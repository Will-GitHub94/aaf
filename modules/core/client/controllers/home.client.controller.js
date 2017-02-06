angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	($scope, Authentication) => {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
