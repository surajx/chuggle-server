var config  = require('./config'),
    io      = require('socket.io')(config.wsPort),
    request = require('request'),
    redis = require('redis');

var connectedUserCnt = 0;
var gameState = undefined;
var gameData = undefined;
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
    else {
      if (resp.type){
        callback(null);
      } else{
        console.log(resp);
        callback(new Error("Unable to sync with Lounge."));
      }
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
    } else {
      var resp = JSON.parse(body);
      if (resp.type){
        callback(null, resp.data);
      } else{
        console.log(resp);
        callback(new Error("Unable to Retrieve game parameters from co-ordination server."));
      }
    }
  });
}

var getCurGameState = function() {
  if ((gameData.round_offset - gameData.g_duration) > 0) {
    if ((gameData.round_offset - gameData.g_duration - gameData.c_duration) > 0) {
      return config.gameStates.LEADERBOARD;
    } else {
      return config.gameStates.CONSOLIDATING;
    }
  } else {
    return config.gameStates.RUNNING;
  }
};

var sendScoresForConsolidation = function(callback){
  client.hgetall(gameData.gid, function (err, scoreObj) {
    if (err) { callback(err); }
    else {
      //if scoreObj is empty dont place request.
      if (scoreObj) {
        request({
          uri: config.scoreConsolidatorURI,
          method: "POST",
          json: {
            gid: gameData.gid,
            scores: scoreObj
          }
        }, function(err, res, resp) {
          if (err) { callback(err); }
          else{
            if (resp.type) {
              callback(null);
            } else{
              console.log(resp);
              callback(new Error("Unable to send scores to consolidator."));
            }
          }
        });
      } else {
        callback(new Error("Nothing to Consolidate."));
      }
    }
  });
};

var requestLeaderBoard = function(gid, callback){
  request({
    uri: config.leaderBoardRequestURI+gid,
    method: "GET",
  }, function(err, res, body) {
    if (err) { callback(err); }
    else{
      var resp = JSON.parse(body);
      if (resp.type) {
        callback(null, resp.data);
      } else{
        console.log(resp);
        callback(new Error("Unable to request for Leaderboard."));
      }
    }
  });
}

//shitty code: tremendous scope or refactoring
var gameLoop = function(){
  //flush redis
  getCurrentGameParameters(function(err, data){
    if (err) { console.log(err); }
    else {
      gameData = data;
      gameState = getCurGameState();
      io.emit(gameState, gameData);
      var remTime = gameData.g_duration + gameData.c_duration + gameData.l_duration - gameData.round_offset + Math.random();
      switch (gameState) {
        case config.gameStates.LEADERBOARD:
          requestLeaderBoard(gameData.gid, function(err, leaderBoard){
            if(err) { console.log(err); }
            else {
              gameData.leaderboard = leaderBoard;
              io.emit(gameState, gameData);
            }
          });
          break;
        case config.gameStates.CONSOLIDATING:
          setTimeout(function(){
            gameState = config.gameStates.LEADERBOARD;
            requestLeaderBoard(gameData.gid, function(err, leaderBoard){
              if(err) { console.log(err); }
              else {
                gameData.leaderboard = leaderBoard;
                io.emit(gameState, gameData);
              }
            });
          }, (gameData.g_duration + gameData.c_duration - gameData.round_offset)*1000);
          break;
        case config.gameStates.RUNNING:
          setTimeout(function(){
            gameState = config.gameStates.CONSOLIDATING;
            io.emit(gameState, gameData);
            setTimeout(function(){
              sendScoresForConsolidation(function(err){
                if (err) { console.log(err); }
                else{
                  setTimeout(function(){
                    gameState = config.gameStates.LEADERBOARD;
                    requestLeaderBoard(gameData.gid, function(err, leaderBoard){
                      if(err) { console.log(err); }
                      else {
                        gameData.leaderboard = leaderBoard;
                        io.emit(gameState, gameData);
                      }
                    });
                  }, gameData.c_duration*1000);
                }
              });
            }, gameData.c_duration*500 + Math.random()*1000);
          }, (gameData.g_duration - gameData.round_offset)*1000);
          break;
      };
      setTimeout(gameLoop, remTime*1000);
    }
  });
};

client.on('connect', function() {

  syncWithLounge(connectedUserCnt, function(err) {
    if (err) { console.log(err); }
    else {
      console.log('App is ready at : ' + config.wsPort);
      gameLoop();
    }
  });

  io
    .on('connection', function (socket) {
      connectedUserCnt += 1;
      socket.emit(gameState, gameData);
      socket
        .on('score', function(scoreData){
          client.hmset(scoreData.gid, scoreData.uid+':'+scoreData.utag, scoreData.score);
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
