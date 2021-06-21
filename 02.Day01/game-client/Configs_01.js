const games = require("./GameConfig");
const getGameIds = () => Object.assign({}, ...Object.keys(games).map((gameName) => ({ [gameName]: games[gameName].id })));
const getGameNames = () => Object.assign({}, ...Object.keys(games).map((gameName) => ({ [games[gameName].id]: gameName })));

const configs = {
  //ssl: false,
  disabledDirectLogin: true,
  // serverEndpoints: {
  //   localhost: "10.10.50.12:8100",
  //   "10.6.10.13": "10.10.50.12:8100",
  // },
  gameIds: getGameIds(),
  gameNames: getGameNames(),
  games: games,
  //sentryUrl: "",
  gameAnalytics: {
    clientId: "093146669bf12df12eeedd2d57ddb469",
    secretKey: "f41dc948ed66a029406413327a68b6ae27fe4e6c",
  },
  supportedLanguages: [
    { code: "en-US", text: "English" },
    { code: "id-ID", text: "Bahasa Indonesia" },
    { code: "th-TH", text: "ภาษาไทย" },
    { code: "zh-CN", text: "简体字" },
    { code: "zh-TW", text: "繁體字" },
  ],
  defaultLanguage: "en-US",
  announcement: {
    cachingMessageTime: 60,
    scrollingMessageDelayTime: 120,
    announcementMessageColorHEX: "#ffffff",
    newGameMessageColorHEX: "#FFFF5E",
    speed: 100,
  },
  environments: {
    aws: {
      ssl: true,
      hostNames: {
        "www.sc3-games.sportsfun.app": "sc3-proxy.sportsfun.app/main",
        "sc3-games.sportsfun.app": "sc3-proxy.sportsfun.app/main",
      },
      sentryUrl: "https://e970ec458e474ae08ee7a8163dc19445@sentry.sabagame.com/86",
      gameUserUrl: "https://sc3-user.sportsfun.app",
    },
    pro: {
      ssl: true,
      hostNames: {
        "www.sabaclub.net": "proxy1.sabaclub.net/main",
        "sabaclub.net": "proxy1.sabaclub.net/main",
        "ww2.sabaclub.net": "proxy1.sabaclub.net/main",
        "ww3.sabaclub.net": "proxy1.sabaclub.net/main",
      },
      sentryUrl: "https://e970ec458e474ae08ee7a8163dc19445@sentry.sabagame.com/86",
      gameUserUrl: "https://user.sabaclub.net",
    },
    pro1: {
      ssl: true,
      hostNames: {
        "www.vgaming.club": "proxy.vgaming.club/main",
      },
      sentryUrl: "https://e970ec458e474ae08ee7a8163dc19445@sentry.sabagame.com/86",
      gameUserUrl: "https://user.vgaming.club",
    },
    pro2: {
      ssl: true,
      hostNames: {
        "www.vgaming88.net": "proxy.vgaming88.net/main",
        "w1.vgaming88.net": "proxy.vgaming88.net/main",
        "w2.vgaming88.net": "proxy.vgaming88.net/main",
      },
      sentryUrl: "https://e970ec458e474ae08ee7a8163dc19445@sentry.sabagame.com/86",
      gameUserUrl: "https://user.vgaming88.net",
    },
    uat: {
      ssl: true,
      hostNames: {
        "uat.sabaclub.net": "uatproxy.sabaclub.net/uat/main",
      },
      sentryUrl: "https://dff14f1fdd294c4cb0be6e72ccc39af4@sentryuat.sabagame.com/85",
      gameUserUrl: "https://uatuser.sabaclub.net",
    },
    uat1: {
      ssl: true,
      hostNames: {
        "uat.vgaming.club": "uatproxy.vgaming.club/uat/main",
      },
      sentryUrl: "https://dff14f1fdd294c4cb0be6e72ccc39af4@sentryuat.sabagame.com/85",
      gameUserUrl: "https://uatuser.vgaming.club",
    },
    uat2: {
      ssl: true,
      hostNames: {
        "uat.vgaming88.net": "uatproxy.vgaming88.net/uat/main",
      },
      sentryUrl: "https://dff14f1fdd294c4cb0be6e72ccc39af4@sentryuat.sabagame.com/85",
      gameUserUrl: "https://uatuser.vgaming88.net",
    },
    sit: {
      ssl: true,
      hostNames: {
        "sit1.sabaclub.net": "sit1-gsr.sabaclub.net",
        "sit.sabaclub.net": "sit-gsr.sabaclub.net",
      },
      sentryUrl: "https://230c26ade6e14d90b30f5768470a69c3@sentryuat.sabagame.com/84",
      gameUserUrl: "https://situser.sabaclub.net",
    },
    sit1: {
      ssl: true,
      hostNames: {
        "sit.vgaming.club": "uatproxy.vgaming.club/sit/main",
      },
      sentryUrl: "https://230c26ade6e14d90b30f5768470a69c3@sentryuat.sabagame.com/84",
      gameUserUrl: "https://situser.vgaming.club",
    },
    sit2: {
      ssl: true,
      hostNames: {
        "sit.vgaming88.net": "uatproxy.vgaming88.net/sit/main",
      },
      sentryUrl: "https://230c26ade6e14d90b30f5768470a69c3@sentryuat.sabagame.com/84",
      gameUserUrl: "https://situser.vgaming88.net",
    },
    local1: {
      ssl: false,
      hostNames: {
        "l3-games-1.nexdev.net": "l3-api-proxy.nexdev.net/local1/game-server",
      },
      sentryUrl: "https://65490c1dc51a47aeada1d14639f18264@sentryuat.sabagame.com/103",
      gameUserUrl: "http://l3-user-1.nexdev.net",
    },
    local2: {
      ssl: false,
      hostNames: {
        "l3-games-2.nexdev.net": "l3-api-proxy.nexdev.net/local2/game-server",
      },
      sentryUrl: "https://66a70037f7b94a9398b51b1a7b8e379a@sentryuat.sabagame.com/140",
      gameUserUrl: "http://l3-user-2.nexdev.net",
    },
    local3: {
      ssl: false,
      hostNames: {
        "l3-games-3.nexdev.net": "l3-api-proxy.nexdev.net/local3/game-server",
      },
      sentryUrl: "https://a9379082e13d4c9aa88578ca9f62402f@sentryuat.sabagame.com/154",
      gameUserUrl: "http://l3-user-3.nexdev.net",
    },
    dev: {
      ssl: false,
      hostNames: {
        "10.23.10.100:7456": "10.23.10.100:8080",
        "localhost:7456": "localhost:8081",
        "10.6.10.13": "10.10.50.12:8100",
      },
      sentryUrl: "https://527ed6c32fde46519ed0669c861cdf44@sentryuat.sabagame.com/139",
      //gameUserUrl: "http://l3-user-1.nexdev.net", // LOCAL 1
      gameUserUrl: "http://localhost:7780",
    },
  },
};

module.exports = configs;
