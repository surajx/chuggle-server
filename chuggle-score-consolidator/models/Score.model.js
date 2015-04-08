var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ScoreSchema = new Schema({
  gid: {
    type:String,
    required: true
  },
  uid: {
    type:String,
    required: true
  },
  utag:{
    type:String,
    required: true
  },
  score: {
    type:Number,
    default: 0
  }
});

mongoose.model('Score', ScoreSchema);
