"use strict";

angular.module('activities').factory('ActivitiesService', ['$resource', 'Authentication',
	function($resource, Authentication) {
		return {
			getActivitiesOfCurrentUser: $resource('api/:userId/activities/:activityId', {
				userId: Authentication.user._id,
				activityId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			}),
			getActivitiesOfAllUsers: $resource('api/activities/:activityId', {
				activityId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			}),
			getMultipleActivitiesOfAllUsers: $resource('api/activities/compare/:activityIds')
		};
	}
]);
