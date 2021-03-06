import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import { logos } from '../utils/logos.js';
import "../css/gameInfo.css";
import { useRouter } from "../utils/router";
import { format_date } from "../utils/formatDate";
import { months } from "../utils/months";

export const PlaceBet = ({web3, accounts, contract}) => {
    const gamesByMonth = useSelector(state => state.gamesByMonth);
    const { match } = useRouter();

    const [state, setState] = useState({
        teams: [],
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
        displayFinalConfirm: false,
        receipt: null
    });

    const get_this_game = async () => {
        const thisGame = await gamesByMonth[months[match.params.gameDate.slice(5, 7)]][match.params.gameDate].filter((game) => {
            return game.gid === match.params.gameID;
        });
        return thisGame[0];
    }

    const betOnTeam = (teamID) => {
        const selected = state.teams.filter((team) => {
            return team.tid === teamID;
        });
        const opponent = state.teams.filter((team) => {
            return team.tid !== teamID;
        });

        setState({
            ...state,
            selectedTeamID: teamID,
            selectedTeam: selected[0],
            opponentTeamID: opponent[0].tid,
            opponentTeam: opponent[0],
            displayConfirm: true
        })
    }

    const confirm_team = () => {
        setState({
            ...state,
            confirmedTeam: true,
            displayConfirm: false,
            displayBetInput: true
        });
    }

    const final_confirm = () => {
        const bet = document.getElementById('betinput').value;
        setState({
            ...state,
            betAmount: bet,
            displayBetInput: false,
            displayFinalConfirm: true
        });
    }

    const handleNodeNullResponse = async (response, [f, args = []]) => {
        if (response === null) {
          await window.sleep(3000);
          return f(...args);
        }
        return response;
      }

    const send_bet = async () => {       
        const bet = [state.gameID, state.selectedTeamID, state.opponentTeamID, 0];
        const sender = accounts[0];
        return handleNodeNullResponse(
            await contract.methods.createBet(bet).send({from: sender, value: web3.utils.toWei(state.betAmount, "ether")}),
            [send_bet]
        );
    }

    const send = async () => {
        const receipt = await send_bet();
        if(receipt.status) {
            setState({
                ...state,
                receipt,
                displayFinalConfirm: false
            });
        }
    }

    useEffect(() => {
        const asyncUseEffect = async () => {
            const game = await get_this_game();
            setState({
                ...state,
                teams: [game.v, game.h],
                gameID: game.gid,
                game
            });
        }
        asyncUseEffect();
    }, []);
 



    return (
        <>
        {state.game ? (
        <div id="gameInfoContainer">
        <div id="teams">
            <div id="away" onClick={() => betOnTeam(state.game.v.tid)}>
                <p id="h3away">{`${state.game.v.tc} ${state.game.v.tn}`}</p>
                <p>{state.game.v.re}</p>
                <img id="awayImg" alt={"logo of nba team at this path: " + logos[state.game.v.tc]} src={process.env.PUBLIC_URL + "images/" + logos[state.game.v.tc]}></img>
            </div>
            <div id="gameTime">
                {state.game.an}
                <br></br>
                {state.game.stt}
            </div>
            <div id="home" onClick={() => betOnTeam(state.game.h.tid)}>
                <p id="h3home">{`${state.game.h.tc} ${state.game.h.tn}`}</p>
                <p>{state.game.h.re}</p>
                <img id="homeImg" alt={"logo of nba team at this path: " + logos[state.game.h.tc]} src={process.env.PUBLIC_URL + "images/" + logos[state.game.h.tc]}></img>
            </div>
        </div>
        <div id="confirm">
            <div id="confirmTxt">
                {state.displayConfirm ? `Please confirm: You would like to place a bet on the ${state.selectedTeam.tc} ${state.selectedTeam.tn} to defeat the ${state.opponentTeam.tc} ${state.opponentTeam.tn} at ${state.game.an} in ${state.game.ac}, on ${format_date(state.game.etm)}` : ""}
            </div>
            <br></br>
            <div id="confirmBtn">
                {state.displayConfirm ? <Button
                                            variant="info"
                                            onClick={confirm_team}
                                        >Confirm Team</Button>
                                         : ""}
            </div>
        </div>
        <p id="instructions">
            {state.selectedTeamID ? "" : "Want to place a friendly bet on one of these teams to win this game? Click a team's logo to place bet on them to win"}
        </p>
        <div id="bet">
            {state.displayBetInput ? <p>How much ETH would you like to bet?</p> : ""}
            {state.displayBetInput ? <input id="betinput" placeholder="0.1"></input> : ""}
            {state.displayBetInput ? <Button
                                         variant="info"
                                         onClick={final_confirm}
                                        >Confirm Bet
                                        </Button> 
                                      : ""}
        </div>
        <div className="finalConfirm">
            {state.displayFinalConfirm ? <div className="finalConfirm"><p className="confirmP">{`Please confirm: You would like to place a bet on the ${state.selectedTeam.tc} ${state.selectedTeam.tn} to defeat the ${state.opponentTeam.tc} ${state.opponentTeam.tn} at ${state.game.an} in ${state.game.ac}, on ${format_date(state.game.etm)}`}</p> <p className="confirmP">{`Your wager amount is ${state.betAmount} ETH.  Confirming this bet will prompt you to complete a transaction sending ETH from your account to the betting smart contract.`}</p></div> : ""}
            {state.displayFinalConfirm ? <Button
                                                variant="info"
                                                onClick={send}
                                              >Send Bet</Button> 
                                            : ""}
            {state.receipt ? <Link
                                   to="/"  
                                  >
                                    <Button
                                     variant="info"  
                                    >Back
                                    </Button>
                                  </Link> 
                                : ""}
        </div>
        </div>) : "No game"}

        </>
    )
}