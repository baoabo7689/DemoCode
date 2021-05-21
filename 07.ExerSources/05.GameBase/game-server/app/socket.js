let first = require("./Controllers/User.js").first;
let onPost = require("./Controllers/onPost.js");

let auth = function (client) {
  client.gameEvent = {};
  client.scene = "home";
  first(client);
  client = null;
};

let signMethod = function (client) {
  client.TTClear = function () {
    this.TTClear = null;
  };
  client = null;
};

module.exports = {
  auth: auth,
  message: onPost,
  signMethod: signMethod,
};
