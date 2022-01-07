// Hilo Service
const socket = socketIOClient("http://localhost:5005/user/hilo", {
  transports: ["websocket"],
  upgrade: false,
  path: "",
  forceNew: true,
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
  socket.emit("collect");
  socket.emit("inGame");
  socket.emit("bet", { amount: 10 });

  setTimeout(() => {
    socket.emit("deal", { amount: 10, betChoice: "h" });
  }, 2000);
  setTimeout(() => {
    socket.emit("getHistory", { page: 1 });
  }, 10000);
});

// set-result
const http = new XMLHttpRequest();
const url = "http://localhost:5005/api/set-result";
http.open("POST", url);
http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
http.send(JSON.stringify({ roundId: 10, result: { rank: 5, suit: 2 } }));

http.onreadystatechange = (e) => {
  console.log(http.responseText);
};

// L1.Local1

const socket = socketIOClient("http://localhost:5001/user/hilo", {
  transports: ["websocket"],
  upgrade: false,
  path: "",
  forceNew: true,
  //   parser: customParser,
});

const socket = socketIOClient("https://l1-proxy1.lumigame.com/user/hilo", {
  transports: ["websocket"],
  upgrade: false,
  path: "/hilo/socket.io",
  forceNew: true,
  //   parser: customParser,
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
  console.log("disconnect " + reason);
});

socket.emit("signin", {
  username: "ONEworks1_1001057",
  ss: "aBYMo2izLfXwsUGCrtMCD17NUkOUW74u_ONEworks1_1001057",
});

socket.on("signedIn", () => {
  socket.emit("collect");
  socket.emit("inGame");
  socket.emit("bet", { amount: 10 });

  setTimeout(() => {
    // socket.emit("deal", { amount: 10, betChoice: "h" });
  }, 2000);
  //socket.emit("getHistory", { page: 1 });
  setTimeout(() => {
    //socket.emit("getHistory", { page: 1 });
  }, 10000);
});
