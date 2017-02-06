angular.module('activities').controller('ActivitiesListController', ['$scope', 'ActivitiesService', 'Authentication', '$state',
	($scope, ActivitiesService, Authentication, $state) => {
		$scope.activitiesToCompare = [];
		$scope.activities = [];
		$scope.wantToCompare = false;
		$scope.compareActivities = false;
		$scope.orderProp = 'name';

		ActivitiesService.getActivitiesOfCurrentUser.query((activities) => {
			activities.forEach((activity) => {
				$scope.activities.push(activity);
			});
		});

		ActivitiesService.getActivitiesOfAllUsers.query((activities) => {
			activities.forEach((activity) => {
				if ((activity.sharedWith.indexOf(Authentication.user._id) > -1) && (activity.user._id !== Authentication.user._id)) {
					$scope.activities.push(activity);
				}
			});
		});

		$scope.toggleActivityToCompare = (activity, wantToCompare) => {
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

		$scope.compare = () => {
			$state.go('activities.compare', {
				activityIds: $scope.activitiesToCompare
			});
		};
	}
])
;
