import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment-reworked";
const appConfig = require("../configs/appConfigs");
const modelName = `${appConfig.gameName}_Round`;

const Schema = new mongoose.Schema({
    result: { type: Array },
    settlementResult: { type: Number },
    roundStartTime: { type: Date },
    time: { type: Date },
    ended: { type: Boolean, default: false },
    uid: { type: String, required: true },
    name: { type: String, required: true },
    odds: { type: Object },
});

Schema.plugin(autoIncrement.MongooseAutoIncrementID.plugin, { modelName, field: "id" });

const rounds = mongoose.model(modelName, Schema);

export { rounds as Rounds };
