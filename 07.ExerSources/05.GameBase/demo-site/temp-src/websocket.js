var exampleSocket = new WebSocket("ws://localhost:3009/");
exampleSocket.onopen = function(e) {
  exampleSocket.send("Demo 1")
};
