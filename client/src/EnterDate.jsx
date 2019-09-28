import React, { Component } from "react";
import Game from "./Game";
import DatePicker from "react-date-picker";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/gameInfo.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { allGames, gamesByMonthAction, allGamesFeedAction } from './actions/gamesAction.js';
import GamesContainer from "./GamesContainer";
import "./EnterDate.css";
const axios = require("axios");

class EnterDate extends Component {
  state = { address: 0, allGames: null, gamesByMonth: null };

  componentDidMount() {
      axios.get("http://localhost:3000/fullSchedule")
      .then((response) => {
        let monthSort = this.groupGamesByMonth(response.data.data.lscd);
        let all_games_feed = this.groupAllGames(monthSort);
        this.props.dispatch(allGamesFeedAction(all_games_feed));
        this.props.dispatch(gamesByMonthAction(monthSort));
        this.setState({gamesByMonth: monthSort, allGamesFeed: all_games_feed});
      });
  }

  format_date = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // let num_date = date.toLocaleDateString("en-US"); // 9/17/2016
    date = new Date(date);
    let long_date = date.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
    return long_date
  }

  groupAllGames = (games_by_month) => {
      const all = [];
      for(let key in games_by_month) {
          let month = games_by_month[key];
          for(let game_date in month) {
            let games = month[game_date];
            console.log(games)
            games.forEach((game) => {
                let tvProviders = game.bd.b;
                tvProviders.forEach((tv) => {
                   tv.disp = `${tv.disp}\n`;
                })
            })
            
            all.push(games);
          }
      }
      console.log(all);
      return all;
  }

  groupGamesByMonth = (data) => {
    let gamesByMonth = {};

    data.forEach((monthObj) => {
       let month = monthObj.mscd.mon;
       console.log(month)
       let games = monthObj.mscd.g;
       let groupedGames = this.groupBy(games, 'gdte');
       gamesByMonth[month] = groupedGames;
    });

    const orderedGames = [];
    Object.keys(gamesByMonth).forEach((month) => {
      orderedGames.push(gamesByMonth[month])
    });
   
    return gamesByMonth;
  }

  groupBy = (arr, property) => {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});    
  }

  onDatePick = (date) => {
    this.setState({ date });
  }

  logState = () => {
    console.log(this.state);
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
    if(!this.state.allGamesFeed) {
      return (<h3>Loading...</h3>)
    } else {
      return (
      <div id="enterDate">
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

        <button onClick={this.logState}>click me</button>
        <GamesContainer />

        {/* <div id="gamesContainer">
            {this.state.games ? this.state.games.map((game, index) => (
                <Game games={game} key={index} />
            )) : ""}
        </div> */}
        
        {/* <div>
          {this.state.gamesByMonth.map((game, index) => (
            <Game games={game} key={index} />
          ))}
        </div> */}

        {/* <div>The address of the Betting contract is: {this.state.address}</div> */}
      </div>
    );
    }
  }
}

const mapStateToProps = state => {
  // console.log(state)
  return {
    allGames: state.allGames,
    gamesByMonth: state.gamesByMonth,
    allGamesFeed: state.allGamesFeed
  }
}

export default withRouter(connect(mapStateToProps)(EnterDate));