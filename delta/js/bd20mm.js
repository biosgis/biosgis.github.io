// bd20mm.js 20170608 dean.chiang@wildlife.ca.gov
// CALLER--bd20mmmap.html

// HELPERS
var brk = "<br />";
function $(id) { return document.getElementById(id); }
function hide(id) { $(id).style.display = 'none'; }
function show(id) { $(id).style.display = ''; }
function toggle(id) {
    if ($(id).style.display !== 'none') {
        hide(id);
    } else {
        show(id);
    }
}
function pass(s) { var msg = s; }

// GLOBALS
avn = 20170612;
appVersion = (parseInt(avn / 10000) - 2010) + "." + parseInt((avn - 20170000) / 100) + "." + (avn % 100);
msglog = [];
var viewer = {
    "id": "bd20mm",
    "name": "Bay Delta 20-mm Survey Map",
    "title": "CDFW Bay Delta Region Fish Distribution Survey",
    "subtitle": "Fish Distribution CPUE",
    "homepage": "https://www.wildlife.ca.gov/Conservation/Delta/20mm-Survey",
    "mappage": "http://www.dfg.ca.gov/delta/data/20mm/CPUE_Map.asp",
    "docTitle": "SKT Map",
    "url": "delta/bd20mmmap.html",
    "extent" : {//homeExtent, DEFAULT_EXTENT
        "xmin" : -13610303.883433947,
        "ymin" : 4571306.1727394955,
        "xmax" : -13510547.148149377,
        "ymax" : 4626756.58920527,
        "spatialReference" : {
            "wkid" : 102100,
            "latestWkid" : 3857
        }
    }
}
var app = {
    id: "bd20mm",
    layers: {
        "bd20mmStations": {
            url: "//services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mmgdb/FeatureServer/0"
        },
        "bd20mmFishDistribution": {
            url: "//services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mmgdb/FeatureServer/1"
        },
        "bd20mmAreaPercentage": {
            url: "//services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mmgdb/FeatureServer/3"
        },
        "bdSpecies": {
            url: "//services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mmgdb/FeatureServer/4"
        }
    }
}

