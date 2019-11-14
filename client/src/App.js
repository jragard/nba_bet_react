import Betting from "./contracts/Betting.json";

import React, { useState, useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { storeWeb3Action } from './actions/actions.js';
import getWeb3 from "./utils/getWeb3";

import HomePage from "./components/HomePage";
import PlaceBet from "./components/PlaceBet";
import UserBets from "./components/UserBets";


import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({ address: 0, web3: null, accounts: null, contract: null });

  const connectWeb3 = async () => {
    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = Betting.networks[networkId];

      const instance = new web3.eth.Contract(
        Betting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to state, and dispatch the same state object to redux store
      dispatch(storeWeb3Action({web3, accounts, contract: instance }));
      setState({ web3, accounts, contract: instance });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  useEffect(() => {
    async function connect() {
      await connectWeb3();
    }
    connect();
  }, []);

  return (
    <>
      {state.web3 ? (
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/bets" component={UserBets}/>
              <Route path="/games/:gameID" component={PlaceBet} />
            </Switch>
      ) : <div>Loading Web3, accounts, and contract...</div>}
    </>
  );

}

export default App;
