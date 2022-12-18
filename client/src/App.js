import Betting from "./contracts/Betting.json";

import React, { useState, useEffect } from "react";
import { Routes, Route, createRoutesFromElements } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { storeWeb3, hydrateGames } from './actions/actions.js';

import getWeb3 from "./utils/getWeb3";

import { HomePage, PlaceBet, UserBets } from "./components/index";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

const App = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({ address: 0, web3: null, accounts: null, contract: null });
  const [gamesByDate, setGamesByDate] = useState([]);

  const getGames = () => {
    axios.get("http://localhost:3000/fullSchedule")
    .then((response) => {
      console.log('response: ', response);
      dispatch(hydrateGames(response.data));
      setGamesByDate(response.data.gamesByDate);
    });
  }

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
      dispatch(storeWeb3({web3, accounts, contract: instance }));
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
      getGames();
      connectWeb3();
    }
    connect();
  }, []);

  return ( 
    <>
      {state.web3 && gamesByDate ? (
            <Routes>
              <Route path="/" element={<HomePage gamesByDate={gamesByDate} />} />
              <Route path="/bets" element={<UserBets />} />
              <Route path="/games/:gameID/:gameDate" element={<PlaceBet web3={state.web3} accounts={state.accounts} contract={state.contract} />}
                    //  render={(props) => <PlaceBet {...props} web3={state.web3} accounts={state.accounts} contract={state.contract} />}
              />
            </Routes>
      ) : <div>Loading Web3, accounts, and contract...</div>}
    </>
  );

}

export default App;
