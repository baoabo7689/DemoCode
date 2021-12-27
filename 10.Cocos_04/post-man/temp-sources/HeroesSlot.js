// heroes-slot service
const socket = socketIOClient("http://l1-proxy.lumigame.com/user/heroesslot", {
  transports: ["websocket"],
  upgrade: false,
  path: "/heroesslot/socket.io",
  forceNew: true,
});

socket.emit("signin", {
  username: "gamesimulator_2148557",
  ss: "lXtCebybTd2JAXa6uT3hQqk12T9S637V_gamesimulator_2148557",
});

socket.on("signedIn", () => {
  const data = {
    amount: 10,
    betChoice: "fish",
    freeBet: false,
    // roundId: 7,
  };

  // socket.emit(this.state.methodName, this.state.requestData);
  socket.emit(this.state.methodName, data);
  socket.emit("getGameConfigs");
  socket.emit("inGame");

  socket.emit("getStatistics", {});
});
