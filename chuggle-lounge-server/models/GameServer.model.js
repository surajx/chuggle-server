var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var GameServerSchema = new Schema({
  gpath: {
    type:String,
    required: true,
    unique: true
  },
  playercount: {
    type:Number,
    default: 0
  }
});

mongoose.model('GameServer', GameServerSchema);
