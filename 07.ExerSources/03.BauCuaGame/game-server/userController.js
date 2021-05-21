let { MongooseController }  = require('./mongooseController');

class UserController {
	constructor() {
		this.mongooseController = new MongooseController();
		this.UserModel = this.mongooseController.getModel("User");
	}
		
	setHeader(res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
	}

	registerServices(app) {
		app.get('/addbalance', async (req, res) => {
			var result = await this.addBalance(req.query.username, req.query.balance);
			this.setHeader(res);
			res.send(result);	
		})
	}

	async createNewUser(username) {		
		var result = new this.UserModel({
			username,
			balance: 100000,
			betValue: 10
		});
		
		await result.save();
		return result;
	}

	async findUser(username) {
		return await this.UserModel.findOne({  username });
	}

	async addBalance(username, balance) {
		let user = await this.findUser(username);
		if(user == null) {
			user = await this.createNewUser(username);
		}

		user.balance += parseFloat(balance);
		await user.save();

		return user;
	}
}


module.exports = {
	UserController: UserController
};
