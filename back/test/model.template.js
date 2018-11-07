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
  describe('.template(route, filters)', function() {
    it('should work for get', function() {
      var template = jokes.template(['get'], []);
      template.should.equal('index');
    });
    it('should work for getDetail', function() {
      var template = jokes.template(['get'], [{ key: '_id', value: 'ad' }]);
      template.should.equal('show');
    });
  });
  describe('format=html', function() {
    it('should render index', function(done) {
      request(app)
        .get('/api/jokes?format=html')
        .expect('Content-Type', /html/)
        .end(function(err, res) {
          res.text.should.match(/index/);
          res.text.should.match(new RegExp(joke1.title));
          res.text.should.match(new RegExp(joke2.title));
          res.text.should.match(new RegExp(joke3.title));
          done();
        });
    });
    it('should render show', function(done) {
      request(app)
        .get('/api/jokes/' + joke1._id + '/?format=html')
        .expect('Content-Type', /html/)
        .end(function(err, res) {
          res.text.should.match(/show/);
          res.text.should.match(new RegExp(joke1.title));
          res.text.should.not.match(new RegExp(joke2.title));
          res.text.should.not.match(new RegExp(joke3.title));
          done();
        });

    });
  });
});
