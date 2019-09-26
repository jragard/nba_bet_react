pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./usingProvable.sol";

contract Betting is usingProvable {

    mapping(bytes32 => bool) validIDs;

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    address public owner;
    address public current_query_address;

    event LogResult(string result);
    event LogNewProvableQuery(string description);
    event LogPayout(string payout);

    mapping(uint => address) public gameID_to_address;
    mapping(address => uint[]) public address_to_bet;
    mapping(address => address) public matched_bet_addresses;
    mapping(address => uint[]) public matching_bets;

    string[1] results;
    mapping(string => address) result_to_address;
    mapping(address => string) address_to_result;

    constructor() public {
    //  provable_setProof(proofType_TLSNotary | proofStorage_IPFS);
        OAR = OracleAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        owner = msg.sender;
    }

    function get_owner() public view returns (address) {
        address _owner = owner;
        return _owner;
    }

    // Will pass in uint32[] with game_ID, team1_id, opponent_id, bet_amount
    function createBet(uint[4] calldata _bet) external payable {
        // add msg.value to end of bet array
        uint[4] memory bet = _bet;
        bet[3] = msg.value;


        // map address to bet array
        address_to_bet[msg.sender] = bet;

        // zeros is expected result from mapping gameID_to_address[game_ID] if
        // there is nothing currently mapped to that game_ID
        address zeros = 0x0000000000000000000000000000000000000000;
        // if gameID_to_address[game_ID] is empty (no bets have been made for this gameID)
        // then we map the game_ID to the sender's address

        // if gameID_to_address[game_ID] IS mapped to an address, this means someone has
        // placed a bet for this game.  In this case, we will map the existing bet address
        // to the new confirming bet address (msg.sender) so the 2 addresses are linked.
        // Then we will map the original bet address (bet1) to the new matching bet (_bet)
        // and we will map the matching bet address (_bet) to the original bet (bet1).

        // We now have the following mappings:

        // gameID_to_address[gameID] == zeros;
        // address_to_bet[bet1_sender] == bet1;
        // address_to_bet[bet2_sender] == bet2;
        // matched_bet_addresses[bet1_sender] == bet2_sender;
        // matched_bet_addresses[bet2_sender] == bet1_sender;
        // matching_bets[bet1_sender] == _bet (bet2);
        // matching_bets[bet2_sender] == bet1;

        // When somebody calls query, winning_Team_ID string will be mapped
        // to the caller's address.  So, let's say bet2 sender calls query:

        // mapping result_to_address["winning_ID"] = bet2_sender;
        // mapping address_to_result[bet2_sender] = result;
        // mapping address_to_result[bet1_sender] = result;
        // with current information we can use bet2_sender to:

        // get matching bet1 senders address with matched_bet_addresses[bet1_sender_address]
        // get bet1 with address_to_bet[bet1];
        // get bet2 with address_to_bet[bet2];
        // get winning_Team_ID with address_to_result[bet2_sender_address]
        // get winning_Team_ID with address_to_result[bet1_sender_address]
        // bet1_sender known: true
        // bet2_sender_known: true
        // bet1_known (and thereby, the gameID): true
        // bet2_known: true
        // gameID known: true
        // winning_team_id known: true

        if(gameID_to_address[bet[0]] == zeros) {
            gameID_to_address[bet[0]] = msg.sender;
        } else {
            matched_bet_addresses[gameID_to_address[bet[0]]] = msg.sender;
            matched_bet_addresses[msg.sender] = gameID_to_address[bet[0]];
            matching_bets[gameID_to_address[bet[0]]] = bet;
            matching_bets[msg.sender] = address_to_bet[gameID_to_address[bet[0]]];
            gameID_to_address[bet[0]] = zeros;
        }
    }

   function claimWin() public {
       bool won = didWin(msg.sender);

        if(won) {
            get_payout_amount(msg.sender);
        }
    }

    function transfer_payout(uint payout, address payable winner) private {
        winner.transfer(payout);
        // require(winner.transfer(payout), "transfer failed");
        emit LogPayout("A winner was just paid out!");
    }

    function get_payout_amount(address payable winner) private {
        address matched_bet_addr = matched_bet_addresses[winner];
        uint[] memory winner_bet = matching_bets[matched_bet_addr];
        uint[] memory matching_bet = address_to_bet[matched_bet_addr];

        uint bet1_amt = winner_bet[3];
        uint bet2_amt = matching_bet[3];
        uint payout = bet1_amt.add(bet2_amt);
        transfer_payout(payout, winner);
    }

    function didWin(address payable sender) private view returns (bool) {
        address matched_bet_addr = matched_bet_addresses[sender];
        uint[] memory caller_bet = matching_bets[matched_bet_addr];
        string memory empty = "";
        string memory result = address_to_result[sender];
        // require(result != empty);
        require(keccak256(abi.encodePacked((result))) != keccak256(abi.encodePacked((empty))), "No result found");
        uint int_result = safeParseInt(result);

        uint caller_team_id = caller_bet[1];

        bool caller_won = false;

        if(caller_team_id == int_result) {
            caller_won = true;
        }

        return caller_won;
    }

    function get_addr_to_result() public view returns (string memory) {
        string memory result = address_to_result[msg.sender];
        return result;
    }

    function append(string memory a, string memory b) private pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function __callback(bytes32 myid, string memory result) public {
        if(!validIDs[myid]) revert("Invalid ID");
        if (msg.sender != provable_cbAddress()) revert("msg.sender != provable_cbAddress()");
        emit LogResult(result);
        results[0] = result;
        result_to_address[result] = current_query_address;
        address matching_address = matched_bet_addresses[current_query_address];
        address_to_result[current_query_address] = result;
        address_to_result[matching_address] = result;
        delete validIDs[myid];
    }

    function get_result(address _address) public view returns (string memory) {
        string memory result = address_to_result[_address];
        return result;
    }

    function get_string_to_address() public view returns (address) {
        address result = result_to_address[results[0]];
        return result;
    }

    function query_win() external {
        uint[] memory bet = address_to_bet[msg.sender];
        query(bet[0], msg.sender);
    }

    function query(uint _game_ID, address _sender) private {
        if (provable_getPrice("URL") > address(this).balance) {
          emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            current_query_address = _sender;
            uint big_game_ID = uint(_game_ID);
            string memory game_ID_str = uint2str(big_game_ID);
            string memory _url_start = append("json(https://bad-frog-13.localtunnel.me/completed/", game_ID_str);
            string memory _url_end = ").data.winning_ID";
            string memory url = append(_url_start, _url_end);

            bytes32 queryId = provable_query("URL", url);
            validIDs[queryId] = true;
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
        }
    }





}
