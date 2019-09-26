import React, { Component } from "react";
import Betting from "./contracts/Betting.json";
import getWeb3 from "./utils/getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom';
import EnterDate from "./EnterDate";
import GameInfo from "./GameInfo";

import "./App.css";

class App extends Component {
  state = { address: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log('here');
      console.log(web3);
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = Betting.networks[networkId];
      console.log(deployedNetwork)
      const instance = new web3.eth.Contract(
        Betting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ web3, accounts, contract: instance }, this.runExample);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    let address = await contract.methods.get_owner().call();
    this.setState({ address: address });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={EnterDate} />
          <Route path="/games/:gameID" component={GameInfo} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
