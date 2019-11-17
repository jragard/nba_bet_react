import React from "react";
import { Link } from 'react-router-dom';
import "../css/homePage.css";
import {GamesContainer} from "./GamesContainer";

export const HomePage = ({gamesByDate}) => {

  return (
    <>
    {gamesByDate ? (
    <div id="enterDate">
    <Link to="/bets">See My Bets</Link>
    <br></br>
    <h1>Scroll for NBA games to bet on</h1>
    <GamesContainer gamesByDate={gamesByDate}/>
  </div>
    ) : <h3>Loading...</h3>}
    </>
  )
}