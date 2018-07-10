myApp.controller('locController', function ($scope, $log, $http, $window, $timeout, apiService) {
    
    $scope.loadData = loadData;
    $scope.showOnMap = showOnMap;
    $scope.removeOnMap = removeOnMap;
    $scope.loadDeviceList = loadDeviceList;
    $scope.selectedGpsList = [];
    $scope.filterTable = filterTable;
    $scope.f = {};
    
    $scope.loadData();
    $scope.loadDeviceList();

    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
    $scope.itemsPerPage = 20;

    function loadDeviceList() {
        apiService.getDeviceList().then(function (response) {           
            $scope.deviceList = response.data;
        }, function (error) { $log.error(error.message); });
    };

    function loadData() {
        apiService.getLocData().then(function (response) {     
            $scope.gpsPositionInitialList = response.data;
            $scope.gpsPositionList = response.data.slice(0, 20);
            $scope.bigTotalItems = response.data.length;

            $scope.gpsPositionList[0].clicked = true;
            for (i = 1; i < $scope.gpsPositionList.length; i++) {
                $scope.gpsPositionList[i].clicked = false;
            }

            $scope.selectedGpsList.push($scope.gpsPositionList[0]);
             $scope.reloadMap = 123;
            //$scope.gpsPositionSelection = response.data;
        }, function (error) { $log.error(error.message); });
    };

    function showOnMap(index) {
        $scope.gpsPositionList[index].clicked = true;
        $scope.selectedGpsList.push($scope.gpsPositionList[index]);
        $scope.reloadMap = $scope.gpsPositionList[index].gpsPositionLongitude + $scope.gpsPositionList[index].gpsPositionLatitude;
    }

    function removeOnMap(buttonIndex,item) {
        $scope.gpsPositionList[buttonIndex].clicked = false;
        var index = $scope.selectedGpsList.indexOf(item);
        $scope.selectedGpsList.splice(index, 1);
        //$scope.selectedGpsList.push($scope.gpsPositionList[index]);
        $scope.reloadMap = $scope.selectedGpsList.length;
    }

    function filterTable () {
        $scope.loaderVisibility = true;

        if ($scope.selectedDevice !== "") {
            debugger;
            $scope.gpsPositionList = $scope.gpsPositionInitialList.filter(f=>f.deviceId === $scope.selectedDevice.deviceId)
            $scope.f.deviceId = $scope.selectedDevice.deviceId;
        }

        $scope.loaderVisibility = false;
    }

    $scope.pagination = function(){
        debugger;
        if($scope.selectedDevice ===undefined){
            $scope.gpsPositionList = $scope.gpsPositionInitialList.slice($scope.bigCurrentPage*20 - 20, $scope.bigCurrentPage*20);
        }
        $scope.gpsPositionList = $scope.gpsPositionInitialList.filter(f=>f.deviceId === $scope.selectedDevice.deviceId).slice($scope.bigCurrentPage*20 - 20, $scope.bigCurrentPage*20);
    }
});