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

    apiService.saveDeviceList = function (userId) {
        return $http({
            url: "api/myDevice/saveDeviceList/" + null,
            method: "GET",
        })
    };

    return apiService;
});