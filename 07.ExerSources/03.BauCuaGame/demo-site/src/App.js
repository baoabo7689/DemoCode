import './App.scss';
import React from 'react';
import moment from 'moment';
import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:3000');

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
        betOptions: ["bau", "ca", "cua", "ga", "ho", "tom"],
        username: "Louis.Nguyen",
        addedBalance: "200",

        gameRoundId: '',
        startTime: '',
        endTime: '',

        gameOutstanding: 0,
        joinedUsername: "",
        balance: 0,
        outstanding: 0,
        betValue: 0,

        choosedBets: [],
        timestamp: ""
    };

    this.listenFromAPI();
}

listenFromAPI() {
  socket.on("UpdateRound", data => {
    this.setState({
        gameRoundId: data.id,
        startTime: moment(data.startTime).format("hh:mm:ss"),
        endTime:  moment(data.endTime).format("hh:mm:ss"),
        gameOutstanding: 0,
        outstanding: 0,
        choosedBets: []
    });
  });

  socket.on("UpdateJoinedUser", data => {
    console.log(data.targetUsername);
    if(data.targetUsername !== this.state.joinedUsername) {
      return;
    }

    this.setState({       
			joinedUsername: data.username,
			balance: data.balance,
			betValue: data.betValue,
      gameOutstanding: data.roundTurnover,
      outstanding: data.userTurnover,
      choosedBets: data.choosedBets
    });
  });

  socket.on("UpdateRoundTurnover", data => {
    console.log(data.roundTurnover + this.state.joinedUsername);
    if(data.roundId !== this.state.gameRoundId) {
      return;
    }

    this.setState({ gameOutstanding: data.roundTurnover });
  });

  socket.on("UpdateUserTurnover", data => {
    if(data.roundId !== this.state.gameRoundId ||
      data.targetUsername !== this.state.joinedUsername) {
      return;
    }

    this.setState({ outstanding: data.userTurnover });
  });

  socket.on("UpdateUserBalance", data => {
    if(data.targetUsername !== this.state.joinedUsername) {
      return;
    }

    this.setState({ balance: data.balance });
  });
}

updateUsername(e) {
  this.setState({ username: e.target.value });
}

updateAddedBalance(e) {
  this.setState({ addedBalance: e.target.value });
}

addBalance() {
  socket.emit('addBalance', {
    username: this.state.username,
    balance: this.state.addedBalance
  });
}

joinGame() {
  if(!this.state.gameRoundId) {
    return;
  }

  this.setState({ joinedUsername: this.state.username });
  socket.emit('joinGame', this.state.username);
}

leaveGame() {
  socket.emit('leaveGame',{
    username:this.state.joinedUsername,
    roundId: this.state.gameRoundId
  });
  
  this.setState({ 
    joinedUsername: "",
    choosedBets: []
  });
}

disableBetOption(b) {
  return this.state.choosedBets.indexOf(b) === -1 ? "" : " hide";
}

chooseBet(e, b) {
  console.log(b);
  var choosedBets = this.state.choosedBets;
  if (choosedBets.indexOf(b) !== -1) {
      return;
  }

  socket.emit('placeBet', {
    username: this.state.joinedUsername,
    betOption: b,
    betValue: this.state.betValue,
    roundId: this.state.gameRoundId
  });

  choosedBets.push(b);
  this.setState({ 
    choosedBets,
    timestamp: new Date()
  });
}

  render() {
      return (
      <div>
        <div id="user-info">
            <input id="username" type="text" value={this.state.username} onChange={(e) => this.updateUsername(e)} />
            <button onClick={() => this.addBalance()}>Add Balance</button>
            <input id="balance" type="text" value={this.state.addedBalance} onChange={(e) => this.updateAddedBalance(e)} />
        </div>
        <div className="group">
            <div className="game-round">Game Round Id: {this.state.gameRoundId}</div>
            <div className="game-start-time">Start Time: {this.state.startTime}</div>
            <div className="game-end-time">End Time: {this.state.endTime}</div>
            <button className={this.state.joinedUsername ? "hide" : ""} onClick={() => this.joinGame()}>Join Game</button>
            <button className={this.state.joinedUsername ? "" : "hide"} onClick={() => this.leaveGame()}>Leave Game</button>
        </div>
        <div id="game-container" className={"game-container " + (this.state.joinedUsername ? "" : " hide")}>
          <div className="group">
              <div className="joined-username">Joined Username: {this.state.joinedUsername}</div>
              <div className="user-balance">Balance: {this.state.balance}</div>
              <div className="user-bet-value">Bet Value: {this.state.betValue}</div>
              <div className="user-outstanding">Outstanding in this game: {this.state.outstanding}</div>
              <div className="game-outstanding">Total Game Outstanding: {this.state.gameOutstanding}</div>
          </div>          
          <div className="group bet-options-group">
              <div className="bet-options">Bet Options</div>
              <div id="bet-options">
                  {
                      this.state.betOptions.map(b =>
                          <div className={"bet-option bet-" + b + this.disableBetOption(b)}
                              onClick={(e) => this.chooseBet(e, b)}
                              style={{backgroundImage: 'url("/images/' + b +'.png")'}}></div>)
                  }
              </div>
          </div>          
          <div className="group choosed-bets-group">
              <div>Choose Bets</div>
              <div id="choosed-bets">
                  {
                      this.state.choosedBets.map(b =>
                          <div className={"bet-option bet-" + b}
                              style={{backgroundImage: 'url("/images/' + b +'.png")'}}></div>)
                  }
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
