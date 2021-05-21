// Router HTTP / HTTPS

module.exports = function (app, redT) {
  // Home
  app.get("/", function (req, res) {
    res.send("Site is running");
  });
  
  require("./end-game")(app, redT);
  require('./common')(app, redT);
  require('./games')(app, redT);
};
