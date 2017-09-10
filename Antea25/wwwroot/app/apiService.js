myApp.factory('apiService', function ($http) {

    var apiService = {};

    apiService.getLocData = function () {
        return $http({
            url: "api/loc/GetGpsData",
            method: "GET",
        })
    };

    return apiService;
});