var config = {}
if (process.env.NODE_ENV === 'production') {
  config = {
    currentEnv: "production",
    wsPort: process.env.PORT,
    dbURL: "mongodb://userAdmin:Userr0cks@ds055699.mongolab.com:55699/gamedb",
    gameStates:{
      INIT: "INITIALIZING",
      RUNNING: "RUNNING",
      COSOLIDATING: "CONSOLIDATING",
      LEADERBOARD: "LEADERBOARD"
    }
  }
} else {
  config = {
    currentEnv: "development",
    wsPort: 3001,
    dbURL: "mongodb://127.0.0.1/gamedb",
    gameStates:{
      INIT: "INITIALIZING",
      RUNNING: "RUNNING",
      COSOLIDATING: "CONSOLIDATING",
      LEADERBOARD: "LEADERBOARD"
    }
  }
}

module.exports = config;
