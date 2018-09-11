

myApp.controller('locController', function ($scope, $log, $http, $window, $timeout, apiService) {

    $scope.map = new MapWrapper({ mapId: "map", center: [25.5, 44.5], zoom: 9, mapType: "STANDARD" });
    $scope.map.init();
    $scope.config = {};
    loadObjects();
    $scope.liveCounts = [1, 10, 20, 50, 100];
    $scope.liveCount = 10;
    $(function () {
        $('.history-datepicker').datetimepicker();

        $("#history-datepicker-from").on("dp.change", function () {

            $scope.historyStart = $("#history-datepicker-from input").val();

        });
        $("#history-datepicker-to").on("dp.change", function () {

            $scope.historyEnd = $("#history-datepicker-to input").val();

        });
    })


    $scope.stopLiveTracking = function () {
        clearInterval($scope.config.liveInterval);
        
        $scope.liveIsStopped = true;
    }

    $scope.startLiveTracking = function () {
        loadLiveData($scope.selectedObject.trackedObjectId, $scope.liveCount); 
        $scope.liveIsStopped = false;
    }

    $scope.liveTrackingChanged = function () {
        loadLiveData($scope.selectedObject.trackedObjectId, $scope.liveCount); 
    };
    $scope.liveTrackingToolClicked = function () {
        if ($scope.liveTrackingToolActive == true) 
            $scope.liveTrackingToolActive = false;
        else
            $scope.liveTrackingToolActive = true;
        
    };
    $scope.historyTrackingToolClicked = function () {
        if ($scope.historyTrackingToolActive == true)
            $scope.historyTrackingToolActive = false;
        else
            $scope.historyTrackingToolActive = true;

    };
    $scope.trackedObjectToolClicked = function () {
        if ($scope.trackedObjectToolActive == true)
            $scope.trackedObjectToolActive = false;
        else
            $scope.trackedObjectToolActive = true;
    };
    $scope.getHistoryRoute = function () {
        $scope.stopLiveTracking();
        loadHistoryData($scope.selectedObject.trackedObjectId, $scope.historyStart, $scope.historyEnd);
    }

    function loadObjects() {
        apiService.getObjects().then(function (response) {
            $scope.trackedObjects = response.data;
            if ($scope.trackedObjects.length) {
                console.log($scope.trackedObjects[0]);
                $scope.selectedObject = $scope.trackedObjects[0];
                $scope.config.liveInterval = setTimeout(function () { loadLiveData($scope.selectedObject.trackedObjectId, $scope.liveCount); }, 1000);
            }
        }, function (error) { $log.error(error.message); });
    }
    function loadLiveData(trackedObjectId, count) {
        $scope.liveLoading = true;
        clearInterval($scope.config.liveInterval);
        $scope.map.clearRoutes();
        apiService.getLocData(trackedObjectId, count).then(function (response) {              
            $scope.map.addRoute(response.data);
            setTimeout(function () { $scope.liveLoading = false; $scope.$apply();}, 1000);
            $scope.config.liveInterval = setTimeout(function () { loadLiveData(trackedObjectId, count); }, 15000);
        }, function (error) { $log.error(error.message); });
    };

    function loadHistoryData(trackedObjectId, start, end) {
        $scope.historyLoading = true;
        $scope.map.clearRoutes();
        apiService.getHistoryData(trackedObjectId, start, end).then(function (response) {
            $scope.map.addRoute(response.data);
            setTimeout(function () { $scope.historyLoading = false; $scope.$apply(); }, 1000);
        }, function (error) { $log.error(error.message); });
    }
    


});