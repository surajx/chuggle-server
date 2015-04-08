var mongoose = require('mongoose');

var Score       = mongoose.model("Score");
    //HighScore = mongoose.model("HighScore");

var standardErrorResposnse = function(code, res, err){
  res.status(code);
  res.json({
    type: false,
    data: "Error occured: " + err
  });
};

exports.saveScore = function(req, res){
  var scoreArray = [];
  var gid = req.body.gid;
  for(var userDataString in req.body.scores){
    var score = req.body.scores[userDataString];
    var userDataArray = userDataString.split(':');
    scoreArray.push({
      gid: gid,
      uid: userDataArray[0],
      utag: userDataArray[1],
      score: score
    });
  }
  Score.collection.insert(scoreArray, function(err, docs){
    if(err) { standardErrorResposnse(500, res, err); }
    else {
      res.json({
        type: true,
        data: docs.length
      });
    }
  });
};

exports.generateLeaderBoard = function(req,res) {
  //Explore the option to cache leaderboard in memory once its generated.
  //curently fetch from db for each request from Game Servers.
  Score.find({ gid:req.params.gid }).sort({score: -1}).exec(function(err, leaderBoard){
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      if (leaderBoard) {
        res.json({
          type: true,
          data: leaderBoard
        });
      } else { standardErrorResposnse(500, res, new Error("No LeaderBoard data Available")); }
    }
  });
};

//save high score in redis with persistence?
