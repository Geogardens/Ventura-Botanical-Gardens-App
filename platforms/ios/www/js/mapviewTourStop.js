function mapViewTourStop() {
    // navigator.
    // $('#divMapView').height($(window).height());


    //hide the map View and display the list view
    $('#divMapView').css('display', 'block');
    $('#divTourStops').css('display', 'none');
    $('#divTrails').css('display', "none");

    //hide the listview button and display the back/mapview button
    //$('#hrefListView').css('display', 'block');
    //$('#hrefTrailList').css('display', 'none');

    require(["esri/map", "esri/layers/FeatureLayer", "esri/SpatialReference", "esri/dijit/InfoWindowLite", "esri/InfoTemplate", "esri/tasks/query", "esri/symbols/PictureMarkerSymbol", "esri/graphic", "dojo/domReady!"],
        function (Map, FeatureLayer, SpatialReference, InfoWindowLite, InfoTemplate, Query, PictureMarkerSymbol, Graphic) {
            thisExt = new esri.geometry.Extent(-13279639.3307, 4066988.5658, -13279344.0046, 4067600.0887, new esri.SpatialReference({
                wkid: 102100
            }));

            map = new Map("map", {
                basemap: "topo",
                extent: thisExt, // long, lat
                //zoom: 13,
                slider: false

            });

            var template = new InfoTemplate();
            // template.setTitle("Demo Trail Tour Stop");
            template.setTitle("<b>${Name}</b>");
            template.setContent("${Caption}<br/>"
                + "<img src=${PrimaryImage}></img>");


            pointLayer = new esri.layers.FeatureLayer("http://services1.arcgis.com/UdNSRpyD8hxLx3jb/ArcGIS/rest/services/Demonstration_Tour_Stops/FeatureServer/0", {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                infoTemplate: template,
                outFields: ["*"]
            });

            lineLayer = new esri.layers.FeatureLayer("http://services1.arcgis.com/UdNSRpyD8hxLx3jb/ArcGIS/rest/services/DemonstrationTrail/FeatureServer/0", {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
            });

            map.addLayers([lineLayer, pointLayer]);

            var spRef = new esri.SpatialReference({
                wkid: 102100
            });
            //var spRef = mapOnListView.SpatialReference;
            var query = new esri.tasks.Query();
            query.outFields = ["*"];
            query.where = "FID > 0";
            query.returnGeometry = true;
            query.maxAllowableOffset = 4326;
            query.spatialRelationship = Query.SPATIAL_REL_CONTAINS;
            query.outSpatialReference = spRef;

            pointLayer.queryFeatures(query);
            // $("#ul_TrailStops3").empty();
            dojo.connect(pointLayer, "onQueryFeaturesComplete", function (featureSet) {
                map.graphics.clear();
                //if (mapOnListView.graphics != null) {
                //    mapOnListView.graphics.clear();
                //}
                console.log("Number of features " + featureSet.features.length);
                for (var i = featureSet.features.length - 1; i > 0; i--) {
                    console.log(featureSet.features[i].attributes["Name"]);
                    console.log(featureSet.features[i].attributes["Lat"]);
                    console.log(featureSet.features[i].attributes["Long_"]);
                    //console.log(featureSet.features[i].attributes["geometry"]);

                    //var geom = new esri.geometry.Point(featureSet.features[i].attributes["geometry"]);

                    //console.log("Geometry " + geom);
                    //var pt = new Point(geom, new SpatialReference({ wkid: 4326 }));
                    var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(parseFloat(featureSet.features[i].attributes["Lat"]), parseFloat(featureSet.features[i].attributes["Long_"])));
                    //mapOnListView.centerAndZoom(pt, 16);

                    console.log("Point where graphic will be drawn " + pt);
                    var pictureMarker = new esri.symbol.PictureMarkerSymbol(imgArray[i].src, 24, 24);
                    var color = "#00FFFF";
                    //var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("#FF0000"), 1), new Color(color));

                    var graphic = featureSet.features[i];
                    graphic.setSymbol(pictureMarker);
                    map.graphics.add(graphic);
                }
            });

            //dojo.connect(map, "onClick", function (evt) {
            //    map.infoWindow.show(evt.mapPoint);
            //});
            //});
            //pointLayer.on("load", function () {
            //    var query = new Query();
            //    query.where = "1=1";
            //    query.outFields = ["*"];
            //    ;
            //    query.execute(query, function (result) {
            //        alert(result);
            //    });
            //});

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
                //navigator.geolocation.watchPosition(showLocation, locationError);
            }
            //geoLocate = new LocateButton({ map: map },"locate");
            //geoLocate.startup();
        });
}

function zoomToLocation(location) {
    //var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
    //map.centerAndZoom(pt, 16);
    require(["esri/map", "esri/symbols/PictureMarkerSymbol", "dojo/domReady!"], function (Map, PictureMarkerSymbol) {
        thisExt = new esri.geometry.Extent(-13279639.3307, 4066988.5658, -13279344.0046, 4067600.0887, new esri.SpatialReference({
            wkid: 102100
        }));
        var pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
        map.centerAndZoom(pt, 16);
        var pictureMarker = new esri.symbol.PictureMarkerSymbol("images/green-pin.png", 25, 25);

        var graphic = new esri.Graphic(pt, pictureMarker);
        map.graphics.add(graphic);
    });

}

function showLocation(location) {

}
function locationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Location not provided");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Current location not available");
            break;
        case error.TIMEOUT:
            alert("Timeout");
            break;
        default:
            alert("unknown error");
            break;
    }
}