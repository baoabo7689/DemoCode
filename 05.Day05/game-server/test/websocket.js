
const http = require('http');
const server = http.createServer(app);
var expressWs = require('express-ws')(app, server);
let wss = expressWs.getWss();

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});
 
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log("Message: " + msg);
  });

  console.log('socket', req.testing);
});
 