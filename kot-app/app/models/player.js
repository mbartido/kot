// app/models/player.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Declare Schema
var PlayerSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  character: {
    type: String,
    default: ''
  },
  health: {
    type: Number,
    default: 10
  },
  points: {
    type: Number,
    default: 0
  },
  energy: {
    type: Number,
    default: 0
  },
  roomID: {
    type: String,
    default: ''
  },
  inGame: {
    type: Boolean,
    default: false
  },

  // login portion
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  signUpDate: {
    type: Date,
    default: Date.now()
  }
}, {
  collection: 'users'           // Add to users collection
});

PlayerSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

PlayerSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

// Export Model so Node can use
module.exports = mongoose.model('Player', PlayerSchema);