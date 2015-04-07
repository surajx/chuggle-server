var config = {}
if (process.env.NODE_ENV === 'production') {
  config = {
    currentEnv: "production",
    wsPort: process.env.PORT,
    loungeSyncAPI: "http://some.paas/api/v1/gs/sync",
    gameCoordinatorAPI: "http://some.pass/api/v1/game",
    gameServerURL: "http://some.pass", //check how to dynamically get server url?
    gameStates:{
      INIT: "INITIALIZING",
      RUNNING: "RUNNING",
      COSOLIDATING: "CONSOLIDATING",
      LEADERBOARD: "LEADERBOARD"
    },
    redisURL: "http://some.redis.paas",
    redisPORT: 6379
  }
} else {
  config = {
    currentEnv: "development",
    wsPort: 4000,
    loungeSyncAPI: "http://localhost:3000/api/v1/gs/sync",
    gameCoordinatorAPI: "http://localhost:5000/api/v1/game",
    gameServerURL: "http://localhost",
    gameStates:{
      INIT: "INITIALIZING",
      RUNNING: "RUNNING",
      COSOLIDATING: "CONSOLIDATING",
      LEADERBOARD: "LEADERBOARD"
    },
    redisURL: "127.0.0.1",
    redisPORT: 6379
  }
}

module.exports = config;
