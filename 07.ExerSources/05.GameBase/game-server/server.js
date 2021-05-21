const express = require('express')
const appConfig = require("./config/appConfigs");

const app = express()
const port = appConfig.port

const http = require('http');
const server = http.createServer(app);
var expressWs = require('express-ws')(app);

var useragent = require("express-useragent");
app.use(useragent.express());

const expressip = require("express-ip");
app.use(expressip().getIpInfoMiddleware);

require("./app/web/mongodb_connection")();
require("./config/admin");

let bodyParser = require("body-parser");
var morgan = require("morgan");

// đọc dữ liệu from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.set("view engine", "ejs"); // chỉ định view engine là ejs
app.set("views", "./views"); // chỉ định thư mục view

// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static("public"));

// server socket
let redT = expressWs.getWss();

const logger = require("./app/web/logger");

redT.on("connection", (ws) => {
  ws.on("error", (error) => {
    logger.logError(error);
  });
});

redT.on("error", (error) => {
  logger.logError(error);
});

require("./routes/routerHttp")(app, redT); // load các routes HTTP
require("./routes/routerSocket")(app, redT); // load các routes WebSocket

require("./app/Helpers/socketUser")(redT); // Add function socket
require("./app/Helpers/ConfigHelper").loadAllConfigs(); // load all game configs
require("./app/Cron/UserCacheManagement/userCacheHandler").run(redT);

// Chạy game Bầu Cua
require("./app/Cron/baucua")(redT);
require("./app/Controllers/game/baucua/cuoc").initUserQueueProcessing(redT);

app.listen(port, function () {
  console.log("App is listening on port ", port);
});

require("./app/web/authentication")(app);

process.on("uncaughtException", function (err) {
  logger.logCritical(err);
  let messageLog = `${new Date()} uncaughtException `;
  if (err.message) {
    messageLog += err.message;
  }

  if (err.stack) {
    messageLog += "stack: " + err.stack;
  }

  console.log(messageLog);
});



