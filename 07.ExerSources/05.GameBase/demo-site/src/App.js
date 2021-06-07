import './App.scss';
import React from 'react';
import GameController from "./gameController"
import appConfigs from './configs';
const request = require('request');

var gameController = new GameController();

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...gameController.connectSockets(this),
      ...gameController.getDefaultState()
    };
  }

  updateUsername(e) {
    this.setState({ username: e.target.value });
  }

  updatePassword(e) {
    this.setState({ password: e.target.value });
  }

  updateAdminResult(e) {
    this.setState({ adminResult: e.target.value });
  }

  resetState() {
    this.setState({ ...gameController.getDefaultState() }); 
  }

  makeQueryStr(req) {
    return Object.keys(req).map(key => key + '=' + req[key]).join('&');
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
        this.setState({ isAdmin: true });
        
        this.setState({ userServices: gameController.connectUserServices(this) });
        this.state.userServices.emit("getCurrentGameRound");

        return;
      }

    } catch {      
    }
  }

  authenticateUser() {
    this.resetState();

    const req = {
      token: 'dummy-token',
      username: this.state.username,
      userId: 1,
      language: "en-US"
    };

    request.get(`${appConfigs.gameServer}/authenticate?` +  this.makeQueryStr(req),
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
          
          this.state.userServer.send(JSON.stringify(data));
        } else {
          this.setState({  errorMsg: 'Not authenticated!' });          
        }
    });
  }

  authenticateAdmin() {
    this.resetState();
    this.setState({ adminServer: gameController.connectAdminServer(this), timestamp: new Date() });
    const req = {
      authentication:
      {
        // token: gameController.generateToken(),
        jwt: gameController.getJwt(this.state.username),
        username: this.state.username,
        password:this.state.password
      }
    };
    
    this.state.adminServer.send(JSON.stringify(req));
  }

  joinGame() {
    this.setState({ userServices: gameController.connectUserServices(this) }) ;

    gameController.userJoinGame({
      username: this.state.sessionName,
      ss: this.state.sessionId
    });
  }

  userSignedIn() {
    this.state.userServices.emit("getCurrentGameRound");
    this.state.userServices.emit('getGameConfigs')
  }

  updateGameConfigs(data) {
    this.setState({ joinedGame: true, chips: data.chips, betValue: data.chips[0].value });
  }

  chooseChip(value) {
    this.setState({ betValue: value });
  }

  disableBetOption(b) {
    return this.state.choosedBets.indexOf(b) === -1 ? "" : " hide";
  }

  chooseBet(e, b) {
    if(!this.state.canPlaceBet) {
      this.setState({ errorMsg: 'Please wait to 15s to place bet'});
      return;
    }

    this.setState({ errorMsg: ''});
    var choosedBets = this.state.choosedBets;
    if (choosedBets.indexOf(b) !== -1) {
        return;
    }
  
    choosedBets.push(b);
    this.setState({
      choosedBets, 
      currentBetOption: b,
      timestamp: new Date()
    });
    gameController.placeBet({ [b]: this.state.betValue });
  }

  placedBet(result) {
    if(result.endBet === 1) {
      this.setState({ errorMsg: ''});
    } else{      
      this.setState({ errorMsg: result.notice  });
    }
  }

  leaveGame() {
    gameController.userLeaveGame();
    this.setState({ joinedGame: false });
  }  

  history() {
    this.state.userServices.emit("getHistory", { page: 1 });
  }

  showHistory(history) {
    this.setState({ showHistory: true, history });
  }

  setAdminResult() {
    this.setState({ setResultMsg: '' });
    this.setState({ adminServer: gameController.connectAdminServer(this) });

    const result = this.state.adminResult.split(",").map(c => gameController.mapChoice(c));
    const adminResult = {
      roundId: this.state.roundId + 1,
      dice1: result[0],
      dice2: result[1] || result[0],
      dice3: result[2] || result[0]
    };

    // gameController.settleAdminResultByHttp(this, adminResult);    
    gameController.settleAdminResultBySocker(this, adminResult);
  }

  setRemainingTime(remainingTime) {
    const timePlaceBets = 15;

    if(this.state.remainingTime <= 0) {
     clearInterval(this.state.roundInterval)
     
     this.state.userServices.emit("getCurrentGameRound");
     this.state.userServices.emit('getGameRoundResult', this.state.roundId-1)
    }

    this.setState({ 
      remainingTime,
      choosedBets: [],
      totalBets: 0
     })

    const roundInterval = setInterval(() => {
      const canPlaceBet = this.state.remainingTime <= timePlaceBets && this.state.remainingTime > 0;
      this.setState({ 
        remainingTime: this.state.remainingTime > 0 ? this.state.remainingTime-1:0,
        canPlaceBet
      })    
    }, 1000);

    this.setState({ roundInterval })
  }

  setTotalBets(totalBets) {
    if(Object.keys(totalBets).length === 0) {
      return;
    }

    const t = Object.values(totalBets).reduce((accumulator, val) => accumulator + val);
    this.setState({ totalBets: t });
  }

  showGameRoundResult(data) {
    console.log(data.gameRoundResult.result)
    this.setState({
      finishedRound: data.gameRoundResult,
      resultId: data.gameRoundResult.id,
      result: data.gameRoundResult.result
    });
  }

  setCurrentRound(data) {
    this.setState({ roundId: data.currentGameRound.id })

    this.setRemainingTime(data.currentGameRound.remainingTime)
    this.setTotalBets(data.currentGameRound.totalBets)
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
        <div className="group">
          <button onClick={(e) => gameController.testCall()}>Call Services</button>
        </div>
        
        <div className={"group " + (this.state.sessionId ? "":"hide")}> 
          <label>Session ID: {this.state.sessionId}</label>
        </div>
        <div className= { "group " + (this.state.sessionId ? "":"hide")}> 
           <button onClick={() => this.joinGame()}>Join Game</button>
           <button onClick={() => this.leaveGame()}>Leave Game</button>
        </div>
        <div className={"group " + (this.state.joinedGame ? "":"hide")}> 
          <label>Round: {this.state.roundId} - </label><label>Time: {this.state.remainingTime}</label>
          <label> - Round Total Bets: {this.state.totalBets}</label>
        </div>
        <div className={"group chip-group " + (this.state.joinedGame ? "":"hide")}> 
              <div className="bet-value">Bet Value: {this.state.betValue}</div>
              <div id="chips">
                  {
                      this.state.chips.map(b =>
                          <button className={"chip-option " + (this.state.betValue===b.value?'selected':'')}
                            key={"chip-" + b.value}
                            onClick={(e) => this.chooseChip(b.value)}>{b.label}</button>)
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
        <div className={"group " + (this.state.isAdmin ? "": 'hide')}>
              <label>Round: {this.state.roundId+1} - </label>
              <label>Admin Result</label>
              <input id="admin-result" type="text" className="label" value={this.state.adminResult} onChange={(e) => this.updateAdminResult(e)} />
              <button onClick={(e) => this.setAdminResult()}>Set Admin Result</button>
              <label>{this.state.setResultMsg}</label>
        </div>
        <div className={"group " + (!!this.state.finishedRound ? '' : 'hide')}>
          <label>Round Id: {this.state.resultId}</label>
          <label>Result: </label>
          <div className="bet-option bet-1" key="result-bet-1" style={{backgroundImage: 'url("/images/' + gameController.mapChoice(this.state.result.dice1) +'.png")'}}></div>
          <div className="bet-option bet-2" key="result-bet-2" style={{backgroundImage: 'url("/images/' + gameController.mapChoice(this.state.result.dice2) +'.png")'}}></div>
          <div className="bet-option bet-3" key="result-bet-3" style={{backgroundImage: 'url("/images/' + gameController.mapChoice(this.state.result.dice3) +'.png")'}}></div>
       </div>
        
        <div className={"group " + (this.state.joinedGame ? "":"hide")}>
          <button onClick={(e) => this.history()}>History</button>
        </div>
        <div className={"group history-group " + (this.state.showHistory ? "":"hide")}>
          <label>Page: {this.state.history.page}</label> - <label>Page Size: {this.state.history.pageSize}</label> - <label>Total: {this.state.history.total}</label>
          <div id="bet-logs">
            {
              this.state.history.betLogs.map(b => 
                <div key={b.phien}>
                  <label>Round: {b.phien}</label>
                  <label> - Result: {b.result.dice1}, {b.result.dice2}, {b.result.dice3}</label>
                  <label> - Bet: {gameController.getBetOptions(b)}</label>
                </div>)
            }
          </div>      
        </div>
      </div>
    );
  }
}

export default App;
