import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import DatePicker from "react-date-picker";
import Button from "react-bootstrap/Button";
import "../css/homePage.css";

import { allGamesAction, gamesByDateAction } from '../actions/actions.js';
import GamesContainer from "./GamesContainer";

import axios from "axios";

class HomePage extends Component {
  state = { allGames: null, gamesByDate: null };

  componentWillMount() {
      axios.get("http://localhost:3000/fullSchedule")
      .then((response) => {
        let monthSort = this.groupGamesByMonth(response.data.data.lscd);
        let games_by_date = this.groupGamesByDate(monthSort);
        let all_games = this.groupAllGames(games_by_date);

        this.props.dispatch(allGamesAction(all_games));
        this.props.dispatch(gamesByDateAction(games_by_date));
        // this.props.dispatch(gamesByMonthAction(monthSort));
        this.setState({ allGames: all_games, gamesByDate: games_by_date });
      });
  }

  groupAllGames = (games_by_date) => {
    const all = [];
    games_by_date.forEach((date) => {
      date.forEach((game) => {
        all.push(game);
      })
    });
    return all;
  }

  groupGamesByDate = (games_by_month) => {
      const all = [];
      for(let key in games_by_month) {
          let month = games_by_month[key];
          for(let game_date in month) {
            let games = month[game_date];
            games.forEach((game) => {
                let tvProviders = game.bd.b;
                tvProviders.forEach((tv) => {
                   tv.disp = `${tv.disp}\n`;
                })
            })
            
            all.push(games);
          }
      }
      return all;
  }

  groupGamesByMonth = (data) => {
    let gamesByMonth = {};

    data.forEach((monthObj) => {
       let month = monthObj.mscd.mon;
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
    console.log('placeholder function')
  }

  // submitDate = () => {
  //   let date = this.state.date;
  //   date = this.formatDate(date);

  //   let url = "http://localhost:3000/games";
  //   let options = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({date: date})
  //   }

  //   fetch(url, options)
  //   .then((res) => {
  //     return res.json()
  //   })
  //   .then((res) => {
  //     let gameData = [];

  //     for(let key in res.data) {
  //       let gamePair = res.data[key];
  //       let timestamp = new Date(gamePair[0].gameDateEST).getTime() / 1000;
  //       gamePair[0].timestamp = timestamp;
  //       gamePair[1].timestamp = timestamp;

  //       let homeObj = gamePair.filter((obj) => {
  //         return obj.homeTeamID === obj.teamID;
  //       });

  //       let awayObj = gamePair.filter((obj) => {
  //         return obj.visitorTeamID === obj.teamID;
  //       });

  //       gameData.push([awayObj[0], homeObj[0]]);
  //   }
    
  //   this.props.dispatch(allGames(gameData));
  //   this.setState({ games: gameData});
  //   })

  // }

  render() {
    if(!this.state.allGames) {
      return (<h3>Loading...</h3>)
    } else {
      return (
      <div id="enterDate">
        <Link to="/bets">See My Bets</Link>
        <br></br>
        <h1>Scroll for NBA games to bet on</h1>
        {/* <div>
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
        </div> */}

        <GamesContainer />
      </div>
    );
    }
  }
}

const mapStateToProps = state => {
  return {
    allGames: state.allGames,
    gamesByDate: state.gamesByDate
  }
}

export default withRouter(connect(mapStateToProps)(HomePage));