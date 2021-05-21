
let User = require('./User');
const GameNotification = require("./game-notification");

module.exports = function (client, p) {
	if (!!p) {
		if (!!p.signName) {
			User.signName(client, p.signName);
		}

		if (!!p.user) {
			User.onData(client, p.user);
		}

		if (!!p.gameNotifications) {
      GameNotification(client, p.gameNotifications);
    }
	}
	client = null;
	p = null;
}
