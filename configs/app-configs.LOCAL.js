export default {
  hostingPort: 5000,
  apiSettings: {
    enabledApi: true,
    apiUrl: 'http://l2_game_api_local:5000',
    authUrl: 'http://l2_auth_api_local:5000',
    client: {
      id: 'game-server',
      secret: 'gameserver@20luminet&',
    },
    useAuthenticate: true,
    requestTimeout: 10000,
    placeBetTimeout: 4500,
    enabledApiLogs: true,
  },
  socketOptions: {
    pingInterval: 60 * 1000,
    pingTimeout: 60 * 1000,
    transports: ['websocket'],
    allowUpgrades: false,
    perMessageDeflate: false,
  },
  enabledLogs: true,
  database: {
    url: 'mongodb://lmn_backend:LmnBackend@10.10.50.13:37101/?replicaSet=L2Local',
    options: {
      dbName: 'minigame',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auto_reconnect: true,
    },
  },
  sentry: {
    sentryUrl:
      'https://acb36eb835d948d68c1aad9873754d51@sentry.lumigame.com/27',
    logIdentifier: 'lucky-wheel',
    env: 'LOCAL',
  },
  authenticateSettings: {
    audiences: ['api', 'admin-api'],
  },
  adminSecretKey: 'asWDEerfOIdgsdqRTFabvmgh',
  enableCorsWs: true,
  corsUrls: [
    'http://localhost:7456',
    'http://localhost:7000',
    'http://localhost:3000',
    'https://l2-games.lumigame.com',
    'https://l2-admin.lumigame.com',
    'http://l2-m.lumigame.com',
    'https://l2-m.lumigame.com',
  ],
};
