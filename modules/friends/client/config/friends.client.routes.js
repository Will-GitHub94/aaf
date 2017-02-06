angular.module('friends').config(['$stateProvider',
	($stateProvider) => {

		let getFriend = ['$stateParams', 'FriendsService', ($stateParams, FriendsService) => {
			return FriendsService.get({
				friendId: $stateParams.friendId
			}).$promise;
		}];

		let newFriend = ['FriendsService', (FriendsService) => {
			return new FriendsService();
		}];

		$stateProvider
			.state('friends', {
				abstract: true,
				url: '/friends',
				template: '<ui-view/>'
			})
			.state('friends.list', {
				url: '/:userId',
				templateUrl: 'modules/friends/client/views/list-friends.client.view.html',
				controller: 'FriendsListController',
				data: {
					pageTitle: 'Friends List'
				}
			})
			.state('friends.add', {
				url: '/add',
				templateUrl: 'modules/friends/client/views/form-friend.client.view.html',
				controller: 'FriendsController',
				resolve: {
					friendResolve: newFriend
				},
				data: {
					roles: ['user', 'admin'],
					pageTitle: 'Friends Add'
				}
			})
			.state('friends.view', {
				url: '/:friendId',
				templateUrl: 'modules/friends/client/views/view-friend.client.view.html',
				controller: 'FriendsController',
				resolve: {
					friendResolve: getFriend
				},
				data: {
					pageTitle: 'Friend {{ friendResolve.name }}'
				}
			});
	}]);
