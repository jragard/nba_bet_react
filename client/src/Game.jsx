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
    render() {
        // let awayTeam = this.props.games[0]
        return (
            <div>
                <a href="http://google.com"><h3>{this.props.games.map((game) => (
                    this.formatText(game)
                ))}</h3></a>
            </div>
        )
    }
}

export default Game;