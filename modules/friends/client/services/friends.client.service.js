// Friends service used to communicate Friends REST endpoints
angular.module('friends').factory('FriendsService', ['$resource', 'Authentication',
	($resource, Authentication) => {
		return $resource('api/:userId/friends/:friendId', {
			userId: Authentication.user._id,
			friendId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('friends').factory('UsersService', ['$resource',
	($resource) => {
		return $resource('api/friends/users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
