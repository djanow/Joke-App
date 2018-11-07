var should = require('should'),
    request = require('supertest'),
    sinon = require('sinon');

describe('Model', function() {
  var config,
      jokes,
      users,
      app,
      joke1,
      joke2,
      joke3,
      user1,
      user2;
  before(function(done) {
    config = require('./fixtures/config');
    config.ready(function() {
      app = config.app;
      jokes = config.joke;
      users = config.user;
      joke1 = config.jokes[0];
      joke2 = config.jokes[1];
      joke3 = config.jokes[2];
      user1 = config.users[0];
      user2 = config.users[1];
      done();
    });
  });
  describe('filters', function() {
    it('should limit GET to 10', function(done) {
      request(app)
        .get('/api/jokes?limit=10')
        .end(function(err, res) {
          res.body.length.should.equal(10);
          done();
        });
    });
    it('should limit GET to 1', function(done) {
      request(app)
        .get('/api/jokes?limit=1')
        .end(function(err, res) {
          res.body.length.should.equal(1);
          done();
        });
    });
    it('should skip by 5', function(done) {
      request(app)
        .get('/api/jokes?limit=1&skip=5')
        .end(function(err, res) {
          request(app)
            .get('/api/jokes?limit=6')
            .end(function(err2, res2) {
              res.body[0].should.eql(res2.body[res2.body.length-1]);
              done();
            });
        });
    });
    it('should select fields', function(done) {
      request(app)
        .get('/api/jokes?select=year')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.should.not.have.property('title');
            joke.should.have.property('year');
          });
          done();
        });
    });
    it('should sort documents', function(done) {
      request(app)
        .get('/api/jokes?sort=year')
        .end(function(err, res) {
          for(var i = 1; i < res.body.length; i++) {
            (res.body[i].year >= res.body[i-1].year).should.be.true;
          }
          done();
        });
    });
    it('should filter fields using equal', function(done) {
      request(app)
        .get('/api/jokes?year=2011')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.year.should.equal(2011);
          });
          done();
        });
    });
    it('should filter fields using gte', function(done) {
      request(app)
        .get('/api/jokes?year__gte=2012')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.year.should.be.above(2011);
          });
          done();
        });
    });
    it('should filter fields using gt', function(done) {
      request(app)
        .get('/api/jokes?year__gt=2011')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.year.should.be.above(2011);
          });
          done();
        });
    });
    it('should filter fields using lt', function(done) {
      request(app)
        .get('/api/jokes?year__lt=2013')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.year.should.be.below(2013);
          });
          done();
        });
    });
    it('should filter fields using lte', function(done) {
      request(app)
        .get('/api/jokes?year__lte=2012')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.year.should.be.below(2013);
          });
          done();
        });
    });
    it('should filter fields using ne', function(done) {
      request(app)
        .get('/api/jokes?year__ne=2013')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.year.should.not.equal(2013);
          });
          done();
        });
    });
    it('should filter fields using regex', function(done) {
      request(app)
        .get('/api/jokes?title__regex=2')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            joke.title.should.containEql('2');
          });
          done();
        });
    });
    it('should filter fields using regex with options', function(done) {
      request(app)
        .get('/api/jokes?title__regex=' + encodeURIComponent("/tITLE/i"))
        .end(function(err, res) {
          res.body.length.should.be.above(0);
          res.body.forEach(function(joke) {
            joke.title.toLowerCase().should.containEql('title');
          });
          done();
        });
    });
    it('should populate an objectId', function(done) {
      request(app)
        .get('/api/jokes/' + joke1._id + '?populate=creator')
        .end(function(err, res) {
          res.body.creator.username.should.equal(user1.username);
          res.body.creator.pass_hash.should.equal(user1.pass_hash);
          done();
        });
    });
    it('should filter using in', function(done) {
      request(app)
        .get('/api/jokes?year__in=2010,2011')
        .end(function(err, res) {
          res.body.forEach(function(joke) {
            [2010,2011].indexOf(joke.year).should.be.above(-1);
          });
          done();
        });
    });
    it('should filter using nin', function(done) {
      request(app)
        .get('/api/jokes?year__nin=2012,2013,2014')
        .end(function(err, res) {
          res.body.length.should.be.above(0)
          res.body.forEach(function(joke) {
            [2012,2013,2014].indexOf(joke.year).should.equal(-1);
          });
          done();
        });
    });
  });
});
