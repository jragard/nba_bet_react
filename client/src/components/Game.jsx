import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import "../css/game.css";

class Game extends Component {

    render() {
        return (
            

        <div id="individualGame">
            <div id="timeAndTv">
                <div id="time">
                    <h6>
                        {this.props.game.stt}
                    </h6>
                </div>
                <div id="tv">
                    
                    {this.props.game.bd.b.slice(0, 1).map((tv, index) => (
                       <p id="tvP" key={index}>{tv.disp}</p>
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
                    <Link to={"/games/" + this.props.game.gid}>
                        <Button 
                            // variant="info"
                            id="btn1"

                        >
                            Bet On Game
                        </Button>
        
                    </Link>
                    
                    <a href={"https://www.nba.com/games/" + this.props.game.gcode + "/#/"}>
                    <Button
                        // variant="info"
                        id="btn2"
                    >
                        Game Preview
                    </Button>
                    </a>
                </div>
        </div>
        )
    }
}
export default Game