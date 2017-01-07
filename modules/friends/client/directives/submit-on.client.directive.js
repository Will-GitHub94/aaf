// TODO: This can be deleted
(function () {
	'use strict';

	angular
		.module('friends')
		.directive('submitOn', submitOn);

	submitOn.$inject = [/*Example: '$state', '$window' */];

	function submitOn(/*Example: $state, $window */) {
		return {
			link: function postLink(scope, element, attrs) {
				scope.$on(attrs.submitOn, function() {
					//We can't trigger submit immediately, or we get $digest already in progress error :-[ (because ng-submit does an $apply of its own)
					setTimeout(function() {
						angular.element(element).triggerHandler('submit');
					});
				});
			}
		};
	}
})();
