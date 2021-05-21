import mongoose from "mongoose";
const appConfig = require("../configs/appConfigs");
const modelName = `${appConfig.gameName}_Bet`;

const schema = new mongoose.Schema({
    id: { type: Number, default: 0 },
    uid: { type: String, required: true },
    name: { type: String, required: true },
    round: { type: Number, default: 0 },

    total: { type: Number, default: 0 },
    payment: { type: Boolean, default: false },
    bet: { type: Number, default: 0 },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    endTime: { type: Date },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

const bets = mongoose.model(modelName, schema);

export { bets as Bets };
