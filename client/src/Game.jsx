import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Game extends Component {

    formatText = (game) => {
        let away = game[0];
        let home = game[1];
        let awayCity = away.teamCityName;
        let homeCity = home.teamCityName;
        let awayRecord = "(" + away.teamWinsLosses + ")";
        let homeRecord = "(" + home.teamWinsLosses + ")";
        return `${awayCity} ${awayRecord} at ${homeCity} ${homeRecord}`;
    }

    formatUrl = () => {
        let gameID = this.props.games[0].gameID;
        return `/games/${gameID}/`;
    }

    render() {
        return (
            <div>
                <Link to={this.formatUrl()}><h3>{this.formatText(this.props.games)}</h3></Link>
            </div>
         
        )
    }
}

const mapStateToProps = state => {
    return {
        allGames: state.allGames
    }
}

export default withRouter(connect(mapStateToProps)(Game));