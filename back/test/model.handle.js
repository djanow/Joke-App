var should = require('should'),
    request = require('supertest'),
    config = require('./fixtures/config'),
    sinon = require('sinon');

describe.skip('Model', function() {
  var jokes,
      users,
      app,
      joke1,
      joke2,
      joke3,
      user1,
      user2;
  before(function() {
    app = config.app;
    jokes = config.joke;
    users = config.user;
    joke1 = config.jokes[0];
    joke2 = config.jokes[1];
    joke3 = config.jokes[2];
    user1 = config.users[0];
    user2 = config.users[1];
  });
  describe('.handle', function() {
    it('should handle a pseudo-get route', function(done) {
      request(app)
        .get('/api/jokes/fakeget')
        .end(function(err, res) {
          request(app)
            .get('/api/jokes')
            .end(function(err2, res2) {
              res.body.should.eql(res2.body);
              done();
            });
        });
    });
    it('should handle a pseudo-postroute', function(done) {
      request(app)
        .post('/api/jokes/fakepost')
        .send({
          title: "A very stupid joke",
        })
        .end(function(err, res) {
          res.body.title.should.equal('A very stupid joke');
          res.body._id.should.not.be.empty;
          jokes.Model.findById(res.body._id, function(err, model) {
            model.title.should.equal('A very stupid joke');
            done();
          });
        });
    });
  });
});
