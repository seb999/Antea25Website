myApp.factory('apiService', function ($http) {

    var apiService = {};

    apiService.getLocData = function (deviceId, count) {
        return $http({
            url: "api/loc/GetGpsData/" + deviceId + "/" + count,
            method: "GET",
        })
    };

    apiService.getHistoryData = function (deviceId, start, end) {

        var s = new Date(start);
        var e = new Date(end);
        return $http({
            url: "api/loc/GetHistoryData",
            data: JSON.stringify({ "Start": s, "End": e, "DeviceId": deviceId}),
            method: "POST",
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' }
        })
    };
    
    apiService.getDeviceList = function () {
        return $http({
            url: "api/myDevice/getDeviceList",
            method: "GET",
        })
    };

    apiService.getObjects  = function () {
        return $http({
            url: "api/objects/getObjectsList/" + null,
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