angular.module('friends').controller('FriendsListController', ['FriendsService',
	(FriendsService) => {
		$scope.friends = FriendsService.query();
	}
]);
