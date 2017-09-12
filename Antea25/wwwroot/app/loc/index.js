myApp.controller('locController', function ($scope, $log, $http, $window, $timeout, apiService) {
    $scope.loadData = loadData;
    $scope.showOnMap = showOnMap;
    
    $scope.displayPosition = {
        gpsPositionLatitude : "48.8566",
        gpsPositionLongitude : "2.35222"
    };

    $scope.loadData();

    function loadData() {
        apiService.getLocData().then(function (response) {           
            $scope.gpsPositionList = response.data;
        }, function (error) { $log.error(error.message); });
    };

    function showOnMap(index) {
        $scope.displayPosition = $scope.gpsPositionList[index];
        $scope.reloadMap = $scope.gpsPositionList[index].gpsPositionLongitude + $scope.gpsPositionList[index].gpsPositionLatitude;
    }

});