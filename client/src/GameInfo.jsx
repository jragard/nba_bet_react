import React, { Component } from "react";
import "./css/gameInfo.css";
import { connect } from 'react-redux';
import { nicknames, logos } from './teamNicknames.js';

class GameInfo extends Component {

    get_this_game = () => {
        let this_game = this.props.allGames.filter((gamePair) => {
            return gamePair[0].gameID === this.props.match.params.gameID;
        });
        console.log(this_game[0]);
        return this_game[0];
    }

    get_away_and_home_teams = () => {
        let game = this.get_this_game();
        return [`${game[0].teamCityName} ${nicknames[game[0].teamCityName]}`, `${game[1].teamCityName} ${nicknames[game[1].teamCityName]}`]
    }

    get_away_and_home_records = () => {
        let game = this.get_this_game();
        return [game[0].teamWinsLosses, game[1].teamWinsLosses]
    }

    format_date = () => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let game = this.get_this_game();
        let date = new Date(game[0].gameDateEST);
        // let num_date = date.toLocaleDateString("en-US"); // 9/17/2016
        let long_date = date.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
        return long_date
    }

    get_logo_paths = () => {
        let game = this.get_this_game();
        console.log(logos[game[0].teamCityName])
        return [logos[game[0].teamCityName], logos[game[1].teamCityName]]
    }





    render() {
        return (
            <div>
            
            <div id="teams">
                <div id="away">
                    <h3 id="h3away">{`${this.get_away_and_home_teams()[0]} -- ${this.get_away_and_home_records()[0]}`}</h3>
                    <img id="awayImg" src={process.env.PUBLIC_URL + "images/" + this.get_logo_paths()[0]}></img>
                </div>
                <div id="gameTime">
                    Time of Game (5:00 EST)
                </div>
                <div id="home">
                    <h3 id="h3home">{`${this.get_away_and_home_teams()[1]} -- ${this.get_away_and_home_records()[1]}`}</h3>
                    <img id="homeImg" src={process.env.PUBLIC_URL + "images/" + this.get_logo_paths()[1]}></img>
                </div>
            </div>
            <div id="bet">
                <h5>How much would you like to bet?</h5>
                <input id='betinput'></input> ETH
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        allGames: state.allGames,
        gamesByMonth: state.gamesByMonth
    }
}

export default connect(mapStateToProps)(GameInfo);