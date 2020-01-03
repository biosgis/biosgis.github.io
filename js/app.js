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
        uridlast: "",
        url: "",
        urlast: ""
    },
    args: null, //=FOR SAVING TMP BOOKMARKPROPERTIES TO RESTORE
    atool: {
        id: "",
        geometry: null,
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
    geometry: null,
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
    ll: [-119.8, 37.67], //=longitude, latitude pair
    loaded: false,
    lon: -119.80671,
    mask: null,
    mouse: null,
    name: "BIOS",
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
    title: "Biogeographic Information Observation System",
    token: null,
    tool: "",
    urid: "",
    url: window.location.href,
    urlsearch: null, //=FOR ONE TIME STORE OF LOCATION SEARCH PARAMS
    agolname: "anyone", //"anonymous", //=guest
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
app.layers["CalTrans_Lane_Closures"] = {
    id: "CalTrans_Lane_Closures",
    name: "CalTrans Lane Closures",
    type: "kml",
    url: "https://cdfw.maps.arcgis.com/home/item.html?id=566c65d5f9e44b118c0aded153b1fc8e",
    visible: true
};
app.layers["usa"] = {
    id: "usa",
    name: "USA",
    sublayers: [
        {
            id: 0,
            name: "Cites",
            visible: true
        },
        {
            id: 1,
            name: "Highways",
            visible: true
        },
        {
            id: 2,
            name: "States",
            visible: true
        },
        {
            id: 3,
            name: "Counties",
            visible: true
        }
    ],
    tiled: false,
    tocgroup: "ref",
    type: "MapServer map=image MapImageLayer",
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    visible: true
}
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
    if (configs[app.viewer] != undefined) {
        viewer = configs[app.viewer];
        viewer.layers = configs[app.viewer].layers;
    }
} else if (configs[app.site] != undefined) {
    viewer = configs[app.site];
    viewer.layers = configs[app.site].layers;
    app.viewer = app.site;
} else {
    viewer = configs.bios;
    viewer.layers = configs.bios.layers;
}
console.log('app.viewer=' + app.viewer);

function appstart() {
    // APP.START
    if (location.search.indexOf('al=') > 0) {
        var al = location.search.split('al=')[1].split('&')[0];
        if (al !== '') {
            var dsid = parseInt(al.toLowerCase().replace('biosds', '').replace('ds', ''));
            if (typeof dsid === 'number') {
                app.al = 'biosds' + al;
                $('al').value = app.al;
                // Load a BIOS layer
                app.dsid = dsid;
                $('dsid').value = dsid;
                // TODO: bios.addbiosds(dsid);
            }
        }
    }
    if (location.search.indexOf('dslist=') > 0) {
        var dslist = location.search.split('dslist=')[1].split('&')[0];
    } else if (location.search.indexOf('dsl=') > 0) {
        var dslist = location.search.split('dsl=')[1].split('&')[0];
    }
    if (dslist !== '') {
        if (dslist.indexOf('|') > 0) {
            var dsl = val.replace(/\|/g, ',');
        } else {
            var dsl = val;
        }
        app.dslist = dsl;
        $('dslist').value = dsl;
        if (dsl.indexOf(',') > 0) {
            let dsar = dsl.split(',');
            let dsids = [];
            for (let i = 0; i < dsar.length; i++) {
                var dsno = parseInt(dsar[i]);
                dsids.push(dsno);
            }
            app.dsids = dsids;
        } else {
            app.dsids = [parseInt(dsl)];
        }
        // TODO: bios.adddslist(dsl);
    }
}
app.start = appstart;

app.initLayers = function () {
    addmsg('DO app.initLayers');
    var jo = app.layers['usa'];
    jo = tocFillMapImageLayerSubinfos(jo);
    tocAddMapImageLayerItem(jo);
    var jo = imaps.layers['Soil_Survey_Map'];
    jo = tocFillMapImageLayerSubinfos(jo);
    tocAddMapImageLayerItem(jo);
    var jo = lands.layers['DFG_Lands'];
    //jo = tocFillMapImageLayerSubinfos(jo);
    //tocAddMapImageLayerItem(jo);
    addMapImageLayer(jo);
}
window.addEventListener('load', function () {
    console.log('DO appWindowOnload');
    // VIEWER CONFIG
    document.title = viewer.name;
    $('apphome').href = viewer.homepage;
    $('apphome').target = '_blank';
    $('apphome').title = viewer.name + ' homepage';
    $('applogo').src = viewer.logo;
    if (viewer.id === 'ace') {
        $('applogo').style.height = '80px';
        $('applogo').style.marginTop = '-15px';
    }
    $('appname').innerHTML = viewer.name;
    $('appname').title = viewer.title;
    $('apptitle').innerHTML = viewer.title;
    $('apptitle').title = viewer.name;
    if (window.Worker) {
        var myWorker = new Worker('../js/worker.js');
        var first = $('devin1');
        var second = $('devin2');
        var resultp = $('resoutp');
        first.onchange = function () {
            myWorker.postMessage([first.value, second.value]);
            console.log('Message posted to worker by devin1');
        }

        second.onchange = function () {
            myWorker.postMessage([first.value, second.value]);
            console.log('Message posted to worker by devin2');
        }
        myWorker.onmessage = function (e) {
            resultp.textContent = e.data;
            console.log('Message received from worker');
            $('devout').value = e.data;
        }
    }
});
console.log('Loaded app');
