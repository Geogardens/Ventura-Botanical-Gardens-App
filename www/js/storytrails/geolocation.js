// This work for hire application was developed as a collaborative effort for the benefit of all parks and gardens. Copyright 2015 Michele Dunham.

// Nathan Strout, Developer and Director of Spatial Technology, University of Redlands. 

// Released under the GNU General Public License.  View full license text in the LICENSE.TXT file at the ROOT of
// this GitHub repository.  View the short license text and DISCLAIMER in the README.TXT file located at the
// ROOT of this GitHub repository.

//window.plugin.backgroundMode.enable();
var mapLocation; //esri point in web mercator
var currentLocation; //geolocation from navigator api in wgs84
var watchID;
var locCheckDelay = 5
var locCheckDelayCounter = 0;
var radiusInterval = 10;
var geofenceInterval = 5;
var radius;
var lastAccuracyCheck = new Date();
var accuracyRadiusListener;
var geofenceListener;
var mapWatchId;
var geofenceWatchId;

function startGeolocation() {
    var geo_options = {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 5000
    };
    if (navigator.geolocation) {
        mapWatchId = navigator.geolocation.watchPosition(watchLocation, locationError, geo_options);
    }

}
function stopGeolocation() {
    navigator.geolocation.clearWatch(mapWatchId);
    clearInterval(accuracyRadiusListener);
}
function startGeofencing() {

    var geo_options = {
        enableHighAccuracy: true

    };
    if (device.platform != "Android") {
        window.plugin.backgroundMode.enable();
    }
    geofenceWatchId = navigator.geolocation.watchPosition(geofenceCheck, null, geo_options);
}
function stopGeofencing() {
    navigator.geolocation.clearWatch(geofenceWatchId);
    appProfile.geofenceSwipeAway = false;
    if (device.platform != "Android") {
        window.plugin.backgroundMode.disable();
    }
}
function doGeofence() {
    var geo_options = {
        enableHighAccuracy: true

    };
    navigator.geolocation.getCurrentPosition(geofenceCheck, locationError, geo_options);
}
function geofenceCheck(position) {
    try {

        if (typeof (position) != "undefined" && position != null && appProfile.currentTour != null && typeof (appProfile.currentTour) != "undefined" && appProfile.guidedTourOn == true) {
            if (position.coords.accuracy > (appData.geofenceDistance + 10) / 3.28084) {
                $(".LowGpsWarning").show();
                return false;
            }
            $(".LowGpsWarning").hide();
            appProfile.lastGeofenceTime = new Date();
            appProfile.lastGeofenceLocation = position;
            localStorage.appProfile = JSON.stringify(appProfile);
            mapLocation = esri.geometry.geographicToWebMercator(new esri.geometry.Point(position.coords.longitude, position.coords.latitude));
            //First check that we're within a mile of a stop. If not, let's cancel the tour
            var stopInOneMile = getStopInDistance(mapLocation, appProfile.currentTour.stops, 5280);

            if (typeof (stopInOneMile) == "undefined" || stopInOneMile == null) {
                if (inForeground == true) {
                    $.UIPopup({
                        selector: "#" + currentArticle,
                        id: "cancelGeocode",
                        title: 'Guided Tour Ended',
                        message: 'We have ended your guided tour to conserve battery life because you are more than a mile away from any tour stops.',
                        cancelButton: 'Got it'
                    });
                }
                else {
                    window.plugin.notification.local.add({ id: 1, title: "Guided Tour Alert", message: "Tour ended. You are farther than 1 mile away.", autoCancel: true });
                }
                $(".GuidedTourButton").removeClass("tourOn");
                $(".tourStatus").text("Guided Tour OFF");
                $(".tourBtn").attr("src", "images/Buttons/stopTour.png");
                appProfile.guidedTourOn = false;
                stopGeofencing();
                return false;
            }

            //Check that we're within the geofenceDistance. If so, go to the stop page and alert the user.
            var stopInDistance = getStopInDistance(mapLocation, appProfile.currentTour.stops, appData.geofenceDistance);
            if (typeof (stopInDistance) != "undefined" && stopInDistance != null) {
                //if the user has swiped away from a stop, 
                if (stopInDistance.orderId == appProfile.lastGeofenceStopId && appProfile.geofenceSwipeAway == true) {
                    return false;
                }
                if (appProfile.currentStop == null || appProfile.currentStop.orderId != stopInDistance.orderId) {
                    goToStop(appProfile.currentTour.tag, stopInDistance.orderId);
                    appProfile.currentStop = stopInDistance;
                    appProfile.lastGeofenceStopId = stopInDistance.orderId;
                    appProfile.geofenceSwipeAway = false;
                    if (inForeground == true) {
                        setTimeout(function () { navigator.notification.beep(1); }, 1);
                        setTimeout(function () { navigator.notification.vibrate(500); }, 1);
                        if (appProfile.currentStop.audioLink != null && appProfile.currentStop.audioLink != "") {
                            //we'll make a different popup here...
                            $.UIPopup({
                                selector: "#" + currentArticle,
                                id: "geofenceAlert",
                                title: "Approaching Stop #" + stopInDistance.orderId,
                                message: 'You are approaching stop #' + stopInDistance.orderId + ' - <b>' + stopInDistance.title + '</b>. Please explore the content on this page to learn more about this stop.',
                                cancelButton: 'Got it!'

                            });
                        }
                        else {
                            $.UIPopup({
                                selector: "#" + currentArticle,
                                id: "geofenceAlert",
                                title: "Approaching Stop #" + stopInDistance.orderId,
                                message: 'You are approaching stop #' + stopInDistance.orderId + ' - <b>' + stopInDistance.title + '</b>. Please explore the content on this page to learn more about this stop.',
                                cancelButton: 'Explore Stop'

                            });
                        }
                    }
                    else {
                        window.plugin.notification.local.add({ id: 1, title: "Guided Tour Alert", message: "Approaching Stop #" + stopInDistance.orderId + ": " + stopInDistance.title, autoCancel: true });

                    }
                }
            }
        }
    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }

}

