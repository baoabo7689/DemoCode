let users = require('./socketUsers');

module.exports = function (app, redT) {
  app.get("/", function (req, res) {
    res.send("Site is running");
  });
  
  app.ws('/websocket', function(ws, req) {
		users(ws, redT, req);
	});
};
