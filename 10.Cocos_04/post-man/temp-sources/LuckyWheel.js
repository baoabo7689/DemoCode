
// lucky-wheel
"userServices" = "http://localhost:8001/user/luckywheel"
const socket = socketIOClient(
  appConfigs.userServices,
  appConfigs.socketOptions
);

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

socket.emit('getLogs');
socket.emit('getHistory', {page:1});
socket.emit('playSpin');


const socket = socketIOClient(
  'https://l2-proxy.lumigame.com/user/luckywheel',
  {
    transports: ['websocket'],
    upgrade: false,
    path: '/minikeno/socket.io',
    forceNew: false,
  }
);

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});



socket.emit("getLogs");
socket.emit("getHistory", { page: 1 });
socket.emit("playSpin");

socket.on("signedIn", () => {
  socket.emit("playSpin");

  const data = {
    amount: 1,
    betChoice: "big",
    freeBet: false,
    // roundId: 7,
  };

  socket.emit(this.state.methodName, data);
  socket.emit("getGameConfigs");
  socket.emit("inGame");

  socket.emit("getStatistics", {});
});

