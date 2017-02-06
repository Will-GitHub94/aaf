angular.module('friends').run(['Menus',
	(menuService) => {
		// Set top bar menu items
		menuService.addMenuItem('topbar', {
			title: 'Friends',
			state: 'friends',
			type: 'dropdown',
			roles: ['admin', 'user']
		});

		// Add the dropdown list item
		menuService.addSubMenuItem('topbar', 'friends', {
			title: 'List Friends',
			state: 'friends.list'
		});

		// Add the dropdown create item
		menuService.addSubMenuItem('topbar', 'friends', {
			title: 'Add Friend',
			state: 'friends.add',
			roles: ['user']
		});
	}
]);
