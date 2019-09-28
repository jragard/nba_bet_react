import React, { Component } from "react";
import Game from "./Game";
import './css/gameInfo.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class GameDate extends Component {

    render() {
        return (
            <div id={"g" + this.props.idNum.toString()}>

                <div id="date">
                    <div id="dateTextDiv">
                    <h6 id="dateText">{this.props.date}</h6>
                    </div>
                    {/* <div>
                        {this.props.games.map((game) => (
                            <Game game={game}/>
                        ))}
                    </div> */}
                </div>
                <div id="games">
                    <div id="grayStrip">

                    </div>
                        {this.props.games.map((game) => (
                            <Game game={game}/>
                        ))}
                    </div>
            </div>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         allGames: state.allGames,
//         gamesByMonth: state.gamesByMonth,
//         allGamesFeed: state.allGamesFeed
//     }
// }

// export default withRouter(connect(mapStateToProps)(GameDate));
export default GameDate;