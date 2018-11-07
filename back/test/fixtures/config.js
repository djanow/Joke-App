var express = require('express'),
    fixtures = require('pow-mongodb-fixtures'),
    app = require('../../examples/jokes/'),
    data = require('./data'),
    done = false,
    mongoose,
    callback;


exports.app = app;
exports.joke = app.joke;
exports.user = app.user;
exports.review = app.review
mongoose = app.mongoose;
fixtures = fixtures.connect(mongoose.connection.name);

fixtures.load(data, function(err) {
  exports.users = data.users;
  exports.jokes = data.jokes;
  exports.reviews = data.reviews;
  done = true;
  if (callback) return callback();
});

exports.jokes = data.jokes;
exports.users = data.users;
exports.reviews = data.reviews;

exports.ready = function(cb) {
  callback = cb; 
  if (done) callback();
};
