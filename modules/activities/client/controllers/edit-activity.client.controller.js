'use strict';

// Activities edit controller
angular.module('activities').controller('ActivitiesEditController', ['$scope', '$state', '$window', 'Authentication', 'activityResolve',
	($scope, $state, $window, Authentication, activity) => {
		$scope.activity = activity;
		$scope.authentication = Authentication;
		$scope.error = null;
		$scope.form = {};

		$scope.activityTypes = [{
			name: "Ride"
		}, {
			name: "Walk"
		}, {
			name: "Run"
		}, {
			name: "Swim"
		}];

		$scope.save = (isValid) => {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
				return false;
			}
			$scope.activity.comments = $scope.comments;

			let successCallback = (res) => {
				$state.go('activities.view', {
					activityId: res._id
				});
			};

			let errorCallback = (res) => {
				$scope.error = res.data.message;
			};
			$scope.activity.$update(successCallback, errorCallback);

		};

		$scope.addComment = (isValid) => {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'form.activityForm');
				return false;
			}

			$scope.activity.comments.push({
				user: Authentication.user,
				comment: $scope.comment,
				added: Date.now()
			});
			$scope.comment = "";
			$scope.activity.$update();
		};
	}
]);
