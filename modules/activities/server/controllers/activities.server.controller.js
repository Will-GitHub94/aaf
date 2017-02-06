/**
 * Module dependencies.
 */
let path = require('path'),
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
let addGpxDataAndCurrentUserToActivity = (activity, user, callback) => {
	let filename = activity.gpxData,
		gpxDataFile = path.join(__dirname, "../../client/gpxData", filename);

	fs.readFile(gpxDataFile, "utf-8", (err, data) => {
		activity.gpxData = {
			filename: filename,
			data: data
		};
		activity.isCurrentUserOwner = (user) && (activity.user) && (activity.user._id.toString() === user._id.toString());
		callback(activity);
	});
};

/**
 * Create a Activity
 */
exports.create = (req, res) => {
	let activity = new Activity(req.body);
	activity.user = req.user;

	activity.save((err) => {
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
exports.read = (req, res) => {
	let activity = req.activity ? req.activity.toJSON() : {};

	addGpxDataAndCurrentUserToActivity(activity, req.user, (activity) => {
		res.jsonp(activity);
	});
};

/**
 * Shows the activities wanting to be compared
 */
exports.readMultiple = (req, res) => {
	let activities = [],
		manipulatedActivities = [];

	req.activities.forEach((activity) => {
		activities.push(activity.toJSON());
	});

	activities.forEach((activity) => {
		addGpxDataAndCurrentUserToActivity(activity, req.user, (manipulatedActivity) => {
			manipulatedActivities.push(manipulatedActivity);

			if (activities.length === manipulatedActivities.length) {
				res.jsonp(manipulatedActivities);
			}
		});
	});
};

/**
 * Update a Activity
 */
exports.update = (req, res) => {
	let activity = req.activity;

	activity = _.extend(activity, req.body);

	activity.save((err) => {
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
exports.delete = (req, res) => {
	let activity = req.activity;

	activity.remove((err) => {
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
exports.list = (req, res) => {
	Activity.find().sort('-created').populate('user', 'displayName').exec((err, activities) => {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(activities);
		}
	});
};

exports.usersActivities = (req, res) => {
	let userId = req.params.userId;

	Activity.find({
		user: mongoose.Types.ObjectId(userId)
	}).populate("user", "displayName").exec((err, activities) => {
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
exports.activityByID = (req, res, next, id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Activity is invalid'
		});
	}

	Activity.findById(id).populate('user', 'displayName').exec((err, activity) => {
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

exports.activitiesByID = (req, res, next, ids) => {
	let activityIds = _.map(ids.split(','), (activityId) => {
		if (!mongoose.Types.ObjectId.isValid(activityId)) {
			// handle error
		}
		return mongoose.Types.ObjectId(activityId);
	});

	Activity.find({ _id: {
		$in: activityIds
	}}).sort('-created').populate('user', 'displayName').exec((err, activities) => {
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

exports.uploadGpx = (req, res) => {
	let storage = multer.diskStorage(config.uploads.gpxUpload.storage),
		upload = multer({
			storage: storage
		}).single('gpxData');

	upload(req, res, (err) => {
		if (err) {
			console.log(err);
		}
	});
};
