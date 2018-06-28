myApp.factory('apiService', function ($http) {

    var apiService = {};

    apiService.getLocData = function (userId) {
        return $http({
            url: "api/loc/GetGpsData/" + null,
            method: "GET",
        })
    };

    apiService.getDeviceList = function (userId) {
        return $http({
            url: "api/myDevice/getDeviceList/" + null,
            method: "GET",
        })
    };

    apiService.saveDevice = function (device) {
        return $http({
            url: "api/myDevice/SaveDevice",
            method: "POST",
            data: JSON.stringify(device),
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' }
        })
    };

    return apiService;
});