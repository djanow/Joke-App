var config = require('./fixtures/config'),
    request = require('supertest'),
    sinon = require('sinon');

describe('Model', function() {
  var app, joke, user;
  before(function() {
    app = config.app;
    joke = config.joke;
    user = config.user;
  });
  describe('before hook', function() {
    it('should call the before hook on a GET', function() {
      joke.routes.get.before.length.should.equal(1);
      joke.routes.get.after.length.should.equal(1);
    });
    it('should call the before hook on a POST', function() {
      joke.routes.post.before.length.should.equal(1);
      joke.routes.post.after.length.should.equal(1);
    });
    it('should call the before hook on a PUT', function() {
      joke.routes.put.before.length.should.equal(1);
      joke.routes.put.after.length.should.equal(1);
    });
    it('should call after all hook on user defined all route', function(done) {
      request(app)
        .get('/api/jokes/recommend')
        .end(function(err, res) {
          res.body.recommend.should.equal('called');
          res.body.after.should.equal('called');
          done();
        });
    });
    it('should call before all hook on user defined get route', function(done) {
      request(app)
        .get('/api/jokes/' + config.jokes[2]._id + '/athirdroute')
        .end(function(err, res) {
          res.body.athirdroute.should.equal('called');
          res.body.after.should.equal('called');
          done();
        });
    });
    it('should use the properties set in a before route for filtering', function(done) {
      request(app)
        .get('/users')
        .end(function(err, res) {
          res.body.should.have.length(1);
          done(err);
        });
    });
  });
});
