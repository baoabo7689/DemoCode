
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid: { type: String, required: true },    // ID Người cược
	name: { type: String, required: true },    // Name Người cược
	round: { type: Number, required: true, index: true },    // phiên cược
	red: { type: Boolean, required: true },    // loại tiền (Red = true,   Xu = false)

	0: { type: Number, default: 0 },         // Số tiền đặt Hươu
	1: { type: Number, default: 0 },         // Số tiền đặt Bầu
	2: { type: Number, default: 0 },         // Số tiền đặt Gà
	3: { type: Number, default: 0 },         // Số tiền đặt Cá
	4: { type: Number, default: 0 },         // Số tiền đặt Cua
	5: { type: Number, default: 0 },         // Số tiền đặt Tôm

	payment: { type: Boolean, default: false },    // tình trạng thanh toán
	bigWin: { type: Boolean, default: false },    // Thắng lớn
	betWin: { type: Number, default: 0 },	       // Tiền thắng được
	time: { type: Date },                       // thời gian cược,

	memberId: { type: Number },
	siteId: { type: String }
});

module.exports = mongoose.model('BauCua_cuoc', Schema);
