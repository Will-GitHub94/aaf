"use strict";

// Friends service used to communicate Friends REST endpoints
angular.module('friends').factory('FriendsService', ['$resource', 'Authentication',
	function($resource, Authentication) {
		return {
			getFriendsOfCurrentUser: $resource('api/:userId/friends/:friendId', {
				userId: Authentication.user._id,
				friendId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			}),
			getAllUsers: $resource('api/friends/users'),
			getAllFriends: $resource('api/friends')
		};
	}
]);
