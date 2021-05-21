import './App.scss';
import React from 'react';
import socketIOClient from "socket.io-client";
var request = require('request');

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    const sockets = this.connectSockets();
    this.state = {
        betOptions: ["bau", "ca", "cua", "ga", "ho", "tom"],
        ...sockets,
        username: 'admin',
        password: '123456',

        sessionId: '',
        sessionName: '',

        joinedGame: false,
        chips: [],
        betValue: 0,
        choosedBets: [],

        adminResult: 'ca,tom,cua'
    };
  }

  connectSockets() {
    const userSocket = new WebSocket("ws://localhost:3009/websocket");
    const adminSocket = new WebSocket("ws://localhost:3009/admin");
    const socketIOUser = socketIOClient('http://localhost:3011/user/bbgame', { 
      "pingInterval": 60000,
      "pingTimeout": 60000,
      "transports": ["websocket"],
      "allowUpgrades": false 
    });

    userSocket.onmessage = (res) => {
    };

    adminSocket.onmessage = (res) => {
     this.handleAdminResult(res);
    };

    return { socketIOUser, userSocket, adminSocket }
  }

  handleAdminResult(res) {
    if(!res.data) {
      return;
    }

    try{
      var result =  JSON.parse(res.data);
      if(result.unauth) {
        this.setState({ errorMsg: `${result.unauth.title} ${result.unauth.text}` });
        return;
      }

      if(result.Authorized) {
        this.setState({ sessionId: 'Authorized!' });
        return;
      }

    } catch {      
    }
  }

  updateUsername(e) {
    this.setState({ username: e.target.value });
  }

  updatePassword(e) {
    this.setState({ password: e.target.value });
  }

  resetSession() {
    this.setState({ 
      sessionId: "", 
      sessionName: '',
      errorMsg: '',

      joinedGame: false,
      chips: [],
      betValue: 0,
      choosedBets: []
    }); 
  }

  makeQueryStr(req) {
    return Object.keys(req).map(key => key + '=' + req[key]).join('&');
  }

  authenticateUser() {
    this.resetSession();

    const req = {
      token: 'dummy-token',
      username: this.state.username,
      userId: 1
    };

    request.get('http://localhost:3009/authenticate?' +  this.makeQueryStr(req),
      (err, res, body) => {
        if(err) {
          this.setState({ errorMsg: err.message });  
          return;
        }

        var result =  JSON.parse(body);
        if(result.isAuthenticated) {
          this.setState({ sessionId: result.ss, sessionName: result.username });
          
          const data = {
            authentication: {
              username: this.state.sessionName,
              password: this.state.password,
              data: {
                username: this.state.sessionName,
                ss: this.state.sessionId
              }
            }
          };
          
          this.state.userSocket.send(JSON.stringify(data));
        } else{
          this.setState({  errorMsg: 'Not authenticated!' });          
        }
    });
  }

  authenticateAdmin() {
    this.resetSession();

    const req = {
      authentication:
      {
        username: this.state.username,
        password:this.state.password
      }
    };
    
    this.state.adminSocket.send(JSON.stringify(req));
  }

  joinGame() {
    const req = {
      username: this.state.username,
      userId: 1
    };

    request.get('http://localhost:3009/api/settings?' +  this.makeQueryStr(req), (err, res, body) => {
      var result =  JSON.parse(body);
      this.setState({ joinedGame: true, chips: result.chips, betValue:  result.chips[0].value });
    });
  }

  chooseChip(value) {
    this.setState({ betValue: value });
  }

  disableBetOption(b) {
    return this.state.choosedBets.indexOf(b) === -1 ? "" : " hide";
  }

  chooseBet(e, b) {
    var choosedBets = this.state.choosedBets;
    if (choosedBets.indexOf(b) !== -1) {
        return;
    }
  
    // place bet
    choosedBets.push(b);
    this.setState({ 
      choosedBets,
      timestamp: new Date()
    });
  }

  leaveGame() {
    this.setState({ joinedGame: false });
  }
  
  updateAdminResult(e) {
    this.setState({ adminResult: e.target.value });
  }

  setAdminResult() {
    this.setState({ setResultMsg: '' });
    request.post('http://localhost:3008/set-result?' +  this.makeQueryStr({ adminResult: this.state.adminResult }), (err, res, body) => {
      var result =  JSON.parse(body);
      if(result.success) {
        this.setState({ setResultMsg: 'Done set Admin Result' });
      } else {
        this.setState({ setResultMsg: 'Error set Admin Result' });
      }
    });
  }

  testCall() {  
    this.state.socketIOUser.emit("testMethod", "BB")
  }

  render() { 
    return (
      <div>
        <div>Demo Site</div> 
        <div className={"group err-msg " + (this.state.errorMsg ? "" : "hide") }> 
          <label>Error: {this.state.errorMsg}</label>
        </div>
        <div className="group"> 
          <label>Username</label>
          <input id="username" type="text" className="label" value={this.state.username} onChange={(e) => this.updateUsername(e)} />
          <label>Password</label>
          <input id="password" type="text" className="label" value={this.state.password} onChange={(e) => this.updatePassword(e)} />
          <button onClick={() => this.authenticateUser()}>Authenticate User</button>
          <button onClick={() => this.authenticateAdmin()}>Authenticate Admin</button>
        </div>
        <div className={"group " + (this.state.sessionId ? "":"hide")}> 
          <label>Session ID: {this.state.sessionId}</label>
        </div>
        <div className= { "group " + (this.state.sessionId ? "":"hide")}> 
           <button onClick={() => this.joinGame()}>Join Game</button>
           <button onClick={() => this.leaveGame()}>Leave Game</button>
        </div>
        <div className={"group chip-group " + (this.state.joinedGame ? "":"hide")}> 
              <div className="bet-value">Bet Value: {this.state.betValue}</div>
              <div id="chips">
                  {
                      this.state.chips.map(b =>
                          <button className="chip-option" onClick={(e) => this.chooseChip(b.value)}>{b.label}</button>)
                  }
              </div>
        </div>
        <div className={"group bet-options-group " + (this.state.joinedGame ? "":"hide")}>
            <div className="bet-options">Bet Options</div>
            <div id="bet-options">
                {
                    this.state.betOptions.map(b =>
                        <div className={"bet-option bet-" + b + this.disableBetOption(b)}
                            onClick={(e) => this.chooseBet(e, b)}
                            key={"bet-" + b }
                            style={{backgroundImage: 'url("/images/' + b +'.png")'}}></div>)
                }
            </div>
        </div>    
        <div className={"group choosed-bets-group " + (this.state.joinedGame ? "":"hide")}>
            <div>Choosed Bets</div>
            <div id="choosed-bets">
                {
                    this.state.choosedBets.map(b =>
                        <div className={"bet-option bet-" + b}
                            key={"choosed-bet-" + b }
                            style={{backgroundImage: 'url("/images/' + b +'.png")'}}></div>)
                }
            </div>
        </div>
        <div className="group">
              <label>Admin Result</label>
              <input id="admin-result" type="text" className="label" value={this.state.adminResult} onChange={(e) => this.updateAdminResult(e)} />
              <button onClick={(e) => this.setAdminResult()}>Set Admin Result</button>
              <label>{this.state.setResultMsg}</label>
        </div>
        <div className="group">
          <button onClick={(e) => this.testCall()}>Call Services</button>
        </div>
      </div>
    );
  }
}

export default App;
