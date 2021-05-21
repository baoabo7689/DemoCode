let { MongooseController }  = require('./mongooseController');
let { UserController }  = require('./userController');

class GameController {
	constructor() {
		this.roundTime = 10000;
		this.maxRoundId = 1000;
		this.mongooseController = new MongooseController();

		this.GameRoundModel = this.mongooseController.getModel("GameRound");
		this.OnlineUserModel = this.mongooseController.getModel("OnlineUser");
		this.BetTicketModel = this.mongooseController.getModel("BetTicket");
		this.RoundResultModel = this.mongooseController.getModel("RoundResult");

		this.userController = new UserController();
	}
	
	async authenticateUser(username) {
		var user = await this.userController.findUser(username);

		if(user == null) {
			user = await this.userController.createNewUser(username);
		}

		return user;
	}

	async updateRound() {
		let data =  await this.getCurrentRound();
		let isUpdate = false;

		if(data == null) {
			data = await this.createNewRound(0);	
			isUpdate = true;	
		} else if (data.endTime < Date.now()){
			await this.settleTickets();
			data = await this.createNewRound(data.id);
			isUpdate = true;	
		}
		
		return { isUpdate, data };		
	}

	async createNewRound(maxId) {		
		var currentTime = new Date();
		
		var result = new this.GameRoundModel({
			id: (maxId >= this.maxRoundId ? 1 : maxId + 1),
			startTime: currentTime,
			endTime: new Date(currentTime.getTime() + this.roundTime)
		});
		
		await result.save();
		return result;
	}
	
	async getCurrentRound() {		 
		let data =  await this.GameRoundModel.findOne().sort("-id").limit(1);
		return data;		
	}	

	async getRound(roundId) {		 
		let data =  await this.GameRoundModel.findOne({ id: roundId });
		return data;		
	}	

	async joinGame(username, roundId) {
		let data =  await this.OnlineUserModel.findOne({  username, roundId });
		if(data == null) {
			data = new this.OnlineUserModel({
				username,
				roundId,
				inGame: true
			});
		} else {
			data.inGame = true;
		}

		await data.save();
	}	

	async leaveGame(username, roundId) {
		let data =  await this.OnlineUserModel.findOne({  username, roundId });
		if(data == null) {
			return;
		} 
		
		data.inGame = false;
		await data.save();
	}

	async placeBet(betTicket) {		
		var ticket = new this.BetTicketModel({
			username: betTicket.username,
			roundId: betTicket.roundId,
			betOption: betTicket.betOption,
			betValue: betTicket.betValue,
			isSettled: false
		});

		let user = await this.userController.findUser(ticket.username);
		if(user == null) {
			return;
		}

		var t = await this.BetTicketModel.findOne({  username: ticket.username, roundId:  ticket.roundId, betOption: ticket.betOption });
		if(t != null) {
			return;
		}

		var round = await this.getRound(ticket.roundId);
		if(round.endTime <= Date.now()) {
			return;
		}

		await ticket.save();
		user.balance -= ticket.betValue;
		await user.save();
	}

	async getRoundTurnover(roundId) {
		var tickets = await this.BetTicketModel.find({  roundId });
		var turnover = tickets.map(t =>  parseFloat(t.betValue));
		
		if(turnover.length == 0) {
			return 0;
		}
		
		var r = turnover.reduce((accumulator, currentValue) => accumulator + currentValue);
		return r;
	}

	async getUserTurnover(username, roundId) {
		var tickets = await this.BetTicketModel.find({ username, roundId });
		var turnover = tickets.map(t => parseFloat(t.betValue));
		if(turnover.length == 0) {
			return 0;
		}

		var r = turnover.reduce((accumulator, currentValue) => accumulator +  currentValue);
		return r;
	}

	async getUserBets(username, roundId) {
		var tickets = await this.BetTicketModel.find({ username, roundId });
		var bets = tickets.map(t => t.betOption);		
		return bets;
	}

	generateResult() {
		let betOptions = ["bau", "ca", "cua", "ga", "ho", "tom"];
		let result = [1, 2, 3];
		return result.map(r => betOptions[Math.floor(Math.random() * betOptions.length)]);
	}

	 settleTicket(t, results) {
		var result = results.find(r => r.roundId == t.roundId);
		var balance = result.betOptions.split(",")
			.map(b => b == t.betOption ? t.betValue : 0)
			.reduce((accumulator, currentValue) => accumulator + currentValue);

		return balance;
	}

	async settleTickets() {
		let unsettledTickets = await this.BetTicketModel.find({ isSettled: false });
		let rounds = [...new Set(unsettledTickets.map(t => t.roundId))];
		let results = await Promise.all(rounds.map(async(r) => await this.settleRound(r)));

		let custBalances = [];
		unsettledTickets.forEach(async (t) => {
			var balance =  this.settleTicket(t, results);
			if(balance <= 0) {
				return;
			} 
			
			if(custBalances[t.username]) {
				custBalances[t.username] += balance;
			} else {
				custBalances[t.username] = balance;
			}
		});

		unsettledTickets.forEach(async (t) => {
			t.isSettled = true;
			await t.save();	
		});


		let updatingCusts = [...new Set(unsettledTickets.map(t => t.username))];
		updatingCusts.forEach(async (c) => {
			if(!custBalances[c]) {
				return;
			}

			await this.userController.addBalance(c, custBalances[c]);
		});
	}
	
	async settleRound(roundId) {
		var result = await this.RoundResultModel.findOne({ roundId });
		if(result == null) {
			result = new this.RoundResultModel({
				roundId,
				betOptions: this.generateResult().join(",")
			});

			await result.save();
		}
		
		return result;
	}

	async getLastRoundResult() {		 
		let data =  await this.RoundResultModel.findOne().sort("-roundId").limit(1);
		return data;		
	}	
}

module.exports = {
	GameController: GameController
};
