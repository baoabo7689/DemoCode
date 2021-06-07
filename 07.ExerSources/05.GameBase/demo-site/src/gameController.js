import socketIOClient from "socket.io-client";
import appConfigs from "./configs";
const request = require('request');
const jwt = require("jsonwebtoken");

export default class GameController {  
  constructor() {
    this.state = {
      userServices: null,
      userServer: null,
      adminServer: null,
      choices: ["bau", "ca", "cua", "ga", "ho", "tom"],

      choiceMapper: {        
        "ho": "stag",
        "bau": "gourd",
        "ga": "rooster",
        "ca": "fish",
        "cua": "crab",
        "tom": "prawn",        
        "stag": "ho",
        "gourd": "bau",
        "rooster": "ga",
        "fish": "ca",
        "crab": "cua",
        "prawn": "tom"
      }
    };
  }

  getDefaultState() {
    return {
      betOptions: this.state.choices,
      username: 'admin',
      password: '123456',

      sessionId: '',
      sessionName: '',

      joinedGame: false,
      chips: [],
      betValue: 0,
      choosedBets: [],

      isAdmin: false,
      adminResult: 'ca,tom,cua',
      showHistory: false,
      history: {
        betLogs: [],
        page: 0,
        pageSize: 1000,
        total: 0
      },

      remainingTime: 0,
      roundInterval: 0,
      totalBets: 0,

      currentBetOption: '',
      canPlaceBet: false,
      finishedRound: null,
      resultId: 0,
      result: {
        dice1: 1,
        dice2: 1,
        dice3: 1,
      },

      roundId: 0
    };
  }


  connectUserServices(app) {
    const socket = socketIOClient(appConfigs.userServices, appConfigs.socketOptions);
    socket.on("signedIn", () => {
      app.userSignedIn();
    });

    socket.on("BBGame", (data) => {
        // console.log(data);

        if(!!data.gameConfig) {
          app.updateGameConfigs(data.gameConfig);
        }

        if(!!data.history) {
          app.showHistory(data.history);
        }
        
        if(!!data.remainingTime) {
          app.setRemainingTime(data.remainingTime)
        }
        
        if(!!data.totalBets) {
          app.setTotalBets(data.totalBets)
        }

        if(!!data.endBet) {
          app.placedBet(data);
        }

        if(!!data.gameRoundResult) {
          app.showGameRoundResult(data);
        }

        if(!!data.currentGameRound) {
          app.setCurrentRound(data)
        }
    });

    this.state.userServices = socket;
    return socket;
  }

  connectAdminServices(app) {
    const socket = socketIOClient(appConfigs.adminServices, appConfigs.socketOptions);
    socket.on("BBGame", (data) => {       
        if(!!data.adminSettle) {
          console.log(data.adminSettle);
          if(data.adminSettle.success) {
            app.setState({ setResultMsg: 'Done set Admin Result' });
          } else {
            app.setState({ setResultMsg: 'Error set Admin Result' });
          }
        }
    });

    this.state.adminServices = socket;
    return socket;
  }
  connectUserServer(app) {
    const socket = new WebSocket(appConfigs.userSocket);
    socket.onmessage = (res) => {
    };

    this.state.userServer = socket;
    return socket;
  }

  connectAdminServer(app) {
    const socket = new WebSocket(appConfigs.adminSocket);
    socket.onmessage = (res) => {
      console.log(res)
      app.handleAdminResult(res);
    };

    this.state.adminServer = socket;

    return socket;
  }

  connectSockets(app) {
    return  { 
      userServer: this.connectUserServer(app),
      adminServer: this.connectAdminServer(app)
    };
  }

  testCall() {

  }

  userJoinGame(user) {
    this.state.userServices.emit("signin", user);
  }

  userLeaveGame() {
    this.state.userServices.emit("disconnect");
  }

  placeBet(b) {    
    const bet = {};
    this.state.choices.forEach(c =>{
      const choiceName = this.mapChoice(c);
      bet[choiceName] = b[c] || 0;
    });

    this.state.userServices.emit("bet", { bet });
  }

  getBetOptions(b) {
    return this.state.choices.map(c => this.state.choiceMapper[c]).filter(c => b[c] === 1).join(", ");
  }

  mapChoice(c) {
    return this.state.choiceMapper[c];
  }

  makeQueryStr(req) {
    return Object.keys(req).map(key => key + '=' + req[key]).join('&');
  }

  settleAdminResultByHttp(app, adminResult) {
    request.post(`${appConfigs.gameServices}/set-result?${this.makeQueryStr(adminResult)})`, (err, res, body) => {
      var result =  JSON.parse(body);
      if(result.settlementResultFromAdmin) {
        app.setState({ setResultMsg: 'Done set Admin Result' });
      } else {
        app.setState({ setResultMsg: 'Error set Admin Result' });
      }
    });
  }

  getJwt(username) {
    return jwt.sign({ user: username }, appConfigs.adminSecretKey);
  }

  settleAdminResultBySocker(app, adminResult) {
    const param = {
      authentication: {
        jwt: this.getJwt(app.state.username)
      },
      BBGame: {
        setResult: {
          roundId: adminResult.roundId,
          result: {
            dice1: adminResult.dice1,
            dice2: adminResult.dice2,
            dice3: adminResult.dice3
          }
        }
      }
    };

    this.connectAdminServices(app);
    this.state.adminServices.emit('message', param)
  }

  generateToken() {
    const token = '$2b$12$PKfGz7ktjJ/Q5JjE0WC6aeYTrXsDTLl9lbgoRE/qOrz0HcWccE1pW-BM3dl4urnATaoXDTGcDxNw=='
    return token;
  }
}























