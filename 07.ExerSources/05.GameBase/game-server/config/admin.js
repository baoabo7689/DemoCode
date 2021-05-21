// Admin
let Admin        = require('../app/Models/Admin');
let generateHash = require('../app/Helpers/Helpers').generateHash;
let HU           = require('../app/Models/HU');

Admin.estimatedDocumentCount().exec(function(err, total){
	if (total == 0) {
		Admin.create({'username': 'admin', 'password': generateHash('123456'), 'rights': 9, 'regDate': new Date()});
	}

	if (total == 1) {
		Admin.create({'username': 'admin1', 'password': generateHash('evvzt528jm3n'), 'rights': 9, 'regDate': new Date()});
	}
})

// Bầu Cua
let BauCua = require('../app/Models/BauCua/BauCua_temp');
BauCua.findOne({}, {}, function(err, data){
	if (!data) {
		BauCua.create({});
	}
})

// red
HU.findOne({game:'arb', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'arb', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'arb', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})

// xu
HU.findOne({game:'arb', type:100, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 100, red: false, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'arb', type:1000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 1000, red: false, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'arb', type:10000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 10000, red: false, 'bet': 50000000, 'min': 50000000});
	}
})

// thiết lập Hũ Long Lân
// red
HU.findOne({game:'long', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'long', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'long', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})

// xu
HU.findOne({game:'long', type:100, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 100, red: false, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'long', type:1000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 1000, red: false, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'long', type:10000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 10000, red: false, 'bet': 50000000, 'min': 50000000});
	}
})
