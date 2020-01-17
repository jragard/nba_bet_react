import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import "../css/game.css";

export const Game = ({game}) => {
    return (
        <div id="individualGame">
            <div id="timeAndTv">
                <div id="time">
                    <h6>
                        {game.stt}
                    </h6>
                </div>
                <div id="tv">
                    
                    {game.bd.b.slice(0, 1).map((tv, index) => (
                       <p id="tvP" key={index}>{tv.disp}</p>
                        ))}
                    

                </div>
            </div>
                <div id="teamsDiv">
                    <p className="teamsP">{game.v.tc + " " + game.v.tn}</p>
                    <p className="teamsP">{game.h.tc + " " + game.h.tn}</p>
                </div>
                <div id="venue">
                    <h5>{game.an}</h5>
                    <h6>{game.ac + ", " + game.as}</h6>
                </div>
                <div id="betOnGame">
                    <Link to={`/games/${game.gid}/${game.gdte}`}>
                        <Button 
                            // variant="info"
                            id="btn1"

                        >
                            Bet On Game
                        </Button>
        
                    </Link>
                    
                    <a href={"https://www.nba.com/games/" + game.gcode + "/#/"}>
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