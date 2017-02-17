"use strict";

angular.module('friends').controller('FriendsListController', ['$scope', 'FriendsService', 'Authentication',
	function ($scope, FriendsService, Authentication) {
		var bodyStyle = document.getElementById("body").style,
			friendsBackgroundPath = "/modules/friends/client/img/backgrounds/";

		$scope.friends = [];

		var getAllFriends = function(callback) {
			FriendsService.getAllFriends.query(function(friends) {
				callback(friends);
			});
		};

		var getAllUsers = function(callback) {
			FriendsService.getAllUsers.query(function(users) {
				callback(users);
			});
		};

		var pushFriend = function(friend, added) {
			$scope.friends.push({
				friend: friend,
				added: added
			});
		};

		// This is almost callback hell...
		getAllFriends(function(friends) {
			getAllUsers(function(users) {
				friends.forEach(function(friend) {
					if (Authentication.user._id === friend.friend._id) {
						users.forEach(function(user) {
							if (user._id === friend.user._id) {
								pushFriend(user, friend.added);
							}
						});
					} else if (Authentication.user._id === friend.user._id) {
						pushFriend(friend.friend, friend.added);
					}
				});
			});
		});

		$scope.setBodyImage = function () {
			bodyStyle.backgroundImage = "url('" + friendsBackgroundPath + "cycling.jpg')";
		};
	}
]);
