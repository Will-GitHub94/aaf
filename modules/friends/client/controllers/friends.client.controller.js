(function () {
	'use strict';

	// Friends controller
	angular
		.module('friends')
		.controller('FriendsController', FriendsController);

	FriendsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'friendResolve', 'UsersService'];

	function FriendsController($scope, $state, $window, Authentication, friend, UsersService) {
		var vm = this;

		UsersService.query(function(data) {
			vm.users = data;
		});

		vm.authentication = Authentication;

		// Whatever you are saving here, it has to be part of 'vm.friend'
		// I.e. if you were setting a name, the ng-model would be 'vm.friend.name'
		vm.friend = friend;
		vm.error = null;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;

		// Remove existing Friend
		function remove() {
			if ($window.confirm('Are you sure you want to delete?')) {
				vm.friend.$remove($state.go('friends.list'));
			}
		}

		// Save Friend
		function save(user) {
			vm.friend.friend = user;
			vm.friend.$save(successCallback, errorCallback);

			function successCallback(res) {
				$state.go('friends.list');
			}

			function errorCallback(res) {
				vm.error = res.data.message;
			}
		}
	}
}());
