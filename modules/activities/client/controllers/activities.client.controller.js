(function () {
	'use strict';

	// Activities controller
	angular
		.module('activities')
		.controller('ActivitiesController', ActivitiesController);

	ActivitiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'activityResolve', '$modal', 'FriendsService', 'ActivitiesService', 'FileUploader', '$q'];

	function ActivitiesController($scope, $state, $window, Authentication, activity, $modal, FriendsService, ActivitiesService, FileUploader, $q) {
		var vm = this;

		if (activity.length) {
			vm.activities = [];
			activity.forEach(function(activity) {
				vm.activities.push(activity);
			});
		} else {
			vm.activity = activity;
		}

		FriendsService.query(function (data) {
			vm.friends = data;
			$scope.friends = data;
		});

		vm.authentication = Authentication;
		vm.friendsToShareWith = [];

		if ((vm.activity) && (vm.activity.gpxData)) {
			vm.gpxData = vm.activity.gpxData.data;
			vm.activity.gpxData = vm.activity.gpxData.filename;
		}
		vm.error = null;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
		vm.openModal = openModal;
		vm.loadGPXFileIntoGoogleMap = loadGPXFileIntoGoogleMap;
		vm.addComment = addComment;

		var uploader = vm.uploader = new FileUploader({
			url: 'api/activities/gpxData',
			alias: 'gpxData'
		});

		// Remove existing Activity
		function remove() {
			if ($window.confirm('Are you sure you want to delete?')) {
				vm.activity.$remove($state.go('activities.list'));
			}
		}

		function addComment(isValid) {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
				return false;
			}

			var singleComment = {
				user: Authentication.user,
				comment: vm.comment,
				added: Date.now()
			};
			vm.comment = "";

			vm.activity.comments.push(singleComment);
			vm.activity.$update(function(resp) {
				console.log(resp);
			}, function(err) {
				console.log(err);
			});
		}

		// Save Activity
		function save(isValid) {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
				return false;
			}

			uploader.queue[0].file.name = Date.now() + '-' + uploader.queue[0].file.name;
			vm.activity.gpxData = uploader.queue[0].file.name;
			uploader.uploadAll();

			vm.activity.comments = vm.comments;


			// TODO: move create/update logic to service
			if (vm.activity._id) {
				vm.activity.$update(successCallback, errorCallback);
			} else {
				vm.activity.$save(successCallback, errorCallback);
			}

			function successCallback(res) {
				$state.go('activities.view', {
					activityId: res._id
				});
			}

			function errorCallback(res) {
				vm.error = res.data.message;
			}
		}

		function loadGPXFileIntoGoogleMap() {
			var gpxDataXml = new DOMParser().parseFromString(vm.gpxData, 'text/xml'),
				map = new google.maps.Map(document.getElementById('map'), {
					zoom: 8
				}),
				parser = new GPXParser(gpxDataXml, map);

			parser.setTrackColour("#ff0000");     // Set the track line colour
			parser.setTrackWidth(5);              // Set the track line width
			parser.setMinTrackPointDelta(0.001);  // Set the minimum distance between track points
			parser.centerAndZoom(gpxDataXml);
			parser.addTrackpointsToMap();         // Add the trackpoints
			parser.addWaypointsToMap();           // Add the waypoints
		}

		function shareActivity() {
			vm.friendsToShareWith.forEach(function (friendToShareWith) {
				vm.activity.sharedWith.push(friendToShareWith._id);
			});
			vm.activity.$update(successCallback, errorCallback);

			function successCallback(res) {
				// TODO: Toast controller here
				$state.go('activities.view', {
					activityId: res._id
				});
			}

			function errorCallback(res) {
				vm.error = res.data.message;
			}
		}

		function openModal() {
			$modal.open({
				templateUrl: "templates/friend-modal.template.html",
				size: 'lg',
				scope: $scope,
				controller: function ($modalInstance, $scope) {
					$scope.toggleClicked = function (friend, checked) {
						if (checked) {
							if (vm.friendsToShareWith.indexOf(friend) <= -1) {
								vm.friendsToShareWith.push(friend);
							}
						} else {
							if (vm.friendsToShareWith.indexOf(friend) > -1) {
								vm.friendsToShareWith.splice(vm.friendsToShareWith.indexOf(friend), 1);
							}
						}
					};
					$scope.ok = function () {
						$modalInstance.close();
						shareActivity();
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				}
			});
		}
	}
}());
