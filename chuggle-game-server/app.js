var config  = require('./config'),
    io      = require('socket.io')(config.wsPort),
    request = require('request');

var syncWithLounge = function(playercount){
  request({
    uri: config.loungeSyncAPI,
    method: "POST",
    json: {
      gpath: config.gameServerURL + ":" + config.wsPort,
      playercount: playercount
    }
  }, function(error, response, body) {
    console.log(body);
  });
};

//Obtain seed, game Id, and set current state.
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

//Game Server Startup sync
syncWithLounge(0);
/*
var g_duration = 0;
var c_duration = 0;
var d_duration = 0;

setTimeout (function(){getCurrentGameParameters(function(err, gameData) {
  if (err) { console.log(err); }
  else {
    console.log(gameData);
    if ((gameData.round_offset - gameData.g_duration) > 0) {
      console.log("Game over.");
      if ((gameData.round_offset - gameData.g_duration - gameData.c_duration) > 0) {
        console.log("Score Consolidation over.");
        //request leaderboard and wait out l_d -
      } else {
        //default score to 0 and wait out c_d - r_o + g_d and then request leaderboardcand broadcast it.
      }
    } else {
      //broadcast seed and remaining duration (g_d-r_o)
    }
  }
})}, );

//define actual callback for subsequent rounds.
//In any end case do a setInterval to make sure that you are triggering getCurrentGameParamenters with correct callback and with a delay og g_d + c_d + l+d

/*
//Register with Lounge

//Loop START
// --request seed, s_epoch, gid from lounge
// --update state to INIT, set stateData to {lb:<>}
// --calculate diff between current epoch and s_epoc which is s_delay
// --wait for s_delay duration
// --update state to RUNNING, broadcast state and set stateData to {seed:<>, s_epoch:<>, g_duration:<>}
// --wait for g_duration seconds
// --update state to COSOLIDATING
// --wait for 20 seconds to consolidate scores
// --request Leaderboard from lounge
// --update state to LEADERBOARD
// --broadcast leaderboard to clients
//Loop END

*/

io
  .on('connection', function (socket) {
    socket.emit(currentState, stateData);
    socket.on('score', function(score){
      //update score in redis.
    });
  });
