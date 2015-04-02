var config = require('./config'),
    io     = require('socket.io')(config.wsPort);
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
