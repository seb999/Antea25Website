﻿myApp.controller('locController', function ($scope, $log, $http, $window, $timeout, apiService) {
    $scope.loadData = loadData;
    $scope.showOnMap = showOnMap;
    $scope.removeOnMap = removeOnMap;
    $scope.selectedGpsList = [];
    
    $scope.loadData();

    function loadData() {
        apiService.getLocData().then(function (response) {  
            debugger;         
            $scope.gpsPositionList = response.data;
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

});