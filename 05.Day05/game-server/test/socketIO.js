
const { Server } = require("socket.io");
const socketIO = new Server(server, { cors: { origin: '*' } });
socketIO.on('connection', (socket) => {  
  socket.on('joinChat', async (msg) => {
    console.log(msg);
  });
});
