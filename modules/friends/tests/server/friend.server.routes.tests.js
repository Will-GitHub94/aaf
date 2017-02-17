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
				user: user
			};

			done();
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

	it('should not be able to get a list of Friends if not signed in', function (done) {
		// Create new Friend model instance
		var friendObj = new Friend(friend);

		// Save the friend
		friendObj.save(function () {
			// Request Friends
			request(app)
				.get('/api/friends')
				.expect(403)
				.end(function (req, res) {
					done(req);
				});

		});
	});

	it('should not be able to get a single Friend if not signed in', function (done) {
		// Create new Friend model instance
		var friendObj = new Friend(friend);

		// Save the Friend
		friendObj.save(function () {
			request(app)
				.get('/api/friends/' + friendObj._id)
				.expect(403)
				.end(function (req, res) {
					done(req);
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

	afterEach(function (done) {
		User.remove().exec(function () {
			Friend.remove().exec(done);
		});
	});
});
