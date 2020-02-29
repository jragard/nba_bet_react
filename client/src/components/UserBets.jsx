import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

import Button from "react-bootstrap/Button";
import "../css/gameInfo.css";
import { logos } from '../utils/logos.js';

export const UserBets = () => {
    const allGames = useSelector(state => state.allGames);
    const web3 = useSelector(state => state.web3);
    const accounts = useSelector(state => state.accounts);
    const contract = useSelector(state => state.contract);

    const [state, setState] = useState({
        userBets: null,
        game: null,
        teams: null,
        records: null,
        time: null,
        logos: null,
        matchedBetAddresses: null,
        queryResult: null,
        querying: false,
        winClaimed: false,
    });

    const get_user_bets = async () => {
        console.log('getuserbets running');
        let betGameID = await contract.methods.address_to_bet(accounts[0], 0).call();
        console.log('betGameID: ', betGameID);
        if(betGameID && betGameID.length < 10) {
            const zeros_to_add = 10 - betGameID.length;
            for(let i = 0; i < zeros_to_add; i++) {
                betGameID = '0' + betGameID;
            }
        }
        const betTeamID = await contract.methods.address_to_bet(accounts[0], 1).call();
        const betOpponentID = await contract.methods.address_to_bet(accounts[0], 2).call();
        const betAmount = await contract.methods.address_to_bet(accounts[0], 3).call();

        console.log('betTeamID: ', betTeamID);
        console.log('betOpponentID: ', betOpponentID);
        console.log('betAmount: ', betAmount);

        const game = allGames.filter((game) => {
            return game.gid === betGameID
        });

        console.log('game: ', game);

        if(game[0]) {
            setState({
                ...state,
                userBets: [betGameID, betTeamID, betOpponentID, betAmount],
                game: game[0], teams: [`${game[0].v.tc} ${game[0].v.tn}`, `${game[0].h.tc} ${game[0].h.tn}`],
                records: [game[0].v.re, game[0].h.re], time: game[0].stt, logos: [logos[game[0].v.tc], logos[game[0].h.tc]]
            });
        }
    }

    const get_matched_bet_addresses = async () => {
        console.log('getMatchedBetAddresses running');
        const zeros = "0x0000000000000000000000000000000000000000";
        const addr = await contract.methods.get_matched_bet_addresses(accounts[0]).call();

        console.log('addr: ', addr);
        if(addr !== zeros) {
            setState({
                ...state,
                matchedBetAddresses: addr
            });
        }
    }

    const get_user_team = () => {
        if(!state.game) {
            return "No Game Found";
        } else {
            const homeID = state.game.h.tid.toString();
            const awayID = state.game.v.tid.toString();
            const userID = state.userBets[1];

            if(userID === homeID) {
                return state.game.h
            } else if(userID === awayID) {
                return state.game.v
            } else {
                return "No game match found"
            }    

        }
    }

    const query_win = async () => {
        setState({
            ...state,
            querying: true
        });
        await contract.methods.query().send({from: accounts[0], value: web3.utils.toWei(".005", "ether")});
        setTimeout(() => {
            get_result()
        }, 30000)
        // contract.methods.query_win().call({from: accounts[0]})
        // .then((result) => {
        //     console.log(result);
        // });
    }

    const get_result = async () => {
        const result = await contract.methods.get_result(accounts[0]).call();
        setState({
            ...state,
            queryResult: result,
            querying: false
        });
    }

    const did_win = () => {
        if(!state.queryResult) {
            return false;
        } else {
            if(state.queryResult === state.userBets[1]) {
                return true
            } else {
                return false
            }
        }       
    }

    const did_win_text = () => {
        if(!state.queryResult) {
            return null;
        } else {
            if(state.queryResult === state.userBets[1]) {
                return "You won this bet!"
            } else {
                return null
            }
        }
    }

    const claim_win = async () => {
        await contract.methods.claimWin().send({from: accounts[0]});
        setState({
            ...state,
            winClaimed: true
        });
    }

    const get_bet_amount = () => {
        if(!state.userBets) {
            return "No userbets found";
        } else {
            return web3.utils.fromWei(state.userBets[3], "ether");
        }
    }


    useEffect(() => {
        get_user_bets();
        // get_matched_bet_addresses();
    }, []);

    useEffect(() => {
        // get_user_bets();
        get_matched_bet_addresses();
    }, [state.userBets]);

    if(!state.userBets) {
        return (<p>loading...</p>)
    } else {

    return (
        <div>
            <Button onClick={() => console.log(state)}>Log state</Button>
            <div id="teams">
                <div id="away">
                    <p id="h3away">{`${state.teams[0]}`}</p>
                    <p>{state.records[0]}</p>
                    <img id="awayImg" alt={"logo of nba team at this path: " + state.logos[0]} src={process.env.PUBLIC_URL + "images/" + state.logos[0]}></img>
                    <div id="yourTeam1">{`${get_user_team().tc} ${get_user_team().tn}` === state.teams[0] ? <div id="yourTeam">YOUR TEAM</div> : <div id="opponentTeam">OPPONENT TEAM</div>}</div>
                </div>
                <div id="gameTime">
                    {state.game.an}
                    <br></br>
                    {state.time}
                </div>
                <div id="home">
                    <p id="h3home">{`${state.teams[1]}`}</p>
                    <p>{state.records[1]}</p>
                    <img id="homeImg" alt={"logo of nba team at this path: " + state.logos[1]} src={process.env.PUBLIC_URL + "images/" + state.logos[1]}></img>
                    <div id="yourTeam2">{`${get_user_team().tc} ${get_user_team().tn}` === state.teams[1] ? <div id="yourTeam">YOUR TEAM</div> : <div id="opponentTeam">OPPONENT TEAM</div>}</div>
                </div>
            </div>

            <div id="matchedBet">
                {state.matchedBetAddresses ? <h1 id="activeBet">ACTIVE BET</h1> : ""}
                {state.matchedBetAddresses ? <p>{`Address ${state.matchedBetAddresses} has taken you up on your bet!`}</p> : ""}
            </div>

            <div id="betAmt">
                {state.userBets ? <p>{`Bet Amount: ${get_bet_amount()} ETH`}</p> : ""}
            </div>

            <div >
                {state.queryResult ? "" : 
                <div id="queryBtn">
                    <br></br>
                    <br></br>
                <p>Did your team win?</p>
                <p>If so, click below to initiate a query.  Initiating a query costs a small amount of ETH, so don't make repeated unnecessary queries, and only query if you believe you won the bet</p>
                <Button variant="info" onClick={query_win}>Check Win</Button>
                <br></br>
                {state.querying ? <p id="queryP">Checking if you won the bet...please be patient, this may take up to 30 seconds...</p> : ""}

                </div>}
            </div>

            {/* <div id="querying">
                {this.state.querying ? <p id="queryP">Checking if you won the bet...please be patient, this may take up to 30 seconds...</p> : ""}
            </div> */}

            <div id="queryResult">
                <h1 id="didWin">{state.queryResult && !state.winClaimed ? did_win_text() : ""}</h1>
                {did_win() ? <Button
                                      variant="info"
                                      onClick={claim_win}
                                     >Claim Winnings</Button> 
                                    : ""}
                                
                {state.winClaimed ? <h1>Congratulations!</h1> : ""}
            
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