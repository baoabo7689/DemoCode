// mini-keno
const socket = socketIOClient("https://l1-proxy.lumigame.com/user/kenomax", {
  transports: ["websocket"],
  upgrade: false,
  path: "/minikeno/socket.io",
  forceNew: true,
});

socket.emit("signin", {
  username: "admin_1",
  ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
});

const data = {
  amount: 1,
  betChoice: "big",
  // freeBet: false,
  // roundId: 7,
};

// mini-keno not work

var socket = socketIOClient("https://l1-proxy.lumigame.com", {
  transports: ["websocket"],
  upgrade: false,
  path: "/minikeno/socket.io",
  forceNew: true,
});

socket.of("/user/kenomax").emit("signin", {
  username: "admin_1",
  ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
});

socket.of("/user/kenomax").on("signedIn", () => {
  const data = {
    amount: 10,
    betChoice: "fish",
    freeBet: false,
    // roundId: 7,
  };

  //  socket.emit(this.state.methodName, data);
  socket.emit("getGameConfigs");
  socket.emit("inGame");

  socket.emit("getStatistics", {});
});

// l2-mini-keno
const socket = socketIOClient("https://l2-proxy1.lumigame.com/user/kenomax", {
  transports: ["websocket"],
  upgrade: false,
  path: "/minikeno/socket.io",
  forceNew: false,
});

socket.emit("signin", {
  username: "admin_1",
  ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
});
