var config = {}
if (process.env.NODE_ENV === 'production') {
  config = {
    currentEnv: "production",
    controllerPort: process.env.PORT,
    gameDuration: 120,
    consolidateDuration: 30,
    leaderboardDuration: 40
  }
} else {
  config = {
    currentEnv: "development",
    controllerPort: 5000,
    gameDuration: 30,
    consolidateDuration: 20,
    leaderboardDuration: 20
  }
}

module.exports = config;
