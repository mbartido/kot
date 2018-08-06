// server.js

// Key configurations
const apiConfig = require('./apiKeys');

// Server and package setup---------------------------------------------------
var express = require('express');          // get express
var app = express();                       // define app using express
var bodyParser = require('body-parser');   
// lets us use bodyParser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       // set the port

// Database connection
var mongoose = require('mongoose');
mongoose.connect(`mongodb://${apiConfig.username}:${apiConfig.password}@ds211558.mlab.com:11558/example-db`,
                 { useMongoClient: true });
// Handle the connection
var db = mongoose.connection;
mongoose.Promise = global.Promise;         // to avoid deprecation warning
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log("DB connection alive.");
});

// Routing for application---------------------------------------------------
var Player =  require('./app/models/player');           // get the model
var router = express.Router();                        // get instance of router
// Request middleware
router.use(function(req, res, next) {
  // Logging
  console.log("Something is happening.");
  next();              // make sure we go to next routes and don't stop here
});

// Test route to make sure working @ http://localhost:8008/api
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to API!' });
});

// Routes
router.route('/players')

  // create a user @ http://localhost:8080/api/users
  .post(function(req, res) {
    var player = new Player();         // creates new instance of user
    // Set initial schema
    player.name = req.body.name;
    player.character = req.body.character;
    player.health = req.body.health;
    player.points = req.body.points;
    player.energy = req.body.energy;
    player.roomID = req.body.roomID;
    player.inGame = req.body.inGame;

    // Saving the player in DB
    player.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'Player created!' });
    });
  })

  // get all users @ http://localhost:8080/api/users
  .get(function(req, res) {
    Player.find(function(err, players) {
      if (err) res.send(err);
      res.json(players);
    });
  });

// routes that end in /players/:player_id
router.route('/players/:player_id')

  // get player with id @ http://localhost:8080/api/players/:player_id
  .get(function(req, res) {
    Player.findById(req.params.player_id, function(err, player) {
      if (err) res.send(err);
      res.json(player);
    });
  })

  // update player with id @ http://localhost:8080/api/players/:player_id
  .put(function(req, res) {
    // use model to find player we want
    Player.findById(req.params.player_id, function(err, player) {
      if (err) res.send(err);
      // Change info in db to one in request
      // Change db info if specific request is made
      if (req.body.name) player.name = req.body.name;
      if (req.body.character) player.character = req.body.character;
      if (req.body.health) player.health = req.body.health;
      if (req.body.points) player.points = req.body.points;
      if (req.body.energy) player.energy = req.body.energy;
      if (req.body.roomID) player.roomID = req.body.roomID;
      if (req.body.inGame) player.inGame = req.body.inGame;

      // Save the player
      player.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'Player updated!'})
      })
    })
  })

  // delete player with id @ http://localhost:8080/api/players/:player_id
  .delete(function(req, res) {
    Player.remove({
      _id: req.params.bear_id
    }, function(err, player) {
      if (err) res.send(err);
      res.json({message: 'Successfully deleted!' });
    });
  });

// Register of routes
// All routes prefixed by /api
app.use('/api', router);

// Start server--------------------------------------------------------------
app.listen(port);
console.log('Stuff happens on port ' + port);

