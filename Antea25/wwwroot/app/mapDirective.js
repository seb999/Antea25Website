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
            time: '@',
        },
        link:  function (scope, element, attrs) {
            var map, infoWindow;
            var markers = [];

            // marker
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

            // init the map
            function initMap() {
                var mapOptions = {
                    center: new google.maps.LatLng(scope.latitude, scope.longitude),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scrollwheel: false
                };

                map = new google.maps.Map(element[0], mapOptions);
                //if (map === void 0) {
                //    map = new google.maps.Map(element[0], mapOptions);
                //}
                setMarker(map, new google.maps.LatLng(scope.latitude, scope.longitude), 'info', scope.time.concat(" your bike is here"));
            }

          

            // show the map and place some markers
            
            initMap();

            scope.$watch("reload", function () {
                initMap();
                
            });

        }
    };
});
