var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  uid: {
    type:String,
    required: true,
    unique: true
  },
  user: {
    type:String,
    required: true,
    unique: true
  }
});

mongoose.model('User', UserSchema);
