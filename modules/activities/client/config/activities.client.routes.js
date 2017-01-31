(function () {
	'use strict';

	angular
		.module('activities')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('activities', {
				abstract: true,
				url: '/activities',
				template: '<ui-view/>'
			})
			.state('activities.list', {
				url: '',
				templateUrl: 'modules/activities/client/views/list-activities.client.view.html',
				controller: 'ActivitiesListController',
				controllerAs: 'vm',
				data: {
					pageTitle: 'Activities List'
				}
			})
			.state('activities.create', {
				url: '/create',
				templateUrl: 'modules/activities/client/views/form-activity.client.view.html',
				controller: 'ActivitiesController',
				controllerAs: 'vm',
				resolve: {
					activityResolve: newActivity
				},
				data: {
					roles: ['user', 'admin'],
					pageTitle: 'Activities Create'
				}
			})
			.state('activities.compare', {
				url: '/compare/:activityIds',
				templateUr: '',
				controller: 'ActivitiesController',
				controllerAs: 'vm',
				resolve: {
					activityResolve: getMultipleActivities
				},
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('activities.edit', {
				url: '/:activityId/edit',
				templateUrl: 'modules/activities/client/views/form-activity.client.view.html',
				controller: 'ActivitiesController',
				controllerAs: 'vm',
				resolve: {
					activityResolve: getSingleActivity
				},
				data: {
					roles: ['user', 'admin'],
					pageTitle: 'Edit Activity {{ activityResolve.name }}'
				}
			})
			.state('activities.view', {
				url: '/:activityId',
				templateUrl: 'modules/activities/client/views/view-activity.client.view.html',
				controller: 'ActivitiesController',
				controllerAs: 'vm',
				resolve: {
					activityResolve: getSingleActivity
				},
				data: {
					pageTitle: 'Activity {{ activityResolve.name }}'
				}
			});
	}

	getSingleActivity.$inject = ['$stateParams', 'ActivitiesService'];

	function getSingleActivity($stateParams, ActivitiesService) {
		return ActivitiesService.getActivitiesOfCurrentUser.get({
			activityId: $stateParams.activityId
		}).$promise;
	}

	newActivity.$inject = ['ActivitiesService'];

	function newActivity(ActivitiesService) {
		return new ActivitiesService.getActivitiesOfAllUsers;
	}

	getMultipleActivities.$inject = ['$stateParams', 'ActivitiesService'];

	function getMultipleActivities($stateParams, ActivitiesService) {
		return ActivitiesService.getMultipleActivitiesOfAllUsers.query({
			activityIds: $stateParams.activityIds
		}).$promise
	}
}());
