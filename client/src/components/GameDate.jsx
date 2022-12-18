import React from "react";
import { Game } from "./Game";
import '../css/gameDate.css';

export const GameDate = ({ idNum, date, games }) => {
  return (
    <div id={"g" + idNum.toString()} className="g">

      <div id="date">
        <div id="dateTextDiv">
          <h6 id="dateText">{date}</h6>
        </div>
      </div>
      <div id="games">
        <div id="grayStrip">

        </div>
        {games.map((game, index) => (
          <Game game={game} key={index} />
        ))}
      </div>
    </div>
  );
}