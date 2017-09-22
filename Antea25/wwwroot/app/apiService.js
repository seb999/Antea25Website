myApp.factory('apiService', function ($http) {

    var apiService = {};

    apiService.getLocData = function (userId) {
        return $http({
            url: "api/loc/GetGpsData/" + null,
            method: "GET",
        })
    };

    return apiService;
});