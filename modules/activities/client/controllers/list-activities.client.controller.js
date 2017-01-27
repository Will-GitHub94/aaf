(function () {
	'use strict';

	angular
		.module('activities')
		.controller('ActivitiesListController', ActivitiesListController);

	ActivitiesListController.$inject = ['ActivitiesService'/*, 'FriendsService'*/,'Authentication'];

	function ActivitiesListController(ActivitiesService/*, FriendsService*/, Authentication) {
		var vm = this;

		vm.activities = [];
		ActivitiesService.getActivitiesOfCurrentUser.query(function(activities) {
			activities.forEach(function(activity) {
				vm.activities.push(activity);
			});
		});

		ActivitiesService.getActivitiesOfAllUsers.query(function(activities) {
			activities.forEach(function(activity) {
				if ((activity.sharedWith.indexOf(Authentication.user._id) > -1) && (activity.user._id !== Authentication.user._id)) {
					vm.activities.push(activity);
				}
			});
		});

		vm.compareActivities = false;
		// vm.friends = FriendsService.query();
		vm.orderProp = 'name';
	}
}());
