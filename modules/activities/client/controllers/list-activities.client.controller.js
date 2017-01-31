(function () {
	'use strict';

	angular
		.module('activities')
		.controller('ActivitiesListController', ActivitiesListController);

	ActivitiesListController.$inject = ['ActivitiesService','Authentication', '$state'];

	function ActivitiesListController(ActivitiesService, Authentication, $state) {
		var vm = this;

		vm.activitiesToCompare = [];
		vm.activities = [];
		vm.wantToCompare = false;
		vm.compareActivities = false;
		vm.orderProp = 'name';

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

		vm.toggleWantToCompare = function() {
			vm.wantToCompare = !vm.wantToCompare;
		};

		vm.toggleActivityToCompare = function(activity, wantToCompare) {
			if (wantToCompare) {
				if (vm.activitiesToCompare.indexOf(activity) <= -1) {
					vm.activitiesToCompare.push(activity);
				}
			} else {
				if (vm.activitiesToCompare.indexOf(activity) > -1) {
					vm.activitiesToCompare.splice(vm.activitiesToCompare.indexOf(activity), 1);
				}
			}
		};

		vm.compare = function() {
			$state.go('activities.compare', {
				activityIds: vm.activitiesToCompare
			});
		};
	}
}());
