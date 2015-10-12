var stopLayer;
var map;
var mapOnListView;
var thisExt;
var lineLayer;
var locationLayer;
var pushpinLayer;
var highlightLayer;
var locationBufferLayer;
var selectedTourIndex;
var imgArray = [];
var imgArrayFocussed = [];
var stopID = 0;
var tourName;
var featureServiceURL;
var isFromTour = false;
var isFromHome = false;
var isFromStop = false;
var featureLayer;
var mapService;
var localFeatureSet;
var redrawBuffer = true;

var oidName;
var highResMapService;


function loadMap() {

    //require(["esri/map", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/GraphicsLayer",
    //    "esri/renderers/SimpleRenderer", "esri/symbols/SimpleLineSymbol", "dojo/_base/Color", "esri/SpatialReference", "esri/tasks/query", "esri/symbols/PictureMarkerSymbol", "esri/graphic"],
    //    function (Map, FeatureLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, GraphicsLayer, SimpleRenderer, SimpleLineSymbol, Color, SpatialReference, Query, PictureMarkerSymbol, Graphic) {
    if (map) {
        map.destroy();
    }

    config.map.fullExtent = new esri.geometry.Extent(-13280005.826098137, 4066747.6233484694, -13279145.909529906, 4067879.8468299727, new esri.SpatialReference({
        wkid: 102100
    }));

    actualGeolocate = true;
    //Create Map Object
    map = new esri.Map("map", {
        basemap: "streets",
        extent: config.map.fullExtent, // long, lat
        //zoom: 13,
        slider: false,
        autoResize: true
    });


    //Init Map Events
    map.on("load", function () {
        addLayers();
        
    });
    map.on("zoom-end", function (evt) {
        //Turn off imagery service when user zooms out
        //if (config.map.view == "Aerial") {

        //    if (map.getZoom() > 19 || map.getZoom() <= 14) {
        //        //if (config.map.imageryService != null) {
        //        //    //config.map.imageryService.hide();
        //        //}
        //    }
        //    else {
        //        if (config.map.imageryService != null) {
        //            config.map.imageryService.show();
        //        }
        //    }
        //}
    });



    

    $("#hrefTopo").on("tap", function () {
        changeView("Topo");
    });
    $("#map").height($("#mapArticle").height() - $("#mapToolbar").height());
    //map.resize();
    //map.reposition();


    //});





}
function addLayers() {
    //Add Imagery Service
    //config.map.imageryService = new esri.layers.ArcGISTiledMapServiceLayer("http://tiles.arcgis.com/tiles/UdNSRpyD8hxLx3jb/arcgis/rest/services/imagery/MapServer",

    //{ visible: false });
    //map.addLayer(config.map.imageryService);
    //Add Garden Basemap
    config.map.gardenService = new esri.layers.ArcGISTiledMapServiceLayer(appData.map.gardenService, { visible: true });
    map.addLayer(config.map.gardenService);
    config.map.contourService = new esri.layers.ArcGISTiledMapServiceLayer(appData.map.contourService, { visible: false,opacity:0.5 });
    map.addLayer(config.map.contourService);
    //Add Trail Servicechange
    config.map.trailService = new esri.layers.FeatureLayer(appData.map.trailService, {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        visible: false
    });
    
    var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 255, 255, 1]), 3);
    var lineRenderer = new esri.renderer.SimpleRenderer(lineSymbol);
    config.map.trailService.setRenderer(lineRenderer);
    map.addLayer(config.map.trailService);
    //add location and pushpin layers (empty to start)
    locationLayer = new esri.layers.GraphicsLayer();
    locationBufferLayer = new esri.layers.GraphicsLayer();
    pushpinLayer = new esri.layers.GraphicsLayer();
    highlightLayer = new esri.layers.GraphicsLayer();
    //stopLayer = new esri.layers.FeatureLayer(selectedTourStopService, {
    //    mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
    //    visible: false
    //});
    pushpinLayer.setScaleRange(0, 0);
    map.addLayers([locationBufferLayer, locationLayer, pushpinLayer, highlightLayer]);
    dojo.connect(pushpinLayer, "onClick", function (thisGraphic) {
        var newStopID = thisGraphic.graphic.attributes["ID"];
        if (appProfile.currentStop !=null && newStopID == appProfile.currentStop.orderId) {
            setTimeout(function () { $.UIGoToArticle("#stopView"); }, 300);
            return false;
        }
        highlightStop(newStopID);
        //goToStop(appProfile.currentTour.tag, newStopID);
        setTimeout(function () { goToStop(appProfile.currentTour.tag, newStopID) }, 300);
        //localStorage.setItem("SelectedStopID", newStopID);

        //StopViewStartup();
        //$.UIGoToArticle("#stopView");
    });
    dojo.connect(highlightLayer, "onClick", function (thisGraphic) {
        var newStopID = thisGraphic.graphic.attributes["ID"];
        setTimeout(function () { $.UIGoToArticle("#stopView"); }, 300);
       // setTimeout(function () { goToStop(appProfile.currentTour.tag, newStopID) }, 300);
        //$.UIGoToArticle("#stopView");
        //localStorage.setItem("SelectedStopID", newStopID);

        //StopViewStartup();
        //$.UIGoToArticle("#stopView");
    });
    //config.map.imageryService.on("load", function () {
        $("#hrefAerial").on("tap", function () {
            changeView("Imagery");
        });
    //});
    config.map.gardenService.on("load", function () {
        //changeView("Garden");
        $("#hrefTopo").removeClass("basemapSelected");
        $("#hrefAerial").removeClass("basemapSelected");
        $("#hrefGarden").addClass("basemapSelected");
        //map.resize();
        //map.reposition();
        $("#hrefGarden").on("tap", function () {
            changeView("Garden");
        });
    });

    if (typeof (appProfile.currentTour) != "undefined" && appProfile.currentTour != null) {
        addTourPushpins(appProfile.currentTour.stops);
        pushpinLayer.show();
    }
    var visibleLayers = map.getLayersVisibleAtScale();
    for (var i = 0; i < visibleLayers.length; i++) {
        visibleLayers[i].refresh();
    }
}
function viewMap(showTour, referrer) {
    try {
        if (showTour == null || typeof (showTour) == "undefined") {
            showTour == false;
        }
        //var referrer = localStorage.getItem("ReferringArticle");
        $("#mapLeftNavigation").off("tap");
        $("#mapRightNavigation").off("tap");
        if (showTour) {
            $("#mapArticle > .TourHeader").show();
            $("#mapPageTitle").text("Tour Map");
            //isFromHome = false;
            if (typeof (map) != "undefined") {
                pushpinLayer.show();
                highlightLayer.show();
            }


            if (referrer == "listOfStops") {
                stopID = -9999;
                $("#mapRightNavigation").hide();
                $("#mapLeftNavigation").on("tap", function () {
                    $.UIGoToArticle("#listOfStops");
                });
                $("#mapRightNavigation").on("tap", function () {
                    $.UIGoToArticle("#listOfStops");
                });
                stopID = 9999;
            }
            else if (referrer == "stopView") {
                $("#mapLeftNavigation").on("tap", function () {
                    stopPlayer();
                    $.UIGoBackToArticle("#listOfStops");
                });
                $("#mapRightNavigation").on("tap", function () {
                    $.UIGoToArticle("#stopView");
                });
                $("#mapRightNavigation").show();

            }

        } else {
            $("#mapArticle > .TourHeader").hide();
            $("#mapPageTitle").text("Garden Map");
            if (typeof (map) != "undefined") {
                pushpinLayer.hide();
                highlightLayer.hide();
            }
            //isFromHome = true;

            changeView("Garden");
            $("#mapRightNavigation").hide();
            $("#mapLeftNavigation").on("tap", function () {
                $.UIGoToArticle("#main");
            });
            //stopLayer.hide();

        }
        if (typeof (map) != "undefined") {
            map.resize();
            map.reposition();
        }
    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }

}
function highlightStop(stopID) {
    try {
        highlightLayer.clear();
        for (var i = 0; i < pushpinLayer.graphics.length; i++) {
            var tourFeature = pushpinLayer.graphics[i];
            if (parseInt(tourFeature.attributes["ID"]) == parseInt(stopID)) {
                var pictureMarker = new esri.symbol.PictureMarkerSymbol(imgArrayFocussed[tourFeature.attributes["Number"]].src, 36, 36);
                var graphic = new esri.Graphic(new esri.geometry.Point(tourFeature.geometry, map.spatialReference), pictureMarker, tourFeature.attributes);
                highlightLayer.add(graphic);
                highlightLayer.show();
                return;
            }
        }
    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }


}
function centerAtStop(stop) {
    try {
        var pt = new esri.geometry.Point(stop.location.x, stop.location.y, map.spatialReference);
        map.centerAt(pt);
    }
    catch (err) {
        konsole.log("handled error: " + err.message);
    }

}
function clearHighlighted() {
    if (typeof (map) != "undefined") {
        highlightLayer.clear();
    }
}
function addTourPushpins(stops) {
    try {
        pushpinLayer.clear();
        highlightLayer.clear();
        GetPinImages();
        GetFocussedPinImages();
        var extent = new esri.geometry.Extent();
        extent.setSpatialReference(map.spatialReference);

        for (var i = stops.length - 1; i >= 0; i--) {
            var stop = stops[i];
            var tempFID = parseInt(stop.orderId);
            var stopNum = parseInt(stop.orderId);

            var attributes = {};
            attributes.ID = tempFID;
            attributes.Number = stopNum;
            var pt = [stop.location.x, stop.location.y];



            var pictureMarker = new esri.symbol.PictureMarkerSymbol(imgArray[stopNum].src, 24, 24);
            var graphic = new esri.Graphic(new esri.geometry.Point(pt, map.spatialReference), pictureMarker, attributes);
            pushpinLayer.add(graphic);
            if (typeof (extent.xmin) == "undefined") {
                extent.xmin = stop.location.x;
                extent.ymin = stop.location.y;
                extent.xmax = stop.location.x;
                extent.ymax = stop.location.y;
            }
            else {
                if (stop.location.x < extent.xmin) { extent.xmin = stop.location.x };
                if (stop.location.y < extent.ymin) { extent.ymin = stop.location.y };
                if (stop.location.x > extent.xmax) { extent.xmax = stop.location.x };
                if (stop.location.x > extent.ymax) { extent.ymin = stop.location.y };
            }

        }
        map.setExtent(extent, true);
        pushpinLayer.show();
        highlightLayer.show();
    }
    catch (err) { konsole.log("error adding layer"); }
}
function addTourLayer(tourFeatureSet) {
    try {
        pushpinLayer.clear();
        highlightLayer.clear();
        GetPinImages();
        GetFocussedPinImages();
        oidName = tourFeatureSet.objectIdFieldName;
        for (var i = tourFeatureSet.features.length - 1; i >= 0; i--) {
            var tourFeature = tourFeatureSet.features[i];
            var tempFID = parseInt(tourFeature.attributes[oidName]);
            var stopNum = parseInt(tourFeature.attributes["StopOrder"]);

            var attributes = {};
            attributes.ID = tempFID;
            attributes.Number = stopNum;
            var pt = tourFeature.geometry;



            var pictureMarker = new esri.symbol.PictureMarkerSymbol(imgArray[stopNum].src, 24, 24);
            var graphic = new esri.Graphic(new esri.geometry.Point(pt, map.spatialReference), pictureMarker, attributes);
            pushpinLayer.add(graphic);

        }
        pushpinLayer.show();
        highlightLayer.show();
    }
    catch (err) {
        konsole.log("error adding layer");
    }
}

