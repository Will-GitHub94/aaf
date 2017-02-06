angular.module('activities').controller('ActivitiesViewController', ['$scope', '$state', '$window', 'Authentication',
	'activityResolve', '$modal', 'FriendsService',
	($scope, $state, $window, Authentication, activity, $modal, FriendsService) => {
		$scope.isMultiple = false;

		if (activity.length) {
			$scope.activities = activity;
			$scope.isMultiple = true;
		} else {
			$scope.activity = activity;
			if ($scope.activity.gpxData) {
				$scope.gpxData = $scope.activity.gpxData.data;
				$scope.activity.gpxData = $scope.activity.gpxData.filename;
			}
		}

		FriendsService.query(function (data) {
			$scope.friends = data;
		});

		$scope.authentication = Authentication;
		$scope.friendsToShareWith = [];
		$scope.form = {};

		let shareActivity = () => {
			let successCallback = (res) => {
				// TODO: Toast controller here
				$state.go('activities.view', {
					activityId: res._id
				});
			};

			let errorCallback = (res) => {
				$scope.error = res.data.message;
			};

			$scope.friendsToShareWith.forEach((friendToShareWith) => {
				$scope.activity.sharedWith.push(friendToShareWith._id);
			});
			$scope.activity.$update(successCallback, errorCallback);
		};

		$scope.openModal = () => {
			$modal.open({
				templateUrl: "templates/friend-modal.template.html",
				size: 'lg',
				scope: $scope,
				controller: ($modalInstance, $scope) => {
					$scope.toggleClicked = (friend, checked) => {
						if (checked) {
							if ($scope.friendsToShareWith.indexOf(friend) <= -1) {
								$scope.friendsToShareWith.push(friend);
							}
						} else {
							if ($scope.friendsToShareWith.indexOf(friend) > -1) {
								$scope.friendsToShareWith.splice($scope.friendsToShareWith.indexOf(friend), 1);
							}
						}
					};
					$scope.ok = () => {
						$modalInstance.close();
						shareActivity();
					};
					$scope.cancel = () => {
						$modalInstance.dismiss('cancel');
					};
				}
			});
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

		let parseXmlFromString = (stringToParse) => {
			return (new window.DOMParser()).parseFromString(stringToParse, "text/xml");
		};

		let loadGpxDataIntoMap = (theActivity, gpxData) => {
			let gpxDataXml = parseXmlFromString(gpxData),
				map = new google.maps.Map(document.getElementById(theActivity._id), {
					zoom: 8
				}),
				parser = new GPXParser(gpxDataXml, map);

			parser.setTrackColour("#ff0000");     // Set the track line colour
			parser.setTrackWidth(5);              // Set the track line width
			parser.setMinTrackPointDelta(0.001);  // Set the minimum distance between track points
			parser.centerAndZoom(gpxDataXml);
			let distanceCoveredOnTrack = parser.addTrackpointsToMap();         // Add the trackpoints
			parser.addWaypointsToMap();           // Add the waypoints
		};

		let determineIfMultipleActivities = () => {
			console.log($scope.isMultiple);
			console.log($scope.activities);

			if ($scope.isMultiple) {
				$scope.activities.forEach((theActivity) => {
					console.log(theActivity);
					loadGpxDataIntoMap(theActivity, theActivity.gpxData.data);
				});
			} else {
				loadGpxDataIntoMap($scope.activity, $scope.gpxData);
			}
		};

		angular.element(document).ready(() => {
			determineIfMultipleActivities();
		});
	}
])
;
