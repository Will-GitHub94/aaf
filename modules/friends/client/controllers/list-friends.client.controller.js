"use strict";

angular.module('friends').controller('FriendsListController', ['$scope', 'FriendsService',
	function ($scope, FriendsService) {
		var bodyStyle = document.getElementById("body").style,
			friendsBackgroundPath = "/modules/friends/client/img/backgrounds/";

		FriendsService.getFriendsOfCurrentUser.query(function (data) {
			$scope.friends = data;
		});

		$scope.setBodyImage = function () {
			bodyStyle.backgroundImage = "url('" + friendsBackgroundPath + "cycling.jpg')";
		};
	}
]);
