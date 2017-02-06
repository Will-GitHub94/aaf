/**
 * Module dependencies
 */
let activitiesPolicy = require('../policies/activities.server.policy'),
	activities = require('../controllers/activities.server.controller');

module.exports = (app) => {
	// Activities Routes
	app.route('/api/activities/gpxData').all(activitiesPolicy.isAllowed)
		.post(activities.uploadGpx);

	app.route('/api/activities').all(activitiesPolicy.isAllowed)
		.get(activities.list)
		.post(activities.create);

	app.route('/api/activities/compare/:activityIds').all(activitiesPolicy.isAllowed)
		.get(activities.readMultiple);

	app.route('/api/:userId/activities').all(activitiesPolicy.isAllowed)
		.get(activities.usersActivities)
		.post(activities.create);

	app.route('/api/activities/:activityId').all(activitiesPolicy.isAllowed)
		.get(activities.read)
		.put(activities.update)
		.delete(activities.delete);

	app.route('/api/:userId/activities/:activityId').all(activitiesPolicy.isAllowed)
		.get(activities.read)
		.put(activities.update)
		.delete(activities.delete);

	// Finish by binding the Activity middleware
	app.param('activityId', activities.activityByID);
	app.param('activityIds', activities.activitiesByID)
};
