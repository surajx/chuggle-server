var mongoose = require('mongoose'),
    uuid     = require('node-uuid');

var User       = mongoose.model("User"),
    GameServer = mongoose.model("GameServer");

var standardErrorResposnse = function(code, res, err){
  res.status(code);
  res.json({
    type: false,
    data: "Error occured: " + err
  });
};

exports.createUser = function(req, res) {
  var userDetails = req.body;
  userDetails.uid = uuid.v1();
  var userModel = new User(userDetails);
  userModel.save(function(err, user) {
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      res.json({
        type: true,
        data: user
      });
    }
  });
};

exports.viewUser = function(req, res) {
  User.where({uid: req.params.uid}).findOne(function(err, user) {
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      if (user) {
        res.json({
          type: true,
          data: user
        });
      } else {
        res.json({
          type: false,
          data: "User: " + req.params.uid + " not found"
        });
      }
    }
  });
};

exports.updateUser = function(req, res) {
  var updatedUserDetails = {uid: req.params.uid};
  updatedUserDetails.user = req.body.user;
  User.where({uid: req.params.uid}).findOneAndUpdate(updatedUserDetails, function(err, user) {
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      if (user) {
        res.json({
          type: true,
          data: user
        });
      } else {
        res.json({
          type: false,
          data: "User: " + req.params.id + " not found"
        });
      }
    }
  });
};

exports.checkUserName = function(req, res) {
  User.where({user: req.params.tag}).findOne(function(err, user){
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      if (user) { res.json({type: true, data: "NA"}); }
      else { res.json({type: false, data: "NA"}); }
    }
  });
};

exports.sendGameDetails = function(req, res) {
  GameServer.findOne({}).sort({usercount: 1}).exec(function(err, serverDetails){
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      if (serverDetails) {
        res.json({
          type: true,
          data: {gpath: serverDetails.gpath}
        });
      } else { standardErrorResposnse(500, res, new Error("No Game Rooms available")); }
    }
  });
};

exports.syncGameServer = function(req, res){
  GameServer.findOneAndUpdate({gpath:req.body.gpath}, {gpath:req.body.gpath, playercount:req.body.playercount}, {upsert: true}, function(err, serverDetails){
    if (err) { standardErrorResposnse(500, res, err); }
    else {
      if (serverDetails){
        res.json({
          type: true,
          data: { msg: "Synchronized game server" }
        });
      } else { standardErrorResposnse(500, res, new Error("Unable to Sync Game Server with Lounge")); }
    }
  });
};
