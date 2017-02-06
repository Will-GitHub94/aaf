// Friends controller
angular.module('friends').controller('FriendsController', ['$scope', '$state', '$window', 'Authentication', 'friendResolve', 'UsersService',
	($scope, $state, $window, Authentication, friend, UsersService) => {
		$scope.users = UsersService.query();

		$scope.authentication = Authentication;

		// Whatever you are saving here, it has to be part of 'vm.friend'
		// I.e. if you were setting a name, the ng-model would be 'vm.friend.name'
		$scope.friend = friend;
		$scope.error = null;
		$scope.form = {};
		$scope.remove = () => {
			if ($window.confirm('Are you sure you want to delete?')) {
				vm.friend.$remove($state.go('friends.list'));
			}
		};

		$scope.save = (user) => {
			let successCallback = (res) => {
				$state.go('friends.list');
			};

			let errorCallback = (res) => {
				$scope.error = res.data.message;
			};

			$scope.friend.friend = user;
			$scope.friend.$save(successCallback, errorCallback);
		};
	}
]);
