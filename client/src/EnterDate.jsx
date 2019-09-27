import React, { Component } from "react";
import Game from "./Game";
import DatePicker from "react-date-picker";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { allGames } from './actions/gamesAction.js';

import "./EnterDate.css";

class EnterDate extends Component {
  state = { address: 0, allGames: null };

  onDatePick = (date) => {
    this.setState({ date });
  }

  formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let year = date.getFullYear();
    
    if(month.length < 2) {
      month = '0' + month;
    }
    if(day.length < 2) {
      day = '0' + day;
    }
    return [month, day, year].join("/");
  }

  submitDate = () => {
    let date = this.state.date;
    date = this.formatDate(date);

    let url = "http://localhost:3000/games";
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({date: date})
    }

    fetch(url, options)
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      let gameData = [];

      for(let key in res.data) {
        let gamePair = res.data[key];
        let timestamp = new Date(gamePair[0].gameDateEST).getTime() / 1000;
        gamePair[0].timestamp = timestamp;
        gamePair[1].timestamp = timestamp;

        let homeObj = gamePair.filter((obj) => {
          return obj.homeTeamID === obj.teamID;
        });

        let awayObj = gamePair.filter((obj) => {
          return obj.visitorTeamID === obj.teamID;
        });

        gameData.push([awayObj[0], homeObj[0]]);
    }
    
    this.props.dispatch(allGames(gameData));
    this.setState({ games: gameData});
    })

  }

  render() {
    return (
      <div className="EnterDate">
        <h1>Enter A Date For a List of Upcoming NBA games to bet on</h1>
        <div>
          <DatePicker 
            onChange={this.onDatePick}
            value={this.state.date}  
          />
        </div>
        <div id="submitBtn">
          <Button 
            variant="info"
            onClick={this.submitDate}
            >Submit</Button>
        </div>

        <div>
          {this.state.games ? this.state.games.map((game, index) => (
            <Game games={game} key={index} />
          )) : ""}
        </div>

        <div>The address of the Betting contract is: {this.state.address}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    allGames: state.allGames
  }
}

export default withRouter(connect(mapStateToProps)(EnterDate));