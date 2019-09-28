import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { nicknames, logos } from './teamNicknames.js';
import "./css/gameInfo.css";

class Game extends Component {

    formatText = (game) => {
        let away = game[0];
        let home = game[1];
        let awayCity = away.teamCityName;
        let homeCity = home.teamCityName;
        let awayRecord = "(" + away.teamWinsLosses + ")";
        let homeRecord = "(" + home.teamWinsLosses + ")";
        return `${awayCity} ${awayRecord} at ${homeCity} ${homeRecord}`;
    }

    formatUrl = () => {
        let gameID = this.props.games[0].gameID;
        return `/games/${gameID}/`;
    }

    // get_away_and_home_teams = () => {
    //     let game = this.get_this_game();
    //     let games = this.props.allGames;
    //     games.forEach((game) => {
    //         let awayCity = game[0].teamCityName;
    //         let homeCity = game[1].teamCityName;
    //         let awayNickname = nicknames[awayCity];
    //         let homeNickname = nicknames[homeCity];

    //     })
    //     // return [`${game[0].teamCityName} ${nicknames[game[0].teamCityName]}`, `${game[1].teamCityName} ${nicknames[game[1].teamCityName]}`]
    // }

    // get_away_and_home_records = () => {
    //     let game = this.get_this_game();
    //     return [game[0].teamWinsLosses, game[1].teamWinsLosses]
    // }

    format_date = () => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // let game = this.get_this_game();
        // let date = new Date(game[0].gameDateEST);
        // let num_date = date.toLocaleDateString("en-US"); // 9/17/2016
        // let date = new Date(this.props.date)
        // let long_date = date.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
        // return long_date
        console.log(this.props.game)
        return "date placeholder";
    }

    logprops = () => {
        console.log(this.props.game)
    }

    returnLineBreak = () => {
        let element = <br />
        return element;
    }

    render() {
        return (
            

        <div id="individualGame">
            <div id="timeAndTv">
                <div id="time">
                    <h6>
                        {this.props.game.stt}
                    </h6>
                    {/* <div id="tv">
                        {this.props.game.bd.b.map((tv) => (
                            <p id="tvP">{tv.disp}</p>
                        ))}
                    </div> */}
                </div>
                <div id="tv">
                    
                    {this.props.game.bd.b.map((tv) => (
                       <p id="tvP">{tv.disp}</p>
                        ))}
                    

                </div>
            </div>
                <div id="teamsDiv">
                    <p className="teamsP">{this.props.game.v.tc + " " + this.props.game.v.tn}</p>
                    <p className="teamsP">{this.props.game.h.tc + " " + this.props.game.h.tn}</p>
                </div>
                <div id="venue">
                    <h5>{this.props.game.an}</h5>
                    <h6>{this.props.game.ac + ", " + this.props.game.as}</h6>
                </div>
                <div id="betOnGame">
                    <Button 
                        variant="info"
                        className="btn"

                    >
                        Bet On Game
                    </Button>
                    <a href={"https://www.nba.com/games/" + this.props.game.gcode + "/#/"}>
                    <Button
                        variant="info"
                        className="btn"
                    >
                        Game Preview
                    </Button>
                    </a>
                </div>
        </div>
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         allGames: state.allGames,
//         gamesByMonth: state.gamesByMonth,
//         allGamesFeed: state.allGamesFeed
//     }
// }

// export default withRouter(connect(mapStateToProps)(Game));
export default Game