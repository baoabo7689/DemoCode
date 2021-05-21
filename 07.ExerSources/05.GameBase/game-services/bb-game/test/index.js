const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3008
 
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {  
  console.log('a user connected');
});

app.get('/', (req, res) => {
  res.send('This is Game Server!');
});

server.listen(port, () => {
  console.log('listening on *:3000');
});