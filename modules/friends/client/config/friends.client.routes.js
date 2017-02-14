"use strict";

angular.module('friends').config(['$stateProvider',
	function ($stateProvider) {

		var getFriend = ['$stateParams', 'FriendsService', function ($stateParams, FriendsService) {
			return FriendsService.getFriendsOfCurrentUser.get({
				friendId: $stateParams.friendId
			}).$promise;
		}];

		var newFriend = ['FriendsService', function (FriendsService) {
			return new FriendsService.getFriendsOfCurrentUser;
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
