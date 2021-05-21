import socketIOClient from "socket.io-client";
const socket = socketIOClient('http://localhost:3005');     
socket.on('connect', () => {
  console.log("Connected 2")
});    

const socket = socketIOClient('http://localhost:3009');
socket.emit('joinChat', 'Demo Site')

// Not work
callWebSocket() {
  const io = require('socket.io-client');
  const socket = io.connect('ws://localhost:3011/user/bbgame', { 
    "pingInterval": 60000,
    "pingTimeout": 60000,
    "transports": ["websocket"],
     "allowUpgrades": false 
  });
  
  socket.on('connect', () => {
    console.log("Connected")
  });
}

callSocketIO() {
  const socket = socketIOClient('http://localhost:3008');
  socket.on('connect', () => {
    console.log("Connected")
  });

  socket.on("disconnect", () => {
    console.log("Disconnected")
  });
}
