var restify  = require('restify'),
    fs       = require('fs'),
    config   = require('config'),
    mongoose = require('mongoose');

var controllers = {},
    controllers_path = process.cwd() + '/routes';
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
    }
});

mongoose.connect(config.dbURL);

var server = restify.createServer();

server
    .use(restify.fullResponse())
    .use(restify.bodyParser());

server.post('/api/v1/user', controllers.user.createUser);
server.put('/api/v1/user/:id', controllers.user.updateUser);
server.get('/api/v1/user/:id', controllers.user.viewUser);

var port = config.loungePort || 3000;
server.listen(port, function (err) {
    if (err)
        console.error(err);
    else
        console.log('App is ready at : ' + port);
})

if (config.currentEnv.toLowerCase() === 'production') {
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
    });
}
