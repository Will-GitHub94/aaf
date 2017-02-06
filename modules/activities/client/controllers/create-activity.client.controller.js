angular.module('activities').controller('ActivitiesCreateController', ['$scope', '$state', '$window', 'Authentication',
	'activityResolve', '$modal', 'ActivitiesService', 'FileUploader',
	($scope, $state, $window, Authentication, activity, $modal, ActivitiesService, FileUploader) =>{
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

		let uploader = $scope.uploader = new FileUploader({
			url: 'api/activities/gpxData',
			alias: 'gpxData'
		});

		$scope.setFileName = () => {
			let fr = new FileReader(),
				gpxFile = document.getElementById("gpxData").files[0],
				filename = gpxFile.name;

			fr.onload = function () {
				let gpxDataXml = parseXmlFromString(fr.result);

				setNameTypeDescription(gpxDataXml.documentElement);
				loadGpxDataIntoMap(gpxDataXml);
			};
			fr.readAsText(gpxFile);
			$scope.gpxFileName = filename;
		};

		$scope.save = (isValid) => {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
				return false;
			}

			uploader.queue[0].file.name = Date.now() + '-' + uploader.queue[0].file.name;
			$scope.activity.gpxData = uploader.queue[0].file.name;
			uploader.uploadAll();

			$scope.activity.comments = $scope.comments;

			let successCallback = (res) => {
				$state.go('activities.view', {
					activityId: res._id
				});
			};

			let errorCallback = (res) => {
				$scope.error = res.data.message;
			};
			$scope.activity.$save(successCallback, errorCallback);

		};

		let setNameTypeDescription = (gpxDataXmlDocumentElement) => {
			let activityType = getSingleTagData(gpxDataXmlDocumentElement, "type");

			$scope.activity.name = getSingleTagData(gpxDataXmlDocumentElement, "name");
			$scope.activity.description = getSingleTagData(gpxDataXmlDocumentElement, "descr");

			$scope.activityTypes.forEach((type) => {
				if (type.name.toLowerCase() === activityType.toLowerCase()) {
					$scope.activityType = type;
					$scope.activity.type = type.name;
				}
			});
		};

		let getSingleTagData = (gpxDataDocumentElement, tagToGet) => {
			let tag = gpxDataDocumentElement
				.getElementsByTagName("trk")[0]
				.getElementsByTagName(tagToGet)[0];

			if (tag) {
				return tag.childNodes[0].nodeValue;
			}
			return "N/A";
		};

		let parseXmlFromString = (stringToParse) => {
			return (new window.DOMParser()).parseFromString(stringToParse, "text/xml");
		};

		let loadGpxDataIntoMap = (gpxDataXml) => {
			if (document.getElementById("map")) {
				let map = new google.maps.Map(document.getElementById("map"), {
						zoom: 8
					}),
					parser = new GPXParser(gpxDataXml, map);

				console.log(gpxDataXml);

				parser.setTrackColour("#ff0000");     // Set the track line colour
				parser.setTrackWidth(5);              // Set the track line width
				parser.setMinTrackPointDelta(0.001);  // Set the minimum distance between track points
				parser.centerAndZoom(gpxDataXml);
				let distanceCoveredOnTrack = parser.addTrackpointsToMap();         // Add the trackpoints
				parser.addWaypointsToMap();           // Add the waypoints
			}
		}
	}
]);
