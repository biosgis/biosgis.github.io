// skt.js 20170407 dean.chiang@wildlife.ca.gov 20170425
//====================
// HELPERS
//====================
var brk = "<br />";
function $(id) {return document.getElementById(id);}
function hide(id) {$(id).style.display = 'none';}
function show(id) {$(id).style.display = 'normal';}
function toggle(id) {
    if ($(id).style.display !== 'none') {
        hide(id);
    } else {
        show(id);
    }
}
function pass(s) {var msg = s;}

//====================
// GLOBALS
//====================
avn = 20170609;
appVersion = (parseInt(avn / 10000) - 2010) + "." + parseInt((avn - 20170000) / 100) + "." + (avn % 100);
msglog = [];
var viewer = {
    "id": "skt",
    "name": "Spring Kodiak Trawl Map",
    "title": "CDFW Bay Delta Region Spring Kodiak Trawl Survey",
    "subtitle": "Delta Smelt Distribution",
    "homepage": "https://www.wildlife.ca.gov/Conservation/Delta/Spring-Kodiak-Trawl",
    "docTitle": "SKT Map",
    "url": "delta/sktmap.html",
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
    "Year": 2016,
    "SurveyNumber": 1,
    "Sex": 1,
    "SexDescription": "male",
    "Stage": null,
    "StageDescription": "",
    "services": {
        "sktgdb": {
            "portalItem": "http://www.arcgis.com/home/item.html?id=09916a05a97949cc81c20d4a6a7cc843",
            "title": "Spring Kodiak Trawl Fish Distribution",
            "summary": "CDFW Bay Delta Region (3) Delta Smelt Spring Kodiak Trawl survey data of fish distribution published 20170109",
            "url": "http://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/sktgdb/FeatureServer",
            "type": "FeatureServer"
        }
    },
    "layers": {
        "samples": {
            "piid": "09916a05a97949cc81c20d4a6a7cc843-1",
            "urid": "sktgdb:1",
            "url": "http://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/sktgdb/FeatureServer/1",
            "name": "SKTFishDistributionMaleFemale",
            "type": "Feature Layer",
            "def": "OBJECTID > 0",
            "fields": ["OBJECTID", "Year", "SurveyNumber", "SurveyStartDate", "SurveyEndDate", "Sex", "SecDescription", "StationCode", "Latitude", "Longitude", "Stage", "StageDescription", "Catch", "CatchPercentage"],
            "dtypes": ["esriFieldTypeInteger", "esriFieldTypeInteger", "esriFieldTypeInteger", "esriFieldTypeDate", "esriFieldTypeDate", "esriFieldTypeInteger", "esriFieldTypeString", "esriFieldTypeString", "esriFieldTypeDouble", "esriFieldTypeDouble", "esriFieldTypeInteger", "esriFieldTypeString", "esriFieldTypeInteger", "esriFieldTypeDouble"],
            "aliases": ["OBJECTID", "Year", "SurveyNumber", "SurveyStartDate", "SurveyEndDate", "Sex", "SecDescription", "StationCode", "Latitude", "Longitude", "Stage", "StageDescription", "Catch", "CatchPercentage"],
            "columns": ["OBJECTID", "Year", "SurveyNumber", "SurveyStartDate", "SurveyEndDate", "Sex", "SecDescription", "StationCode", "Latitude", "Longitude", "Stage", "StageDescription", "Catch", "CatchPercentage"],
            "ftype": "point"
        },
        "summary": {
            "piid": "09916a05a97949cc81c20d4a6a7cc843-2",
            "urid": "sktgdb:2",
            "url": "http://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/sktgdb/FeatureServer/2",
            "name": "SKTFishDistributionSexRatio",
            "type": "Feature Layer",
            "def": "OBJECTID > 0",
            "fields": ["OBJECTID", "Year", "SurveyNumber", "SurveyStartDate", "SurveyEndDate", "Sex", "SecDescription", "StationCode", "Latitude", "Longitude", "Catch", "CatchPercentage"],
            "dtypes": ["esriFieldTypeInteger", "esriFieldTypeInteger", "esriFieldTypeInteger", "esriFieldTypeDate", "esriFieldTypeDate", "esriFieldTypeInteger", "esriFieldTypeString", "esriFieldTypeString", "esriFieldTypeDouble", "esriFieldTypeDouble", "esriFieldTypeInteger", "esriFieldTypeDouble"],
            "aliases": ["OBJECTID", "Year", "SurveyNumber", "SurveyStartDate", "SurveyEndDate", "Sex", "SecDescription", "StationCode", "Latitude", "Longitude", "Catch", "CatchPercentage"],
            "columns": ["OBJECTID", "Year", "SurveyNumber", "SurveyStartDate", "SurveyEndDate", "Sex", "SecDescription", "StationCode", "Latitude", "Longitude", "Catch", "CatchPercentage"],
            "ftype": "point"
        },
        "stations": {
            "piid": "09916a05a97949cc81c20d4a6a7cc843-0",
            "urid": "sktgdb:0",
            "url": "http://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/sktgdb/FeatureServer/0",
            "name": "SKT_Stations",
            "type": "Feature Layer",
            "def": null,
            "ftype": "point"
        }
    },
    version: appVersion
}
var map = null;
var mapview = null;
var resultsLayer = null;
var sql = "Year = " + app.Year + " AND SurveyNumber = " + app.SurveyNumber;// + " AND Sex = " + app.Sex;// SexDescription = 'male'
var skt = {
    "SexDescription": ["unknown", "male", "female"],
    "StageDescription": {
        "male": ["Undetermined", "(Stage 1)", "Pre-spawn", "Pre-spawn", "Pre-spawn", "Funct mature", "Spent"],
        "female": ["Undetermined", "(Stage 1)", "Pre-spawn", "Pre-spawn", "Mature", "Spawn precluded", "Spent"],
        "ratio": ["unknown", "male", "female"]
    },
    "colors": {
        "male": ["white", "khaki", "cyan", "cornflowerblue", "steelblue", "lightseagreen", "palegreen"],
        "female": ["white", "khaki", "pink", "magenta", "purple", "coral", "palegreen"],
        "ratio": ["khaki", "deepskyblue", "hotpink"]
    }
}
pass("VISUALIZATION-20170412_25");
var OPACITY = 0.55;
var rgb_white = [255,255,255,OPACITY];
var rgb_khaki = [ 240,230,140, OPACITY ];
var rgb_cyan = [ 0, 255, 255, OPACITY ];
var rgb_cornflowerblue = [ 100,149,237, OPACITY ];
var rgb_steelblue = [ 70, 130, 180, OPACITY ];
var rgb_lightseagreen = [ 32,178,170, OPACITY ];
var rgb_pink = [ 255,192,203, OPACITY ];
var rgb_magenta = [ 255, 0, 255, OPACITY ];
var rgb_purple = [ 128,0,128, OPACITY ];
var rgb_coral = [ 255,127,80, OPACITY ];
var rgb_palegreen = [ 152,251,152, OPACITY ];
var ringSizeStops = [
    { value: 1, size: 20 },
    { value: 5, size: 30 },
    { value: 10, size: 40 },
    { value: 25, size: 50 },
    { value: 50, size: 75 },
    { value: 100, size: 100 },
    { value: 240, size: 120 }
];
var maleStageColorStops =  [
    {value: 0, color: "white"},
    {value: 1, color: "khaki"},
    {value: 2, color: "cyan"},
    {value: 3, color: "cornflowerblue"},
    {value: 4, color: "steelblue"},
    {value: 5, color: "lightseagreen"},
    {value: 6, color: "palegreen"}
];
var femaleStageColorStops = [
    {value: 0, color: "white"},
    {value: 1, color: "khaki"},
    {value: 2, color: "pink"},
    {value: 3, color: "magenta"},
    {value: 4, color: "purple"},
    {value: 5, color: "coral"},
    {value: 6, color: "palegreen"}
];
var sexratioColorStops = [
    {value: 0, color: "khaki"},
    {value: 1, color: "deepskyblue"},
    {value: 2, color: "hotpink"}
]
var sizeVisVar = {
    type: "size",
    field: "Catch",
    valueUnit: "unknown",
    stops: ringSizeStops
}
var colorVisVar = {
    type: "color",
    field: "Stage",
    stops: [
        {value: 0, color: rgb_white},//"white"
        {value: 1, color: [ 255, 255, 0, OPACITY ]},//"yellow"
        {value: 2, color: [ 0, 255, 255, OPACITY ]},//"cyan"
        {value: 3, color: [ 255, 0, 255, OPACITY ]},//"magenta"
        {value: 4, color: [ 0, 0, 255, OPACITY ]},//"blue"
        {value: 5, color: [ 0, 255, 0, OPACITY ]},//"green"
        {value: 6, color: [ 255, 0, 0, OPACITY ]}//"red"
    ]
}
var maleColorVisVar = {
    type: "color",
    field: "Stage",
    stops: [
        {value: 0, color: rgb_white},//"white"
        {value: 1, color: [ 240,230,140, OPACITY ]},//"khaki"
        {value: 2, color: [ 0, 255, 255, OPACITY ]},//"cyan"
        {value: 3, color: [ 100,149,237, OPACITY ]},//"cornflowerblue"
        {value: 4, color: [ 70, 130, 180, OPACITY ]},//"steelblue"
        {value: 5, color: [ 32,178,170, OPACITY ]},//"lightseagreen"
        {value: 6, color: [ 152,251,152, OPACITY ]}//"palegreen"
    ]
}
var femaleColorVisVar = {
    type: "color",
    field: "Stage",
    stops: [
        {value: 0, color: rgb_white},//"white"
        {value: 1, color: [ 240,230,140, OPACITY ]},//"khaki"
        {value: 2, color: [ 255,192,203, OPACITY ]},//"pink"
        {value: 3, color: [ 255, 0, 255, OPACITY ]},//"magenta"
        {value: 4, color: [ 128,0,128, OPACITY ]},//"purple"
        {value: 5, color: [ 255,127,80, OPACITY ]},//"coral"
        {value: 6, color: [ 152,251,152, OPACITY ]}//"palegreen"
    ]
}
var ratioColorVisVar = {
    type: "color",
    field: "Sex",
    stops: [
        {value: 0, color: [ 240,230,140, OPACITY ]},//"khaki"
        {value: 1, color: [ 0,191,255, OPACITY ]},//"deepskyblue"
        {value: 2, color: [ 255,105,180, OPACITY ]}//"hotpink"
    ]
}
var opacityVisVar = {
    type: "opacityInfo",
      field: "Sex",
      //normalizationField: "SQ_KM",
      // features with 30 ppl/sq km or below are assiged the first opacity value
      stops: [
          { value: 0, opacity: OPACITY },
          { value: 1, opacity: OPACITY },
          { value: 2, opacity: OPACITY }
      ]
}

