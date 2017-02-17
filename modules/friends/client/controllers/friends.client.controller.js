"use strict";

// Friends controller
angular.module('friends').controller('FriendsController', ['$scope', '$state', '$window', 'Authentication', 'friendResolve', 'FriendsService',
	function($scope, $state, $window, Authentication, friend, FriendsService) {
		var bodyStyle = document.getElementById("body").style,
			friendsBackgroundPath = "/modules/friends/client/img/backgrounds/";

		$scope.users = [];
		var getAllUsersExceptCurrent = function(callback) {
			FriendsService.getAllUsers.query(function(data) {
				data.forEach(function(user) {
					if (user._id !== Authentication.user._id) {
						$scope.users.push(user);
					}
				});
				callback();
			});
		};

		getAllUsersExceptCurrent(function() {
			FriendsService.getFriendsOfCurrentUser.query(function(friends) {
				friends.forEach(function(friend) {
					$scope.users = $scope.users.filter(function(user) {
						return user._id !== friend.friend._id;
					});
				});
			});
		});

		$scope.authentication = Authentication;

		// Whatever you are saving here, it has to be part of '$scope.friend'
		// I.e. if you were setting a name, the ng-model would be '$scope.friend.name'
		$scope.friend = friend;
		$scope.error = null;
		$scope.form = {};
		$scope.remove = function() {
			if ($window.confirm('Are you sure you want to delete?')) {
				$scope.friend.$remove($state.go('friends.list'));
			}
		};

		$scope.save = function(user) {
			var successCallback = function(res) {
				$state.go('friends.list');
			};

			var errorCallback = function(res) {
				$scope.error = res.data.message;
			};

			$scope.friend.friend = user;
			$scope.friend.$save(successCallback, errorCallback);
		};

		$scope.setBodyImage = function() {
			bodyStyle.backgroundImage = "url('" + friendsBackgroundPath + "running.jpg')";
		};
	}
]);
