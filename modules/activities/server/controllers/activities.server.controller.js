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
	multer = require('multer');

/**
 * Gets the data from the GPX file the activity uses
 */
var addGpxDataAndCurrentUserToActivity = function (activity, req) {
	var gpxDataFile = path.join(__dirname, "../../client/gpxData", activity.gpxData);

	fs.readFile(gpxDataFile, "utf-8", function (err, data) {
		activity.gpxData = {
			filename: activity.gpxData,
			data: data
		};
		activity.isCurrentUserOwner = (req.user) && (activity.user) && (activity.user._id.toString() === req.user._id.toString());
	});
	return activity;
};

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
	var activity = req.activity ? req.activity.toJSON() : {};

	res.jsonp(addGpxDataAndCurrentUserToActivity(activity, req));
};

/**
 * Shows the activities wanting to be compared
 */
exports.readMultiple = function (req, res) {
	var activities = req.activities,
		activitiesArr = [];

	for (var key in activities) {
		if (activities.hasOwnProperty(key)) {
			activitiesArr.push(addGpxDataAndCurrentUserToActivity(activities[key], req));
		}
	}
	res.jsonp(activitiesArr);
};

/**
 * Update a Activity
 */
exports.update = function (req, res) {
	var activity = req.activity;

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

exports.activitiesByID = function (req, res, next, ids) {
	var activityIds = _.map(ids.split(','), function(activityId) {
		if (!mongoose.Types.ObjectId.isValid(activityId)) {
			// handle error
		}
		return mongoose.Types.ObjectId(activityId);
	});

	Activity.find({ _id: {
		$in: activityIds
	}}).sort('-created').populate('user', 'displayName').exec(function (err, activities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.activities = activities;
			next();
		}
	});
};

exports.uploadGpx = function (req, res) {
	var storage = multer.diskStorage(config.uploads.gpxUpload.storage),
		upload = multer({
			storage: storage
		}).single('gpxData');

	upload(req, res, function (err) {
		if (err) {
			console.log(err);
		}
	});
};
