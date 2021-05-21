import express from 'express';
import { Server } from "socket.io";
import http from 'http';

const app = express();
const server = http.createServer(app);
const port = 3008
 
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