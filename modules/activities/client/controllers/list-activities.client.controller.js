(function () {
	'use strict';

	angular
		.module('activities')
		.controller('ActivitiesListController', ActivitiesListController);

	ActivitiesListController.$inject = ['ActivitiesService'];

	function ActivitiesListController(ActivitiesService) {
		var vm = this;

		vm.compareActivities = false;
		vm.activities = ActivitiesService.query();
		vm.orderProp = 'name';
	}
}());
