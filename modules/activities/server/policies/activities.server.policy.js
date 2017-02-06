'use strict';

/**
 * Module dependencies
 */
let acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Activities Permissions
 */
exports.invokeRolesPolicies = () => {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/activities',
			permissions: '*'
		}, {
			resources: '/api/activities/:activityId',
			permissions: '*'
		}]
	}, {
		roles: ['user'],
		allows: [{
			resources: '/api/activities',
			permissions: ['get', 'post']
		}, {
			resources: '/api/activities/:activityId',
			permissions: ['get']
		}, {
			resources: '/api/:userId/activities',
			permissions: ['get', 'post']
		}, {
			resources: '/api/:userId/activities/:activityId',
			permissions: ['get', 'post']
		}, {
			resources: '/api/activities/gpxData',
			permissions: ['post']
		}, {
			resources: '/api/activities/compare/:activityIds',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If Activities Policy Allows
 */
exports.isAllowed = (req, res, next) => {
	let roles = (req.user) ? req.user.roles : ['guest'];

	// If an Activity is being processed and the current user created it(or the activity is shared with the current user)
	// then allow any manipulation
	if ((req.activity) && (req.user) && (req.activity.user) &&
		((req.activity.user.id === req.user.id) || (req.activity.sharedWith.indexOf(req.user.id) > -1))) {
		return next();
	}

	// Check for user roles
	acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
		if (err) {
			// An authorization error occurred
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}
	});
};
