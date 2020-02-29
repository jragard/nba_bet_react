import Betting from "./contracts/Betting.json";

import React, { useState, useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeWeb3, hydrateGames } from './actions/actions.js';

import getWeb3 from "./utils/getWeb3";

import { HomePage, PlaceBet, UserBets } from "./components/index";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

const App = () => {
  const dispatch = useDispatch();
  const gamesByDate = useSelector(state => state.gamesByDate);
  const allGames = useSelector(state => state.allGames);
  const web3Instance = useSelector(state => state.web3);
  const accounts = useSelector(state => state.accounts);
  const contract = useSelector(state => state.contract);

  const [appState, setAppState] = useState({ address: 0, web3: null, accounts: null, contract: null, allGames: [] });
  const getGames = () => {
    axios.get("http://localhost:3000/fullSchedule")
    .then((response) => {
      dispatch(hydrateGames(response.data));
      setAppState({allGames: response.data.allGames})
    });
  }

  const connectWeb3 = async () => {
    console.log('connectWeb3 running')
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log('web3: ', web3);
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log('accounts": ', accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log('networkId: ', networkId);
      const deployedNetwork = Betting.networks[networkId];
      console.log('deployedNetwork: ', deployedNetwork);

      const instance = new web3.eth.Contract(
        Betting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      console.log('instance: ', instance);

      // Set web3, accounts, and contract to state, and dispatch the same state object to redux store
      console.log('{web3, accounts, contract: instance }: ', {web3, accounts, contract: instance });
      dispatch(storeWeb3({web3, accounts, contract: instance }));
      setAppState({ ...appState, web3, accounts, contract: instance });

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  useEffect(() => {
    async function connect() {
      getGames();
      connectWeb3();
    }
    connect();
  }, []);

  return (
    <>
      {gamesByDate && allGames && web3Instance ? (
            <Switch>
              <Route exact path="/" 
                     render={(props) => <HomePage {...props} gamesByDate={gamesByDate} />}
              />
              <Route path="/bets" 
                     component={UserBets}
              />
              <Route path="/games/:gameID/:gameDate" 
                     render={(props) => <PlaceBet {...props} web3={web3Instance} accounts={accounts} contract={contract} allGames={appState.allGames} />}
              />
            </Switch>
            
      ) : <div><div>Loading Web3, accounts, and contract...</div><button onClick={() => {
          console.log('state: ', appState);
          console.log(allGames);
          console.log(gamesByDate);
          console.log(appState.web3);
      }}>log</button></div>}
    </>
  );

}

export default App;
