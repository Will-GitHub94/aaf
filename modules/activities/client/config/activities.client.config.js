"use strict";

angular.module('activities').run(['Menus',
	function(menuService) {
		// Set top bar menu items
		menuService.addMenuItem('topbar', {
			title: 'Activities',
			state: 'activities',
			type: 'dropdown',
			roles: ['admin', 'user']
		});

		// Add the dropdown list item
		menuService.addSubMenuItem('topbar', 'activities', {
			title: 'List Activities',
			state: 'activities.list'
		});

		// Add the dropdown create item
		menuService.addSubMenuItem('topbar', 'activities', {
			title: 'Create Activity',
			state: 'activities.create',
			roles: ['admin', 'user']
		});
	}
]);
