var config = {}
if (process.env.NODE_ENV === 'production') {
  config = {
    currentEnv: "production",
    loungePort: process.env.PORT,
    dbURL: "mongodb://userAdmin:Userr0cks@ds055699.mongolab.com:55699/userdb"
  }
} else {
  config = {
    currentEnv: "development",
    loungePort: 3000,
    dbURL: "mongodb://localhost/userdb"
  }
}

exports.config = config;
