import React, { Component } from "react";
import Game from "./Game";
import './css/gameDate.css';

class GameDate extends Component {

    render() {
        return (
            <div id={"g" + this.props.idNum.toString()} className="g">

                <div id="date">
                    <div id="dateTextDiv">
                    <h6 id="dateText">{this.props.date}</h6>
                    </div>
                </div>
                <div id="games">
                    <div id="grayStrip">

                    </div>
                        {this.props.games.map((game, index) => (
                            <Game game={game} key={index}/>
                        ))}
                    </div>
            </div>
        );
    }
}

export default GameDate;