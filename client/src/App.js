import Betting from "./contracts/Betting.json";

import React, { Component } from "react";
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { storeWeb3Action } from './actions/actions.js';
import getWeb3 from "./utils/getWeb3";

import HomePage from "./components/HomePage";
import PlaceBet from "./components/PlaceBet";
import UserBets from "./components/UserBets";


import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  state = { address: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = Betting.networks[networkId];
      // console.log(deployedNetwork)
      const instance = new web3.eth.Contract(
        Betting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to state
      // this.setState({ web3, accounts, contract: instance });
      this.props.dispatch(storeWeb3Action({web3, accounts, contract: instance }));
      this.setState({ web3, accounts, contract: instance });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, acc.reducerounts, and contract...</div>;
    }

    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/bets" component={UserBets}/>
          <Route path="/games/:gameID" component={PlaceBet} />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    allGames: state.allGames,
    gamesByDate: state.gamesByDate,
    web3: state.web3,
    accounts: state.accounts,
    contract: state.contract
  }
}

export default withRouter(connect(mapStateToProps)(App));