var defaultColor = "#3CB371"; //=MediumSeaGreen = rgb:(60,179,113)
var geomSer = null;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/core/watchUtils",
    "esri/Graphic",
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/support/LabelClass",
    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/TextSymbol",
    "esri/tasks/GeometryService",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
], function (
    Map,
    MapView,
    watchUtils,
    Graphic,
    Extent,
    Point,
    Polygon,
    Polyline,
    FeatureLayer,
    GraphicsLayer,
    LabelClass,
    ClassBreaksRenderer,
    SimpleRenderer,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    TextSymbol,
    GeometryService,
    QueryTask, Query,
    BasemapToggle,
    Home,
    Legend,
    ScaleBar,
    on, dom
    ) {
    //--------------------- LOAD MAP DATA ---------------------
    var dataUrl = app.layers["bd20mmFishDistribution"].url;
    var stationsUrl = app.layers["bd20mmStations"].url;
    var tableUrl = app.layers["bd20mmAreaPercentage"].url;
    defaultExtent = new Extent({
        "xmin": -13619939.698557,
        "ymin": 4559569.42848605,
        "xmax": -13510546.6583436,
        "ymax": 4622807.04296468,
        "spatialReference": { "wkid": 102100 }
    });//copied from stationsURL
    var map3dOptions = {
        basemap: "gray",
        center: [-120.34, 38.765],
        zoom: 7,
        slider: false
    }

    // Code to create the map and view will go here
    var map = new Map({
        basemap: "topo" //streets
    });
    var mapview = new MapView({
        container: "mapview",
        map: map,
        center: [-121.8, 38.1],// [-122.1, 38],
        //extent: { // autocasts as new Extent()
        //    xmin: -13619939.698557,
        //    ymin: 4559569.42848605,
        //    xmax: -13510546.6583436,
        //    ymax: 4622807.04296468,
        //    spatialReference: 102100
        //},
        zoom: 10 //9
    });
    // Basemap Toggle--20170526
    var bltoggle = new BasemapToggle({
        view: mapview,
        nextBasemap: "streets"
    });
    mapview.ui.add(bltoggle, "bottom-right");
    // Home widget--20170526
    var homeWidget = new Home({
        view: mapview
    });
    mapview.ui.add(homeWidget, "top-left");
    var scaleBar = new ScaleBar({
        view: mapview,
        unit: "dual"
    });
    mapview.ui.add(scaleBar, {
        position: "bottom-left"
    });

    //-- MAP VIEW EVENTS------------------------------
    // Working with properties--https://developers.arcgis.com/javascript/latest/guide/working-with-props/index.html
    mapview.then(function () {
        var basemapTitle = map.get("basemap.title");
        document.getElementById("basemap-title").innerHTML = basemapTitle;
        // go to same point using center and zoom
        mapview.goTo({
            center: [-121.8, 38.1],
            zoom: 10
        });
    }, function (error) {
        console.log("mapview failed to load: ", error);
    });

    mapview.on("click", function (evt) {
        //console.log(evt.mapPoint);
        mapviewOnclick(evt);
    });

    // Object: watchUtils--https://developers.arcgis.com/javascript/latest/api-reference/esri-core-watchUtils.html
    var basemapHandle = watchUtils.pausable(map, 'basemap', function (newVal) {
        // Each time the value of map.basemap changes, it is logged in the console
        //console.log("new basemap: ", newVal);
        $("basemap-title").innerHTML = newVal;
    });
    //-- Display mapview center and zoom level when extent changed--20160722
    // Watches for property changes--https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html#watch
    var viewHandles = [];
    viewHandles.push(basemapHandle);
    var mapvProps = ["center", "extent", "scale", "zoom"];
    //for (var i = 0; i < mapvProps.length; i++) {
    //    var handle = mapview.watch(mapvProps[i], function (newValue, oldValue, propertyName, target) {
    //        console.log(propertyName + " changed from " + oldValue + " to " + newValue);
    //    });
    //    viewHandles.push(handle);
    //}
    var scaleHandle = mapview.watch("scale", function (newValue, oldValue, propertyName, target) {
        $("map-scale").innerHTML = Math.round(newValue);
    });
    viewHandles.push(scaleHandle);
    var zoomHandle = mapview.watch("zoom", function (newValue, oldValue, propertyName, target) {
        $("map-zoomlevel").innerHTML = Math.round(newValue);
        mapExtentWrite();
    });
    viewHandles.push(zoomHandle);
    // Converts an array of XY-coordinates--https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-GeometryService.html#toGeoCoordinateString
    geomSer = new GeometryService({
        "url": "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
    });
    var centerHandle = mapview.watch("center", function (newValue, oldValue, propertyName, target) {
        //console.log(propertyName + " changed from " + oldValue + " to " + newValue);
        $("map-x").innerHTML = newValue.x.toFixed(3);
        $("map-y").innerHTML = newValue.y.toFixed(3);
        $("map-wkid").innerHTML = newValue.spatialReference.wkid;
        var params = {};
        params.sr = newValue.spatialReference;//"4326";
        params.coordinates = [[newValue.x, newValue.y]];
        params.conversionType = "dd";
        geomSer.toGeoCoordinateString(params).then(function (response) {
            $("map-latlon").innerHTML = response[0];//like '38.099N 121.800W'
        });
        mapExtentWrite();
    });
    viewHandles.push(centerHandle);
    function mapExtentWrite() {
        var box = [mapview.extent.xmin, mapview.extent.ymin, mapview.extent.xmax, mapview.extent.ymax];
        $("map-extent").innerHTML = box.join(", ");
    }

    //-- STATIONS LAYER--------------------------
    var bd20mmStations = new FeatureLayer({
        url: stationsUrl,
        //renderer: stationsRenderer,
        popupTemplate: {
            content: "{*}"
        }
    });
    //20160728 Setting renderer property of FeatureLayer--https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#renderer
    bd20mmStations.renderer = new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
            size: 6,
            color: "white",
            outline: {
                width: 0.5,
                color: "black"
            }
        })
    });
    map.add(bd20mmStations);

    //-- Stations Labels layer--20160728
    var stationsLabelField = "Station";
    //FAIL METHOD 1-------------------------3D ONLY
    var stationsLabelClass = new LabelClass({
        labelExpressionInfo: { value: "{Station}" },
        symbol: new TextSymbol({
            color: "black",
            haloSize: 1,
            haloColor: "white",
            //xoffset: 3,
            //yoffset: 3,
            //font: {  // autocast as esri/symbols/Font
            //    size: 12,
            //    family: "sans-serif",
            //    weight: "bolder"
            //}
        })
    });
    bd20mmStations.labelsVisible = true;
    bd20mmStations.labelingInfo = [stationsLabelClass];
    //FAIL METHOD 2-------------------------------------------------20160729
    //mapview.whenLayerView(bd20mmStations).then(function (lyrView) {
    //    lyrView.watch("updating", function (val) {
    //        if (!val) {  // wait for the layer view to finish updating
    //            //lyrView.queryFeatures(query).then(function (results) {//FAIL-input query cause QueryEngine fail
    //            lyrView.queryFeatures().then(function (results) {
    //                console.log(results.length + " features returned");//ONLY objectid returnable--NO USE
    //            });
    //        }
    //    });
    //});
    var labelGraphics = [];
    //
    var textSymbol = new TextSymbol({
        color: "blue",
        haloColor: "white",
        haloSize: "1px",
        text: "Station",
        xoffset: 3,
        yoffset: 3,
        font: {  // autocast as esri/symbols/Font
            size: 9,
            family: "sans-serif",
            weight: "normal"
        }
    });
    var stationLabelsLayer = new GraphicsLayer({
        id: "stationsLabels"
    });
    //--Query layer features to build the label graphics after loaded in mapview 2D Labeling--20160729
    bd20mmStations.on("layerview-create", function (evt) {
        // The LayerView for the layer that emitted this event
        evt.layerView;
        //bd20mmStations.labelsVisible = true;
        //bd20mmStations.labelingInfo = [stationsLabelClass];
        //legend.layerInfos.push({
        //    layer: bd20mmStations,
        //    title: "Sampling Stations"
        //});
        var queryStationsTask = new QueryTask({
            url: stationsUrl
        });
        var query = new Query();
        query.where = "1=1";
        //query.where = "OBJECTID > 0";
        //query.geometry = mapPoint; // mapPoint obtained from view-click event.
        //query.distance = 100;
        //query.units = "miles";
        //query.spatialRelationship = "intersects"; // All features that intersect 100mi buffer
        //query.outSpatialReference = { wkid: 102100 };
        query.returnGeometry = true;
        query.outFields = ["Station"];
        queryStationsTask.execute(query).then(function (result) {
            addmsg("CALLBACK queryStationsTask returned " + result.features.length + " features");
            result.features.forEach(function (feature) {
                //console.log(feature.attributes["Station"] + "@" + feature.geometry.x);//OK all have valid geom
                //feature.symbol.text = feature.attributes["Station"].toString();//FAIL--all set one last value
                //feature.symbol = new TextSymbol({
                //    color: "blue",
                //    haloColor: "white",
                //    haloSize: "1px",
                //    text: feature.attributes["Station"].toString(),
                //    xoffset: 5,
                //    yoffset: 5,
                //    font: {  // autocast as esri/symbols/Font
                //        size: 10,
                //        family: "sans-serif",
                //        weight: "bold"
                //    }
                //});
                //mapview.graphics.add(feature);//OK but cannot turn them all on-off together
                var graphic = new Graphic();
                graphic.attributes = feature.attributes;
                graphic.geometry = feature.geometry;
                graphic.symbol = new TextSymbol({
                    color: "blue",
                    haloColor: "white",
                    haloSize: "1px",
                    text: feature.attributes["Station"].toString(),
                    xoffset: 5,
                    yoffset: 5,
                    font: {  // autocast as esri/symbols/Font
                        size: 9,
                        family: "sans-serif",
                        weight: "normal"
                    }
                });
                labelGraphics.push(graphic);// feature);
                stationLabelsLayer.graphics.add(graphic);
            })
        });
    });
    // Add graphic when GraphicsLayer is constructed =FAIL--graphics did not show up this way--20160729
    var labelslayer = new GraphicsLayer({
        id: "labels",
        //renderer: labelRenderer,
        graphics: labelGraphics
    });
    map.add(stationLabelsLayer);
    //stationLabelsLayer.visible = false;//KO--add this line will hide labels always


    //-- SAMPLING STATIONS LABELS TOGGLE----------------------------
    // Create a variable referencing the checkbox node
    var stationLabelsToggle = dom.byId("showlabels");

    // Listen to the onchange event for the checkbox
    on(stationLabelsToggle, "change", function () {
        // When the checkbox is checked (true), set the labels visibility to true
        //bd20mmStations.labelsVisible = stationLabelsToggle.checked;//ONLY GOOD FOR 3D
        //console.log("stationLabelsToggle.checked=" + stationLabelsToggle.checked);
        //mapview.graphics.visible = stationLabelsToggle.checked;//FAIL
        //mapview.graphics.map(function (graphic) {
        //    graphic.visible = stationLabelsToggle.checked;//FAIL
        //});
        stationLabelsLayer.visible = stationLabelsToggle.checked;
    });


    //-- FISH SAMPLING DATA LAYER WITH CLASS BREAK RENDERERS--20160805
    var renderer = new ClassBreaksRenderer({
        field: "CPUE"
    });
    //JSAPI4 METHOD classbreaks
    var classbreaks = [
        { min: 0, max: 0, size: 5, color: "white" },
        { min: 0, max: 10, size: 6, color: "#3CB371" },
        { min: 10, max: 50, size: 12, color: "#3CB371" },
        { min: 50, max: 100, size: 18, color: "#3CB371" },
        { min: 100, max: 200, size: 24, color: "#3CB371" },
        { min: 200, max: 500, size: 36, color: "#3CB371" }
    ];
    for (var i = 0; i < classbreaks.length; i++) {
        renderer.addClassBreakInfo({
            minValue: classbreaks[i].min,
            maxValue: classbreaks[i].max,
            symbol: new SimpleMarkerSymbol({
                size: classbreaks[i].size,
                color: classbreaks[i].color,
                outline: {
                    width: 0.5,
                    color: "black"
                }
            })
        });
    }

    renderer.defaultSymbolSymbol = new SimpleMarkerSymbol({
        size: 6,
        color: "white",
        outline: {
            width: 0.5,
            color: "black"
        }
    });

    var def = "CommonName = 'Delta Smelt' AND SurveyYear = 2016 AND Survey = 6";
    //def = "SurveyYear = 2017";
    var bd20mmFishDistribution = new FeatureLayer({
        url: dataUrl,
        renderer: renderer,
        definitionExpression: def
    });
    //bd20mmFishDistribution.setDefinitionExpression(def);
    map.add(bd20mmFishDistribution);

    //-- LEGEND --------------------
    var legend = new Legend({
        view: mapview,
        layerInfos: [
        {
            layer: bd20mmStations,
            title: "Sampling Stations"
        }, {
            layer: bd20mmFishDistribution,
            title: "CPUE"
        }]
    }, "map-legend");


    //-- BAY DELTA UPSTREAM REGIONAL POLYGONS GRAPHICS LAYER--------------------20160825
    function percentLabelGraphics() {
        addmsg("DO percentLabelGraphics");
        //Bay Delta Upstream Regions coords
        //next zoomlevel out:  Map extent (xmin, ymin, xmax, ymax)=
        //-13701651.221513933, 4517125.078236857, -13415776.73572751, 4669999.134807136
        var xmed = -13559249.038;
        var ymed = 4611066.186;
        var xmin = -13630182.6;
        var ymin = 4555343.6;
        var xmax = -13487245.357;
        var ymax = 4631780.6;

        var bayCoords = [[xmin, ymin], [xmin, ymax], [xmed, ymax], [xmed, ymin]];
        var deltaCoords = [[xmed, ymin], [xmed, ymed], [xmax, ymed], [xmax, ymin]];
        var upstreamCoords = [[xmed, ymed], [xmed, ymax], [xmax, ymax], [xmax, ymed]];
        var bayPoly = new Polygon({
            rings: bayCoords,
            spatialReference: 102100
        });
        var bayFill = new SimpleFillSymbol({
            color: [255, 255, 255, 0.33],
            outline: {
                color: "azure",
                width: 1
            }
        });//semi-transparent white
        var bayRegion = new Graphic({
            geometry: bayPoly,
            symbol: bayFill
        });

        var deltaPoly = new Polygon({
            rings: deltaCoords,
            spatialReference: 102100
        });
        var deltaFill = new SimpleFillSymbol({
            color: [250, 250, 210, 0.5],//LightGoldenRodYellow
            outline: {
                color: "azure",
                width: 1
            }
        });//Gold
        var deltaRegion = new Graphic({
            geometry: deltaPoly,
            symbol: deltaFill
        });

        var upstreamPoly = new Polygon({
            rings: upstreamCoords,
            spatialReference: 102100 //NOT mapview.spatialReference
        });
        var upstreamFill = new SimpleFillSymbol({
            color: [250, 235, 215, 0.5],//antiquewhite
            outline: { // autocasts as new SimpleLineSymbol()
                color: "azure",
                width: 1
            }
        });//Coral
        var upstreamRegion = new Graphic({
            geometry: upstreamPoly,
            symbol: upstreamFill
        });
        // Make pctLabels global so can recreate them to update view
        bayLabel = new Graphic();
        bayLabel.geometry = new Point({
            longitude: -122.0,
            latitude: 38.28
        });//xy= -13581568.650, 4620009.318
        bayLabel.symbol = new TextSymbol({
            color: "brown",
            haloColor: "white",
            haloSize: "1px",
            text: "Bay %",
            xoffset: 3,
            yoffset: 3,
            font: {  // autocast as esri/symbols/Font
                size: 11,
                family: "sans-serif",
                weight: "bold"
            }
        });
        deltaLabel = new Graphic();
        deltaLabel.geometry = new Point({
            longitude: -121.5,
            latitude: 38.15
        });//xy= -13535400.685, 4602887.424
        deltaLabel.symbol = new TextSymbol({
            color: "brown",
            haloColor: "white",
            haloSize: "1px",
            text: "Delta %",
            xoffset: 3,
            yoffset: 3,
            font: {  // autocast as esri/symbols/Font
                size: 11,
                family: "sans-serif",
                weight: "bold"
            }
        });
        upstreamLabel = new Graphic();
        upstreamLabel.geometry = new Point({
            longitude: -121.5,
            latitude: 38.32
        });//xy= -13535400.685, 4623601.859
        upstreamLabel.symbol = new TextSymbol({
            color: "brown",
            haloColor: "white",
            haloSize: "1px",
            text: "Upstream %",
            xoffset: 3,
            yoffset: 3,
            font: {  // autocast as esri/symbols/Font
                size: 11,
                family: "sans-serif",
                weight: "bold"
            }
        });

        pctLabelsLayer = new GraphicsLayer({
            id: "pctLabelsLayer"
        });
        pctLabelsLayer.addMany([bayRegion, deltaRegion, upstreamRegion, bayLabel, deltaLabel, upstreamLabel]);
        map.add(pctLabelsLayer);
        pctLabelsToggle = dom.byId("showpct");
        on(pctLabelsToggle, "change", function () {
            pctLabelsLayer.visible = pctLabelsToggle.checked;
            if (pctLabelsToggle.checked == true) {
                queryPercentages();
            }
        });

        return "DONE percentLabelGraphics";
    }
    msg = percentLabelGraphics();
    console.log(msg);

    //-- Calculate dynamic class breaks to remake renderer depending on query result--20160627
    function rerender(maxval) {
        //addmsg("DO rerender: " + maxval);
        maxval = parseInt(maxval + 1);
        var incr = maxval / 5;
        var renderer = new ClassBreaksRenderer({
            field: "CPUE"
        });
        var classbreaks = [
        { min: 0, max: 0, size: 5, color: "white" },
        { min: 0, max: incr, size: 6, color: "#3CB371" },
        { min: incr, max: (incr * 2), size: 12, color: "#3CB371" },
        { min: (incr * 2), max: (incr * 3), size: 18, color: "#3CB371" },
        { min: (incr * 3), max: (incr * 4), size: 24, color: "#3CB371" },
        { min: (incr * 4), max: (incr * 5), size: 36, color: "#3CB371" }
        ];
        for (var i = 0; i < classbreaks.length; i++) {
            renderer.addClassBreakInfo({
                minValue: classbreaks[i].min,
                maxValue: classbreaks[i].max,
                symbol: new SimpleMarkerSymbol({
                    style: "circle",
                    size: classbreaks[i].size,
                    color: classbreaks[i].color,
                    outline: {
                        color: "black",
                        width: 0.5
                    }
                }),
                label: classbreaks[i].min.toFixed(1) + " - " + classbreaks[i].max.toFixed(1)
            });
        }
        return renderer;
    }
    //-- Draw Map button onclick--20160826
    function drawMap() {
        $("result-box").innerHTML = "";
        var species = $("species").value;
        var commonName = $("species").options[$("species").selectedIndex].innerHTML;
        var year = $("year").value;
        var survey = $("survey").value;
        def = "CommonName = '" + commonName + "' AND Survey = " + survey + " AND SurveyYear = " + year;
        def = "Species = '" + species + "' AND Survey = " + survey + " AND SurveyYear = " + year;
        bd20mmFishDistribution.definitionExpression = def;
        $("result-title").innerHTML = commonName + " " + year + " Survey " + survey;
        queryData(def);
    }
    $("draw_map").addEventListener("click", function (e) {
        drawMap();
    });
    function queryData(def) {
        addmsg("DO queryData: " + def);
        var queryTask = new QueryTask({
            url: dataUrl
        });
        var query = new Query();
        query.returnGeometry = false;
        query.orderByFields = ["Station ASC"];
        query.outFields = ["*"];
        query.where = def;
        // When resolved, returns features and graphics that satisfy the query.
        queryTask.execute(query).then(function (results) {
            addmsg("CALLBACK querytask returned features: " + results.features.length);
            var maxval = 0;
            var outdiv = $("result-box");
            if (results.features == undefined || results.features.length == 0) {
                outdiv.innerHTML = "<i>No data found</i>";
                return;
            }
            var cols = ["Station", "SurfaceTemp", "SurfaceEC", "NumOfTows", "CPUE"];
            var table = document.createElement("table");
            table.style.border = "1px solid dimgray";
            table.style.borderCollapse = "collapse";
            outdiv.appendChild(table);
            var tr = table.insertRow(0);
            for (var j = 0; j < cols.length; j++) {
                var th = document.createElement("th");
                tr.appendChild(th);
                th.innerHTML = cols[j];
                th.style.border = "1px solid silver";
                th.style.borderBottom = "2px solid black";
                th.style.padding = "1px 5px";
            }
            var features = results.features;
            for (var i = 0; i < features.length; i++) {
                var attr = features[i].attributes;
                var row = table.insertRow(table.rows.length);
                if ((i + 1) % 2 == 0) {
                    row.style.backgroundColor = "azure";
                }
                if (i == 0) {
                    //$("result-title").innerHTML += " (" + attr["SurveyStartDate"].toString().split(" ")[0] + " - " + attr["SurveyEndDate"].toString().split(" ")[0] + ")";
                    var borntime = attr["SurveyStartDate"];
                    var endtime = attr["SurveyEndDate"];
                    var borndate = new Date(borntime);
                    var enddate = new Date(endtime);
                    var borned = borndate.getMonth() + 1 + "/" + borndate.getDate() + "/" + borndate.getFullYear();
                    var ended = enddate.getMonth() + 1 + "/" + enddate.getDate() + "/" + enddate.getFullYear();
                    var msg = " (" + borned + " - " + ended + ")";
                    $("result-title").innerHTML += msg;
                }
                for (var j = 0; j < cols.length; j++) {
                    var cell = row.insertCell(j);
                    cell.style.border = "1px solid silver";
                    cell.style.verticalAlign = "top";
                    cell.style.textAlign = "center";
                    var tval = attr[cols[j]];
                    if (cols[j] == "CPUE") {
                        if (tval > maxval) {
                            maxval = tval;
                        }
                        tval = tval.toFixed(3);
                        cell.style.textAlign = "right";
                    }
                    cell.innerHTML = tval;
                }
                //for (var fieldname in attr) {
                //}
                var renderer = rerender(maxval);
                bd20mmFishDistribution.renderer = renderer;
            }
            queryPercentages();
            //DONE queryDataCallback
        });

        // When resolved, returns a count of the features that satisfy the query.
        queryTask.executeForCount(query).then(function (results) {
            console.log(results);
        });
    }

    //--TABLE DATA -----------------------------------------------------
    //-- Query and Write Area Percentage info from feature service table--20160826
    // CALLER: oncheckOfPctLabelToggle
    function queryPercentages() {
        addmsg("DO queryPercentages");
        var species = $("species").value;
        var year = $("year").value;
        var survey = $("survey").value;
        def = "Species = '" + species + "' AND Survey = " + survey + " AND SurveyYear = " + year;
        // TODO: how to make sure cpue and pct show the same def?
        var queryTask = new QueryTask({
            url: tableUrl
        });
        var query = new Query();
        //query.returnGeometry = false;
        query.outFields = ["*"];
        query.where = def;

        queryTask.execute(query).then(function (results) {
            console.log("CALLBACK queryPercentages task results: " + results.features.length);
            var arr = ["Bay", "Delta", "Upstream"];
            var bayval = 0;
            var deltaval = 0;
            var upstreamval = 0;
            if (results.features.length > 0) {
                for (var i = 0; i < results.features.length; i++) {
                    var feature = results.features[i];
                    var loc = feature.attributes["Area"];
                    var pct = feature.attributes["Percentage"].toFixed(2);
                    console.log(loc + "=" + pct);
                    if (loc == "Bay") {
                        bayval = pct;
                    }
                    if (loc == "Delta") {
                        deltaval = pct;
                    }
                    if (loc == "Upstream") {
                        upstreamval = pct;
                    }
                }
            }
            pctLabelsLayer.remove(bayLabel);
            pctLabelsLayer.remove(deltaLabel);
            pctLabelsLayer.remove(upstreamLabel);
            //bayLabel.symbol.text = bayval + "%";
            //deltaLabel.symbol.text = deltaval + "%";
            //upstreamLabel.symbol.text = upstreamval + "%";
            //ISSUE--just changing text does not auto update existing mapview unless mapview changed,
            // need to create new graphic--20160827
            bayLabel = new Graphic();
            bayLabel.geometry = new Point({
                longitude: -122.0,
                latitude: 38.28
            });//xy= -13581568.650, 4620009.318
            bayLabel.symbol = new TextSymbol({
                color: "brown",
                haloColor: "white",
                haloSize: "1px",
                text: bayval + " %",
                xoffset: 3,
                yoffset: 3,
                font: {  // autocast as esri/symbols/Font
                    size: 11,
                    family: "sans-serif",
                    weight: "bold"
                }
            });
            deltaLabel = new Graphic();
            deltaLabel.geometry = new Point({
                longitude: -121.5,
                latitude: 38.15
            });//xy= -13535400.685, 4602887.424
            deltaLabel.symbol = new TextSymbol({
                color: "brown",
                haloColor: "white",
                haloSize: "1px",
                text: deltaval + " %",
                xoffset: 3,
                yoffset: 3,
                font: {  // autocast as esri/symbols/Font
                    size: 11,
                    family: "sans-serif",
                    weight: "bold"
                }
            });
            upstreamLabel = new Graphic();
            upstreamLabel.geometry = new Point({
                longitude: -121.5,
                latitude: 38.32
            });//xy= -13535400.685, 4623601.859
            upstreamLabel.symbol = new TextSymbol({
                color: "brown",
                haloColor: "white",
                haloSize: "1px",
                text: upstreamval + " %",
                xoffset: 3,
                yoffset: 3,
                font: {  // autocast as esri/symbols/Font
                    size: 11,
                    family: "sans-serif",
                    weight: "bold"
                }
            });
            pctLabelsLayer.addMany([bayLabel, deltaLabel, upstreamLabel]);

            //console.log("DONE queryPercentages_queryTaskCallback");
        });
    }

    //--FINAL INIT
    //stationLabelsLayer.then(function () {
    //    $("showlabels").checked = false;//FAIL to hide layer
    //    stationLabelsLayer.visible = false;//once hidden doesnt show again?
    //});
    //pctLabelsLayer.then(function () {
    //    $("showpct").checked = false;//FAIL to hide layer
    //    pctLabelsLayer.visible = false;
    //});
    //$("showlabels").checked = false;//FAIL
    //stationLabelsToggle.click();//KO layer visibility?
    // Match labels toggles to layers init states
    stationLabelsToggle.checked = stationLabelsLayer.visible;
    pctLabelsToggle.checked = pctLabelsLayer.visible;
    if (document.getElementsByClassName("esri-legend__service-label") == undefined) {
        console.log("esri-legend__service-label classname elements not found");
    } else {
        var tags = document.getElementsByClassName("esri-legend__service-label");
        for (var i = 0; i < tags.length; i++) {
            tags[i].innerHTML = "";
        }
    }
    if (window.location.search.indexOf("msg=on") > 0) {
        show("msgbin-toggle");
        show("mapvprop-toggle");
    }
    console.log("DONE REQUIRED");
});

