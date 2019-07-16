/*  Map Control */
var MapWrapper = function (config) {
    this.config = config;
    this.map = null;
    this.layerVectors = null;
    this.layerZones = null;
    this.layerMarkers = null;
    this.layerInfo = null;
    this.tilesLayer = null;
    this.labels = [];
    this.mapType = config.mapType;

};

MapWrapper.prototype = function (jQuery, ol) {
    var defaultSettings = {
        center: [0, 0],
        zoom: 2
    };

    /* public functions */
    var init = function () {

        var thisWrapper = this;

        this.tilesLayer = new ol.layer.Tile({
            source: new ol.source.OSM({ url: getTilesUrl(this.mapType) })
        });

        this.map = new ol.Map({
            layers: [
                this.tilesLayer
            ],
            target: this.config.mapId,
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            view: new ol.View({
                center: ol.proj.transform(getSettingValue("center", this), 'EPSG:4326', 'EPSG:3857'),
                zoom: getSettingValue("zoom", this)
            })
        });

        this.layerZones = new ol.layer.Vector();
        var zonesSource = new ol.source.Vector();
        this.layerZones.setSource(zonesSource);
        this.map.addLayer(this.layerZones);

        this.layerVectors = new ol.layer.Vector();
        var vectorSource = new ol.source.Vector();
        this.layerVectors.setSource(vectorSource);
        this.map.addLayer(this.layerVectors);

        this.layerMarkers = new ol.layer.Vector();
        var markerSource = new ol.source.Vector();
        this.layerMarkers.setSource(markerSource);
        this.map.addLayer(this.layerMarkers);

        this.layerInfo = new ol.layer.Vector();
        var layerSource = new ol.source.Vector();
        this.layerInfo.setSource(layerSource);
        this.map.addLayer(this.layerInfo);


        window.addEventListener('mapTypeChanged', function (e) {
           
            thisWrapper.mapType = e.detail;
            thisWrapper.tilesLayer.getSource().setUrl(getTilesUrl(thisWrapper.mapType));
            thisWrapper.tilesLayer.getSource().setAttributions(getTilesAttributions(thisWrapper.mapType));
            thisWrapper.tilesLayer.getSource().changed();
        });

        this.map.getView().on('propertychange', function (e) {
            switch (e.key) {
                case 'resolution':
                    if (e.oldValue > 1.5) {
                        thisWrapper.layerInfo.setVisible(false);
                    } else {
                        thisWrapper.layerInfo.setVisible(true);
                    }
                    break;
            }
        });
        var popupContainer = document.createElement('div');


        popupContainer.setAttribute("id", 'map-popup');
        var maparea = document.getElementById(this.config.mapId);
        maparea.appendChild(popupContainer);


        var element = document.getElementById('map-popup');

        this.popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false
        });

        this.map.addOverlay(this.popup);
        var thisWrapper = this;
        // display popup on click
        this.map.on('pointermove', function (evt) {
            var feature = this.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    return feature;
                });

     
           
            if (feature && feature.get('tooltip') && $("#map-popup").html() != feature.get('tooltip')) {
                var geometry = feature.getGeometry();
                var coord = geometry.getCoordinates();
                thisWrapper.popup.setPosition(coord);
                $("#map-popup").html(feature.get('tooltip'));
         

            } else if ($("#map-popup").html() != "" ) {
                $("#map-popup").html("");
                thisWrapper.popup.setPosition(0,0);
            }
        });
    };

    var refreshTiles = function () {
        var map = this.map;
        setTimeout(function () { map.updateSize(); }, 200);
    };

    var clearRoutes = function(){
        this.layerMarkers.getSource().clear();
        this.layerVectors.getSource().clear();
    }

    var addRoute = function (coordinates, color, live) {
        var coord = [];

        var lastPoint = null;
        for (var i in coordinates) {
            var currentPoint = coordinates[i];
            var roundHeading = currentPoint.GpsPositionHeading;

            coord.push([currentPoint.gpsPositionLongitude, currentPoint.gpsPositionLatitude]);

            if (lastPoint) {
                var heading = currentPoint.GpsPositionHeading;
                if (currentPoint.gpsPositionLongitude == lastPoint.gpsPositionLongitude) {
                    if (currentPoint.gpsPositionLatitude > lastPoint.gpsPositionLatitude) heading = 0;
                    if (currentPoint.gpsPositionLatitude < lastPoint.gpsPositionLatitude) heading = 180;
                }
                if (currentPoint.gpsPositionLatitude == lastPoint.gpsPositionLatitude) {
                    if (currentPoint.gpsPositionLongitude > lastPoint.gpsPositionLongitude) heading = 90;
                    if (currentPoint.gpsPositionLongitude < lastPoint.gpsPositionLongitude) heading = 270;
                }
                if (currentPoint.gpsPositionLatitude != lastPoint.gpsPositionLatitude && currentPoint.gpsPositionLongitude != lastPoint.gpsPositionLongitude) {
                    if (currentPoint.gpsPositionLatitude > lastPoint.gpsPositionLatitude) {
                        heading = (Math.atan((currentPoint.gpsPositionLongitude - lastPoint.gpsPositionLongitude) / (currentPoint.gpsPositionLatitude - lastPoint.gpsPositionLatitude)) * 180 / Math.PI);
                    }
                    if (currentPoint.gpsPositionLatitude < lastPoint.gpsPositionLatitude) {
                        heading = 180 + (Math.atan((currentPoint.gpsPositionLongitude - lastPoint.gpsPositionLongitude) / (currentPoint.gpsPositionLatitude - lastPoint.gpsPositionLatitude)) * 180 / Math.PI);
                    }
                }

                var roundHeading = Math.round(heading);
                roundHeading = (roundHeading < 0) ? (360 + roundHeading) : roundHeading;

                roundHeading = roundHeading * Math.PI / 180;
            }
            if (i == 0) {
                addIcon.call(this, currentPoint.gpsPositionLongitude, currentPoint.gpsPositionLatitude, "/images/point.png", "", "<b>Start position</b><br /><span><b>Date:</b> " + moment(currentPoint.gpsPositionDate).format('MMMM Do YYYY, h:mm:ss a') + "</span><br /><span><b>Speed:</b> " + currentPoint.gpsPositionSpeed + "</span>" , 0);

            }
            else if (i == coordinates.length - 1) {
                addIcon.call(this, currentPoint.gpsPositionLongitude, currentPoint.gpsPositionLatitude, "/images/bike.png", "", "<b>Final position</b><br /><span><b>Date:</b> " + moment(currentPoint.gpsPositionDate).format('MMMM Do YYYY, h:mm:ss a') + "</span><br /><span><b>Speed:</b> " + currentPoint.gpsPositionSpeed + "</span>", 0);
            }
            else {
                addIcon.call(this, currentPoint.gpsPositionLongitude, currentPoint.gpsPositionLatitude, "/images/arrow-point.png", "", "<span><b>Date:</b> " + moment(currentPoint.gpsPositionDate).format('MMMM Do YYYY, h:mm:ss a') + "</span><br /><span><b>Speed:</b> " + currentPoint.gpsPositionSpeed + "</span>", roundHeading);

            }
           lastPoint = currentPoint;
        }

        var feature = addLine.call(this, coord, "#CC0000CC", 4);

        this.map.getView().fit(feature.getGeometry().getExtent(), this.map.getSize());
    };

    var setCenter = function (longitude, latitude) {
        var myView = new ol.View({
            center: ol.proj.transform([longitude, latitude], "EPSG:4326", "EPSG:3857"), zoom: 17
        });
        this.map.setView(myView);
    }
    
   /* private functions */

    var addIcon = function (longitude, latitude, iconUrl, text, tooltip, rotation) {
        var point = new ol.geom.Point([longitude, latitude]);
  
        point.transform('EPSG:4326', 'EPSG:3857');
        var iconFeature = null;
        if (tooltip) {
            iconFeature = new ol.Feature({
                geometry: point,
                tooltip: tooltip
            });
        } else {
            iconFeature = new ol.Feature({
                geometry: point
            });
        }
        

        var iconStyle = [];

        if (text) {
            iconStyle.push(
                new ol.style.Style({
                    text: new ol.style.Text({
                        text: text,
                        offsetY: +25,
                        font: "13px sans-serif",
                        fill: new ol.style.Fill({
                            color: '#000'
                        })
                    })

                }));
        }

        iconStyle.push(
            new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                    opacity: 1,
                    src: iconUrl,
                    rotation: rotation ? rotation : 0
                }))
            })
        );

        iconFeature.setStyle(iconStyle);
        iconFeature.id = createGuid();
        this.layerMarkers.getSource().addFeature(iconFeature);
        return iconFeature.id;       
    };

    var addLine = function (coord, color, width) {

        // create linestring
        var line = new ol.geom.LineString(coord);
        line.transform('EPSG:4326', 'EPSG:3857');

        // create feature 
        var feature = new ol.Feature(line);
        feature.id = createGuid();
        setStyle(feature, color, width);
        this.layerVectors.getSource().addFeature(feature);
     
        return feature;
    };

    var setStyle = function (feature, color, width) {
        if (!width)
            width = 1;


        var opacity = parseInt(color.substring(7), 16);
            
        color = color.substring(0, 7);
        var colorArray = ol.color.asArray(color);
        colorArray[3] = opacity / 255;

        // create feature style
        var style = new ol.style.Style({
            fill: new ol.style.Fill({ color: colorArray }),
            stroke: new ol.style.Stroke({ color: width > 1 ? colorArray : "#000000", width: width })
        });

        feature.setStyle(style);
    };

    var getTilesUrl = function (type) {
        switch (type.toUpperCase()) {
            case "SATELLITE":
                return "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            default:
                return "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png";
        }
    };

    var getTilesAttributions = function (type) {
        switch (type.toUpperCase()) {
            case "SATELLITE":
                return "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
            default:
                return "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>";
        }
    };

    /* helper functions */
    var removeFromArray = function (array, key, value) {
        for (var i in array) {
            if (array[i][key] == value) {
                array.splice(i, 1);
            }
        }
    };



    var getSettingValue = function (name, currentObject) {

        if (currentObject.config[name])
            return currentObject.config[name];
        else
            return defaultSettings[name];
    };

    //generate a guid data
    var createGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /* Map Wrapper interface */
    return {
        init: init,
        refreshTiles: refreshTiles,
        addRoute: addRoute,
        setCenter: setCenter,
        clearRoutes: clearRoutes
    };

}(jQuery, ol);