import mongoose  from 'mongoose';

export default class  MongooseHelper {
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








