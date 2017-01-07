'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Friend = mongoose.model('Friend'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  friend;

/**
 * Friend routes tests
 */
describe('Friend CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Friend
    user.save(function () {
      friend = {
        name: 'Friend name'
      };

      done();
    });
  });

  it('should be able to save a Friend if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle Friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
            }

            // Get a list of Friends
            agent.get('/api/friends')
              .end(function (friendsGetErr, friendsGetRes) {
                // Handle Friends save error
                if (friendsGetErr) {
                  return done(friendsGetErr);
                }

                // Get Friends list
                var friends = friendsGetRes.body;

                // Set assertions
                (friends[0].user._id).should.equal(userId);
                (friends[0].name).should.match('Friend name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Friend if not logged in', function (done) {
    agent.post('/api/friends')
      .send(friend)
      .expect(403)
      .end(function (friendSaveErr, friendSaveRes) {
        // Call the assertion callback
        done(friendSaveErr);
      });
  });

  it('should not be able to save an Friend if no name is provided', function (done) {
    // Invalidate name field
    friend.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Friend
        agent.post('/api/friends')
          .send(friend)
          .expect(400)
          .end(function (friendSaveErr, friendSaveRes) {
            // Set message assertion
            (friendSaveRes.body.message).should.match('Please fill Friend name');

            // Handle Friend save error
            done(friendSaveErr);
          });
      });
  });

  it('should be able to update an Friend if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle Friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
            }

            // Update Friend name
            friend.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Friend
            agent.put('/api/friends/' + friendSaveRes.body._id)
              .send(friend)
              .expect(200)
              .end(function (friendUpdateErr, friendUpdateRes) {
                // Handle Friend update error
                if (friendUpdateErr) {
                  return done(friendUpdateErr);
                }

                // Set assertions
                (friendUpdateRes.body._id).should.equal(friendSaveRes.body._id);
                (friendUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Friends if not signed in', function (done) {
    // Create new Friend model instance
    var friendObj = new Friend(friend);

    // Save the friend
    friendObj.save(function () {
      // Request Friends
      request(app).get('/api/friends')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Friend if not signed in', function (done) {
    // Create new Friend model instance
    var friendObj = new Friend(friend);

    // Save the Friend
    friendObj.save(function () {
      request(app).get('/api/friends/' + friendObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', friend.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Friend with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/friends/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Friend is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Friend which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Friend
    request(app).get('/api/friends/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Friend with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Friend if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle Friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
            }

            // Delete an existing Friend
            agent.delete('/api/friends/' + friendSaveRes.body._id)
              .send(friend)
              .expect(200)
              .end(function (friendDeleteErr, friendDeleteRes) {
                // Handle friend error error
                if (friendDeleteErr) {
                  return done(friendDeleteErr);
                }

                // Set assertions
                (friendDeleteRes.body._id).should.equal(friendSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Friend if not signed in', function (done) {
    // Set Friend user
    friend.user = user;

    // Create new Friend model instance
    var friendObj = new Friend(friend);

    // Save the Friend
    friendObj.save(function () {
      // Try deleting Friend
      request(app).delete('/api/friends/' + friendObj._id)
        .expect(403)
        .end(function (friendDeleteErr, friendDeleteRes) {
          // Set message assertion
          (friendDeleteRes.body.message).should.match('User is not authorized');

          // Handle Friend error error
          done(friendDeleteErr);
        });

    });
  });

  it('should be able to get a single Friend that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Friend
          agent.post('/api/friends')
            .send(friend)
            .expect(200)
            .end(function (friendSaveErr, friendSaveRes) {
              // Handle Friend save error
              if (friendSaveErr) {
                return done(friendSaveErr);
              }

              // Set assertions on new Friend
              (friendSaveRes.body.name).should.equal(friend.name);
              should.exist(friendSaveRes.body.user);
              should.equal(friendSaveRes.body.user._id, orphanId);

              // force the Friend to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Friend
                    agent.get('/api/friends/' + friendSaveRes.body._id)
                      .expect(200)
                      .end(function (friendInfoErr, friendInfoRes) {
                        // Handle Friend error
                        if (friendInfoErr) {
                          return done(friendInfoErr);
                        }

                        // Set assertions
                        (friendInfoRes.body._id).should.equal(friendSaveRes.body._id);
                        (friendInfoRes.body.name).should.equal(friend.name);
                        should.equal(friendInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Friend.remove().exec(done);
    });
  });
});
