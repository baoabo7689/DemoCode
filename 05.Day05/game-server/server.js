const express = require('express')
const appConfig = require("./configs/appConfigs");

const app = express()
const port = appConfig.port

const http = require('http');
const server = http.createServer(app);

var expressWs = require('express-ws')(app, server);
const socket = expressWs.getWss();
require("./routes/routerSocket")(app, socket);


server.listen(port, () => {
  console.log(`App is listening on *: ${port}`);
});
