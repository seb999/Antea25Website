myApp.controller('myDeviceController', function ($scope, $log, $http, $window, $timeout, apiService) {

    $scope.isAddMode = false;
    $scope.isSaved = true;

    $scope.loadDeviceList = loadDeviceList;
    $scope.addNewDevice = addNewDevice;
    $scope.saveNewDevice = saveNewDevice;
    
    $scope.loadDeviceList();

    function loadDeviceList() {
        apiService.getDeviceList().then(function (response) {           
            $scope.deviceList = response.data;
        }, function (error) { $log.error(error.message); });
    };

    function addNewDevice() {
        $scope.isAddMode = true;
        var newDevice = { "deviceId": $scope.deviceList[$scope.deviceList.length - 1].deviceId + 1, "EUI": "", "Description": "Add description here", "dateAdded": new Date(), "isAddMode" : true}
        $scope.deviceList.push(newDevice);
    };

    function saveNewDevice() {
        apiService.saveDeviceList($scope.deviceList).then(function (response) {
            $scope.isSaved = false;
            $scope.isAddMode = false;
            loadDeviceList();
            $timeout(function () {
                $scope.isSaved = true;
                $scope.deviceList[$scope.deviceList.length - 1].isAddMode = false;
               // $window.location.href = '/Activity/';
            }, 5000);
        }, function (error) { $log.error(error.message); });
    };
});