var should = require('should'),
    request = require('supertest'),
    config = require('./fixtures/config'),
    sinon = require('sinon'),
    checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

var oldA = should.Assertion.prototype.a;
should.Assertion.prototype.a = function(type, desc) {
  if (type === '_id') {
    this.assert(checkForHexRegExp.test(this.obj),
        function() { return 'expected ' + this.inspect + ' to be a ' + type + (desc ? " | " + desc : ""); },
        function(){ return 'expected ' + this.inspect + ' not to be a ' + type  + (desc ? " | " + desc : ""); });
    return this;
  }
  return oldA.call(this, type, desc);
};

describe('Model', function() {
  var jokes, 
      users,
      app, 
      joke1, 
      joke2, 
      joke3, 
      user1, 
      user2,
      review;
  before(function(done) {
    config.ready(function() {
      app = config.app;
      jokes = config.joke;
      users = config.user;
      joke1 = config.jokes[0];
      joke2 = config.jokes[1];
      joke3 = config.jokes[2];
      user1 = config.users[0];
      user2 = config.users[1];
      review = config.reviews[0];
      done();
    });
  });
  describe('handlers', function() {
    it('should handle schema request', function(done) {
      request(app)
        .get('/api/jokes/schema')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.resource.should.equal('jokes');
          res.body.allowed_methods.should.eql(Object.keys(jokes.allowed_methods));
          res.body.fields.should.be.an.instanceOf(Object);
          Object.keys(jokes.schema.paths).forEach(function(path) {
            res.body.fields.should.have.property(path);
          });
          res.body.list_uri.should.equal('/api/jokes');
          res.body.detail_uri.should.equal('/api/jokes/:id');
          done();
        });
    });
    
    it('should dispatch to GET', function(done) {
      request(app)
        .get('/api/jokes')
        .expect('Content-Type', /json/)
        .expect(200, done);
    }); 
    it('should fail POST with no data', function(done) {
      request(app)
        .post('/api/jokes')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
    it('should POST with data', function(done) {
      request(app)
        .post('/api/jokes')
        .send({
          title: "A very stupid joke",
          year: "214243"
        })
        .expect('Content-Type', /json/)
        .expect(201 )
        .end(function(err, res) {
          res.body.title.should.equal('A very stupid joke');
          res.body._id.should.type('string');
          done(err);
        });
    });
    it('should PUT data', function(done) {
      request(app)
        .put('/api/jokes/' + joke2._id)
        .send({
          title: 'I changed the joke title'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.title.should.equal('I changed the joke title');
          jokes.findById(joke2._id, function(err, joke) {
            joke.title.should.equal('I changed the joke title');
            done();
          });
        });
    });
    it('should fail on GET invalid resource ID type', function(done) {
      request(app)
        .get('/api/jokes/55')
        .expect(404, done);
    });
    it('should fail on GET missing resource', function(done) {
      request(app)
        .get('/api/jokes/55e8169191ad293c221a6c9d')
        .expect(404, done);
    });
    it('should fail on PUT missing resource (shouldUseAtomicUpdate=false)', function(done) {
      request(app)
        .put('/api/genres/55e8169191ad293c221a6c9d')
        .send({
          name: "Mysterious genre"
        })
        .expect(404, done);
    });
    it('should fail on PUT missing resource (shouldUseAtomicUpdate=true)', function(done) {
      request(app)
        .put('/api/jokes/55e8169191ad293c221a6c9d')
        .send({
          title: "Mysterious genre"
        })
        .expect(404, done);
    });
    it('should fail on DELETE missing resource (shouldUseAtomicUpdate=false)', function(done) {
      request(app)
        .del('/api/genres/55e8169191ad293c221a6c9d')
        .expect(404, done);
    });
    it('should fail on PUT without filter on unsortable model', function(done) {
      request(app)
        .put('/api/jokes')
        .send({
          title: "A very stupid joke"
        })
        .expect(404, done);
    });
    it('should fail on DELETE without a filter', function(done) {
      request(app)
        .del('/users')
        .expect(404, done);
    });
    it('should DELETE a joke', function(done) {
      request(app)
        .del('/api/jokes/' + joke3._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          jokes.findById(joke3._id, function(err, joke) {
            should.not.exist(joke);
            done();
          });
        });
    });
    it("shouldn't put data on deleted resource", function(done) {
      request(app)
        .del('/api/jokes/' + config.jokes[5]._id)
        .end(function(err, res) {
          request(app)
            .put('/api/jokes/' + config.jokes[5]._id)
            .send({
              title: 'But I already deleted you'
            })
          .expect(404, done);
        });
    });
    it('should 400 deleting a resource twice', function(done) {
      request(app)
        .del('/api/jokes/' + config.jokes[6]._id)
        .end(function() {
          request(app)
            .del('/api/jokes/' + config.jokes[6]._id)
            .expect(404, done);
        });
    });
    it('should 404 on undefined route', function(done) {
      request(app)
        .del('/api/jokes')
        .expect(404, done);
    });
    it('should return a nested model at the generated endpoint creator', function(done) {
      request(app)
        .get('/api/jokes/' + joke1._id + '/creator')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.should.be.json;
          res.body.username.should.equal('test');
          res.body.pass_hash.should.equal(12374238719845134515);
          done();
        }); 
    });
    it('should 404 if we request an object endpoint without a filter', function(done) {
      request(app)
        .get('/api/jokes/creator')
        .expect(404, done);
    });
    it('should retrieve a deeply nested endpoint', function(done) {
      request(app)
        .get('/api/jokes/' + joke1._id + '/meta/director')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.should.be.json;
          res.body.username.should.equal('test2');
          res.body.pass_hash.should.equal(1237987381263189273123);
          done();
        });

    });
    it('should 404 on a nested object', function(done) {
      request(app)
        .get('/api/jokes/' + joke1._id + '/meta')
        .expect(404, done)
    });
    it('should get a user defined route', function(done) {
      request(app)
        .get('/api/jokes/recommend')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.should.be.json;
          res.body.recommend.should.equal("called");
          done();
        });
    });
    it('should get anotheroute (user defined route)', function(done) {
      request(app)
        .get('/api/jokes/anotherroute')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.should.be.json;
          res.body.anotherroute.should.equal("called");
          done();
        });
    });
    it('should get athirdroute (user defined route)', function(done) {
      request(app)
        .get('/api/jokes/' + joke1._id + '/athirdroute')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.should.be.json;
          res.body.athirdroute.should.equal("called");
          done();
        });
    });
    it('should fail athirdroute (user defined route)', function(done) {
      request(app)
        .get('/api/jokes/athirdroute')
        .expect(404, done);
    });
    it('should fail athirdroute (user defined route)', function(done) {
      request(app)
        .put('/api/jokes/' + joke1._id + '/athirdroute')
        .expect(404, done);
    });
    it('should allow put of entire object', function(done) {
      request(app)
        .get('/api/jokes/' + config.jokes[7]._id)
        .end(function(err, res) {
          var joke = res.body;
          joke.title = 'A different title';
          request(app)
            .put('/api/jokes/' + joke._id)
            .send(joke)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              res.body.title.should.equal('A different title');
              done();
            });
        });
    });
    it('should allow overriding of schema route', function(done) {
      request(app)
        .get('/users/schema')
        .expect(404, done);
    });
    it('should allow multiple handlers to be called on a single route', function(done) {
      request(app)
        .get('/api/jokes/pshh')
        .expect(200)
        .end(function(err, res) {
          res.body.pshh.should.equal('called');
          done(err);
        });
    });
    it('should allow get request for model with field named `length`', function(done) {
      request(app)
        .get('/api/reviews/' + review._id)
        .expect(200)
        .end(function(err, res) {
          res.body.body.should.equal('This is a joke review!');
          done(err);
        });
    });
  });
});
