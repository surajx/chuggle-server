var restify  = require('restify'),
    config   = require('./config'),
    fs       = require('fs'),
    mongoose = require('mongoose');

// Connect to DB
mongoose.connect(config.dbURL);

// Register models
var models_path = process.cwd() + '/models';
fs.readdirSync(models_path).forEach(function(file){
  if (file.indexOf('model.js') !== -1) {
    require(models_path + '/' + file);
  }
});

// Initialize routes
var controllers = {},
    controllers_path = process.cwd() + '/routes';
fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
      controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
  }
});

var server = restify.createServer();

//plan on gzipping response to reduce bandwidth
server
  .use(restify.fullResponse())
  .use(restify.bodyParser());

// Lounge routes
server.post('/api/v1/score/report', controllers.scoreActions.saveScore);
server.get('/api/v1/leader/:gid', controllers.scoreActions.generateLeaderBoard);

var port = config.scoreConsolidatorPort;
server.listen(port, function (err) {
  if (err) { console.error(err); }
  else { console.log('App is ready at : ' + port); }
});

if (config.currentEnv === 'production') {
  process.on('uncaughtException', function (err) {
    console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
  });
}
