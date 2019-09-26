import React, { Component } from "react";

class Game extends Component {

    formatText = (game) => {
        let away = game[0];
        let home = game[1];
        console.log(game[0])
        let awayCity = away.teamCityName;
        let homeCity = home.teamCityName;
        let awayRecord = "(" + away.teamWinsLosses + ")";
        let homeRecord = "(" + home.teamWinsLosses + ")";
        return `${awayCity} ${awayRecord} at ${homeCity} ${homeRecord}`;
    }

    formatUrl = () => {
        let gameID = this.props.games[0].gameID;
        return `http://localhost:3004/games/${gameID}`;
    }
    render() {
        // let awayTeam = this.props.games[0]
        return (
            <div>
                <a href={this.formatUrl()}><h3>{this.formatText(this.props.games)}</h3></a>
            </div>
        )
    }
}

export default Game;