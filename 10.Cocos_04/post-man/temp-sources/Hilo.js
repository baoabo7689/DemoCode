// Hilo Service

const socket = socketIOClient("https://l1-proxy.lumigame.com/user/hilo", {
  transports: ["websocket"],
  upgrade: false,
  path: "/hilo/socket.io",
  forceNew: true,
  parser: customParser,
});

const socket = socketIOClient(appConfigs.userServices, {
  ...appConfigs.socketOptions,
  parser: customParser,
});

socket.on("connect", () => {
  console.log(`connection 1`);
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("Hilo", (message) => {
  console.log(message);
});

socket.on("disconnect", (reason) => {
  console.log(reason);
});

socket.emit("signin", {
  username: "admin_1",
  ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
});

socket.on("signedIn", () => {
  // socket.emit("anNon");
  socket.emit("inGame");
  socket.emit("newGame", { amount: 10 });
  // socket.emit("bet", { amount: 10, betChoice: "hi" });
  socket.emit("getHistory", { page: 1 });
});
