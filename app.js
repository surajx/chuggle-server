var restify  = require('restify'),
    fs       = require('fs'),
    config   = require('./config'),
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

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

// Lounge routes
server.post('/api/v1/user', controllers.user.createUser);
server.put('/api/v1/user/:uid', controllers.user.updateUser);
server.get('/api/v1/user/:uid', controllers.user.viewUser);
server.get('/api/v1/checkusername/:tag', controllers.user.checkUserName);

var port = config.loungePort || 3000;
server.listen(port, function (err) {
    if (err){ console.error(err); }
    else { console.log('App is ready at : ' + port); }
});

if (config.currentEnv === 'production') {
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
    });
}
