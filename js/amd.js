// amd.js 20191023 dfgchiang
console.log('Loading amd');
//var JSDIR = window.location.href.split("/" + app.site)[0] + app.site + "/js/";
var JSDIR = function () {
    var hostpath = location.href.split(location.host)[0] + location.host;
    var jspath = location.pathname.replace(DEFAULT_PAGE, '') + 'js/';
    return hostpath + jspath;
}(); // 20181128 FAIL WHEN LOADED BY FILE
console.log('JSDIR=' + JSDIR);

//=========================
// AMD REQUIRED LOADER
//=========================
let amdlibs = [
    "esri/config",
    "esri/request",
    "esri/Graphic",
    "esri/Map",
    "esri/WebMap",
    "esri/layers/CSVLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/SceneLayer",
    "esri/layers/TileLayer",
    "esri/layers/WMSLayer",
    "esri/tasks/IdentifyTask",
    "esri/tasks/support/IdentifyParameters",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/FeatureForm"
];
let amdfun = function (
    esriConfig,
    esriRequest,
    Graphic,
    Map,
    WebMap,
    CSVLayer,
    FeatureLayer,
    GeoJSONLayer,
    GraphicsLayer,
    MapImageLayer,
    SceneLayer,
    TileLayer,
    WMSLayer,
    IdentifyTask, IdentifyParameters,
    QueryTask, Query,
    MapView,
    SceneView,
    Legend,
    Expand, FeatureForm
) {
    esriConfig.geometryServiceUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer";
    //esriConfig.portalUrl = "https://cdfw.maps.arcgis.com";
    //-- GLOBALIZE FOR FUNCTIONS OUTSIDE OF AMDREQURED
    asRequest = esriRequest;
    EsriFeatureForm = FeatureForm;
    EsriFeatureLayer = FeatureLayer;
    EsriGraphic = Graphic;
    EsriGraphicsLayer = GraphicsLayer;
    EsriMapImageLayer = MapImageLayer;
    //EsriPoint = Point;
    //EsriPolygon = Polygon;
    EsriQueryTask = QueryTask;
    EsriQuery = Query;
    EsriTileLayer = TileLayer;
    // CSVLAYER
    const csvurl =
        "https://arcgis.github.io/arcgis-samples-javascript/sample-data/hurricanes.csv";

    const csvLayer = new CSVLayer({
        title: "Hurricanes",
        url: csvurl,
        copyright: "NOAA",
        popupTemplate: {
            title: "{Name}",
            content: [{
                    type: "text",
                    text: "Category {Category} storm with that occurred at {ISO_time}."
                        },
                {
                    type: "fields",
                    fieldInfos: [{
                            fieldName: "wmo_pres",
                            label: "Pressure"
                                },
                        {
                            fieldName: "wmo_wind",
                            label: "Wind Speed (mph)"
                                }
                            ]
                        }
                    ],
            fieldInfos: [{
                fieldName: "ISO_time",
                format: {
                    dateFormat: "short-date-short-time"
                }
                    }]
        },
        renderer: {
            type: "unique-value",
            field: "Category",
            uniqueValueInfos: createUniqueValueInfos()
        }
    });
    //            const map = new WebMap({
    //                // contains a basemap with a South Pole Stereographic projection
    //                // the CSVLayer coordinates will re-project client-side
    //                // with the Projection Engine to match the view's Spatial Reference
    //                basemap: {
    //                    portalItem: {
    //                        id: "3113eacc129942b4abde490a51aeb33f"
    //                    }
    //                },
    //                layers: [csvLayer]
    //            });

    // GEOJSONLAYER 
    // If external files are not on the same domain as your website, a CORS enabled server
    // or a proxy is required.
    const geojsonurl =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
    const template = {
        title: "Earthquake Info",
        content: "Magnitude {mag} {type} hit {place} on {time}",
        fieldInfos: [{
            fieldName: "time",
            format: {
                dateFormat: "short-date-short-time"
            }
                }]
    };

    const renderer = {
        type: "simple",
        field: "mag",
        symbol: {
            type: "simple-marker",
            color: "orange",
            outline: {
                color: "white"
            }
        },
        visualVariables: [{
            type: "size",
            field: "mag",
            stops: [{
                    value: 2.5,
                    size: "4px"
                        },
                {
                    value: 8,
                    size: "40px"
                        }
                    ]
                }]
    };

    const geojsonLayer = new GeoJSONLayer({
        url: geojsonurl,
        copyright: "USGS Earthquakes",
        popupTemplate: template,
        renderer: renderer //optional
    });
    // IDENTIFY TASK ON SOILS TILE LAYER
    // URL to the map service where the identify will be performed
    var soilURL =
        "https://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer";

    // Add the map service as a TileLayer for fast rendering
    // Tile layers are composed of non-interactive images. For that reason we'll
    // use IdentifyTask to query the service to add interactivity to the app
    var soilsLayer = new TileLayer({
        url: soilURL,
        opacity: 0.85
    });
    // MAPIMAGELAYER SAMPLE
    var permitsLayer = new MapImageLayer({
        portalItem: {
            // autocasts as new PortalItem()
            id: "d7892b3c13b44391992ecd42bfa92d01"
        }
    });
    map = new Map({
        basemap: "streets", //"gray", "osm", "dark-gray",
        //                extent: {
        //                    // autocasts as new Extent()
        //                    xmin: -9177811,
        //                    ymin: 4247000,
        //                    xmax: -9176791,
        //                    ymax: 4247784,
        //                    spatialReference: 102100
        //                },
        layers: [csvLayer] //permitsLayer, geojsonLayer
    });
    map.add(soilsLayer);

    view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-121.34, 38.567], // longitude, latitude
        highlightOptions: {
            color: "#ff642e",
            haloOpacity: 1,
            fillOpacity: 0.25
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },
        zoom: 10
    });
    view3d = new SceneView({
        container: "view3div",
        map: map
    });
    // FEATURELAYER
    var featureLayer = new FeatureLayer({
        url: deflayers[1].url
    });
    // carbon storage of trees in Warren Wilson College 
    //url="https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
    map.add(featureLayer);
    // LEGEND WIDGET FOR CSVLAYER
    const legendExpand = new Expand({
        view: view,
        content: new Legend({
            view: view,
            style: "card"
        })
    });
    view.ui.add(legendExpand, "top-left");

    function createUniqueValueInfos() {
        const fireflyImages = [
                    "cat1.png",
                    "cat2.png",
                    "cat3.png",
                    "cat4.png",
                    "cat5.png"
                ];

        const baseUrl =
            "https://arcgis.github.io/arcgis-samples-javascript/sample-data/";

        return fireflyImages.map(function (url, i) {
            return {
                value: i + 1, // Category number
                symbol: {
                    type: "picture-marker",
                    url: baseUrl + url
                }
            };
        });
    }
    // WHEN MAPVIEW LOADED AND READY DO IDENTIFY ON MAP CLICK
    view.when(function () {
        // executeIdentifyTask() is called each time the view is clicked
        view.on("click", executeIdentifyTask);

        // Create identify task for the specified map service
        identifyTask = new IdentifyTask(soilURL);

        // Set the parameters for the Identify
        params = new IdentifyParameters();
        params.tolerance = 3;
        params.layerIds = [0, 1, 2];
        params.layerOption = "top";
        params.width = view.width;
        params.height = view.height;
    });

    // Executes each time the view is clicked
    function executeIdentifyTask(event) {
        // Set the geometry to the location of the view click
        params.geometry = event.mapPoint;
        params.mapExtent = view.extent;
        document.getElementById("viewDiv").style.cursor = "wait";

        // This function returns a promise that resolves to an array of features
        // A custom popupTemplate is set for each feature based on the layer it
        // originates from
        identifyTask
            .execute(params)
            .then(function (response) {
                var results = response.results;

                return results.map(function (result) {
                    var feature = result.feature;
                    var layerName = result.layerName;

                    feature.attributes.layerName = layerName;
                    if (layerName === "Soil Survey Geographic") {
                        feature.popupTemplate = {
                            // autocasts as new PopupTemplate()
                            title: "{Map Unit Name}",
                            content: "<b>Dominant order:</b> {Dominant Order} ({Dom. Cond. Order %}%)" +
                                "<br><b>Dominant sub-order:</b> {Dominant Sub-Order} ({Dom. Cond. Suborder %}%)" +
                                "<br><b>Dominant Drainage Class:</b> {Dom. Cond. Drainage Class} ({Dom. Cond. Drainage Class %}%)" +
                                "<br><b>Farmland Class:</b> {Farmland Class}"
                        };
                    } else if (layerName === "State Soil Geographic") {
                        feature.popupTemplate = {
                            // autocasts as new PopupTemplate()
                            title: "{Map Unit Name}",
                            content: "<b>Dominant order:</b> {Dominant Order} ({Dominant %}%)" +
                                "<br><b>Dominant sub-order:</b> {Dominant Sub-Order} ({Dominant Sub-Order %}%)"
                        };
                    } else if (layerName === "Global Soil Regions") {
                        feature.popupTemplate = {
                            // autocasts as new PopupTemplate()
                            title: layerName,
                            content: "<b>Dominant order:</b> {Dominant Order}" +
                                "<br><b>Dominant sub-order:</b> {Dominant Sub-Order}"
                        };
                    }
                    return feature;
                });
            })
            .then(showPopup); // Send the array of features to showPopup()

        // Shows the results of the Identify in a popup once the promise is resolved
        function showPopup(response) {
            if (response.length > 0) {
                view.popup.open({
                    features: response,
                    location: event.mapPoint
                });
            }
            document.getElementById("viewDiv").style.cursor = "auto";
        }
    }
    // MAP-IMAGE LAYER SUBLAYERS
    // https://developers.arcgis.com/javascript/latest/sample-code/layers-mapimagelayer-sublayers/index.html
    var railrenderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "simple-line", // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255, 0.5],
            width: 0.75,
            style: "long-dash-dot-dot"
        }
    };
    var usalayer = new MapImageLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
        id: "usa",
        sublayers: [{
                id: 2,
                visible: true
                    },
                    //                    {
                    //                        id: 4,
                    //                        visible: false,
                    //                        title: "Railroads",
                    //                        renderer: railrenderer,
                    //                        source: {
                    //                            // indicates the source of the sublayer is a dynamic data layer
                    //                            type: "data-layer",
                    //                            // this object defines the data source of the layer
                    //                            // in this case it's a feature class table from a file geodatabase
                    //                            dataSource: {
                    //                                type: "table",
                    //                                // workspace name
                    //                                workspaceId: "MyDatabaseWorkspaceIDSSR2",
                    //                                // table name
                    //                                dataSourceName: "ss6.gdb.Railroads"
                    //                            }
                    //                        }
                    //                    },
            {
                id: 1,
                visible: true
                    },
            {
                id: 0,
                visible: true
                    }
                ]
    });
    map.add(usalayer)
    /*****************************************************************
     * Wait for Layer to load and update the page to refelect which
     * layers are visible in the Map Service.
     *****************************************************************/
    usalayer.when(function () {
        layer.sublayers.map(function (sublayer) {
            var id = sublayer.id;
            var visible = sublayer.visible;
            var node = document.querySelector(
                ".esri-sublayers-item[data-id='" + id + "']"
            );
            if (visible) {
                node.classList.add("esri-visible-layer");
            }
        });
    });

    /*****************************************************************
     * Listen for when buttons on the page have been clicked to turn
     * layers on and off in the Map Service.
     *****************************************************************/
    var sublayersElement = document.querySelector(".esri-sublayers");
    sublayersElement.addEventListener("click", function (event) {
        var id = event.target.getAttribute("data-id");
        if (id) {
            var sublayer = layer.findSublayerById(parseInt(id));
            var node = document.querySelector(
                ".esri-sublayers-item[data-id='" + id + "']"
            );
            sublayer.visible = !sublayer.visible;
            node.classList.toggle("esri-visible-layer");
        }
    });
    //=== INIT TOOLS
    //-- INIT BIOSBOOKMARKS
    initbb();
    // WHEN LAYER IS CREATED MAKE APP INDEX AND ZOOM TO ACTIVELAYER
    view.on('layerview-create', function (event) {
        var urid = event.layer.id;
        if (app.layers[urid] === undefined) {
            app.layers[urid] = {
                id: event.layer.id,
                name: event.layer.title,
                type: event.layer.type,
                //tiled: ((event.layer.type === 'tile')? true: false),
                urid: urid,
                url: "" //event.layer.url?
            };
        }
        if (urid.indexOf(app.al) === 0 || urid === app.alayer.urid) {
            view.when(function () {
                event.layer.when(function () {
                    if (app.urlsearch.bookmark === undefined && app.urlsearch.zl === undefined) {
                        view.goTo(event.layer.fullExtent);
                    }
                });
            });
        }
    });
    //=== INIT VIEWER DEFAULT LAYERS
    ace.init();
    // DONE AMD REQUIRED LOADER FUNCTION
}
require(amdlibs, amdfun);
//======================================
// NON-AMD REQUIRED APP.STARTUP.INIT
//======================================
window.addEventListener('load', function () {
    if (location.search !== '') {
        var s = location.search.substr(1);
        if (s.indexOf('&') > 0) {
            var kva = s.split('&');
        } else {
            var kva = [s];
        }
        app.urlsearch = {};
        for (var i = 0; i < kva.length; i++) {
            var kvp = kva[i].split('=');
            var key = kvp[0];
            var val = decodeURIComponent(kvp[1]);
            if (val !== undefined && val !== null) {
                if (key === 'al') {
                    // AUTO CORRECT BIOS DSID SHORTHAND TO PROPER biosdsXXX URID--20190220
                    if (val.toLocaleLowerCase().indexOf('biosds') === 0 || val.toLocaleLowerCase().indexOf('ds') === 0) {
                        var dsid = parseInt(val.toLowerCase().replace('bios', '').replace('ds', ''));
                        if (typeof dsid === 'number') {
                            val = 'biosds' + dsid;
                        }
                    } else if (typeof parseInt(val) === 'number') {
                        val = 'biosds' + parseInt(val); // val;=might get biosdsDSXXXX
                    }
                }
                if (key === 'dsl' || key === 'dslist' || key === 'dsids') {
                    key = 'dslist';
                }
                if (key === 'zl' || key === 'z' || key === 'zoom') {
                    key = 'zl';
                }
                app.urlsearch[key] = val;
                if (app[key] !== undefined) {
                    app[key] = val;
                }
                if ($(key) !== null) {
                    $(key).value = val;
                }
            }
        }
    }
    if (location.hash.indexOf('msgx') >= 0) {
        let x = document.querySelectorAll('.msgx');
        x.forEach(function (item) {
            item.classList.remove('msgx');
        });
        // getElementsByClassName = LIVE LIST UPDATED INSTANTLY FROM ANY DOM CHANGE
        //var nl = document.getElementsByClassName('msgx');
        //while (nl.length > 0) {
        //    (document.getElementsByClassName('msgx')[0].classList.remove('msgx'));
        //}
        // BELOW FAIL; BUG--ONLY 1 ELEM PROCESSED; SELF-TRIMMING AS LIVE INDEX DECREASES
        //for (var x of nl) { //} document.getElementsByClassName('msgx')) {
        //    x.classList.remove('msgx');
        //}
        //nl.forEach(function (x) { //FAIL IN OPERA FOR getElementsByClassName
        //    x.classList.remove('msgx');
        //});
        //for (var i = 0; i < nl.length; i++) {
        //    nl[i].classList.remove('msgx');
        //    console.log('Element with msgx class removed');// STILL STOPS AFTER 1 ITER???
        //}
    }
    $('sql-go').onkeyup = function (event) {
        var kc = event.which || event.keyCode;
        if (kc === 13) {
            //gocab(parseInt($('ocab').value));
            var s = $('sql-where').value;
            console.log(s);
        }
    };
    $('buffd').onkeyup = function (event) {
        var kc = event.which || event.keyCode;
        if (kc === 13) {
            $('buffr').value = parseInt($('buffd').value);
        }
    };
    $('buffr').onchange = function (event) {
        $('buffd').value = $('buffr').value;
    };
});
window.addEventListener('hashchange', function () {
    //console.log('URLocation hash changed');
    if (location.hash.indexOf('msgx') >= 0) {
        let x = document.querySelectorAll('.msgx');
        x.forEach(function (item) {
            item.classList.remove('msgx');
        });
    }
});

console.log('LOADED amd');
/* 
 * [open-license](https://project-open-data.cio.gov/open-licenses/)
 * [opengov3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
 * [FreeBSD](https://www.freebsd.org/copyright/freebsd-license.html)
 */
