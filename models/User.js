var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  uid: String,
  usertag: String
});

mongoose.model('User', UserSchema);
