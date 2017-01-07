'use strict';

// Users directive used to force lowercase input
angular.module('activities').directive('onSearchBar', function () {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			scope.$apply(function() {
				scope.$eval(attrs.ngEnter);
			});
			event.preventDefault();
		});
	};
});
