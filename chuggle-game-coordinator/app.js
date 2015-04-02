var restify = require('restify'),
    fs      = require('fs'),
    config  = require('./config'),
    uuid    = require('node-uuid');

var getSeed = function(){
 return Math.floor(Math.random() * 10000000)
};

var getEpoch = function(){
  return Math.floor(new Date() / 1000);
};

var seed = getSeed();
var gid = uuid.v1();
var s_epoch = getEpoch();

//console.log("Current Seed: " + seed);
//console.log("Current Game ID: " + gid);

var gameLoop = function(){
  seed = getSeed();
  gid = uuid.v1();
  s_epoch = getEpoch();
  //console.log("Current Seed: " + seed);
  //console.log("Current Game ID: " + gid);
};

var gameTime = (config.gameDuration + config.consolidateDuration + config.leaderboardDuration)*1000;
setInterval(gameLoop, gameTime);

var server = restify.createServer();
server
  .use(restify.fullResponse())
  .use(restify.bodyParser());
server.get('/api/v1/game', function(req, res){
  res.json({
    type: true,
    data: {
      seed: seed,
      gid: gid,
      g_duration: config.gameDuration,
      c_duration: config.consolidateDuration,
      l_duration: config.leaderboardDuration,
      round_offset: getEpoch() - s_epoch
    }
  });
});

var port = config.controllerPort;
server.listen(port, function (err) {
  if (err) { console.error(err); }
  else { console.log('App is ready at : ' + port); }
});

if (config.currentEnv === 'production') {
  process.on('uncaughtException', function (err) {
    console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)));
  });
}
