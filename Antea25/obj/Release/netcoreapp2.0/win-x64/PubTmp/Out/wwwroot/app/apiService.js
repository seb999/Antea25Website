myApp.factory('apiService', function ($http) {

    var apiService = {};

    apiService.getLocData = function (trackedObjectId, count) {
        return $http({
            url: "api/loc/GetGpsData/" + trackedObjectId + "/" + count,
            method: "GET",
        })
    };
    apiService.getHistoryData = function (trackedObjectId, start, end) {

        var s = new Date(start);
        var e = new Date(end);
        return $http({
            url: "api/loc/GetHistoryData",
            data: JSON.stringify({ "start": s, "end": e, "trackedObjectId": trackedObjectId}),
            method: "POST",
            contentType: 'application/json',
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' }
        })
    };
    
    apiService.getDeviceList = function (userId) {
        return $http({
            url: "api/myDevice/getDeviceList/" + userId,
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