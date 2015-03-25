var mongoose = require('mongoose'),
    Article = mongoose.model("Article"),
    ObjectId = mongoose.Types.ObjectId;

exports.createUser = function(req, res, next) {
  var userModel = new User(req.body);
  userModel.save(function(err, user) {
      if (err) {
          res.status(500);
          res.json({
              type: false,
              data: "Error occured: " + err
          })
      } else {
          res.json({
              type: true,
              data: user
          })
      }
  });
};

exports.viewUser = function(req, res, next) {
  User.findById(new ObjectId(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
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

exports.updateUser = function(req, res, next) {
  var updatedUserModel = new User(req.body);
  User.findByIdAndUpdate(new ObjectId(req.params.id), updatedUserModel, function(err, user) {
    if (err) {
      res.status(500);
      res.json({
          type: false,
          data: "Error occured: " + err
      })
    } else {
      if (user) {
        res.json({
            type: true,
            data: user
        })
      } else {
        res.json({
            type: false,
            data: "User: " + req.params.id + " not found"
        })
      }
    }
  })
}