//========================
// AMD REQUIRED LOADER--20170407
//========================
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/Multipoint",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/tasks/GeometryService",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/widgets/Expand",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
    "dojo/_base/array",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
], function (
    Map,
    MapView,
    Graphic,
    Multipoint,
    FeatureLayer,
    GraphicsLayer,
    SimpleRenderer,
    UniqueValueRenderer,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    TextSymbol,
    GeometryService,
    QueryTask, Query,
    Expand,
    BasemapToggle,
    Home,
    Legend,
    ScaleBar,
    arrayUtils,
    on, dom
) {
    console.log("DO AMD REQUIRED LOADER");
    initLegend();
    map = new Map({
        basemap: "gray",
        ground: "world-elevation"
    });
    var extent = { // autocasts as new Extent()
        xmin: -9177811,
        ymin: 4247000,
        xmax: -9176791,
        ymax: 4247784,
        spatialReference: 102100
    }
    mapview = new MapView({
        container: "mapview",
        map: map,
        center: [-121.9, 38.15],
        zoom: 10
    });
    pass("BASEMAP TOGGLE-20170410");
    var bltoggle = new BasemapToggle({
        view: mapview,
        nextBasemap: "streets"
    });
    mapview.ui.add(bltoggle, "bottom-right");
    // Home widget--20170505
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
    pass("//-- DEFAULT OBJECT TEMPLATES FOR DEEP CLONING-20170420");
    aGraphic = new Graphic({
      "OBJECTID": 1,
      "Name": "esriGraphic",
      "Usage": "Global abstract graphic for cloning outside loader"
    });
    aMarker = new SimpleMarkerSymbol({
        color: "transparent",
        size: 10,
        outline: {
            color: "white",
            width: 0.5
        }
    });
    whiteMarker = new SimpleMarkerSymbol({
        style: "circle",
        color: rgb_white,
        size: 6,
        outline: {
            color: "white",
            width: 0.5
        }
    });
    crimsonText = new TextSymbol({
        color: "crimson",
        haloColor: "black",
        haloSize: "1px",
        text: "StationCode",//feature.attributes["StationCode"].toString(),
        xoffset: 10,
        yoffset: 0,
        font: {
            size: 12,
            family: "sans-serif",
            weight: "bold"
        }
    });
    var samplesPopupPlate = {
        title: "{Year} Survey#{SurveyNumber} Station-{StationCode}",
        //content: "{SexDescription} Stage={Stage}({StageDescription}) Catch={Catch}({CatchPercentage}%)",
        content: "<table><tr><th>Sex</th><td>{SexDescription}</td></tr>"
        + "<tr><th>Stage</th><td>{Stage} ({StageDescription})<td></tr>"
        + "<tr><th>Catch</th><td>{Catch} ({CatchPercentage}%)<td></tr></table>",
        fieldInfos: [{
            fieldName: "CatchPercentage",
            format: {
                digitSeparator: false,
                places: 2
            }
        }]
    }
    var sexratioPopupPlate = {  // autocastsas new PopupTemplate
        title: "{Year} Survey#{SurveyNumber} Station-{StationCode}",
        content: "Sex={Sex} ({SexDescription}),  Catch={Catch}({CatchPercentage}%)",
        fieldInfos: [{
            fieldName: "CatchPercentage",
            format: {
                digitSeparator: false,
                places: 2
            }
        }]
    }
    pass("ADD FETURE LAYER-20170407");
    stationsLayer = new FeatureLayer({
        url: app.layers.stations.url
    });
    map.add(stationsLayer);
    pass("RENDER LAYER FEATURE-20170407");
    var stationsMarker = whiteMarker.clone();
    stationsMarker.color = "white";
    stationsMarker.outline.color = "black";
    stationsLayer.renderer = new SimpleRenderer({
        symbol: stationsMarker
    });
    pass("Male Stages Caught Layer-20170412");
    maleRenderer = new SimpleRenderer({
        symbol: whiteMarker.clone(),
        visualVariables: [maleColorVisVar, sizeVisVar, opacityVisVar]
    });
    maleLayer = new FeatureLayer({
        url: app.layers.samples.url,
        definitionExpression: "Sex = 1 AND Catch > 0",
        outFields: ["*"],
        renderer: maleRenderer,
        popupTemplate: samplesPopupPlate
    });
    map.add(maleLayer);
    pass("Female Stages Caught Layer-20170412");
    femaleRenderer = new SimpleRenderer({
        symbol: whiteMarker.clone(),
        visualVariables: [femaleColorVisVar, sizeVisVar, opacityVisVar]
    });
    femaleLayer = new FeatureLayer({
        url: app.layers.samples.url,
        definitionExpression: "Sex = 2 AND Catch > 0",
        outFields: ["*"],
        renderer: femaleRenderer,
        popupTemplate: samplesPopupPlate
    });
    map.add(femaleLayer);
    pass("Sex Ratio Layer-20170412");
    ratioRenderer = new SimpleRenderer({
        symbol: whiteMarker.clone(),
        visualVariables: [ratioColorVisVar, sizeVisVar]
    });
    ratioLayer = new FeatureLayer({
        url: app.layers.summary.url,
        definitionExpression: "Catch > 0",
        outFields: ["*"],
        renderer: ratioRenderer,
        popupTemplate: sexratioPopupPlate
    });
    map.add(ratioLayer);
    maleLayer.visible = false;
    femaleLayer.visible = false;
    ratioLayer.visible = false;
    var failRenderer = new UniqueValueRenderer({// SimpleRenderer({
        field: "Sex",
        field2: "Stage",
        fieldDelimiter: ", ",
        defaultSymbol: new SimpleMarkerSymbol({
            color: "white",
            outline: {
                color: "white",
                width: 0.5
            }
        }),
        label: "Catch per Stage",
        visualVariables: [{
            type: "size",  // indicates this is a color visual variable
            field: "Catch",  // total population in poverty
            //normalizationField: "TOTPOP_CY",  // total population
            minDataValue: 1,  // features where < 10% of the pop in poverty
            maxDataValue: 250,  // features where > 30% of the pop in poverty
            minSize: 15,  // size of marker in pts
            maxSize: 125  // size of marker in pts
        }, {
            type: "color",
            stops: [
                //{value: "0, 0", color: "transparent"},
                {value: "1, 0", color: "white"},
                {value: "1, 1", color: "khaki"},
                {value: "1, 2", color: "cyan"},
                {value: "1, 3", color: "cornflowerblue"},
                {value: "1, 4", color: "steelblue"},
                {value: "1, 5", color: "lightseagreen"},
                {value: "1, 6", color: "palegreen"},
                {value: "2, 0", color: "white"},
                {value: "2, 1", color: "khaki"},
                {value: "2, 2", color: "pink"},
                {value: "2, 3", color: "magenta"},
                {value: "2, 4", color: "purple"},
                {value: "2, 5", color: "coral"},
                {value: "2, 6", color: "palegreen"}
            ]
        }]
    });
    pass("Sampling Data Layer-20170410");
    samplesRingRenderer = new UniqueValueRenderer({
        field: "Sex",
        field2: "Stage",
        fieldDelimiter: ", ",
        defaultSymbol: new SimpleMarkerSymbol(),
        visualVariables: [{
            type: "size",
            field: "Catch",
            stops: ringSizeStops
        }]
    });
    for (var i = 0; i < maleStageColorStops.length; i++) {
        samplesRingRenderer.addUniqueValueInfo(
            "1, " + maleStageColorStops[i].value,
            new SimpleMarkerSymbol({
                color: "transparent",
                outline: {
                    color: maleStageColorStops[i].color,
                    width: 3
                }
            })
        )
    }
    for (var i = 0; i < femaleStageColorStops.length; i++) {
        samplesRingRenderer.addUniqueValueInfo(
            "2, " + femaleStageColorStops[i].value,
            new SimpleMarkerSymbol({
                color: "transparent",
                outline: {
                    color: femaleStageColorStops[i].color,
                    width: 3
                }
            })
        )
    }
    samplesUrl = app.layers.samples.url;
    samplesLayer = new FeatureLayer({
        url: app.layers.samples.url,
        definitionExpression: app.layers.samples.def,
        outFields: ["*"],
        renderer: samplesRingRenderer,
        popupTemplate: samplesPopupPlate
    });
    map.add(samplesLayer);
    summaryRingRenderer = new UniqueValueRenderer({
        field: "Sex",
        defaultSymbol: new SimpleMarkerSymbol(),
        visualVariables: [{
            type: "size",
            field: "Catch",
            //normalizationField: "SQ_KM",
            stops: ringSizeStops
        }]
    });
    for (var i = 0; i < sexratioColorStops.length; i++) {
        summaryRingRenderer.addUniqueValueInfo(
            sexratioColorStops[i].value,
            new SimpleMarkerSymbol({
                color: "transparent",
                outline: {
                    color: sexratioColorStops[i].color,
                    width: 3
                }
            })
        );
    }
    summaryUrl = app.layers.summary.url;
    summaryLayer = new FeatureLayer({
        url: app.layers.summary.url,
        definitionExpression: app.layers.summary.def,
        outFields: ["*"],
        renderer: summaryRingRenderer,
        popupTemplate: sexratioPopupPlate
    });
    map.add(summaryLayer);
    pass(" LEGEND WIDGET-20170410");
    var legend = new Legend({
        view: mapview,
        container: document.createElement("div"),
        layerInfos: [
            {
                layer: samplesLayer,
                title: "Delta Smelt Catch by Stage"
            },
            {
                layer: ratioLayer,
                title: "Delta Smelt Sex Raio"
            }
        ]
    });
    // mapview.ui.add(legend, "bottom-left"); //20170605-put legend in toggle
    var lgExpand = new Expand({
        view: mapview,
        content: legend.domNode,
        expandIconClass: "esri-icon-layer-list"
    });
    mapview.ui.add(lgExpand, "bottom-left");
    pass(" Create graphics layer and symbol to use for displaying the results of query");
    resultsLayer = new GraphicsLayer({
        id: "resultsLayer"
    });
    map.add(resultsLayer);
    pass(" Converts an array of XY-coordinates--https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-GeometryService.html#toGeoCoordinateString");
    geomSer = new GeometryService({
        "url": "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
    });
    pass(" QUERYTASK-20170410");
    samplesQueryTask = new QueryTask({
        url: samplesUrl
    });
    samplesParams = new Query({
        returnGeometry: true,
        orderByFields: ["Catch ASC", "Stage ASC"],
        outFields: ["*"]
    });
    summaryQueryTask = new QueryTask({
        url: summaryUrl
    });
    summaryParams = new Query({
        returnGeometry: true,
        orderByFields: ["Catch ASC", "Stage ASC"],
        outFields: ["*"]
    });
    initStationLabelsLayer(FeatureLayer, Query, QueryTask, TextSymbol, UniqueValueRenderer);
    $("draw-map").addEventListener("click", function (e) {
        drawMap();
    });
    $("showlabels").addEventListener("click", function (e) {
        stationsLayer.visible = $("showlabels").checked;
        stationLabelsLayer.visible = $("showlabels").checked;
        addmsg("Show station labels");
    });
    // Watches for property changes--https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html#watch
    //mapwatch(map, mapview, watchUtils);
    mapview.on("click", function (evt) {
        mapviewOnclick(evt);
    });
    pass("//-- DATASET STATISTICS-20170411");
    samplesParams.orderByFields = ["Year ASC", "SurveyNumber ASC", "StationCode ASC", "Sex ASC", "Stage ASC"];
    sktSearch("OBJECTID > 0", samplesParams, samplesQueryTask, sktStatsCallback);
    summaryParams.orderByFields = ["Year ASC", "SurveyNumber ASC", "StationCode ASC", "Sex ASC"];
    sktSearch("OBJECTID > 0", summaryParams, summaryQueryTask, sktStatsCallback);
    pass(" PIE CHART TOTAL");
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    pass("//-- INIT-20170420");
    $("Year").value = app.Year;
    $("SurveyNumber").value = app.SurveyNumber;
    $("Sex").value = app.Sex;
    $("showlabels").checked = true;
    $("rings").checked = true;
    $("map-ll").value = "";
    $("map-xy").value = "";
    drawMap();
    esriMultipoint = Multipoint; //GLOBALIZE-20170526

    if (window.location.search.indexOf("msg=on") > 0) {
        show("msgbin-toggle");
    }
    console.log("DONE Required");
});

