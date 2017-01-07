'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Friend = mongoose.model('Friend'),
	User = mongoose.model('User'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

/**
 * Add a Friend
 */
exports.add = function (req, res) {
	var friend = new Friend(req.body);
	friend.user = req.user;

	friend.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friend);
		}
	});
};

/**
 * Show the current Friend
 */
exports.read = function (req, res) {
	// convert mongoose document to JSON
	var friend = req.friend ? req.friend.toJSON() : {};

	// Add a custom field to the Article, for determining if the current User is the "owner".
	// NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
	friend.isCurrentUserOwner = req.user && friend.user && friend.user._id.toString() === req.user._id.toString();

	res.jsonp(friend);
};

/**
 * Update a Friend
 */
exports.update = function (req, res) {
	var friend = req.friend;

	friend = _.extend(friend, req.body);

	friend.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friend);
		}
	});
};

/**
 * Delete an Friend
 */
exports.delete = function (req, res) {
	var friend = req.friend;

	friend.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friend);
		}
	});
};

/**
 * List of Friends
 */
exports.list = function (req, res) {
	Friend.find().sort('-created').populate('user', 'displayName').exec(function (err, friends) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(friends);
		}
	});
};

/**
 * List of Users
 */
exports.usersList = function(req, res) {
	User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

		res.json(users);
	});
};

/**
 * Friend middleware
 */
exports.friendByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Friend is invalid'
		});
	}

	Friend.findById(id).populate('user', 'displayName').exec(function (err, friend) {
		if (err) {
			return next(err);
		} else if (!friend) {
			return res.status(404).send({
				message: 'No Friend with that identifier has been found'
			});
		}
		req.friend = friend;
		next();
	});
};