function changeView(view) {

    konsole.log("changing to " + view);
    config.map.view = view;

    switch (view.toLowerCase()) {
        case "topo":
            if (typeof (map) != "undefined") {
                map.setBasemap("topo");
                config.map.gardenService.hide();
                //config.map.imageryService.hide();
                config.map.trailService.show();
                config.map.contourService.show();
            }



            $("#hrefTopo").addClass("basemapSelected");
            $("#hrefAerial").removeClass("basemapSelected");
            $("#hrefGarden").removeClass("basemapSelected");
            break;
        case "garden":
            if (typeof (map) != "undefined") {
                config.map.gardenService.show();
                //config.map.imageryService.hide();
                config.map.trailService.hide();
                config.map.contourService.hide();
                map.setBasemap("streets");
            }
            config.map.view = "Garden";


            $("#hrefTopo").removeClass("basemapSelected");
            $("#hrefAerial").removeClass("basemapSelected");
            $("#hrefGarden").addClass("basemapSelected");
            break;
        case "imagery":
            if (typeof (map) != "undefined") {
                map.setBasemap("satellite");
                config.map.gardenService.hide();
                config.map.contourService.hide();
                //config.map.imageryService.show();
                if (isFromHome) {
                    config.map.trailService.hide();
                }
                else {
                    config.map.trailService.show();
                }
            }



            $("#hrefTopo").removeClass("basemapSelected");
            $("#hrefAerial").addClass("basemapSelected");
            $("#hrefGarden").removeClass("basemapSelected");
            break;
    }



}


function BackToTrail() {
    //localStorage.setItem("View", "Garden");
    map.setExtent(config.map.fullExtent);

}
