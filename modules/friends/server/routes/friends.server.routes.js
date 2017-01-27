'use strict';

/**
 * Module dependencies
 */
var friendsPolicy = require('../policies/friends.server.policy'),
	friends = require('../controllers/friends.server.controller');

module.exports = function (app) {
	// Friends Routes
	app.route('/api/friends').all(friendsPolicy.isAllowed)
		.get(friends.list)
		.post(friends.add);

	app.route('/api/:userId/friends').all(friendsPolicy.isAllowed)
		.get(friends.usersFriends)
		.post(friends.add);

	app.route('/api/friends/users')
		.get(friends.usersList);

	app.route('/api/friends/:friendId').all(friendsPolicy.isAllowed)
		.get(friends.read)
		.put(friends.update)
		.delete(friends.delete);

	app.route('/api/:userId/friends/:friendId').all(friendsPolicy.isAllowed)
		.get(friends.read)
		.put(friends.update)
		.delete(friends.delete);

	// Finish by binding the Friend middleware

	// do I have to bind users here?
	app.param('userId', friends.userByID);
	app.param('friendId', friends.friendByID);
};
