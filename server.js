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
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log("DB connection alive.");
});

// Routing for application---------------------------------------------------
var Bear =  require('./app/models/player');           // get the model
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

// Other routes

// Register of routes
// All routes prefixed by /api
app.use('/api', router);

// Start server--------------------------------------------------------------
app.listen(port);
console.log('Stuff happens on port ' + port);

