/* 
 * app.js 20191108 dfgchiang 
 * All Layer Sources and App Configurations
 */
console.log('Loading app');
let app = {
    al: "",
    alayer: {
        def: "",
        dfield: "",
        lid: -1,
        name: "",
        orid: "",
        sql: "",
        type: "",
        urid: "",
        url: "",
        urlast: ""
    },
    args: null, //=FOR SAVING TMP BOOKMARKPROPERTIES TO RESTORE
    atool: {
        id: "",
        graphic: null,
        where: "",
        oids: [],
        selectlayer: "",
        target: "",
        xy: []
    },
    bl: "topo", // streets satellite hybrid topo gray dark-gray oceans national-geographic terrain osm
    bookmark: null,
    center: [-119.8, 37.67], //=lon,lat separated by comma or esriGeometryPoint
    clientId: "O59X894aUmrlXei5", //=ArcGIS Developers Registered App ID
    col: "",
    def: null,
    description: "Biogeographic Information Observation System",
    dsid: 0,
    dsids: [],
    dsl: [], //=dslist
    dslist: "",
    dsname: null,
    dstags: null,
    fields: [],
    filterg: null,
    graphics: [],
    id: "bios",
    identify: {}, //aurid:{graphic: null, oids: []}
    ingress: 0,
    itemId: "ae32068bbd33404991cbb56fb2124ffb", //piid=portalItemId
    json: {}, //=bookmarkJson
    job: null,
    labels: [],
    lat: 37.67015,
    latlon: [37.67, -119.82],
    layerIds: [],
    layers: {},
    layerViews: {},
    lid: -1, //TODO DEL?
    lids: [],
    ll: [-119.8, 37.67], //=longitude/latitude pair
    loaded: false,
    lon: -119.80671,
    mask: null,
    mouse: null,
    name: "Bios",
    oids: [],
    point: null,
    defs: {}, //aurid: {where: ""}
    filters: {}, //aurid:{graphic: null, count: 0}
    selections: {}, //aurid:{graphic: null, count: 0, outFields: ["*"], selectlayer: "", features: []}
    queries: {}, //aurid: {where: ""}
    selectg: null,
    sid: "",
    site: "bios6",
    sql: null,
    status: 0,
    subtask: null,
    surl: "",
    task: null,
    timestart: (new Date()).getTime(),
    title: "BIOS",
    token: null,
    tool: "",
    urid: "",
    url: window.location.href,
    urlsearch: null, //=FOR ONE TIME STORE OF LOCATION SEARCH PARAMS
    agolname: "anonymous", //=guest
    agolgroups: "Everyone", //=Public
    userName: "guest",
    userGroups: "Public",
    version: "6." + (parseInt((avn - 20170000) / 100) + 12) + "." + (avn % 100),
    viewer: "bios",
    x: -13535187.9774,
    y: 4495589.15484,
    xy: [-13535187.9774, 4495589.15484],
    zl: 10,
    zoom: 10
};
app.site = function () {
    var y = 'bios6';
    var x = location.pathname.replace(/^\/|\/$/g, '');
    if (x.indexOf('/') < 0) {
        if (x.indexOf('.') < 0) {
            return x;
        }
    } else {
        let a = x.split('/');
        for (var i = 0; i < a.length; i++) {
            let b = a.pop();
            if (b.indexOf('.') < 0) {
                return b;
            }
        }
    }
    return y;
}();
console.log('app.site=' + app.site);
if (location.search.indexOf('viewer=') > 0) {
    app.viewer = location.search.split('viewer=')[1].split('&')[0];
    //    if (configs[app.viewer] != undefined) {
    //        viewer = configs[app.viewer];
    //        viewer.layers = configs[app.viewer].layers;
    //    }
    //} else if (configs[app.site] != undefined) {
    //    viewer = configs[app.site];
    //    viewer.layers = configs[app.site].layers;
    //} else {
    //    viewer = configs.bios;
    //    viewer.layers = configs.bios.layers;
}
console.log('app.viewer=' + app.viewer);
//TODO CONFIGURE VIEWER
let configs = {
    "ace": {},
    "bios": {},
    "cwhr": {},
    "delta": {},
    "dfg": {},
    "fire": {},
    "fishing": {},
    "habitrak": {},
    "imaps": {},
    "lands": {},
    "marine": {},
    "min": {},
    "rarefind": {},
    "veg": {}
}
var imaps = {
    id: "imaps",
    layers: {
        "CalTrans_Lane_Closures": {
            id: "CalTrans_Lane_Closures",
            name: "CalTrans Lane Closures",
            type: "kml",
            url: "https://cdfw.maps.arcgis.com/home/item.html?id=566c65d5f9e44b118c0aded153b1fc8e",
            visible: true
        },
        "DFG_Properties:0": {
            id: "DFG_Properties:0",
            name: "CDFW Facilities",
            type: "feature",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/0",
            visible: true
        }
    }
}
app.layers["CalTrans_Lane_Closures"] = {
    id: "CalTrans_Lane_Closures",
    name: "CalTrans Lane Closures",
    type: "kml",
    url: "https://cdfw.maps.arcgis.com/home/item.html?id=566c65d5f9e44b118c0aded153b1fc8e",
    visible: true
};
app.layers["Soil_Survey_Map"] = {
    id: "Soil_Survey_Map",
    name: "Soil_Survey",
    type: "tile",
    tiled: true,
    tocgroup: "ref",
    url: "https://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer",
    visible: true
}
app.layers["DFG_Properties:0"] = {
    id: "DFG_Properties:0",
    name: "CDFW Facilities",
    type: "feature",
    url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/0",
    visible: true
};
app.layers["usa"] = {
    id: "usa",
    name: "USA",
    tiled: false,
    tocgroup: "ref",
    type: "MapServer map=image MapImageLayer",
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    visible: true
}
let GISSERVER = 'https://map.dfg.ca.gov';

function addmsg(s) {
    document.getElementById('msgbox').innerHTML += s + '<br/>';
}
// TO CLEAN UP UNWANTED OUTPUTS IN PRODUCTION RENAME ABOVE FUNCTION TO BELOW
function xxaddmsg(s) {
    return false;
}
var als = {
    "EVEG": {
        id: "EDW_ExistingVegetationRegion05_01",
        name: "Existing Vegetation",
        type: "MapServer",
        tiled: false,
        tocgroup: "ref",
        urid: "EDW_ExistingVegetationRegion05_01",
        url: "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ExistingVegetationRegion05_01/MapServer",
        visible: true
    }
}
console.log('Loaded app');
