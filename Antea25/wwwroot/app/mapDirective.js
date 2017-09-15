myApp.directive('myMap', function () {
    // directive link function
    return {
        restrict: 'E',
        template: '<div id="gmaps"></div>',
        replace: true,
        scope: {
            longitude: '=',
            latitude: '=',
            reload: '=',
            gpslist: '=',
            time: '@',
        },
        link:  function (scope, element, attrs) {
            var map, infoWindow;
            var markers = [];
            var waypts = [];
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            // init the map
            function initMap() {
                var mapOptions = {
                    //center: new google.maps.LatLng(scope.latitude, scope.longitude),
                    center: new google.maps.LatLng(scope.gpslist[0].gpsPositionLatitude, scope.gpslist[0].gpsPositionLongitude),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scrollwheel: true
                };

                map = new google.maps.Map(element[0], mapOptions);
                directionsDisplay.setMap(map);

               //We add market and way points
                for (i = 0; i < scope.gpslist.length; i++) {
                    setMarker(map, new google.maps.LatLng(scope.gpslist[i].gpsPositionLatitude, scope.gpslist[i].gpsPositionLongitude), 'info', scope.time.concat(" your bike was here"));

                    if (i > 0 && i < scope.gpslist.length) {
                        console.log("add ways points");
                        waypts.push({
                            location: new google.maps.LatLng(scope.gpslist[i].gpsPositionLatitude, scope.gpslist[i].gpsPositionLongitude),
                            stopover: true,
                        });
                    } 
                }

                //we show the route
                calcRoute(scope.gpslist[0], scope.gpslist[scope.gpslist.length - 1]);
                
            }

            //|Add routes
            function calcRoute(start, end) {
                var start = new google.maps.LatLng(start.gpsPositionLatitude, start.gpsPositionLongitude);
                var end = new google.maps.LatLng(end.gpsPositionLatitude, end.gpsPositionLongitude);
                var request = {
                    origin: start,
                    destination: end,
                    waypoints: waypts,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap(map);
                    } else {
                        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                    }
                });
            }

            //add markers
            function setMarker(map, position, title, content) {
                var marker;
                var markerOptions = {
                    position: position,
                    animation: google.maps.Animation.DROP,
                    map: map,
                    title: title,
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

            //Show the map when data loaded
            scope.$watch("reload", function () {   
                if (scope.gpslist.length>0) {
                    initMap();
                    waypts = [];
                    markers = [];
                }
            });

        }
    };
});
