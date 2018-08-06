// app/models/player.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Declare Schema
var PlayerSchema = new Schema({
  name: String,
  character: String,
  health: Number,
  points: Number,
  energy: Number,
  roomID: String,
  inGame: Boolean
}, {
  collection: 'users'           // Add to users collection
});

// Export Model so Node can use
module.exports = mongoose.model('Player', PlayerSchema);