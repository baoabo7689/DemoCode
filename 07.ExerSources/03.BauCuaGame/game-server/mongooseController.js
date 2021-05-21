const mongoose = require('mongoose');
const { Schema } = mongoose;

class MongooseController {
	connectGameServer() {
		this.connection = 'mongodb://127.0.0.1:27017/BBGameServer';
		mongoose.connect(this.connection, {useNewUrlParser: true});

		this.deleteModels();
		this.defineModels();
	}

	getModel(name) {
		return  mongoose.model(name);
	}
	
	deleteModels() {
		var models = ['User', 'GameRound', 'OnlineUser', 'BetTicket', 'RoundResult'];
		models.forEach((m, _) => this.deleteModel(m));
	}

	defineModels() {
		mongoose.model('User', new Schema({ 
			username: String,
			balance: Number,
			betValue: Number
		}));

		mongoose.model('GameRound', new Schema({ 
			id: Number,
			startTime: Date,
			endTime: Date
		}));
		
		mongoose.model('OnlineUser', new Schema({ 
			username: String,
			roundId: Number,
			inGame: Boolean
		}));
		
		mongoose.model('BetTicket', new Schema({ 
			username: String,
			roundId: Number,
			betOption: String,
			betValue: Number,
			isSettled: Boolean
		}));
		
		mongoose.model('RoundResult', new Schema({ 
			roundId: Number,
			betOptions: String
		}));
	}

	deleteModel(name) {
		mongoose.connections.forEach(connection => {
			if(connection != this.connection) {
				return;
			}

			const modelNames = Object.keys(connection.models)
		  
			modelNames.forEach(modelName => {
			  delete connection.models[modelName]
			})
		  
			const collectionNames = Object.keys(connection.collections)
			collectionNames.forEach(collectionName => {
			  delete connection.collections[collectionName]
			})
		  })
		  
		  const modelSchemaNames = Object.keys(mongoose.modelSchemas)
		  modelSchemaNames.forEach(modelSchemaName => {
			delete mongoose.modelSchemas[modelSchemaName]
		  });
	}
}


module.exports = {
	MongooseController: MongooseController
};










