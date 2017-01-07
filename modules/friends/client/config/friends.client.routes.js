(function () {
	'use strict';

	angular
		.module('friends')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('friends', {
				abstract: true,
				url: '/friends',
				template: '<ui-view/>'
			})
			.state('friends.list', {
				url: '',
				templateUrl: 'modules/friends/client/views/list-friends.client.view.html',
				controller: 'FriendsListController',
				controllerAs: 'vm',
				data: {
					pageTitle: 'Friends List'
				}
			})
			.state('friends.add', {
				url: '/add',
				templateUrl: 'modules/friends/client/views/form-friend.client.view.html',
				controller: 'FriendsController',
				controllerAs: 'vm',
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
				controllerAs: 'vm',
				resolve: {
					friendResolve: getFriend
				},
				data: {
					pageTitle: 'Friend {{ friendResolve.name }}'
				}
			});
	}

	getFriend.$inject = ['$stateParams', 'FriendsService'];

	function getFriend($stateParams, FriendsService) {
		return FriendsService.get({
			friendId: $stateParams.friendId
		}).$promise;
	}

	newFriend.$inject = ['FriendsService'];

	function newFriend(FriendsService) {
		return new FriendsService();
	}
}());
