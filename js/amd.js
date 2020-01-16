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
    "esri/core/urlUtils",
    "esri/core/watchUtils",
    "esri/core/workers",
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/geometryEngine",
    "esri/geometry/support/webMercatorUtils",
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
    "esri/widgets/BasemapGallery",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/widgets/FeatureForm",
    "esri/widgets/ScaleBar",
    "dgrid/Grid"
];
let amdfun = function (
    esriConfig,
    esriRequest,
    Graphic,
    Map,
    WebMap,
    urlUtils,
    watchUtils,
    workers,
    Portal, OAuthInfo, esriId, PortalQueryParams,
    Point,
    Polygon,
    geometryEngine,
    webMercatorUtils,
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
    BasemapGallery,
    BasemapToggle,
    Expand, Home,
    Legend,
    FeatureForm,
    ScaleBar,
    Grid
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
    //--- ESRI IDENTITY MANAGER OAUTH LOGIN SAMPLE--2020.01.14
    var personalPanelElement = document.getElementById("personalizedPanel");
    var anonPanelElement = document.getElementById("anonymousPanel");
    var userIdElement = document.getElementById("userId");

    var authinfo = new OAuthInfo({
        // Swap this ID out with registered application ID
        appId: "O59X894aUmrlXei5",
        // Uncomment the next line and update if using your own portal
        // portalUrl: "https://<host>:<port>/arcgis"
        // Uncomment the next line to prevent the user's signed in state from being shared with other apps on the same domain with the same authNamespace value.
        // authNamespace: "portal_oauth_inline",
        popup: false
    });
    esriId.registerOAuthInfos([authinfo]);

    esriId
        .checkSignInStatus(authinfo.portalUrl + "/sharing")
        .then(function () {
            displayItems();
        })
        .catch(function () {
            // Anonymous view
            anonPanelElement.style.display = "block";
            personalPanelElement.style.display = "none";
        });

    document
        .getElementById("sign-in")
        .addEventListener("click", function () {
            // user will be redirected to OAuth Sign In page
            esriId.getCredential(authinfo.portalUrl + "/sharing");
        });

    document
        .getElementById("sign-out")
        .addEventListener("click", function () {
            esriId.destroyCredentials();
            window.location.reload();
        });

    function displayItems() {
        var portal = new Portal();
        // Setting authMode to immediate signs the user in once loaded
        portal.authMode = "immediate";
        // Once loaded, user is signed in
        portal.load().then(function () {
            // Create query parameters for the portal search
            var queryParams = new PortalQueryParams({
                query: "owner:" + portal.user.username,
                sortField: "numViews",
                sortOrder: "desc",
                num: 20
            });
            userIdElement.innerHTML = portal.user.username;
            anonPanelElement.style.display = "none";
            personalPanelElement.style.display = "block";

            // Query the items based on the queryParams created from portal above
            portal.queryItems(queryParams).then(createGallery);
        });
    }

    function createGallery(items) {
        var htmlFragment = "";
        items.results.forEach(function (item) {
            htmlFragment +=
                '<div class="esri-item-container">' +
                (item.thumbnailUrl ?
                    '<div class="esri-image" style="background-image:url(' +
                    item.thumbnailUrl +
                    ');"></div>' :
                    '<div class="esri-image esri-null-image">Thumbnail not available</div>') +
                (item.title ?
                    '<div class="esri-title">' + (item.title || "") + "</div>" :
                    '<div class="esri-title esri-null-title">Title not available</div>') +
                "</div>";
        });
        document.getElementById("itemGallery").innerHTML = htmlFragment;
    }

    //--- CSVLAYER
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

    //--- GEOJSONLAYER 
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
    //--- IDENTIFY TASK ON SOILS TILE LAYER
    // URL to the map service where the identify will be performed
    var soilURL =
        "https://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer";

    // Add the map service as a TileLayer for fast rendering
    // Tile layers are composed of non-interactive images. For that reason we'll
    // use IdentifyTask to query the service to add interactivity to the app
    var soilsLayer = new TileLayer({
        url: soilURL,
        id: "Soil_Survey_Map",
        opacity: 0.77,
        visible: false
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
    // GLOBALIZE
    mapview = view;
    sceneview = view3d;
    //--- BASEMAP GALLERY SIDEBAR
    var basemapgal = new BasemapGallery({
        view: view,
        container: "basemapgal"
    });
    //basemapgal.on('click', function () {
    //    $('bl').value = map.basemap.id;// FAIL--RETURNS BLANK
    //});
    //--- BASEMAP TOGGLE WIDGET
    var basemaptoggle = new BasemapToggle({
        view: view, // view that provides access to the map's initial basemap
        nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
    });
    view.ui.add(basemaptoggle, "bottom-left");
    //--- HOME WIDGET
    var homeWidget = new Home({
        view: view
    });
    view.ui.add(homeWidget, "top-left");
    //--- FEATURELAYER
    // carbon storage of trees in Warren Wilson College 
    //url="https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
    var featureLayer = new FeatureLayer({
        id: lands.layers["DFG_Properties:0"].id,
        url: lands.layers["DFG_Properties:0"].url
    });
    //map.add(featureLayer);
    //--- LEGEND WIDGET FOR CSVLAYER
    const legendExpand = new Expand({
        view: view,
        content: new Legend({
            view: view,
            style: "card"
        })
    });
    view.ui.add(legendExpand, "top-left");
    //--- SCALEBAR WIDGET
    var scaleBar = new ScaleBar({
        view: view
    });
    // Add widget to the bottom left corner of the view
    view.ui.add(scaleBar, {
        position: "bottom-left"
    });

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
        $('bl').value = map.basemap.id;
        $('mapdim').innerHTML = [view.extent.width.toFixed(2), view.extent.height.toFixed(2)];
        $('mapsize').innerHTML = [view.width, view.height];
        view.on('click', function (event) {
            $('clickxy').innerHTML = [event.mapPoint.x.toFixed(3), event.mapPoint.y.toFixed(3)];
            $('lonlat').innerHTML = [event.mapPoint.longitude.toFixed(6), event.mapPoint.latitude.toFixed(6)];
            $('xy').value = [event.mapPoint.x, event.mapPoint.y];
            $('ll').value = [event.mapPoint.longitude, event.mapPoint.latitude];
            app.xy = [event.mapPoint.x, event.mapPoint.y];
            app.ll = [event.mapPoint.longitude, event.mapPoint.latitude];
            app.atool.geometry = event.mapPoint;
            app.selectg = event.mapPoint;
            var clickbox = ptbox(event.mapPoint);
            $('clickbox').innerHTML = clickbox.join(', ');
            // MOVED IDENTIFY TASK SAMPLE BLOCK HERE-2019.12.11
            if (app.tool === 'identify' && activeLayer.url === soilURL) {
                // executeIdentifyTask() is called each time the view is clicked
                //view.on("click", executeIdentifyTask);

                // Create identify task for the specified map service
                identifyTask = new IdentifyTask(soilURL);

                // Set the parameters for the Identify
                params = new IdentifyParameters();
                params.tolerance = 3;
                params.layerIds = [0, 1, 2];
                params.layerOption = "top";
                params.width = view.width;
                params.height = view.height;
                executeIdentifyTask(event);
            }
            /*************************
             * Create a point graphic--20200106
             *************************/
            // First create a point geometry (this is the location of the Titanic)
            var point = {
                type: "point", // autocasts as new Point()
                longitude: event.mapPoint.longitude,
                latitude: event.mapPoint.latitude
                //x: event.mapPoint.x,
                //y: event.mapPoint.y
            };
            // Create a symbol for drawing the point
            var markerSymbol = {
                size: 14,
                //style: "x",
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [255, 255, 255, 0.55],
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: "hotpink", //[255, 255, 255],
                    width: 2
                }
            };
            // Create a graphic and add the geometry and symbol to it
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });
            // Add the graphics to the view's graphics layer
            //view.graphics.addMany([pointGraphic]);
            view.graphics.removeAll();
            view.graphics.add(pointGraphic);
        });
        view.watch("scale", function (newValue, oldValue, propertyName, target) {
            //console.log(propertyName + " changed from " + oldValue + " to " + newValue);//scale changed from
            $('zl').value = parseInt(mapview.zoom);
            $('zoom').value = parseInt(mapview.zoom);
            let lonlat = webMercatorUtils.xyToLngLat(mapview.center.x, mapview.center.y);
            let ll = [lonlat[0].toFixed(3), lonlat[1].toFixed(3)];
            $('center').value = ll + ' | xy(' + [mapview.center.x.toFixed(3), mapview.center.y.toFixed(3)] + ')';
            $('mapdim').innerHTML = [mapview.extent.width.toFixed(2), mapview.extent.height.toFixed(2)];
            $('mapres').innerHTML = [(mapview.extent.width / mapview.width).toFixed(1), (mapview.extent.height / mapview.height).toFixed(1)];
            $('mapscale').value = parseInt(mapview.scale);
        });
        // MAPVIEW EVENT HANDLERS
        $('zoom').addEventListener('keyup', function (event) {
            var kc = event.which || event.keyCode;
            if (kc === 13) {
                mapview.zoom = parseInt($('zoom').value);
            }
        });
        $('mapscale').addEventListener('keyup', function (event) {
            var kc = event.which || event.keyCode;
            if (kc === 13) {
                mapview.scale = parseInt($('mapscale').value);
            }
        });
        $('mapexthen').addEventListener('click', function () {
            let tics = {
                xmin: mapview.extent.xmin,
                ymin: mapview.extent.ymin,
                xmax: mapview.extent.xmax,
                ymax: mapview.extent.ymax,
                spatialReference: {
                    wkid: mapview.spatialReference.wkid
                }
            }
            $('mapext').value = JSON.stringify(tics);
        });
        view.on('resize', function () {
            $('mapsize').innerHTML = [mapview.width, mapview.height];
        }); //window.addEventListener
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
        sublayers: [
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
                id: 0,
                visible: true
            },
            {
                id: 1,
                visible: true
            },
            {
                id: 2,
                visible: true
            },
            {
                id: 3,
                visible: true
            }
        ],
        visible: false
    });
    map.add(usalayer)
    /*****************************************************************
     * Wait for Layer to load and update the page to refelect which
     * layers are visible in the Map Service.
     *****************************************************************/
    /*usalayer.when(function () {
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
     });*/
    /*****************************************************************
     * Listen for when buttons on the page have been clicked to turn
     * layers on and off in the Map Service.
     *****************************************************************/
    /*var sublayersElement = document.querySelector(".esri-sublayers");
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
     });*/
    app.initLayers();
    //=== INIT TOOLS
    bsinit();
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
    view.when(function () {
        console.info(mapview.extent);
        addmsg('mapview.extent.xmin=' + mapview.extent.xmin); //.x TypeError: Cannot read property 'x' of null
    });
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
        show('msgbar');
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
    $('basemapgal').addEventListener('click', function () {
        $('bl').value = basemap2id[map.basemap.title];
    });
});
window.addEventListener('hashchange', function () {
    console.log('URLocation hash changed to ' + location.hash);
    if (location.hash.indexOf('msgx') >= 0) {
        let x = document.querySelectorAll('.msgx');
        x.forEach(function (item) {
            item.classList.remove('msgx');
        });
        show('msgbar');
    }
    var s = location.hash.substr(1);
    urlcmd(s);
});

function urlcmd(s) {
    if (s.indexOf('&') > 0) {
        var kva = s.split('&');
    } else {
        var kva = [s];
    }
    for (var i = 0; i < kva.length; i++) {
        kvp = kva[i];
        if (kvp.indexOf('=') > 0) {
            var keyval = kvp.split('=');
            var key = keyval[0];
            var val = keyval[1];
            switch (key) {
                case 'al':
                    var dsid = isbiosds(val);
                    addmsg('addActiveLayer biosdsid ' + dsid);
                    break;
                case 'bl':
                    // code block
                    break;
                default:
                    addmsg('DO urlcmd/keyvalpair= ' + keyval);
            }
        }
    }
}

function isbiosds(s) {
    s = s.toLowerCase();
    var dsid = parseInt(s.replace('biosds', '').replace('ds', ''));
    if (typeof (dsid) === 'number') {
        return dsid;
    } else {
        return 0;
    }
}

console.log('LOADED amd');
/* 
 * [open-license](https://project-open-data.cio.gov/open-licenses/)
 * [opengov3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
 * [FreeBSD](https://www.freebsd.org/copyright/freebsd-license.html)
 */
