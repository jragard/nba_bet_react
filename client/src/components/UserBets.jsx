import React, { Component } from "react";
import { connect } from 'react-redux';

import Button from "react-bootstrap/Button";
import "../css/gameInfo.css";
import { logos } from '../utils/logos.js';


class UserBets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userBets: null,
            game: null,
            teams: null,
            records: null,
            time: null,
            logos: null,
            matchedBetAddresses: null,
            queryResult: null,
            querying: false,
            winClaimed: false
        }
    }

    componentWillMount() {
        this.get_user_bets();
        this.get_matched_bet_addresses();
    }

    get_user_bets = async () => {
        let contract = this.props.contract;
        // let web3  = this.props.web3;
        let accounts = this.props.accounts;
        let betGameID = await contract.methods.address_to_bet(accounts[0], 0).call();
        if(betGameID && betGameID.length < 10) {
            let zeros_to_add = 10 - betGameID.length;
            for(let i = 0; i < zeros_to_add; i++) {
                betGameID = '0' + betGameID;
            }
        }
        let betTeamID = await contract.methods.address_to_bet(accounts[0], 1).call();
        let betOpponentID = await contract.methods.address_to_bet(accounts[0], 2).call();
        let betAmount = await contract.methods.address_to_bet(accounts[0], 3).call();

        let game = this.props.allGames.filter((game) => {
            return game.gid === betGameID
        });

        if(game[0]) {
            this.setState({
                userBets: [betGameID, betTeamID, betOpponentID, betAmount],
                game: game[0], teams: [`${game[0].v.tc} ${game[0].v.tn}`, `${game[0].h.tc} ${game[0].h.tn}`],
                records: [game[0].v.re, game[0].h.re], time: game[0].stt, logos: [logos[game[0].v.tc], logos[game[0].h.tc]]
            });
        }

    }

    get_user_team = () => {
        if(!this.state.game) {
            return "No Game Found";
        } else {
            let homeID = this.state.game.h.tid.toString();
            let awayID = this.state.game.v.tid.toString();
            let userID = this.state.userBets[1];

            if(userID === homeID) {
                return this.state.game.h
            } else if(userID === awayID) {
                return this.state.game.v
            } else {
                return "No game match found"
            }    

        }
    }

    get_matched_bet_addresses = async () => {
        let contract = this.props.contract;
        let accounts = this.props.accounts;
        let zeros = "0x0000000000000000000000000000000000000000";

        let addr = await contract.methods.get_matched_bet_addresses(accounts[0]).call();
        console.log('matched bet address');
        console.log(addr);
        if(addr !== zeros) {
            this.setState({
                matchedBetAddresses: addr
            })
        }

    }

    set_state_helper = (obj) => {
        this.setState(obj);
    }

    query_win = async () => {
        console.log('query win')
        let contract = this.props.contract;
        let accounts = this.props.accounts;
        let web3 = this.props.web3;
        this.setState({
            querying: true
        });
        await contract.methods.query().send({from: accounts[0], value: web3.utils.toWei(".005", "ether")});
        setTimeout(() => {
            this.get_result()
        }, 20000)
        // contract.methods.query_win().call({from: accounts[0]})
        // .then((result) => {
        //     console.log(result);
        // });
    }

    get_result = async () => {
        let contract = this.props.contract;
        let accounts = this.props.accounts;
        let result = await contract.methods.get_result(accounts[0]).call();
        console.log(result);
        console.log(typeof result);
        this.setState({
            queryResult: result,
            querying: false
        });

    }

    did_win = () => {
        if(!this.state.queryResult) {
            return false;
        } else {
            if(this.state.queryResult === this.state.userBets[1]) {
                return true
            } else {
                return false
            }
        }       
    }

    did_win_text = () => {
        if(!this.state.queryResult) {
            return null;
        } else {
            if(this.state.queryResult === this.state.userBets[1]) {
                // this.set_state_helper({
                //     didWin: true
                // })
                // this.setState({
                //     didWin: true
                // })
                return "You won this bet!"
            } else {
                return null
            }
        }
    }

    claim_win = async () => {
        let contract = this.props.contract;
        let accounts = this.props.accounts;
        await contract.methods.claimWin().send({from: accounts[0]});
        this.setState({
            winClaimed: true
        });
    }

    get_bet_amount = () => {
        if(!this.state.userBets) {
            return "No userbets found";
        } else {
            let web3 = this.props.web3;
            let bet = this.state.userBets[3];
            bet = web3.utils.fromWei(bet, "ether");
            return bet;
        }
    }



    log_state = () => {
        console.log(this.state);
    }

    render() {
        if(!this.state.userBets) {
            return (<p>loading...</p>)
        } else {

        return (
            <div>
                {/* {this.state.userBets ? "yep we got userbets" : ""} */}
                <Button variant="info" onClick={this.log_state}>Log State</Button>
                <div id="teams">
                    <div id="away">
                        <p id="h3away">{`${this.state.teams[0]}`}</p>
                        <p>{this.state.records[0]}</p>
                        <img id="awayImg" alt={"logo of nba team at this path: " + this.state.logos[0]} src={process.env.PUBLIC_URL + "images/" + this.state.logos[0]}></img>
                        <div id="yourTeam1">{`${this.get_user_team().tc} ${this.get_user_team().tn}` === this.state.teams[0] ? <div id="yourTeam">YOUR TEAM</div> : <div id="opponentTeam">OPPONENT TEAM</div>}</div>
                    </div>
                    <div id="gameTime">
                        {this.state.game.an}
                        <br></br>
                        {this.state.time}
                    </div>
                    <div id="home">
                        <p id="h3home">{`${this.state.teams[1]}`}</p>
                        <p>{this.state.records[1]}</p>
                        <img id="homeImg" alt={"logo of nba team at this path: " + this.state.logos[1]} src={process.env.PUBLIC_URL + "images/" + this.state.logos[1]}></img>
                        <div id="yourTeam2">{`${this.get_user_team().tc} ${this.get_user_team().tn}` === this.state.teams[1] ? <div id="yourTeam">YOUR TEAM</div> : <div id="opponentTeam">OPPONENT TEAM</div>}</div>
                    </div>
                </div>

                <div id="matchedBet">
                    {this.state.matchedBetAddresses ? <h1 id="activeBet">ACTIVE BET</h1> : ""}
                    {this.state.matchedBetAddresses ? <p>{`Address ${this.state.matchedBetAddresses} has taken you up on your bet!`}</p> : ""}
                </div>

                <div id="betAmt">
                    {this.state.userBets ? <p>{`Bet Amount: ${this.get_bet_amount()} ETH`}</p> : ""}
                </div>

                <div id="queryBtn">
                    {this.state.queryResult ? "" : <Button variant="info" onClick={this.query_win}>Check Win</Button>}
                </div>

                <div id="querying">
                    {this.state.querying ? <p>Checking if you won the bet...please be patient, this may take up to 15 seconds...</p> : ""}
                </div>

                <div id="queryResult">
                    {this.state.queryResult ? this.did_win_text() : ""}
                    {this.did_win() ? <Button
                                          variant="info"
                                          onClick={this.claim_win}
                                         >Claim Winnings</Button> 
                                        : ""}
                </div>

                <div id="congrats">
                    {this.state.winClaimed ? <h1>Congratulations!</h1> : ""}
                </div>

                {/* <div>
                    <p>{`Your team: ${this.get_user_team().tc} ${this.get_user_team().tn} - ${this.get_user_team().re}`}</p>
                    <p>{`Your team ID: ${this.get_user_team().tid}`}</p>
                    <p>{this.state.matchedBetAddresses ? `This is an active bet with: ${this.state.matchedBetAddresses}` : "No matching bet found, this bet is not yet activated"}</p>
                    <Button variant="info" onClick={this.query_win}>Query Win</Button>
                    <Button variant="info" onClick={this.get_result}>Get Result</Button>
                    <Button variant="info" onClick={this.claim_win}>Claim Win</Button>
                </div> */}
            </div>
        )
        }
    }
}

const mapStateToProps = state => {
    return {
        allGames: state.allGames,
        gamesByDate: state.gamesByDate,
        web3: state.web3,
        accounts: state.accounts,
        contract: state.contract
    }   
}

export default connect(mapStateToProps)(UserBets);