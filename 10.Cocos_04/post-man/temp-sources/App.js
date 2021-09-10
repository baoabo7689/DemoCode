socket.on('result2', (data) => this.displayResultObject(data));

// Roulette Bet
const data = {
  amount: 10,
  betChoices: {
    bigSmall: {
      small: 10,
      big: 10,
    },
    oddEven: {
      odd: 10,
      even: 10,
    },
    redBlack: {
      red: 10,
      black: 10,
    },
  },
  freeBet: false,
};

const data = {
  amount: 10,
  betChoices: {
    split: {
      '12-15': 10,
    },
  },
  freeBet: false,
};

// BauCua Bet
const data = {
  amount: 10,
  betChoice: 'fish',
  // betChoice: '3', // old format
  freeBet: false,
};

// socket
const socket = socketIOClient(
  appConfigs.userServices,
  appConfigs.socketOptions
);

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

// connect Local02

const socket = socketIOClient('http://l3-api-proxy.nexdev.net/user/roulette', {
  transports: ['websocket'],
  upgrade: false,
  path: '/local2/roulette/socket.io',
  forceNew: true,
});

socket.emit('signin', {
  username: 'gamesimulator_807629',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

{
  ssoToken: '626767d9-b2e8-4a36-b0b5-dd118304de44';
}

// Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36

// 60cad7a0a016fc10f73746e6 => userinfo
// 5ec5f4c7d2b6eb3714eb044d

const socket = socketIOClient('http://l3-api-proxy.nexdev.net/user/roulette', {
  transports: ['websocket'],
  upgrade: false,
  path: '/local2/roulette/socket.io',
  forceNew: true,
});

socket.emit('signin', {
  username: 'gamesimulator_807629',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

const socket = socketIOClient('http://l3-api-proxy.nexdev.net/user/baucua', {
  transports: ['websocket'],
  upgrade: false,
  path: '/local2/minifishprawncrab/socket.io',
  forceNew: true,
});

socket.emit('signin', {
  username: 'gamesimulator_807629',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

// heroes-slot service
const socket = socketIOClient('http://l1-proxy.lumigame.com/user/heroesslot', {
  transports: ['websocket'],
  upgrade: false,
  path: '/heroesslot/socket.io',
  forceNew: true,
});

socket.emit('signin', {
  username: 'gamesimulator_2148557',
  ss: 'lXtCebybTd2JAXa6uT3hQqk12T9S637V_gamesimulator_2148557',
});

socket.on('signedIn', () => {
  const data = {
    amount: 10,
    betChoice: 'fish',
    freeBet: false,
    // roundId: 7,
  };

  // socket.emit(this.state.methodName, this.state.requestData);
  socket.emit(this.state.methodName, data);
  socket.emit('getGameConfigs');
  socket.emit('inGame');

  socket.emit('getStatistics', {});
});

// mini-keno
const socket = socketIOClient('https://l1-proxy.lumigame.com/user/kenomax', {
  transports: ['websocket'],
  upgrade: false,
  path: '/minikeno/socket.io',
  forceNew: true,
});

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

const data = {
  amount: 1,
  betChoice: 'big',
  // freeBet: false,
  // roundId: 7,
};

// mini-keno not work

var socket = socketIOClient('https://l1-proxy.lumigame.com', {
  transports: ['websocket'],
  upgrade: false,
  path: '/minikeno/socket.io',
  forceNew: true,
});

socket.of('/user/kenomax').emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

socket.of('/user/kenomax').on('signedIn', () => {
  const data = {
    amount: 10,
    betChoice: 'fish',
    freeBet: false,
    // roundId: 7,
  };

  //  socket.emit(this.state.methodName, data);
  socket.emit('getGameConfigs');
  socket.emit('inGame');

  socket.emit('getStatistics', {});
});

// l2-mini-keno
const socket = socketIOClient('https://l2-proxy1.lumigame.com/user/kenomax', {
  transports: ['websocket'],
  upgrade: false,
  path: '/minikeno/socket.io',
  forceNew: false,
});

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});


// lucky-wheel
"userServices" = "http://localhost:8001/user/luckywheel"
const socket = socketIOClient(
  appConfigs.userServices,
  appConfigs.socketOptions
);

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});

socket.emit('getLogs');
socket.emit('getHistory', {page:1});
socket.emit('playSpin');


const socket = socketIOClient(
  'https://l2-proxy.lumigame.com/user/luckywheel',
  {
    transports: ['websocket'],
    upgrade: false,
    path: '/minikeno/socket.io',
    forceNew: false,
  }
);

socket.emit('signin', {
  username: 'admin_1',
  ss: 'l6q6opiOm6wVU7qOhhwknF8PNGnl39Ce_admin_1',
});



socket.emit("getLogs");
socket.emit("getHistory", { page: 1 });
socket.emit("playSpin");

socket.on("signedIn", () => {
  socket.emit("playSpin");

  const data = {
    amount: 1,
    betChoice: "big",
    freeBet: false,
    // roundId: 7,
  };

  socket.emit(this.state.methodName, data);
  socket.emit("getGameConfigs");
  socket.emit("inGame");

  socket.emit("getStatistics", {});
});


// HiLo

















