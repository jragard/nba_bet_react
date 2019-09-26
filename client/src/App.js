import React, { Component } from "react";
import Betting from "./contracts/Betting.json";
import Game from "./Game";
import getWeb3 from "./utils/getWeb3";
import DatePicker from "react-date-picker";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";

class App extends Component {
  state = { address: 0, web3: null, accounts: null, contract: null, date: new Date(), games: null };

  componentDidMount = async () => {
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
      console.log(res.data);
      console.log(typeof res.data);

      let gameData = [];
      // let gameText = [];
      // let gameData = [];
      for(let key in res.data) {
        let gamePair = res.data[key];
        // console.log('gamePair');
        // console.log(gamePair);
        let timestamp = new Date(gamePair[0].gameDateEST).getTime() / 1000;
        // console.log('timestamp');
        // console.log(timestamp);
        gamePair[0].timestamp = timestamp;
        gamePair[1].timestamp = timestamp;

        // let gameID = gamePair[0].gameID;
        // let homeTeamID = gamePair[0].homeTeamID;

        // let city1 = gamePair[0].teamCityName;
        // let teamID1 = gamePair[0].teamID;
        // let record1 = gamePair[0].teamWinsLosses;

        // let city2 = gamePair[1].teamCityName;
        // let record2 = gamePair[1].teamWinsLosses;

        // let homeTeam;
        // let visitorTeam;
        // let homeRecord;
        // let visitorRecord;

        // if(teamID1 === homeTeamID) {
        //     homeTeam = city1;
        //     visitorTeam = city2;
        //     homeRecord = record1;
        //     visitorRecord = record2;
        //     gamePair[0].home = true;
        //     gamePair[0].visiting = false;
        //     gamePair[1].home = false;
        //     gamePair[1].visiting = true;
        // } else {
        //     homeTeam = city2;
        //     visitorTeam = city1;
        //     homeRecord = record2;
        //     visitorRecord = record1;
        //     gamePair[1].home = true;
        //     gamePair[1].visiting = false;
        //     gamePair[0].home = false;
        //     gamePair[0].visiting = true;
        // }
        console.log(gamePair);

        let homeObj = gamePair.filter((obj) => {
          return obj.homeTeamID === obj.teamID;
        });

        let awayObj = gamePair.filter((obj) => {
          return obj.visitorTeamID === obj.teamID;
        });
        console.log(homeObj);
        console.log(awayObj);

        gameData.push([awayObj[0], homeObj[0]]);
    }
    console.log(gameData);
    this.setState({ games: gameData});
    })

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
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

        <div>
          {this.state.games ? this.state.games.map((game) => (
            <Game games={game}/>
          )) : ""}
        </div>

        <div>The address of the Betting contract is: {this.state.address}</div>
      </div>
    );
  }
}

export default App;
