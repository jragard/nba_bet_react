const Betting = artifacts.require("./Betting.sol");

contract("Initialization (Oracle)", (accounts) => {

    it("initial test", async () => {
        const instance = await Betting.deployed();
        // let owner = await instance.owner();
        // assert.equal(owner, accounts[0]);
        let mapping = await instance.get_matched_bet_addresses(accounts[3]);
        console.log(mapping);
        console.log(typeof mapping)
        assert.isOk(false);
    });

    // it("creating 2 matching bets to test oracle", async () => {
    //     const instance = await Betting.deployed();
    //     // bets take uint32 arrays with the following, by index:
    //     // game_id (21800202)
    //     // team_id (the team you are betting on) Ex: Philadelphia == 1610612755
    //     // opponent_team_id (opponent's team id) Ex: Orlando == 1610612753
    //     // 0 representing the bet amount...bet amount will be added based on msg.value in solidity

    //     let game_id = 21800202; // Philadelphia/Orlando, 11-14-2018
    //     let team_id = 1610612755; // Philly
    //     let opponent_id = 1610612753; // Orlando

    //     let game_id2 = 21800202; // Philadelphia/Orlando, 11-14-2018
    //     let team_id2 = 1610612753; // Orlando
    //     let opponent_id2 = 1610612755; // Philly

    //     // ORLANDO won this game (accounts[4])
    //     // PHILLY lost this game (accounts[3])

    //     let bet = [game_id, team_id, opponent_id, 0,]; //timestamp needs to go here];
    //     let bet2 = [game_id2, team_id2, opponent_id2, 0];

    //     await instance.createBet(bet, {from: accounts[3], value: web3.utils.toWei("1", "ether")});
    //     await instance.createBet(bet2, {from: accounts[4], value: web3.utils.toWei("1", "ether")});

    //     let mapping = await instance.get_address_to_bet(accounts[3]);
    //     console.log(mapping);
    //     assert.isOk(false);
    // });

    // it("testing oracle", (done) => {
    //     Betting.deployed().then((instance) => {
    //         return instance.query_win({from: accounts[4]});
    //     }).then((instance) => {
    //         setTimeout(() => {
    //             console.log('12 seconds later...');
    //             done();
    //         }, 12000)
    //     });
    // });

    // it("getting query result", async () => {
    //     const instance = await Betting.deployed();
    //     await instance.claimWin({from: accounts[4]});
    //     // let did_not_win = await instance.claimWin({from: accounts[3]});
    //     // assert.isOk(won);
    //     // assert.isNotOk(did_not_win);
    // });

    // it("testing how much to pay out", async () => {
    //     const instance = await Betting.deployed();
    //     let payout = await instance.get_payout_amount({from: accounts[3]});
    //     console.log(payout.toString());
    //     console.log(web3.utils.fromWei(payout.toString(), 'ether'));
    // })

    // it("testing what address to result is when there is no result", async () => {
    //     const instance = await Betting.deployed();
    //     let result = await instance.get_addr_to_result({from: accounts[7]});
    //     console.log(result);
    //     console.log('$');
    //     assert.equal(result, "");

    // })


});