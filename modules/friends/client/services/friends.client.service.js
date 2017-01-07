// Friends service used to communicate Friends REST endpoints
(function () {
	'use strict';

	angular
		.module('friends')
		.factory('FriendsService', FriendsService);

	FriendsService.$inject = ['$resource'];

	function FriendsService($resource) {
		return $resource('api/friends/:friendId', {
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
