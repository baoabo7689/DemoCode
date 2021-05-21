const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000
 
const { MongooseController }  = require('./mongooseController');
const mongooseController = new MongooseController();
mongooseController.connectGameServer();

const { GameController }  = require('./gameController');
const gameController = new GameController();

let { UserController }  = require('./userController');
let userController = new UserController();

const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: '*' } });

async function initClient(socket) {
  const r = await gameController.updateRound();
  socket.emit("UpdateRound", r.data);
}

async function showLastResult(socket, user) {
  const lastResult = await gameController.getLastRoundResult();
  if(lastResult == null) {
    socket.emit("UpdateLastRoundResult", null);
  } else {
    socket.emit("UpdateLastRoundResult", {
      roundId: lastResult.roundId,
      betOptions: lastResult.betOptions,
      lastBets: await gameController.getUserBets(user.username, lastResult.roundId)
    });  
  }
}

io.on('connection', (socket) => {  
  console.log('a user connected');
  initClient(socket);
  
  const socketInterval = setInterval(async () => { 
    const r = await gameController.updateRound();    
    if(r.isUpdate) {
      socket.emit("UpdateRound", r.data);
    }    
  }, 500);


  let lastResultInterval = 0;

  socket.on('joinGame', async (msg) => {
    console.log(msg + ' joins game.');
    const user = await  gameController.authenticateUser(msg);
    const round = await gameController.getCurrentRound();
    const userTurnover = await  gameController.getUserTurnover(msg, round.id);
    const roundTurnover = await  gameController.getRoundTurnover(round.id);
    await  gameController.joinGame(msg, round.id);

    const bets =  await  gameController.getUserBets(msg, round.id);
    socket.emit("UpdateJoinedUser", {
      targetUsername: msg,
      userTurnover,
      roundTurnover,
      username: user.username,
			balance: user.balance,
			betValue: user.betValue,
      choosedBets: bets
    });

    showLastResult(socket, user);
    lastResultInterval = setInterval(async () => { 
      showLastResult(socket, user);

      const u = await userController.findUser(user.username);
      socket.emit("UpdateUserBalance", { balance: u.balance, targetUsername: user.username});      
    }, 3000);
  });

  socket.on('leaveGame', async (msg) => {
    console.log(`${msg.username} leaves round ${msg.roundId}.`);

    await  gameController.leaveGame(msg.username, msg.roundId);
    clearInterval(lastResultInterval);
  });

  socket.on('placeBet', async (msg) => {
    console.log(`${msg.username} places bet: ${msg.betOption} on round ${msg.roundId}.`);
    await gameController.placeBet(msg);

    const roundTurnover = await gameController.getRoundTurnover(msg.roundId);
    const userTurnover = await gameController.getUserTurnover(msg.username, msg.roundId);
    const user = await userController.findUser(msg.username);
    socket.emit("UpdateRoundTurnover", { roundId: msg.roundId, roundTurnover});
    socket.emit("UpdateUserTurnover", { roundId: msg.roundId, userTurnover, targetUsername: msg.username});
    socket.emit("UpdateUserBalance", { balance: user.balance, targetUsername: user.username});
  });

  socket.on('addBalance', async (msg) => {
    console.log(`Add ${msg.balance} for ${msg.username}.`);
    const user = await userController.addBalance(msg.username, msg.balance);
    socket.emit("UpdateUserBalance", { balance: user.balance, targetUsername: user.username});
  });

  socket.on("disconnect", () => {
    clearInterval(socketInterval);
    clearInterval(lastResultInterval);
  });
});

app.get('/', (req, res) => {
  res.send('This is Game Server!');
});

server.listen(port, () => {
  console.log('listening on *:3000');
});