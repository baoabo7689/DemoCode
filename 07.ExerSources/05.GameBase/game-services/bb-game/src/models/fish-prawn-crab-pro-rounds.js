import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment-reworked";

const modelName = "FishPrawnCrabPro_phien";

const resultSchema = new mongoose.Schema(
  {
    dice1: { type: String, required: true },
    dice2: { type: String, required: true },
    dice3: { type: String, required: true },
  },
  { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
  {
    ground: { type: Number, default: 0 },
    water: { type: Number, default: 0 },

    single1: { type: Number, default: 0 },
    single2: { type: Number, default: 0 },
    single3: { type: Number, default: 0 },
    single4: { type: Number, default: 0 },
    single5: { type: Number, default: 0 },
    single6: { type: Number, default: 0 },

    double1: { type: Number, default: 0 },
    double2: { type: Number, default: 0 },
    double3: { type: Number, default: 0 },
    double4: { type: Number, default: 0 },
    double5: { type: Number, default: 0 },
    double6: { type: Number, default: 0 },

    anyTriple: { type: Number, default: 0 },
    triple1: { type: Number, default: 0 },
    triple2: { type: Number, default: 0 },
    triple3: { type: Number, default: 0 },
    triple4: { type: Number, default: 0 },
    triple5: { type: Number, default: 0 },
    triple6: { type: Number, default: 0 },

    combination12: { type: Number, default: 0 },
    combination13: { type: Number, default: 0 },
    combination14: { type: Number, default: 0 },
    combination15: { type: Number, default: 0 },
    combination16: { type: Number, default: 0 },

    combination23: { type: Number, default: 0 },
    combination24: { type: Number, default: 0 },
    combination25: { type: Number, default: 0 },
    combination26: { type: Number, default: 0 },

    combination34: { type: Number, default: 0 },
    combination35: { type: Number, default: 0 },
    combination36: { type: Number, default: 0 },

    combination45: { type: Number, default: 0 },
    combination46: { type: Number, default: 0 },

    combination56: { type: Number, default: 0 },

    stag: { type: Number, default: 0 },
    gourd: { type: Number, default: 0 },
    rooster: { type: Number, default: 0 },
    fish: { type: Number, default: 0 },
    crab: { type: Number, default: 0 },
    prawn: { type: Number, default: 0 }
  },
  { _id: false }
);

const Schema = new mongoose.Schema({
  result: resultSchema,
  settlementResult: settlementResultSchema,
  time: { type: Date, default: new Date() },
});

Schema.plugin(autoIncrement.MongooseAutoIncrementID.plugin, { modelName, field: "id" });

export default mongoose.model(modelName, Schema);
