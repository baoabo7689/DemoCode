socket.on("result2", (data) => this.displayResultObject(data));

// socket
const socket = socketIOClient(
  appConfigs.userServices,
  appConfigs.socketOptions
);

socket.emit("signin", {
  username: "admin_1",
  ss: "l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1",
});
