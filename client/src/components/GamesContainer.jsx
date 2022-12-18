import React from "react";
import '../css/gamesContainer.css';
import { GameDate } from "./GameDate";
import { format_date } from "../utils/formatDate";

export const GamesContainer = ({ gamesByDate }) => {

  return (
    <>
      {gamesByDate ? (
        <>
          <div id="gamesContainer">
            {gamesByDate.map((gameDate, index) => (
              <GameDate games={gameDate} idNum={gameDate.length} date={format_date(gameDate[0].etm)} key={index} />
            ))}
          </div>
        </>
      ) : <h3>Loading...</h3>}
    </>
  )
}