//==================================
// FUNCTIONS
//=================================

// CALLER--upon clicking on mapview sending a mouse click event
mapviewOnclick = function (evt) {
    var mapx = evt.mapPoint.x;
    var mapy = evt.mapPoint.y;
    $("map-pxy").innerHTML = mapx.toFixed(3) + ", " + mapy.toFixed(3);
    var params = {};
    params.sr = evt.mapPoint.spatialReference;
    params.coordinates = [[mapx, mapy]];
    params.conversionType = "dd";
    geomSer.toGeoCoordinateString(params).then(function (response) {
        //console.log("mapclicked=" + response[0]);
        //console.log(response);
        $("map-pll").innerHTML = response[0];
    });
}


/*
 *-------------------------------- NOTES -------------------------------------------------
Get started with map view--https://developers.arcgis.com/javascript/latest/sample-code/get-started-mapview/index.html
Get started with layers--https://developers.arcgis.com/javascript/latest/sample-code/get-started-layers/index.html

20160728 Add FeatureLayer to your Map--https://developers.arcgis.com/javascript/latest/sample-code/layers-featurelayer/index.html

20160728 view-source:https://developers.arcgis.com/javascript/latest/sample-code/visualization-location-simple/live/index.html
demo diff renderers for diff layers and add multiple layers into map at same time and legend
20160728 jsapi4 has no LabelLayer so adding GraphicsLayer to create labels layer
Class: GraphicsLayer--https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html
Class: TextSymbol--https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-TextSymbol.html
20160729
 Create Labels--https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#labelingInfo

NOTE--Known Limitations in version 4.0
There is no support for labeling in 2D. Labeling is only supported in 3D SceneViews.
--that's why code doesnt fail but no labels show up.
Class: Query--https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
Get started with graphics--https://developers.arcgis.com/javascript/latest/sample-code/get-started-graphics/index.html

TODO: can use esri/geometry/support/webMercatorUtils to convert btwn xy-lonlat

20160805 Class: ClassBreaksRenderer--https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-ClassBreaksRenderer.html
20160825 Percentage labels and bay delta regions polygons:
Get started with graphics--https://developers.arcgis.com/javascript/latest/sample-code/get-started-graphics/live/index.html

TODO: dynamic legend values
Set up regions by central point at  Map click lat, lon= 38.223634N 121.804807W
Map click X, Y= -13559249.038, 4611066.186
map view upper left corne (xr= Map click lat, lon= 38.368058N 122.439267W
Map click X, Y= -13629876.852, 4631551.310
map view lower right corner= Map click lat, lon= 37.847223N 121.160733W
Map click X, Y= -13487551.105, 4557866.014
---Create Area Percentage Regions---
upstrm: Coral=FF7F50=255,127,80|AntiqueWhite=FAEBD7=250,235,215
delt: Gold=FFD700=255,215,0|Cornsilk=FFF8DC=255,248,220

//NEXT--HIDE layer names in legend by class esri-legend__service-label
*/
