"use strict";

angular.module('activities').controller('ActivitiesListController', ['$scope', 'ActivitiesService', 'Authentication', '$state',
	function($scope, ActivitiesService, Authentication, $state) {
		var bodyStyle = document.getElementById("body").style,
			activitiesBackgroundPath = "/modules/activities/client/img/backgrounds/";

		$scope.activitiesToCompare = [];
		$scope.activities = [];
		$scope.wantToCompare = false;
		$scope.compareActivities = false;
		$scope.orderProp = 'name';

		ActivitiesService.getActivitiesOfCurrentUser.query(function(activities) {
			activities.forEach(function(activity) {
				$scope.activities.push(activity);
			});
		});

		ActivitiesService.getActivitiesOfAllUsers.query(function(activities) {
			activities.forEach(function(activity) {
				if ((activity.sharedWith.indexOf(Authentication.user._id) > -1) && (activity.user._id !== Authentication.user._id)) {
					$scope.activities.push(activity);
				}
			});
		});

		$scope.toggleActivityToCompare = function(activity, wantToCompare) {
			if (wantToCompare) {
				if ($scope.activitiesToCompare.indexOf(activity) <= -1) {
					$scope.activitiesToCompare.push(activity);
				}
			} else {
				if ($scope.activitiesToCompare.indexOf(activity) > -1) {
					$scope.activitiesToCompare.splice($scope.activitiesToCompare.indexOf(activity), 1);
				}
			}
		};

		$scope.compare = function() {
			$state.go('activities.compare', {
				activityIds: $scope.activitiesToCompare
			});
		};

		$scope.setBodyImage = function() {
			bodyStyle.backgroundImage = "url('" + activitiesBackgroundPath + "basketball.jpg')";
		};
	}
]);
