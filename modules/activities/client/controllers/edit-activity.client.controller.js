'use strict';

// Activities edit controller
angular.module('activities').controller('ActivitiesEditController', ['$scope', '$state', '$window', 'Authentication', 'activityResolve',
	function($scope, $state, $window, Authentication, activity) {
		var bodyStyle = document.getElementById("body").style,
			activitiesBackgroundPath = "/modules/activities/client/img/backgrounds/";

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

		$scope.setBodyImage = function() {
			bodyStyle.backgroundImage = "url('" + activitiesBackgroundPath + "climbing.jpg')";
		};

		$scope.save = function(isValid) {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
				return false;
			}
			$scope.activity.comments = $scope.comments;

			var successCallback = function(res) {
				$state.go('activities.view', {
					activityId: res._id
				});
			};

			var errorCallback = function(res) {
				$scope.error = res.data.message;
			};
			$scope.activity.$update(successCallback, errorCallback);

		};

		$scope.addComment = function(isValid) {
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