function getStopInDistance(locPoint, stops, feetDistance) {
    //locPoint should be an esri Point in web mercator
    var meterDistance = feetDistance * .3048;
    for (var i = 0; i < stops.length; i++) {
        var stop = stops[i];
        var d = Math.round(Math.sqrt((Math.pow(stop.location.x - locPoint.x, 2)) + (Math.pow(stop.location.y - locPoint.y, 2))));
        konsole.log(stop.orderId + " is " + Math.round((d / .3048)) + " feet away.");
        if (d <= meterDistance) {
            konsole.log("Switch to stop");

            return stop;
        }
    }
    return;
}
//Just watch location do not zoom to
function watchLocation(location) {
    try {
        currentLocation = location;
        mapLocation = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
        var now = new Date();
        var attributes = {};
        attributes.DATETIME = now.getTime();
        //konsole.log("Location " + location + "referrer "+ localStorage.getItem("ReferringLink"));
        var pt = mapLocation;
        var pictureMarker = new esri.symbol.PictureMarkerSymbol("images/mapButtons/blueDot.png", 25, 25);
        var graphic = new esri.Graphic(new esri.geometry.Point(pt, map.spatialReference), pictureMarker, attributes);
        var circle, mapLocation, ring, pts, angle, sym;
        if (typeof (radius) == "undefined" || radius == null) {
            radius = currentLocation.coords.accuracy;
        }
        //check the accuracy every 10 seconds
        if (new Date() - lastAccuracyCheck >= appProfile.accuracyUpdateInterval * 1000) {
            radius = currentLocation.coords.accuracy;
            lastAccuracyCheck = new Date();
        }


        sym = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL), new esri.Color([46, 154, 254, 0.25]));
        circle = new esri.geometry.Polygon(map.spatialReference);

        ring = [];
        // point that make up the circle
        pts = 50;
        // number of points on the circle
        angle = 360 / pts;
        // used to compute points on the circle
        for (var i = 1; i <= pts; i++) {
            // convert angle to radians
            var radians = i * angle * Math.PI / 180;
            // add point to the circle
            ring.push([mapLocation.x + radius * Math.cos(radians), mapLocation.y + radius * Math.sin(radians)]);

        }

        ring.push(ring[0]);
        // start point needs to == end point
        circle.addRing(ring);

        locationLayer.clear();
        locationLayer.add(graphic);
        locationBufferLayer.clear();
        locationBufferLayer.add(new esri.Graphic(circle, sym));


        $("#imgGeolocate").attr('src', "images/mapButtons/locationIcon.png");

    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }

}

function ZoomToCurrentLocation() {
    try {
        var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(currentLocation.coords.longitude, currentLocation.coords.latitude));
        map.centerAndZoom(pt, 18);
    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }

}

function zoomToLocation(location) {
    try {

        var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
        map.centerAndZoom(pt, 18);

    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }


}
function locationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            konsole.log("Location not provided - testing from VBG App");
            break;
        case error.POSITION_UNAVAILABLE:
            konsole.log("Current location not available");
            break;
        case error.TIMEOUT:
            konsole.log("Timeout");
            break;
        default:
            konsole.log("unknown error");
            break;
    }
}
function distance(lat1, lon1, lat2, lon2, unit) {
    30
    var radlat1 = Math.PI * lat1 / 180
    31
    var radlat2 = Math.PI * lat2 / 180
    32
    var radlon1 = Math.PI * lon1 / 180
    33
    var radlon2 = Math.PI * lon2 / 180
    34
    var theta = lon1 - lon2
    35
    var radtheta = Math.PI * theta / 180
    36
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    37
    dist = Math.acos(dist)
    38
    dist = dist * 180 / Math.PI
    39
    dist = dist * 60 * 1.1515
    40
    if (unit == "K") { dist = dist * 1.609344 }
    41
    if (unit == "N") { dist = dist * 0.8684 }
    42
    return dist
    43
}
var konsole = {
    log: function () {
        if (typeof (debug) == "undefined" || debug == true) {
            console.log(arguments)
        }


    }
}