var config = require('./fixtures/config'),
    request = require('supertest');

describe('Model', function() {
  var app, joke, user;
  before(function() {
    app = config.app;
    joke = config.joke;
    user = config.user;
  });
  describe('excludes', function() {
    it('should exclude the excluded fields', function(done) {
      request(app)
        .get('/api/jokes/' + config.jokes[0]._id + '/')
        .end(function(err, res) {
          res.body.should.not.have.property('secret');
          done();
        });
    });
  });
});
