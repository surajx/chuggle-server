var config  = require('./config'),
    io      = require('socket.io')(config.wsPort),
    request = require('request'),
    redis = require('redis');

var connectedUserCnt = 0;
var client = redis.createClient(config.redisPORT, config.redisURL); //creates a new client

//sync with lounge on user connect
var syncWithLounge = function(playercount, callback){
  request({
    uri: config.loungeSyncAPI,
    method: "POST",
    json: {
      gpath: config.gameServerURL + ":" + config.wsPort,
      playercount: playercount
    }
  }, function(err, res, resp) {
    if (err) { callback(err); }
    if (resp.type){
      callback(null);
    } else{
      callback(new Error("Unable to sync with Lounge."));
    }
  });
};

//Obtain game data.
var getCurrentGameParameters = function(callback){
  request({
    uri: config.gameCoordinatorAPI,
    method: "GET"
  }, function(err, res, body) {
    if (err) {
      callback(err);
    }
    var resp = JSON.parse(body);
    if (resp.type){
      callback(null, resp.data);
    } else{
      callback(new Error("Unable to Retrieve game parameters from co-ordination server."));
    }
  });
}

var gameActions = function(wsInterface, gameData, callback){
  //console.log(gameData);
  if ((gameData.round_offset - gameData.g_duration) > 0) {
    if ((gameData.round_offset - gameData.g_duration - gameData.c_duration) > 0) {
      /*requestLeaderBoard(function(err, leaderboardData){
        if (err) { callback(err); }
        else {
          gameData.leaderboard = leaderboardData;
          wsInterface.emit(config.gameStates.LEADERBOARD, gameData);
          callback(null);
        }
      });*/
      //console.log("GAME STATE: " + config.gameStates.LEADERBOARD);
      callback(null);
    } else {
      //console.log("GAME STATE: " + config.gameStates.COSOLIDATING);
      wsInterface.emit(config.gameStates.COSOLIDATING, gameData);
      callback(null);
    }
  } else {
    //console.log("GAME STATE: " + config.gameStates.RUNNING);
    wsInterface.emit(config.gameStates.RUNNING, gameData);
    callback(null);
  }
}

var gameLoop = function(){
  getCurrentGameParameters(function(err, data){
    if (err) { console.log(err); }
    else {
      gameActions(io, data, function(err){
        if (err) { console.log(err); }
        else{
          var remTime = data.g_duration + data.c_duration + data.l_duration - data.round_offset + Math.random();
          setTimeout(gameLoop, remTime*1000);
        }
      });
    }
  });
};

client.on('connect', function() {

  syncWithLounge(connectedUserCnt, function(err){
    if (err) { console.log(err); }
    else { gameLoop(); }
  });

  io
    .on('connection', function (socket) {
      connectedUserCnt += 1;
      getCurrentGameParameters(function(err, data){
        if (err) { console.log(err); }
        else {
          gameActions(socket, data, function(err){
            if (err) { console.log(err); }
          });
        }
      });
      socket
        .on('score', function(scoreData){
        client.hmset(scoreData.gid, scoreData.uid, scoreData.score);
      })
        .on('disconnect', function(){
          connectedUserCnt -= 1;
          syncWithLounge(connectedUserCnt, function(err){
            if (err) { console.log(err); }
          });
      });
      syncWithLounge(connectedUserCnt, function(err){
        if (err) { console.log(err); }
      });
  });
});

//How to decide when and how to request Leaderboard.
//implement Client.hmset redis
