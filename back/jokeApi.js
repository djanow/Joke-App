var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    restful = require('./'),
    bcrypt = require('bcrypt');
    
// Make a new Express app
var app = module.exports = express();

// Connect to mongodb
mongoose.connect("mongodb://heroku_2zp344l8:3h1l8b95jhdtaal8i8ak7g377d@ds153763.mlab.com:53763/heroku_2zp344l8");

// Use middleware to parse POST data and use custom HTTP methods
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

var hashPassword = function(req, res, next) {
  if (!req.body.password)
    return next({ status: 400, err: "No password!" }); // We can also throw an error from a before route
  req.body.password = bcrypt.hashSync(req.body.password, 10); // Using bcrypt
  return next(); // Call the handler
}

var sendEmail = function(req, res, next) {
  // We can get the user from res.bundle and status code from res.status and
  // trigger an error by calling next(err) or populate information that would otherwise be miggins
  next(); // I'll just pass though
}

var User = restful.model( "users", mongoose.Schema({
    username: 'string',
    password: 'string',
  }))
  .methods(['get', 'put', 'delete', {
    method: 'post',
    before: hashPassword, // Before we make run the default POST to create a user, we want to hash the password (implementation omitted)
    after: sendEmail, // After we register them, we will send them a confirmation email
  }]);

User.register(app, '/user'); // Register the user model at the localhost:3000/user

var validateUser = function(req, res, next) {
  if (!req.body.creator) {
    return next({ status: 400, err: "Jokes need a creator" });
  }
  User.findById(req.body.creator, function(err, model) {
    if (!model) return next(restful.objectNotFound());
    else 
    {

      bcrypt.compare(req.body.password, model.password, function(err, res) {
        if(res) {
          return next();;
          
        } else {
          return next({ status: 500, err: "Bad Password" });
        } 
      });
    }
  });
}

var Joke = restful.model("joke", mongoose.Schema({
    category: { type: 'string', required: true},
    body: { type: 'string', required: true},
    creator: { type: 'ObjectId', ref: 'user', require: true},
    thumbUp: { type: 'number', default: 0},
    thumbDown: { type: 'number', default: 0},
  }))
  .methods(['get', 'delete', { method: 'post', before: validateUser }, { method: 'put', before: validateUser }]);

  Joke.register(app, '/joke');

User.route("jokes", {
  handler: function(req, res, next, err, model) { // we get err and model parameters on detail routes (model being the one model that was found)
    Joke.find({ creator: model._id }, function(err, list) {
      if (err) return next({ status: 500, err: "Something went wrong" });
      //res.status is the status code
      res.status = 200;

      // res.bundle is what is returned, serialized to JSON
      res.bundle = list;
      return next();
    });
  },
  detail: true, // detail routes operate on a single instance, i.e. /user/:id
  methods: ['get'], // only respond to GET requests
});
app.listen(process.env.PORT || 3000);
