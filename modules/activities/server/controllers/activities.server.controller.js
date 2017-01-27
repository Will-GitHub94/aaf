'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Activity = mongoose.model('Activity'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash'),
	fs = require('fs'),
	config = require(path.resolve('./config/config')),
	multer = require('multer'),
	XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

/**
 * Create a Activity
 */
exports.create = function (req, res) {
	var activity = new Activity(req.body);
	activity.user = req.user;

	activity.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activity);
		}
	});
};

/**
 * Show the current Activity
 */
exports.read = function (req, res) {
	var gpxDataFile = path.join(__dirname, "../../client/gpxData", req.activity.gpxData),
		activity = req.activity ? req.activity.toJSON() : {};

	fs.readFile(gpxDataFile, "utf-8", function (err, data) {
		activity.gpxData = {
			filename: req.activity.gpxData,
			data: data
		};

		// convert mongoose document to JSON

		// Add a custom field to the Article, for determining if the current User is the "owner".
		// NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
		activity.isCurrentUserOwner = req.user && activity.user && activity.user._id.toString() === req.user._id.toString();

		res.jsonp(activity);
	});
};

/**
 * Update a Activity
 */
exports.update = function (req, res) {
	var activity = req.activity;

	console.log("\n====================");
	console.log(activity);
	console.log("\n");
	console.log(req.body);
	console.log("====================\n");

	activity = _.extend(activity, req.body);

	activity.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activity);
		}
	});
};

/**
 * Delete an Activity
 */
exports.delete = function (req, res) {
	var activity = req.activity;

	activity.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activity);
		}
	});
};

/**
 * List of Activities
 */
exports.list = function (req, res) {
	Activity.find().sort('-created').populate('user', 'displayName').exec(function (err, activities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activities);
		}
	});
};

exports.usersActivities = function (req, res) {
	var userId = req.params.userId;

	Activity.find({
		user: mongoose.Types.ObjectId(userId)
	}).populate("user", "displayName").exec(function (err, activities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			})
		} else {
			res.jsonp(activities);
		}
	});
};

/**
 * Activity middleware
 */
exports.activityByID = function (req, res, next, id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Activity is invalid'
		});
	}

	Activity.findById(id).populate('user', 'displayName').exec(function (err, activity) {
		if (err) {
			return next(err);
		} else if (!activity) {
			return res.status(404).send({
				message: 'No Activity with that identifier has been found'
			});
		}
		req.activity = activity;
		next();
	});
};

exports.uploadGpx = function(req, res) {
	var storage = multer.diskStorage(config.uploads.gpxUpload.storage),
		upload = multer({
			storage: storage
		}).single('gpxData');

	upload(req, res, function(err) {
		if (err) {
			console.log(err);
		}
	});
};
