import React, { Component } from "react";
import "./css/gameInfo.css";
import { connect } from 'react-redux';
import { logos } from './teamNicknames.js';
import Button from "react-bootstrap/Button";


class GameInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTeamID: null,
            selectedTeam: null,
            opponentTeamID: null,
            opponentTeam: null,
            betAmount: null,
            gameID: null,
            game: null,
            confirmedTeam: false,
            displayConfirm: false,
            displayBetInput: false,
            displayFinalConfirm: false
        }
    }

    componentWillMount() {
        let game = this.get_this_game();
        this.setState({
            gameID: game.gid,
            game
        });
    }

    get_this_game = () => {
        let this_game = this.props.allGames.filter((game) => {
            return game.gid === this.props.match.params.gameID;
        });
        return this_game[0];
    }

    get_away_and_home_teams = () => {
        return [`${this.state.game.v.tc} ${this.state.game.v.tn}`, `${this.state.game.h.tc} ${this.state.game.h.tn}`]
    }

    get_away_and_home_records = () => {
        return [this.state.game.v.re, this.state.game.h.re]
    }

    format_date = () => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let date = new Date(this.state.game.etm);
        // let num_date = date.toLocaleDateString("en-US"); // 9/17/2016
        let long_date = date.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
        return long_date
    }

    get_time = () => {
        return this.state.game.stt;
    }

    get_logo_paths = () => {
        return [logos[this.state.game.v.tc], logos[this.state.game.h.tc]]
    }

    bet_on_away = () => {
        let away_id = this.state.game.v.tid;
        this.setState({
            selectedTeamID: away_id,
            displayConfirm: true
        });
    }

    bet_on_home = () => {
        let home_id = this.state.game.h.tid;
        this.setState({
            selectedTeamID: home_id,
            displayConfirm: true
        });
    }

    confirm_message = () => {
        let teams = [this.state.game.v, this.state.game.h];
        let selectedTeam = teams.filter((team) => {
            return team.tid === this.state.selectedTeamID;
        });
        let opponentTeam = teams.filter((team) => {
            return team.tid !== this.state.selectedTeamID;
        });

        let message = `Please confirm: You would like to place a bet on the ${selectedTeam[0].tc} ${selectedTeam[0].tn} to defeat the ${opponentTeam[0].tc} ${opponentTeam[0].tn} at ${this.state.game.an} in ${this.state.game.ac}, on ${this.format_date()}`;
        return message;
    }

    confirm_team = () => {
        let teams = [this.state.game.v, this.state.game.h];
        let opponentTeam = teams.filter((team) => {
            return team.tid !== this.state.selectedTeam;
        });
        this.setState({
            opponentTeam: opponentTeam[0],
            opponentTeamID: opponentTeam[0].tid,
            confirmedTeam: true,
            displayConfirm: false,
            displayBetInput: true
        });
    }

    final_confirm = () => {
        let bet = document.getElementById('betinput').value;
        this.setState({
            betAmount: bet,
            displayBetInput: false,
            displayFinalConfirm: true
        });
    }

    final_confirm_message = () => {
        let message = this.confirm_message();
        let message2 = `Your wager amount is ${this.state.betAmount} ETH.  Confirming this bet will prompt you to complete a transaction sending ETH from your account to the betting smart contract.`;
        return [`${message}.`, `${message2}`]

    }

    handleNodeNullResponse = async (response, [f, args = []]) => {
        if (response === null) {
          await window.sleep(3000);
          return f(...args);
        }
        return response;
      }

    send_bet = async () => {
        let contract = this.props.contract;
        let web3 = this.props.web3;        
        let bet = [this.state.gameID, this.state.selectedTeamID, this.state.opponentTeamID, 0];
        let sender = this.props.accounts[0];
        return this.handleNodeNullResponse(
            await contract.methods.createBet(bet).send({from: sender, value: web3.utils.toWei(this.state.betAmount, "ether")}),
            [this.send_bet]
        )
        // let receipt = await contract.methods.createBet(bet).send({from: sender, value: web3.utils.toWei(this.state.betAmount, "ether")});
    }

    send = async () => {
        let receipt = await this.send_bet();
        console.log(receipt);
    }

    render() {
        return (
            <div id="gameInfoContainer">
            <div id="teams">
                <div id="away" onClick={this.bet_on_away}>
                    <p id="h3away">{`${this.get_away_and_home_teams()[0]}`}</p>
                    <p>{this.get_away_and_home_records()[0]}</p>
                    <img id="awayImg" alt={"logo of nba team at this path: " + this.get_logo_paths()[0]} src={process.env.PUBLIC_URL + "images/" + this.get_logo_paths()[0]}></img>
                </div>
                <div id="gameTime">
                    {this.state.game.an}
                    <br></br>
                    {this.get_time()}
                </div>
                <div id="home" onClick={this.bet_on_home}>
                    <p id="h3home">{`${this.get_away_and_home_teams()[1]}`}</p>
                    <p>{this.get_away_and_home_records()[1]}</p>
                    <img id="homeImg" alt={"logo of nba team at this path: " + this.get_logo_paths()[1]} src={process.env.PUBLIC_URL + "images/" + this.get_logo_paths()[1]}></img>
                </div>
            </div>
            <div id="confirm">
                <div id="confirmTxt">
                    {this.state.displayConfirm ? this.confirm_message() : ""}
                </div>
                <br></br>
                <div id="confirmBtn">
                    {this.state.displayConfirm ? <Button
                                                variant="info"
                                                onClick={this.confirm_team}
                                               >Confirm Team
                                               </Button> 
                                             : ""}
                </div>
            </div>
            <p id="instructions">
                {this.state.selectedTeamID ? "" : "Want to place a friendly bet on one of these teams to win this game? Click a team's logo to place bet on them to win"}
            </p>
            <div id="bet">
                {this.state.displayBetInput ? <p>How much ETH would you like to bet?</p> : ""}
                {this.state.displayBetInput ? <input id="betinput" placeholder="0.1"></input> : ""}
                {this.state.displayBetInput ? <Button
                                             variant="info"
                                             onClick={this.final_confirm}
                                            >Confirm Bet
                                            </Button> 
                                          : ""}
            </div>
            <div className="finalConfirm">
                {this.state.displayFinalConfirm ? <div className="finalConfirm"><p className="confirmP">{this.final_confirm_message()[0]}</p> <p className="confirmP">{this.final_confirm_message()[1]}</p></div> : ""}
                {this.state.displayFinalConfirm ? <Button
                                                    variant="info"
                                                    onClick={this.send}
                                                  >Send Bet</Button> 
                                                : ""}
            </div>
            </div>
        )
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

export default connect(mapStateToProps)(GameInfo);