//=================================
// FUNCTIONS
//=================================
// Pass required classes into fxns defined outside of loader for them to work
function drawChart() {
    //--- Init pie chart legend on page load
    var data = google.visualization.arrayToDataTable([
      ['Stage', 'Percentage'],
      ['1', 0],
      ['2 (Pre-spawn)', 0],
      ['3 (Pre-spawn)', 25],
      ['4 (Pre-spawn)', 75],
      ['5 (Funct mature)', 0],
      ['6 (Spent)', 0]
    ]);

    var options = {
        title: 'Delta Smelt Stages',
        colors: [
            'khaki', 'cyan', 'cornflowerblue', 'steelblue', 'lightseagreen', 'palegreen'
        ],
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}
function drawMap() {
    // Onclick of Draw Map button
    addmsg('CLICKED draw-map');
    show("map-loading");
    $("data-msg").innerHTML = "Querying...";

    var year = $("Year").value;
    var survey = $("SurveyNumber").value;
    var sex = $("Sex").value;
    var reportType = $("Sex").options[$("Sex").selectedIndex].innerHTML;
    var type = $("Sex").options[$("Sex").selectedIndex].title;
    $("survey").innerHTML = survey;
    $("surveyyear").innerHTML = year;
    $("reporttype").innerHTML = reportType;
    if (reportType == "Sex Ratios") {
        var sql = "Year = " + year + " AND SurveyNumber = " + survey + " AND Catch > 0";
        samplesLayer.definitionExpression = "OBJECTID < -1";
        if ($("circles").checked == true) {
            summaryLayer.renderer = ratioRenderer;
        } else if ($("rings").checked == true) {
            summaryLayer.renderer = summaryRingRenderer;
        }
        if ($("bars").checked == true) {
            summaryLayer.definitionExpression = "OBJECTID < -1";
            pass("Draw samples data by svg bars");
        } else {
            summaryLayer.definitionExpression = sql;
        }
        querySamples(sql, summaryParams, summaryQueryTask, samplesOutput);
        hide("legend-keys-male");
        hide("legend-keys-female");
    } else {
        var sql = "Year = " + year + " AND SurveyNumber = " + survey + " AND Sex = " + sex;
        summaryLayer.definitionExpression = "OBJECTID < -1";
        if ($("circles").checked == true) {
            if ($("Sex").value == 1) {
                samplesLayer.renderer = maleRenderer;
            } else {
                samplesLayer.renderer = femaleRenderer;
            }
        } else if ($("rings").checked == true) {
            samplesLayer.renderer = samplesRingRenderer;
        }
        if ($("bars").checked == true) {
            samplesLayer.definitionExpression = "OBJECTID < -1";
            pass("Draw samples data by svg bars");
        } else {
            samplesLayer.definitionExpression = sql;
        }
        querySamples(sql, samplesParams, samplesQueryTask, samplesOutput);
        hide("legend-keys-ratio");
        hide("legend-keys-" + (type == "male" ? "female" : "male"));
    }
    show("legend-keys-" + type);
    hide("map-loading");
    $("data-msg").innerHTML = "";
}
function mapviewOnclick(evt) {
    // Upon clicking on mapview sending a mouse click event
    var mapx = evt.mapPoint.x;
    var mapy = evt.mapPoint.y;
    addmsg("CLICKED ON mapxy: " + mapx.toFixed(3) + ", " + mapy.toFixed(3));
    $("map-xy").value = mapx.toFixed(3) + ", " + mapy.toFixed(3);
    var params = {};
    params.sr = evt.mapPoint.spatialReference;
    params.coordinates = [[mapx, mapy]];
    params.conversionType = "dd";
    geomSer.toGeoCoordinateString(params).then(function (response) {
        //addmsg("mapclicked=" + response[0]);
        //addmsg(response);
        $("map-ll").value = response[0];
        addmsg("CLICKED ON map-latlon: " + response[0])
    });
}
function promiseRejected(err) {
    console.error("Promise rejected: ", err.message);
}
function sktSearch(sql, params, queryTask, callback) {
    addmsg("DO sktSearch: " + sql);
    $("data-msg").innerHTML = "Querying ...";
    $("charts").innerHTML = "";
    $("tables").innerHTML = "";
    params.where = sql;
    queryTask.execute(params)
    .then(callback)
    .otherwise(promiseRejected)
}
function sktStatsCallback(response) {
    addmsg("CALLBACK sktStatsCallback: " + response.features.length);
    var features = response.features;
    var catchmax = 0;
    var catchmin = 0;
    var categorylist = "sex&stage|";//|sex=sexdesc&stage=stagedesc
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var attributes = feature.attributes;
        var count = attributes["Catch"];
        if (count > catchmax) {
            catchmax = count;
        }
        if (count < catchmin) {
            catchmin = count;
        }
        var category = attributes["Sex"] + "=" + attributes["SexDescription"] + "&" + attributes["Stage"] + "=" + attributes["StageDescription"];
        if (categorylist.indexOf(category) < 0) {
            categorylist += "|" + category;
        }
    }
    var msgs = "";
    addmsg("MinCatch:" + catchmin);
    msgs += "MinCatch:" + catchmin + "<br>";
    addmsg("MaxCatch:" + catchmax);
    msgs += "MaxCatch:" + catchmax + "<br>";
    addmsg("Categories:");
    msgs += "Categories:" + "<br>";
    var cats = categorylist.split("||")[1].split("|");
    for (var i = 0; i < cats.length; i++) {
        addmsg(cats[i]);
        msgs += cats[i] + "<br>";
    }
    //$("tables").innerHTML = msgs;
    hide("map-loading");
    $("data-msg").innerHTML = "";//features.length + " rows found"
    addmsg("DONE sktStatsCallback");
}
function querySamples(sql, params, queryTask, callback) {
    addmsg("DO querySamples: " + sql);
    $("data-msg").innerHTML = "Querying ...";
    $("charts").innerHTML = "";
    $("tables").innerHTML = "";
    params.where = sql;
    params.orderByFields = ["StationCode ASC", "Catch DESC"];
    queryTask.execute(params)
    .then(callback)
    .otherwise(promiseRejected)
}
function samplesOutput(response) {
    addmsg("CALLBACK samplesOutput: " + response.features.length);
    resultsLayer.removeAll();
    var samplesResults = [];
    //var cols = "|StationCode|Stage|Catch|";
    for (var i = 0; i < response.features.length; i++) {
        var feature = response.features[i];
        //for (fieldname in feature.attributes) {
        //    if (cols.indexOf(fieldname + "|") > 0) {
        //        $("tables").innerHTML += fieldname + "=" + feature.attributes[fieldname];
        //    }
        //}
        //$("tables").innerHTML += "<br>";
        if (i == 0) {
            //$("result-title").innerHTML += " (" + attributes["SurveyStartDate"].toString().split(" ")[0] + " - " + attributes["SurveyEndDate"].toString().split(" ")[0] + ")";
            var borntime = feature.attributes["SurveyStartDate"];
            var endtime = feature.attributes["SurveyEndDate"];
            var borndate = new Date(borntime);
            var enddate = new Date(endtime);
            var borned = borndate.getMonth() + 1 + "/" + borndate.getDate() + "/" + borndate.getFullYear();
            var ended = enddate.getMonth() + 1 + "/" + enddate.getDate() + "/" + enddate.getFullYear();
            var msg = " (" + borned + " - " + ended + ")";
            $("dates").innerHTML = msg;
        }
        feature.symbol = crimsonText.clone();
        feature.symbol.text = feature.attributes["StationCode"].toString();
        resultsLayer.add(feature);
        samplesResults.push(feature);
    }
    var type = $("Sex").options[$("Sex").selectedIndex].title;
    if (type == "ratio") {
        var data = summaryTable(response.features);
    } else {
        var data = samplesTable(response.features);
    }
    plotPies(data, type);
    if ($("bars").checked == true) {
        var sortdata = samplesBars(response.features);
    }
    //resultsLayer.addMany(samplesResults);//FAIL to labeltext
    //var ptcoll = new esriMultipoint({
    //    points: samplesResults
    //});
    //var zoombox = ptcoll.extent.expand(1.5);
    //mapview.goTo(zoombox);
    if (samplesResults.length < 6) {
        mapview.goTo(samplesResults).then(
            function () {
                mapview.goTo(mapview.extent.expand(1.2));
            });
    } else {
        mapview.goTo(samplesResults);
    }
    hide("map-loading");
    $("data-msg").innerHTML = "";
    addmsg("DONE samplesOutput");
}
function add(a, b) {
    return a + b;
}
function samplesTable(features) {
    addmsg("DO samplesTable: " + features.length);
    var data = [];
    var row = ["Station","Stage", 1, 2, 3, 4, 5, 6, "Sum"];
    data.push(row);
    var sums = [0, 0, 0, 0, 0, 0, 0];
    var laststn = 0;
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var station = parseInt(feature.attributes["StationCode"]);
        //addmsg("station=" + [station]);
        var stage = parseInt(feature.attributes["Stage"]);//20170605 convert string
        //addmsg("station,stage=" + [station, stage]);
        var cnt = feature.attributes["Catch"];
        addmsg("station,stage,caught=" + [station, stage, cnt]);
        if (cnt == undefined || cnt == null) {
            cnt = 0;
        }
        if (station != laststn) {
            if (laststn > 0) {
                var sum = row.reduce(add, 0) - laststn;
                row[8] = sum;
                data.push(row);
            }
            var row = [];
            row.push(station);
            addmsg("station=" + row);
            for (var k = 0; k < 8; k++) {
                row.push(k*0);
            }
        }
        row[(stage + 1)] = cnt;
        sums[stage] = sums[stage] + cnt;
        addmsg("row=" + row);
        laststn = station;
        if (i == (features.length - 1)) {
            var sum = row.reduce(add, 0) - laststn;
            row[8] = sum;
            data.push(row);
        }
    }
    var sumtotal = sums.reduce(add, 0);
    var row = (["Total"]).concat(sums, [sumtotal]);
    data.push(row);
    var tbl = document.createElement("table");
    tbl.className = "tbl";
    for (var i = 0; i < data.length; i++) {
        var arr = data[i];
        var row = tbl.insertRow(i);
        for (var j = 0; j < arr.length; j++) {
            var cell = row.insertCell(j);
            cell.innerHTML = arr[j];
            if (i == 0 || j == 0) {
                cell.className = "hdr";
            }
            if (i > 0 && j > 0) {
                cell.className = "cell";
            }
        }
    }
    $("tables").appendChild(tbl);
    return data;
}
function summaryTable(features) {
    addmsg("DO summaryTable: " + features.length);
    var data = [];
    var row = ["Station","Sex", 1, 2, "Sum"];
    data.push(row);
    var sums = [0, 0, 0];
    var laststn = 0;
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var station = parseInt(feature.attributes["StationCode"]);
        var sex = parseInt(feature.attributes["Sex"]);//20170605 fix stringval
        var cnt = feature.attributes["Catch"];
        if (cnt == undefined || cnt == null) {
            cnt = 0;
        }
        if (station != laststn) {
            if (laststn > 0) {
                var sum = row.reduce(add, 0) - laststn;
                row[4] = sum;
                data.push(row);
            }
            var row = [];
            row.push(station);
            for (var k = 0; k < 4; k++) {
                row.push(k*0);
            }
        }
        row[(sex + 1)] = cnt;
        sums[sex] = sums[sex] + cnt;
        laststn = station;
        if (i == (features.length - 1)) {
            var sum = row.reduce(add, 0) - laststn;
            row[4] = sum;
            data.push(row);
        }
    }
    var sumtotal = sums.reduce(add, 0);
    var row = (["Total"]).concat(sums, [sumtotal]);
    data.push(row);
    var tbl = document.createElement("table");
    tbl.className = "tbl";
    for (var i = 0; i < data.length; i++) {
        var arr = data[i];
        var row = tbl.insertRow(i);
        for (var j = 0; j < arr.length; j++) {
            var cell = row.insertCell(j);
            cell.innerHTML = arr[j];
            if (i == 0 || j == 0) {
                cell.className = "hdr";
            }
            if (i > 0 && j > 0) {
                cell.className = "cell";
            }
        }
    }
    $("tables").appendChild(tbl);
    return data;
}
function plotPies(data, type) {
    addmsg("Plot tabulated data into separate pie charts");
    var hrow = data.shift();  // Get rid of first header rows
    var cells = data.pop();  // Get last row that has the sumtotal
    var stn = cells.shift();
    var sum = cells.pop();
    if (type == "ratio") {
        var category = "Sex";
    } else {
        var category = "Stage";
    }
    var gdata = [[category, 'Percentage']];
    for (var k = 0; k < cells.length; k++) {
        gdata.push([category + '-' + k, Math.round(cells[k] * 100 / sum)]);
    }
    chartPie(gdata, type, null, google);
    for (var i = 0; i < data.length; i++) {
        var stn = data[i][0];
        var dv = document.createElement("div");
        dv.id = "piechart-" + stn;
        dv.style.border = "1px solid gainsboro";
        dv.style.float = "left";
        dv.style.height = "200px";
        dv.style.width = "200px";
        $("charts").appendChild(dv);
    }
    while (data.length > 0) {
        var cells = data.shift();
        var stn = cells.shift();
        var sum = cells.pop();
        var gdata = [[category, 'Percentage']];
        for (var k = 0; k < cells.length; k++) {
            gdata.push([category + '-' + k, Math.round(cells[k] * 100 / sum)]);
        }
        chartPie(gdata, type, stn, google);
    }
}
function chartPie(gdata, type, station, google) {
    var data = google.visualization.arrayToDataTable(gdata);
    var options = {
        colors: skt.colors[type],
        legend: { position: 'none' }
    };
    if (station == undefined || station == null) {
        var uiid = "piechart";
        if (type == "ratio") {
            options.title = "Delta Smelt Sex Ratio";
        } else {
            options.title = "Delta Smelt Stages";
        }
        options['legend'] = { position: 'bottom' };
    } else {
        var uiid = "piechart-" + station;
        options.title = "Station " + station;
    }
    var chart = new google.visualization.PieChart(document.getElementById(uiid));
    chart.draw(data, options);
}
//fxn_chartPie was here-0170502
function initLegend() {
    for (type in skt.StageDescription) {
        var tbl = document.createElement("table");
        tbl.id = "legend-keys-" + type;
        tbl.style.margin = "5px";
        tbl.style.borderSpacing = "5px";
        var cats = skt.StageDescription[type];
        for (var i = 0; i < cats.length; i++) {
            var row = tbl.insertRow(i);
            var cell = row.insertCell(0);
            var color = skt.colors[type][i];
            //cell.style.backgroundColor = skt.colors[type][i];
            //cell.style.border = "1px solid silver";
            cell.style.height = "15px";
            cell.style.width = "30px";
            //cell.innerHTML = "&nbsp;";
            cell.innerHTML = '<svg height="18" width="30">' +
            '<rect height="18" width="30" style="fill:' + color + ';stroke-width:1;stroke:silver" />' +
            '</svg>';
            cell.title = "Stage-" + i;
            var cell = row.insertCell(1);
            cell.style.padding = "0px";
            cell.innerHTML = cats[i];
        }
        if (type != "male") {
            tbl.style.display = "none";
        }
        $("legend-keys").appendChild(tbl);
    }
}
function initUI() {
    $("circles").addEventListener("click", function (e) {
        if ($("Sex").value == 1) {
            samplesLayer.renderer = maleRenderer;
        } else if ($("Sex").value == 2) {
            samplesLayer.renderer = femaleRenderer;
        } else {
            summaryLayer.renderer = ratioRenderer;
        }
    });
    $("rings").addEventListener("click", function (e) {
        if ($("Sex").value == 1) {
            samplesLayer.renderer = samplesRingRenderer;
        } else if ($("Sex").value == 2) {
            samplesLayer.renderer = samplesRingRenderer;
        } else {
            summaryLayer.renderer = summaryRingRenderer;
        }
    });
}
//--stationLabelsLayer-20170427
function initStationLabelsLayer(FeatureLayer, Query, QueryTask, TextSymbol, UniqueValueRenderer) {
    addmsg("DO initStationLabelsLayer: use query task to create unique station number texts on feature layer");
    var labelfield = "StationCode";
    stationLabelsLayer = new FeatureLayer({
        url: app.layers.stations.url,
        //renderer: renderer,
        popupTemplate: {
            content: "{*}"
        }
    });
    map.add(stationLabelsLayer);
    var renderer = new UniqueValueRenderer({
        field: "StationCode",
        //defaultLabel: "Station",
        //uniqueValueInfos: uniqueValueInfos,
        defaultSymbol: new TextSymbol({
            color: "orange",
            haloColor: "red",
            haloSize: "1px",
            text: "+",
            xoffset: 0,
            yoffset: 0,
            font: {  // autocast as esri/symbols/Font
                size: 10,
                family: "sans-serif",
                weight: "bolder"
            }
        })
    });
    var query = new Query();
    query.where = "1=1";
    //query.where = "OBJECTID > 0";
    query.returnGeometry = true;
    query.outFields = [labelfield];
    var queryTask = new QueryTask({
        url: app.layers.stations.url
    });
    queryTask.execute(query).then(function (result) {
        console.log("CALLBACK initStationLabelsLayer_queryTask result: " + result.features.length);
        result.features.forEach(function (feature) {
            renderer.addUniqueValueInfo({
                value: feature.attributes[labelfield],
                symbol: new TextSymbol({
                    color: "orange",
                    haloColor: "navy",
                    haloSize: "1px",
                    text: feature.attributes[labelfield].toString(),
                    xoffset: 10,
                    yoffset: 0,
                    font: {  // autocast as esri/symbols/Font
                        size: 10,
                        family: "sans-serif",
                        weight: "bold"
                    }
                })
            });
            stationLabelsLayer.renderer = renderer;
        })
    });
    //stationsLayer.on("layerview-create", function (evt) {
    //});
}
function symbolsize(x) {
    // Calculate symbol size
    var pv = 0;
    var ps = 0;
    for (var i = 0; i < ringSizeStops.length; i++) {
        var v = ringSizeStops[i].value;
        var s = ringSizeStops[i].size;
        if (x > v) {
            pass("Try next value");
        } else if (x == v){
            var y = s;
        } else if (x < v) {
            var y = Math.round( ((x - pv)/(v - pv))*(s - ps) + ps);
        }
        pv = v;
        ps = s;
    }
    return y;
}
function samplesBars(features) {
    addmsg("DO samplesBars: " + features.length);
    pass("Sort by Catch-OBJECTID array and then draw feature by OBJECTID from large catch to small");
    //still does not avoid problem of 2 diff stages of same size overlapping on a station-20170501
    resultsLayer.removeAll();
    var samplesResults = [];
    var data = [];
    var d = "m100 100 L100 0 A100 100 1 1 0 200 100";//3 quarters pie from 12 to 3 oclock counterclockwise
    var laststation = null;
    var xshift = 0;
    var yshift = 0;
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var attributes = feature.attributes;
        var oid = attributes["OBJECTID"];
        var station = attributes["StationCode"];
        var sex = attributes["Sex"];
        var cnt = attributes["Catch"];
        if ($("bars").checked == true) {
            if ($("Sex").value > 0) {
                var stage = attributes["Stage"];
                var s = cnt + "-" + station + "-" + stage + "-" + oid;
                var dotcolor = skt.colors[skt.SexDescription[sex]][stage];
                feature.popupTemplate = {
                    title: "#{StationCode}",
                    content: "Stage-{Stage}({StageDescription}): {Catch}"
                }
            } else {
                var s = cnt + "-" + station + "-" + oid;
                var dotcolor = skt.colors.ratio[sex];
                feature.popupTemplate = {
                    title: "#{StationCode}",
                    content: "Count: {Catch}"
                }
            }
        }
        data.push(s);
        if (station != laststation) {
            xshift = 0;
            yshift = 0;
        }
        //--Symbolize feature with svg
        var h = 10; // A catchsize smaller than this becomes thinner bar//20170504
        var v = barsize(cnt);// 10 + cnt * 5;// symbolsize(cnt);
        var d = "m0 0 V" + v + " H" + h + " V0 Z";
        addmsg(station + "=" + cnt + ", d=" + d);
        var svgbar = aMarker.clone();
        svgbar.color = dotcolor;
        svgbar.path = d;
        svgbar.xoffset = xshift;
        svgbar.size = v;// 50; // all same height if set this constant
        feature.symbol = svgbar;
        //feature.symbol = new SimpleMarkerSymbol({
        //    color: dotcolor,// "yellow",
        //    outline: {
        //        color: "white",
        //        width: 0.5
        //    },
        //    path: d,
        //    //style: "circle",
        //    xoffset: xshift,
        //    size: 50
        //});
        samplesResults.push(feature);
        if (station != laststation) {
            var stationlabel = aGraphic.clone();
            stationlabel.geometry = feature.geometry;
            var stationtext = crimsonText.clone();
            stationtext.color = "blue";
            stationtext.haloColor = "yellow";
            stationtext.text = station;
            stationtext.xoffset = -12;
            stationtext.yoffset = 5;
            stationtext.font = {
                size: 12,
                family: "sans-serif",
                weight: "bold"
            }
            stationlabel.symbol = stationtext;
        }
        samplesResults.push(stationlabel);
        //stationlabel.symbol = new TextSymbol({
        //    color: "blue",
        //    haloColor: "yellow",
        //    haloSize: "1px",
        //    text: attributes["StationCode"],
        //    xoffset: 3,
        //    yoffset: 3,
        //    font: {  // autocast as esri/symbols/Font
        //        size: 12,
        //        family: "sans-serif",
        //        weight: "bolder"
        //    }
        //});
        laststation = station;
        xshift = xshift + 9;
        yshift = yshift + 20;// v; //(v / 2) NO EFFECT?
        //end loop thru allfeatures
    }
    resultsLayer.addMany(samplesResults);
    //mapview.goTo(samplesResults);
    data.sort();
    data.reverse();
    return data;
}
function barsize(x) {
    //20170504--Smoothing transformation: y = sqrt(x) or y = sqrt(x) + sqrt(x + 1)
    var min = 10;
    var y = min;
    if (x <= min) {
        y = min;
    } else if (x > min && x <= 20) {
        y = min + x * Math.log(x);
    } else if (20 > min && x <= 30) {
        y = x * Math.log(x);
    } else if (30 > min && x <= 50) {
        y = min + Math.sqrt(x) + Math.sqrt(x + 1);
    } else if (50 > min && x <= 100) {
        y = min + Math.sqrt(x) + Math.sqrt(x + 1);
    } else {
        y = min + Math.sqrt(x) + Math.sqrt(x + 1);
    }
    return y;
}
console.log('LOADED skt.js');

//**************************** NOT USED ********************************
function popPie(PopupTemplate, poptitle, pietitle, piefields, tipfield) {
    //--Create a new popup with pie chart--20160915
    var popup = new PopupTemplate();
    popup.title = poptitle;
    popup.content = [];
    popup.content.push(
        {
            type: "media",
            mediaInfos: [{
                title: pietitle,
                type: "pie-chart",
                caption: "",
                value: {
                    theme: "Grasshopper",
                    fields: piefields,
                    normalizeField: null,
                    tooltipField: tipfield
                }
            }]
        }
    );
    return popup;
}
