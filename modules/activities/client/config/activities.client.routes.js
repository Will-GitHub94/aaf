'use strict';

angular.module('activities').config(['$stateProvider',
	function($stateProvider) {

		var getSingleActivity = ['$stateParams', 'ActivitiesService', function($stateParams, ActivitiesService) {
			return ActivitiesService.getActivitiesOfCurrentUser.get({
				activityId: $stateParams.activityId
			}).$promise;
		}];

		var newActivity = ['ActivitiesService', function(ActivitiesService) {
			return new ActivitiesService.getActivitiesOfAllUsers;
		}];

		var getMultipleActivities = ['$stateParams', 'ActivitiesService', function($stateParams, ActivitiesService) {
			return ActivitiesService.getMultipleActivitiesOfAllUsers.query({
				activityIds: $stateParams.activityIds
			}).$promise;
		}];

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
				data: {
					pageTitle: 'Activities List'
				}
			})
			.state('activities.create', {
				url: '/create',
				templateUrl: 'modules/activities/client/views/form-activity.client.view.html',
				controller: 'ActivitiesCreateController',
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
				templateUrl: 'modules/activities/client/views/compare-activities.client.view.html',
				controller: 'ActivitiesViewController',
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
				controller: 'ActivitiesEditController',
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
				controller: 'ActivitiesViewController',
				resolve: {
					activityResolve: getSingleActivity
				},
				data: {
					pageTitle: 'Activity {{ activityResolve.name }}'
				}
			});
	}
]);
