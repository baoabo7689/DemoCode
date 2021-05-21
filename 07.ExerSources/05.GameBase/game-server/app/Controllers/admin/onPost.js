const Admin = require("./Admin");
const BauCua = require("./game/baucua");

module.exports = function (client, data) {
  if (!!data) {
    if (!!data.admin) {
      Admin.onData(client, data.admin);
    }

    // Begin Game
    if (!!data.baucua) {
      BauCua(client, data.baucua);
    }    
  }
};
