// Friends service used to communicate Friends REST endpoints
(function () {
	'use strict';

	angular
		.module('friends')
		.factory('FriendsService', FriendsService);

	FriendsService.$inject = ['$resource', 'Authentication'];

	function FriendsService($resource, Authentication) {
		return $resource('api/:userId/friends/:friendId', {
			userId: Authentication.user._id,
			friendId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}

	angular
		.module('friends')
		.factory('UsersService', UsersService);

	UsersService.$inject = ['$resource'];

	function UsersService($resource) {
		return $resource('api/friends/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
}());
