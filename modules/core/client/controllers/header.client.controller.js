angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
	($scope, $state, Authentication, Menus) => {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;

		// Get the topbar menu
		$scope.menu = Menus.getMenu('topbar');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = () => {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', () => {
			$scope.isCollapsed = false;
		});
	}
]);
