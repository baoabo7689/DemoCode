import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    UID: { type: Number, required: true, unique: true },
    avatar: { type: String, default: "" },
    joinedOn: { type: Date, default: new Date() },

    email: { type: String, default: "" },
    cmt: { type: String, default: "" },

    security: {
        login: { type: Number, default: 0 },
    },

    red: { type: Number, default: 0 },
    ketSat: { type: Number, default: 0 },
    xu: { type: Number, default: 0 },

    redWin: { type: Number, default: 0 },
    redLost: { type: Number, default: 0 },
    redPlay: { type: Number, default: 0 },

    xuWin: { type: Number, default: 0 },
    xuLost: { type: Number, default: 0 },
    xuPlay: { type: Number, default: 0 },
    thuong: { type: Number, default: 0 },

    vip: { type: Number, default: 0 },
    lastVip: { type: Number, default: 0 },

    hu: { type: Number, default: 0 },
    huXu: { type: Number, default: 0 },

    type: { type: Boolean, default: false },
    otpFirst: { type: Boolean, default: false },

    avatarId: { type: Number, default: 0 },
    currency: { type: String, default: "" },

    inRoom: { type: Boolean, default: false },
    inGameRoom: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    scoins: { type: Number, default: 0 },
    banned: { type: Boolean, default: false },
    minBet: { type: Number, default: 0 },
    maxBet: { type: Number, default: 0 },
    betLimitModifiedDate: { type: Date },
    patternId: { type: Number, default: 0 },
});

export default mongoose.model("UserInfo", Schema);
