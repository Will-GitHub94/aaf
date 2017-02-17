"use strict";

angular.module('activities').controller('ActivitiesViewController', ['$scope', '$state', '$window', 'Authentication',
	'activityResolve', '$modal', 'FriendsService',
	function($scope, $state, $window, Authentication, activity, $modal, FriendsService) {
		var bodyStyle = document.getElementById("body").style,
			activitiesBackgroundPath = "/modules/activities/client/img/backgrounds/";

		$scope.isMultiple = false;
		$scope.friends = [];

		if (activity.length) {
			$scope.distanceCovered = [];
			$scope.activities = activity;
			$scope.isMultiple = true;
		} else {
			$scope.activity = activity;

			if ($scope.activity.gpxData) {
				$scope.gpxData = $scope.activity.gpxData.data;
				$scope.activity.gpxData = $scope.activity.gpxData.filename;
			}
		}

		FriendsService.getFriendsOfCurrentUser.query(function(data) {
			data.forEach(function(friend) {
				friend.isSharedWith = ($scope.activity.sharedWith.indexOf(friend.friend._id) > -1);
				$scope.friends.push(friend);
			});
		});

		$scope.authentication = Authentication;
		$scope.friendsToShareWith = [];
		$scope.form = {};

		var shareActivity = function() {
			var successCallback = function(res) {
				// TODO: Toast controller here
				$state.go('activities.view', {
					activityId: res._id
				});
			};

			var errorCallback = function(res) {
				$scope.error = res.data.message;
			};
			$scope.activity.$update(successCallback, errorCallback);
		};

		$scope.openModal = function() {
			$modal.open({
				template:   "<div class='modal-header'>" +
								"<h3 class='modal-title' id='modal-title'>Friends</h3>" +
							"</div>" +
							"<div class='modal-body list-group col-lg-12 col-md-12' id='modal-body' ng-repeat='friend in friends'>" +
								"<input ng-click='toggleClicked(friend.friend._id, friend.isSharedWith)' ng-model='friend.isSharedWith' " +
										"ng-checked='friend.isSharedWith' class='pull-right' type='checkbox'>" +
								"<div class='col-lg-1 col-md-1 pull-left noPadLeft'>" +
									"<img class='friend-user-profile-picture' " +
										"ng-src='{{ friend.friend.profileImageURL }}' alt='{{ friend.friend.displayName }}'>" +
								"</div>" +
								"<div class='col-lg-9 col-md-9 pull-left noPadRight'>" +
									"<small>" +
										"<em class='text-muted'>" +
											"Friends since " +
											"<span ng-bind=\"friend.added | date:'mediumDate'\"></span>" +
										"</em>" +
									"</small>" +
									"<h4 class='list-group-item-heading' ng-bind='friend.friend.displayName'></h4>" +
									"<small class='list-group-item-text' ng-bind='friend.friend.username'></small>" +
									"<p class='list-group-item-text' ng-bind='friend.friend.email'></p>" +
								"</div>" +
							"</div>" +
							"<div class='modal-footer'>" +
								"<button class='btn btn-primary' type='button' ng-click='ok()'>Share</button>" +
								"<button class='btn btn-warning' type='button' ng-click='cancel()'>Cancel</button>" +
							"</div>",
				size: 'lg',
				scope: $scope,
				controller: function($modalInstance, $scope) {
					$scope.toggleClicked = function(friendID, checked) {
						if (checked) {
							if ($scope.activity.sharedWith.indexOf(friendID) <= -1) {
								$scope.activity.sharedWith.push(friendID);
							}
						} else {
							if ($scope.activity.sharedWith.indexOf(friendID) > -1) {
								$scope.activity.sharedWith.splice($scope.activity.sharedWith.indexOf(friendID), 1);
							}
						}
					};
					$scope.ok = function() {
						$modalInstance.close();
						shareActivity();
					};
					$scope.cancel = function() {
						$modalInstance.dismiss('cancel');
					};
				}
			});
		};

		$scope.deleteComment = function(comment) {
			if ($window.confirm('Are you sure you want to delete this comment?')) {
				$scope.activity.comments.splice(activity.comments.indexOf(comment), 1);
			}
		};

		$scope.deleteActivity = function() {
			if ($window.confirm('Are you sure you want to delete this activity?')) {
				$scope.activity.$remove($state.go('activities.list'));
			}
		};

		$scope.setBodyImage = function() {
			bodyStyle.backgroundImage = "url('" + activitiesBackgroundPath + "football.jpg')";
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

		var parseXmlFromString = function(stringToParse) {
			return (new window.DOMParser()).parseFromString(stringToParse, "text/xml");
		};

		var loadGpxDataIntoMap = function(theActivity, gpxData) {
			var gpxDataXml = parseXmlFromString(gpxData),
				map = new google.maps.Map(document.getElementById(theActivity._id), {
					zoom: 8
				}),
				parser = new GPXParser(gpxDataXml, map);

			parser.setTrackColour("#ff0000");
			parser.setTrackWidth(5);
			parser.setMinTrackPointDelta(0.001);
			parser.centerAndZoom(gpxDataXml);

			if ($scope.isMultiple) {
				$scope.distanceCovered.push({
					id: theActivity._id,
					dist: parser.addTrackpointsToMap()
				});
			} else {
				$scope.distanceCovered = parseFloat(parser.addTrackpointsToMap()).toFixed(2);
			}
			parser.addWaypointsToMap();
		};

		var determineIfMultipleActivities = function() {
			if ($scope.isMultiple) {
				$scope.activities.forEach(function(theActivity) {
					loadGpxDataIntoMap(theActivity, theActivity.gpxData.data);
				});
			} else {
				loadGpxDataIntoMap($scope.activity, $scope.gpxData);
			}
		};

		angular.element(document).ready(function() {
			determineIfMultipleActivities();
		});
	}
]);
