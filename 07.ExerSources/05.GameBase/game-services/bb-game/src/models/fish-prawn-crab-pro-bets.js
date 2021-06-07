import mongoose from "mongoose";

const schema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  phien: { type: Number, required: true },

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

  thanhtoan: { type: Boolean, default: false },
  betwin: { type: Number, default: 0 },
  time: { type: Date },
  memberId: { type: Number },
  siteId: { type: String },
  odds: { type: Object },
  freeBet: { type: Boolean, default: false },
  totalBet: { type: Number, default: 0 },
  stag: { type: Number, default: 0 },
  gourd: { type: Number, default: 0 },
  rooster: { type: Number, default: 0 },
  fish: { type: Number, default: 0 },
  crab: { type: Number, default: 0 },
  prawn: { type: Number, default: 0 } 
});

export const FishPrawnCrabProBets = mongoose.model("FishPrawnCrabPro_cuoc", schema);
export const FishPrawnCrabProTmpBets = mongoose.model("FishPrawnCrabPro_tmpcuoc", schema);
