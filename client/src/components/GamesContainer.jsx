import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import '../css/gamesContainer.css';
import GameDate from "./GameDate";


class GamesContainer extends Component {

    format_date = (game_date) => {
        var options = { weekday: 'long', month: 'long', day: 'numeric' };
        let date = new Date(game_date[0].etm);
        // let num_date = date.toLocaleDateString("en-US"); // 9/17/2016
        let long_date = date.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
        return long_date
    }

    render() {
        if(!this.props.allGames) {
            return(<h2>Loading...</h2>)
        } else {
            return (
                <React.Fragment>
                <div id="gamesContainer">
                    {this.props.gamesByDate.map((game_date, index) => (
                        <GameDate games={game_date} idNum={game_date.length} date={this.format_date(game_date)} key={index}/>
                    ))}
                </div>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        allGames: state.allGames,
        gamesByDate: state.gamesByDate
    }
}

export default withRouter(connect(mapStateToProps)(GamesContainer));