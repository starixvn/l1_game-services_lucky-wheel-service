export default {
    hostingPort: 8001,
    apiSettings: {
        enabledApi: true,
        apiUrl: 'http://l2-api.lumigame.com',
        authUrl: 'http://l2-auth.lumigame.com',
        client: {
            id: 'game-server',
            secret: 'gameserver@20luminet&',
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enableApiLogs: true,
    },
    authenticateSettings: {
        url: 'http://l2-auth.lumigame.com',
        id: 'game-services',
        secret: 'gameservices@20luminet&',
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ['api', 'admin-api'],
    },
    userServiceSettings: {
        url: 'http://127.0.0.1:5000',
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ['websocket'],
        allowUpgrades: false,
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
        sentryUrl: 'https://acb36eb835d948d68c1aad9873754d51@sentry.lumigame.com/27',
        logIdentifier: 'lucky-wheel',
        env: 'LOCAL',
    },
    adminSecretKey: 'asWDEerfOIdgsdqRTFabvmgh',
    enableCorsWs: false,
    corsUrls: [
        'http://localhost:7456',
        'http://localhost:7000',
        'http://localhost:3000',
        'http://l2-games.lumigame.com',
        'http://l2-admin.lumigame.com',
    ],
};
