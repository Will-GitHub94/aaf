"use strict";

angular.module('activities').controller('ActivitiesCreateController', ['$scope', '$state', '$window', 'Authentication',
	'activityResolve', '$modal', 'ActivitiesService', 'FileUploader', '$timeout',
	function($scope, $state, $window, Authentication, activity, $modal, ActivitiesService, FileUploader, $timeout) {
		var bodyStyle = document.getElementById("body").style,
			activitiesBackgroundPath = "/modules/activities/client/img/backgrounds/";

		$scope.activity = activity;
		$scope.activity.name = "N/A";
		$scope.activity.type = "N/A";
		$scope.activity.description = "N/A";

		$scope.authentication = Authentication;

		$scope.isMultiple = false;
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

		var uploader = $scope.uploader = new FileUploader({
			url: 'api/activities/gpxData',
			alias: 'gpxData'
		});

		$scope.setFileName = function() {
			var fr = new FileReader(),
				gpxFile = document.getElementById("gpxData").files[0],
				filename = gpxFile.name;

			fr.onload = function() {
				var gpxDataXml = parseXmlFromString(fr.result);

				// Needed to update model
				$timeout(function() {
					setNameTypeDescription(gpxDataXml.documentElement);
					loadGpxDataIntoMap(gpxDataXml);
				}, 1);
			};
			fr.readAsText(gpxFile);
			$scope.gpxFileName = filename;
		};

		$scope.setBodyImage = function() {
			bodyStyle.backgroundImage = "url('" + activitiesBackgroundPath + "climbing.jpg')";
		};

		$scope.save = function(isValid) {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
				return false;
			}

			uploader.queue[0].file.name = Date.now() + '-' + uploader.queue[0].file.name;
			$scope.activity.gpxData = uploader.queue[0].file.name;
			uploader.uploadAll();

			$scope.activity.comments = $scope.comments;

			var successCallback = function(res) {
				$state.go('activities.view', {
					activityId: res._id
				});
			};

			var errorCallback = function(res) {
				$scope.error = res.data.message;
			};
			$scope.activity.$save(successCallback, errorCallback);

		};

		var setNameTypeDescription = function(gpxDataXmlDocumentElement) {
			var activityType = getSingleTagData(gpxDataXmlDocumentElement, "type");

			$scope.activity.name = getSingleTagData(gpxDataXmlDocumentElement, "name");
			$scope.activity.description = getSingleTagData(gpxDataXmlDocumentElement, "descr");

			$scope.activityTypes.forEach(function(type) {
				if (type.name.toLowerCase() === activityType.toLowerCase()) {
					$scope.activityType = type;
					$scope.activity.type = type.name;
				}
			});
		};

		var getSingleTagData = function(gpxDataDocumentElement, tagToGet) {
			var tag = gpxDataDocumentElement
				.getElementsByTagName("trk")[0]
				.getElementsByTagName(tagToGet)[0];

			if (tag) {
				return tag.childNodes[0].nodeValue;
			}
			return "N/A";
		};

		var parseXmlFromString = function(stringToParse) {
			return (new window.DOMParser()).parseFromString(stringToParse, "text/xml");
		};

		var loadGpxDataIntoMap = function(gpxDataXml) {
			if (document.getElementById("map")) {
				var map = new google.maps.Map(document.getElementById("map"), {
						zoom: 8
					}),
					parser = new GPXParser(gpxDataXml, map);

				parser.setTrackColour("#ff0000");     // Set the track line colour
				parser.setTrackWidth(5);              // Set the track line width
				parser.setMinTrackPointDelta(0.001);  // Set the minimum distance between track points
				parser.centerAndZoom(gpxDataXml);
				var distanceCoveredOnTrack = parser.addTrackpointsToMap();         // Add the trackpoints
				parser.addWaypointsToMap();           // Add the waypoints
			}
		};
	}
]);
