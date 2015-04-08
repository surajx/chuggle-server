var config = {}
if (process.env.NODE_ENV === 'production') {
  config = {
    currentEnv: "production",
    scoreConsolidatorPort: process.env.PORT,
    dbURL: "mongodb://userAdmin:Userr0cks@ds055699.mongolab.com:55699/scoredb"
  }
} else {
  config = {
    currentEnv: "development",
    scoreConsolidatorPort: 6000,
    dbURL: "mongodb://127.0.0.1/scoredb"
  }
}

module.exports = config;
