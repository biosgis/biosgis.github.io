/* 
 Copyright © 2019, State of Grace, Department of Fun and Games, dfgchiang
 [MIT License](https://mit-license.org/)
 [GNU GPL v3](https://www.gnu.org/licenses/)
 [open-license](https://project-open-data.cio.gov/open-licenses/)
 [OpenGov3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
 [FreeBSD](https://www.freebsd.org/copyright/freebsd-license.html)
 */
const avn = 20181212;
var app = {
    al: null,
    bl: "topo",
    bookmark: null,
    bm: null,
    clientId: "O59X894aUmrlXei5",
    col: null,
    description: "Biogeographic Information Observation System",
    dsid: 0,
    dsids: [],
    dsl: null,
    id: "min",
    features: [],
    layer: { lid: -1, name: null, orid: null, type: null, urid: null, url: null, urlast: null },
    layers: {},
    ll: [37.67, -119.8], //=lat, lon //[-119.8, 37.67], //=lon,lat separated by comma or pipe
    oids: [],
    ingress: 0,
    sid: null,
    site: "bios6",
    subtitle: "Biogeographic Information Observation System",
    surl: null,
    timestart: Date.now(),
    title: "BIOS",
    tool: "bookmarks",
    urid: null,//TODO DEL?
    url: window.location.href,
    userName: "guest",
    userGroups: "Public",
    version: "6." + (parseInt((avn - 20170000) / 10000) * 12 + parseInt(avn.toString().substr(4, 2))) + "." + (avn % 100),
    val: null,
    viewer: "boo",
    xy: [-13535187.9774, 4495589.15484],
    zl: 8
}
var config = {
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
config.fishing = {
    "ags": "https://map.dfg.ca.gov/arcgis/rest/services/Project_Fishing",
    "layers": {
        "boatfac": {
            "info": "https://www.parks.ca.gov/BoatingFacilities [Find a Boating Facility]"
        }
    }
}
config.dfg = {
    "id": "dfg",
    "layers": [
        {
            "id": 0,
            "link": "http://cdfw.maps.arcgis.com/home/item.html?id=9b9d472bc3bc46058c299d494accb4a6",
            "url": "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosbookmarks/FeatureServer/0",
            "urid": "biosbookmarks",
            "name": "BIOS Bookmarks",
            "type": "feature",
            "tiled": false,
            "visible": false
        },
        {
            "id": 1,
            "link": "http://cdfw.maps.arcgis.com/home/item.html?id=bbdb735bfa2b4dc7b022af4749d75305",
            "url": "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/manifestpub/FeatureServer/0",
            "urid": "manifestpub",
            "name": "BIOS Manifest Public",
            "type": "table",
            "tiled": false,
            "visible": false
        },
        {
            "id": 2,
            "link": "http://cdfw.maps.arcgis.com/home/item.html?id=68cf01b2efaf4ad287ce75a527735fbe",
            "url": "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/bios6dev/FeatureServer/0",
            "urid": "bios6dev",
            "name": "Bios 6 Issues",
            "type": "feature",
            "tiled": false,
            "visible": false
        },
        {
            "id": 3,
            "link": "https://wildfire.cr.usgs.gov/arcgis",
            "url": "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer",
            "urid": "geomac_dyn",
            "name": "Geomac",
            "type": "map-image",
            "tiled": false,
            "visible": false
        }
    ]
};
config.veg = {
    "id": "veg",
    "home": "https://www.wildlife.ca.gov/Data/GIS/Vegetation-Data",
    "al": "ds515",
    "dslist": "dsids||160,161,162,165,166,169,170,172,200,201,292,484,500,515v,561,563,564,566,614,615,616,703,711,712,722,723,724,730,735,770,891,939,947,957,958,983,984,985,986,995,996,997,1019,1020,1021,1029,1057,1094,1196,1328,1336,1345,1346,1395,1500,1501,2632"
}
var urlsearch = null;
function addmsg(s) {
    $('msgbox').innerHTML += s + '<br>';
}
//var JSDIR = window.location.href.split("/" + app.site)[0] + app.site + "/js/";
var JSDIR = function () {
    var hostpath = location.href.split(location.host)[0] + location.host;
    var jspath = location.pathname.replace(DEFAULT_PAGE, '') + 'js/';
    return hostpath + jspath;
}();// 20181128 FAIL WHEN LOADED BY FILE://HTML
console.log('JSDIR=' + JSDIR);

require({
    //baseUrl: "/js/",
    packages: [
        {name: "app", location: JSDIR + "app"}
    ]
}, [
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/geometry/Polygon",
    "esri/request",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/widgets/Expand",
    "esri/widgets/FeatureForm",
    //"app/Minb",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
], function (
    Map, 
    MapView,
    FeatureLayer,
    Graphic, 
    Polygon,
    esriRequest,
    QueryTask, Query,
    Expand, FeatureForm,
    //Minb,
    dom, on
) {
    console.log('DO REQUIRED');
    $('vn').innerHTML = app.version;
    $('vn').classList.remove('fuzz');
    let editFeature, highlight, featureForm, editArea, attributeEditing, updateInstructionDiv;
    
    let esrequest = esriRequest;
    const bookmarksLayer = new FeatureLayer({
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosbookmarks/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: false,
        id: "biosbookmarks",
        visible: false
    });
    //20181019 HIDE THE BOOKMARKSLAYER
    const map = new Map({
        basemap: 'terrain',// streets satellite hybrid topo gray dark-gray oceans national-geographic terrain osm
        layers: [bookmarksLayer]
    });
    // State centroid at North Fork, CA is [-119.443, 37.1597]
    const mapview = new MapView({
        container: "mapview",
        map: map,
        center: [-121.47, 38.576],
        zoom: 10
    });
    //================================
    //--- BOOKMARK TOOL 20181017
    //================================
    var bm, bmid, bmform;
    function extn2poly(extent) {
        var xmax = extent.xmax;
        var xmin = extent.xmin;
        var ymax = extent.ymax;
        var ymin = extent.ymin;
        var rings = [
            [
                [xmin, ymin],
                [xmin, ymax],
                [xmax, ymax],
                [xmax, ymin],
                [xmin, ymin]
            ]
        ];
        var polygon = new Polygon({
            hasZ: false,
            hasM: false,
            rings: rings,
            spatialReference: mapview.spatialReference
        });
        return polygon;
    }
    function datestamp() {
        let d = new Date();
        // Starting 2018 as year 1
        let y = d.getFullYear() - 2017;
        // DayNumberOfYear/CurrentDayNumber: 1..365
        let m = d.getMonth();
        let mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var n = 0;
        for (let i = 0; i < m; i++) {
            n = n + mdays[i];
        }
        n = n + d.getDate();
        // SecondsOfTheDay 1..86400
        let s = (d.getHours() * 60 * 60) + (d.getMinutes() * 60) + d.getSeconds();
        return y * 100000000 + n * 100000 + s;
    }
    let BOOKMARK_FIELDS = ['OBJECTID', 'MapID', 'UserName', 'UserGroup'
    , 'Author', 'Description', 'Created','Immortal', 'Basemap', 'Center'
    , 'DSList', 'Filters', 'Graphics', 'Labels','Layers', 'Link'
    , 'Queries', 'Scale', 'Selections', 'Summary', 'Symbols'
    ,'Tags', 'Title', 'Tool', 'Visible', 'Zoom'];
    // ISSUE--featureForm will display all editable fields 20181116
    // SHOULD NOT BE EDITABLE BY USER: , 'Immortal', 'UserName', 'UserGroup', 'Visible'
    var bmtool = {
        id: "bmtool",
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosbookmarks/FeatureServer/0",
        bmcols: ['Author', 'Description', 'DSList', 'Layers', 'Selections'
        , 'Title', 'Link', 'Labels', 'Queries', 'Summary', 'Tags'
        , 'Basemap', 'Center', 'Tool', 'Zoom', 'MapID'],
        bmfields: ['OBJECTID', 'Author', 'Description', 'Created'
        , 'Selections', 'DSList', 'Layers', 'Link', 'MapID'],
        bmwidths: {"OBJECTID": 55, "Author": 100, "Description": 150, "Created": 100
            , "Selections": 150, "DSList": 100, "Layers": 100, "Link": 80, "Title": 120
            , "Basemap": 120, "Center": 100, "Scale": 100, "Tool": 100, "Zoom": 80
            , "MapID": 100
        },
        addbm: function () {
            addmsg('DO BookmarkTool.addbm ' + Date.now());//TODO APPBOOKMARKSCOUNT+1
            bm.geometry = extn2poly(mapview.extent);
            bm.attributes['Author'] = $('Author').value;
            bm.attributes['Description'] = $('Description').value;
            bm.attributes['Basemap'] = map.basemap.id;
            bm.attributes['Center'] = mapview.center.longitude + ',' + mapview.center.latitude;
            //[mapview.center.longitude, mapview.center.latitude]=FAILED 20181018
            //bm.attributes.Created = Date.now(); (new Date()).toLocaleString().replace(',', '');//=OK BUT WRONG TIME? (ROLLED BACK 8 HRS)
            bm.attributes.Created = Date.now();// d.getTime();//=OK BEST CORRECT TIME 20181018.1559
            bm.attributes['Immortal'] = 0;
            bm.attributes['Link'] = location.href;
            bm.attributes['MapID'] = datestamp();//d.getTime();//=FAIL--Arithmetic overflow error converting expression to data type int. The statement has been terminated.
            bm.attributes['Tags'] = 'test';
            bm.attributes['Title'] = 'Bookmark ' + (new Date()).toISOString();
            bm.attributes['Scale'] = parseInt(mapview.scale);
            bm.attributes['Summary'] = 'Bookmark ' + (new Date()).toLocaleString();
            bm.attributes['Tool'] = app.tool;
            bm.attributes['Usage'] = 0;
            bm.attributes['Visible'] = 1;
            bm.attributes['Zoom'] = mapview.zoom;
            console.log('bookmarkItem = ' + JSON.stringify(bm));//20181017 OK
            bookmarksLayer.applyEdits({
                addFeatures: [bm]
            }).then(function (editsResult) {
                if (editsResult.addFeatureResults.length > 0) {
                    var objectId = editsResult.addFeatureResults[0].objectId;//20181018 BUG why oid=null but no error?
                    //selectFeature(objectId);
                    var link = location.pathname + '?bookmark=' + objectId;
                    $('bm-link').href = link;
                    $('bm-link').innerHTML = link;
                    show('bm-link');
                    if (editsResult.addFeatureResults[0].error !== undefined && editsResult.addFeatureResults[0].error !== null) {
                        console.log('bmtool.addbm returned with error:');
                        console.error(editsResult.addFeatureResults[0].error);
                    }
                }
            }).catch(function (error) {
                console.log('BookmarkTool AddItem ERROR');
                console.error("[ applyEdits ] FAILURE: ", error.code, error.name,
                        error.message);
                console.log("error = ", error);
            });
        },
        applyEdits: function (params) {
            //unselectFeature();
            bookmarksLayer.applyEdits(params).then(function (editsResult) {
                // Get the objectId of the newly added feature.
                // Call selectFeature function to highlight the new feature.
                if (editsResult.addFeatureResults.length > 0) {
                    bmid = editsResult.addFeatureResults[0].objectId;
                    //selectFeature(objectId);
                }
            }).catch(function (error) {
                console.log("===============================================");
                console.error("[ applyEdits ] FAILURE: ", error.code, error.name,
                        error.message);
                console.log("error = ", error);
            });
        },
        delbm: function (oid) {
            var deleteFeature = {
                objectId: [oid]
            };
            var promise = bookmarksLayer.applyEdits({
                deleteFeatures: [deleteFeature]
            });
        },
        getbm: function (oid) {
            addmsg('DO bmtool.getbm: ' + oid);
            bookmarksLayer.queryFeatures({
                objectIds: [oid],
                outFields: bmtool.bmcols,// ["*"],
                returnGeometry: true
            }).then(function (results) {
                if (results.features.length > 0) {
                    addmsg('CALLBACK bmtool.getbm ' + oid);//results.features[0].attributes['OBJECTID'] NOT IN EDITCOLS
                    bm = results.features[0];
                    // display the attributes of selected bookmark in the form
                    bmform.feature = bm;
                    // highlight the bookmarkExtent on the mapview
                    //mapview.whenLayerView(bm.layer).then(function (layerView) {
                    //    highlight = layerView.highlight(bm);
                    //});
                    // ZOOM TO CHOSEN BOOKMARK MAPEXTENT 20181113
                    mapview.extent = bm.geometry.extent;
                    //show('bm-edit');
                    $('OBJECTID').value = oid;
                    // 20181203 DISPLAY CURRENT BOOKMARK PROPERTIES FOR EDIT
                    for (var key in bm.attributes) {
                        addmsg(key + '=' + bm.attributes[key]);
                        if ($(key) !== null) {
                            var val = bm.attributes[key];
                            if (val !== null) {
                                $(key).value = val;
                            }
                        }
                    }
                    $('bm-link').href = location.pathname + '?bookmark=' + oid;
                    $('bm-link').innerHTML = location.pathname + '?bookmark=' + oid;
                    app.bm = bm;
                }
            });
        },
        getrows: function (where, sortby, outcols) {
            addmsg('DO bmtool.getrows');
            //addmsg(bmtool.url); // this.url is undef
            //addmsg(bmtool.bmfields);
            let query = new Query();
            query.where = "OBJECTID > 7";
            query.orderByFields = ['OBJECTID'];//DESC Description ASC
            query.outFields = bmtool.bmfields;//['*'];//
            if (where !== undefined && where !== null) {
                query.where = where;
            }
            if (sortby !== undefined && sortby !== null) {
                query.orderByFields = sortby;
            }
            if (outcols !== undefined) {
                query.outFields = outcols;
            }
            //TODO 20181130 query only biosbookmarks: AND Link NOT LIKE '%bookmark=%' AND Tags LIKE '%bookmark%'
            //query.start = 0;
            //query.num = 10;
            let queryTask = new QueryTask({
                url: bmtool.url//"https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosbookmarks/FeatureServer/0"//
            });
            addmsg('CALLING bmtool.getrowsQuery');
            queryTask.execute(query).then(function (res) {
                addmsg('CALLBACK bmtool.getrows: ' + res.features.length);
                var outdiv = $('databin');
                outdiv.innerHTML = '';
                var tbl = bmtable(res.features);
                outdiv.appendChild(tbl);
            });
            
            function bmtable(features) {
                addmsg('DO bmtool.bmtable: ' + features.length);
                var table = document.createElement('table');
                table.classList.add('btable');
                //var hrow = table.insertRow(0);
                var thed = document.createElement('thead');
                table.appendChild(thed);
                var hrow = document.createElement('tr');
                thed.appendChild(hrow);
                var attributes = features[0].attributes;
                for (var key in attributes) {
                    var hcol = document.createElement('th');
                    //var hcol = hrow.insertCell(hrow.cells.length);
                    hcol.innerHTML = key;
                    var wd = bmtool.bmwidths[key];
                    var ww = key.length * 20;
                    if (ww > wd) {
                        wd = ww;
                    }
                    if (key === 'OBJECTID') {
                        hcol.innerHTML = 'OID';
                        wd = 50;
                    }
                    //hcol.width = bmtool.bmwidths[key];
                    hcol.style.width = wd + 'px';
                    hcol.style.minWidth = wd + 'px';
                    hrow.appendChild(hcol);
                }
                var tbod = document.createElement('tbody');
                table.appendChild(tbod);
                for (var i = 0; i < features.length; i++) {
                    //var row = table.insertRow(table.rows.length);
                    var attributes = features[i].attributes;
                    //addmsg('EXTRA TOP ROW TO MATCH HEADER 20181122');
                    if (i === -1) {
                        var hrow = document.createElement('tr');
                        tbod.appendChild(hrow);
                        for (var key in attributes) {
                            var hcell = document.createElement('th');
                            //addmsg('Add field ' + key + ' at cell ' + hrow.cells.length);
                            //var hcell = hrow.insertCell(hrow.cells.length);
                            hcell.innerHTML = key;
                            var ww = key.length * 20;
                            var wd = bmtool.bmwidths[key];
                            if (ww > wd) {
                                wd = ww;
                            }
                            if (key === 'OBJECTID') {
                                hcell.innerHTML = 'OID';
                                wd = 50;
                            }
                            //hcell.width = bmtool.bmwidths[key];
                            hcell.style.width = wd + 'px';
                            hcell.style.maxWidth = wd + 'px';
                            hcell.style.color = 'lightgray';
                            hrow.appendChild(hcell);
                        }
                    }
                    //addmsg('Add feature record-' + i);
                    var row = document.createElement('tr');
                    tbod.appendChild(row);
                    var k = 0;
                    for (var key in attributes) {
                        var val = attributes[key];
                        var cell = row.insertCell(k);
                        cell.innerHTML = val;
                        var wd = bmtool.bmwidths[key];
                        var ww = key.length * 20;
                        if (ww > wd) {
                            wd = ww;
                        }
                        if (key === 'OBJECTID') {
                            wd = 50;
                        }
                        //cell.width = wd;// bmtool.bmwidths[key];
                        cell.style.width = wd + 'px';
                        cell.style.maxWidth = wd  + 'px';
                        if (key === 'OBJECTID') {
                            cell.innerHTML = val;
                            cell.title = 'Edit';
                            cell.classList.add('go');
                            cell.onclick = function () {
                                bmtool.getbm(parseInt(this.innerHTML));
                                //20181109 ERROR: attributes[key] and console.log(val) are null at runtime
                            }
                        } else if (val !== null) {
                            if (key === 'Summary' || key === 'Title' || key === 'Tags') {// || key === 'Description'
                                cell.innerHTML = val;//.substr(0, 24);
                                //cell.style.width = '100px'; // 20181109 FAIL?
                                cell.title = val;
                            } else if (key === 'Link') {
                                if (val.indexOf('/') === 0 || val.indexOf('http') === 0) {
                                    cell.innerHTML = '<a href="' + val + '" target="_blank">Open</a>';
                                }
                            } else if (key === 'Created') {
                                var d = new Date(parseInt(val));
                                cell.innerHTML = d.toLocaleDateString();
                            } else {
                                cell.innerHTML = val;
                            }
                        }
                        k += 1;
                    }
                }
                return table;
            }
        },
        unselbm: function () {
            bmform.feature = null;
            if (highlight) {
                highlight.remove();
            }
        },
        init: function () {
            console.log('INIT BookmarksTool');
            bm = new Graphic({
                geometry: extn2poly(mapview.extent),
                attributes: {
                    "UserName": "anonymous",
                    "UserGroup": "Public",
                    "Author": "guest",
                    "Description": "test bookmark " + (new Date()).toString(),
                    //"Created": (new Date()).getTime(),
                    //"Immortal": 0,
                    //"LastUsed": "",
                    //"Basemap": map.basemap.id,
                    //"Center": mapview.center.longitude.toFixed(6) + ',' + mapview.center.latitude.toFixed(6),
                    //"DSList": "dslist||",
                    //"Filters": "defs||",
                    //"Graphics": "grfx||",
                    //"Labels": "labels||",
                    //"Layers": "layers||",
                    //"Link": "link||",
                    //"Queries": "sql||",
                    //"Scale": parseInt(mapview.scale),
                    //"Selections": "selxn||",
                    //"Summary": "",
                    //"Symbols": "",
                    //"Tags": "",
                    //"Title": "",
                    //"Tool": "",
                    //"Visible": 1,
                    "Zoom": mapview.zoom
                }
            });
            bmform = new FeatureForm({
                container: "bm-form",
                layer: bookmarksLayer//, feature: bm
            });
            // TODO 20181203 Add hidden bookmarksLayerItem to toc to hold layerProperties
            // TODO 20181203 REPLACE BELOW FXNS
            bmform.on("submit", function () {
                if (bm) {
                    // Grab updated attributes from the form.
                    const updated = bmform.getValues();
                    // Loop through updated attributes and assign
                    // the updated values to feature attributes.
                    Object.keys(updated).forEach(function (name) {
                        bm.attributes[name] = updated[name];
                    });
                    // Setup the applyEdits parameter with updates.
                    const edits = {
                        updateFeatures: [editFeature]
                    };
                    applyEdits(edits);
                }
            });
            document.getElementById("bm-update").onclick = function () {
                bmform.submit();
            }
            document.getElementById("bm-delete").onclick = function () {
                const edits = {
                    deleteFeatures: [bm]
                };
                applyEdits(edits);
            }
            //console.log('bookmarkItem = ' + JSON.stringify(bm));//20181017 OK
            // 20181203 BOOKMARKTOOL UI CONSTRUXN AND RXNS
            if ($('bm-fields') !== null) {
                var outv = $('bm-fields');
                for (var i = 0; i < bmtool.bmcols.length; i++) {
                    var key = bmtool.bmcols[i];
                    if ($(key) === null) {
                        var row = document.createElement('div');
                        row.classList.add('bm');
                        var lab = document.createElement('label');
                        lab.classList.add('bm');
                        lab.innerHTML = key;
                        row.appendChild(lab);
                        var tbox = document.createElement('input');
                        tbox.type = 'text';
                        tbox.classList.add('bookmark');
                        tbox.id = key;
                        //tbox.value = 'anonymous';//forAuthor
                        //tbox.value = 'Test bookmark on ' + (new Date()).toISOString();//forDescription
                        row.appendChild(tbox);
                        outv.appendChild(row);
                    }
                }
            }
            $('bm-add').addEventListener('click', this.addbm);
            $('bm-brew').addEventListener('click', function () {
                bmtool.getrows();//TRAP--this.getrows is undef
            });
            // ON OPENING BOOKMARKTOOLS
            if (bm.attributes['OBJECTID'] === undefined) {// no urlquery bookmark
                //$('Author').value = app.userName;
                //$('Description').value = app.viewer + ' bookmark on ' + (new Date()).toString();
                $('Description').value = 'test bookmark ' + (new Date()).toString();
            }
            addmsg('DONE bmtool.init');
        }
        //END bmtool
    }
    bs = {
        id: "bseeker",
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/manifestpub/FeatureServer/0"
    }
    bs.getds = function (dsid) {
        addmsg('DO bs.getds: ' + dsid);
        let query = new Query();
        query.where = "DATASOURCEID = " + dsid;
        query.outFields = ['*'];
        let queryTask = new QueryTask({
            url: bs.url
        });
        addmsg('CALLING bs.getds');
        queryTask.execute(query).then(function (res) {
            addmsg('CALLBACK bs.getds: ' + res.features.length);
            if (res.features.length >= 0) {
                var feature = res.features[0];
                addmsg('dsname = ' + feature.attributes['DataSourceName']);
                var urids = getbiosurids(feature);
                addmsg('BIOS layer ' + urids);
                // TODO NEXT SEND THIS FTR TO ADDBIOSLYR, LISTBIOSLYR
            } else {
                addmsg('WARNING: No DSID matching ' + dsid);
            }
        });
    }
    mapview.when(function () {
        bmtool.init();
        getinfo('biosbookmarks', config.dfg.layers[0].url);
        om = urlquery();
        if (urlsearch !== null) {
            for (key in urlsearch) {
                var val = urlsearch[key];
                if (key === 'al') {
                    if (val.indexOf('ds') === 0) {
                        var dsid = parseInt(val.replace('ds', ''));
                        bs.getds(dsid);
                    }
                }
                if (key === 'bl') {
                    map.basemap = val;
                }
                if (key === 'bookmark' || key === 'bmk') {            
                    bmtool.getbm(parseInt(val));
                }
                if (key === 'zl') {
                    mapview.zoom = parseInt(val);
                }
            }
        }
    });
    // ONCLICK OF MAPVIEW
    mapview.on("click", function (event) {
        // clear previous feature selection
        //unselectFeature();
        //document.getElementById("mapview").style.cursor = "crosshair";
        mapview.hitTest(event).then(function (response) {
            // If a user clicks on an incident feature, select the feature.
            if (response.results[0].graphic && response.results[0].graphic.layer.id === "biosbookmarks") {
                selectFeature(response.results[0].graphic.attributes[bookmarksLayer.objectIdField]);
            }
        });
    });
    function getinfo(urid, url) {
        addmsg('DO getinfo (activateLayer): ' + urid);
        var qurl = url + '?f=json';
        esriRequest(qurl, {
            responseType: "json"
        }).then(function (response) {
            addmsg('CALLBACK getinfo ' + JSON.stringify(response).length);
            // The requested data
            var json = response.data;
            if (json.fields !== undefined) {
                addmsg('Read ' + urid + ' fields info');
                var fields = json.fields;
                var fvals = [];
                for (var i = 0; i < fields.length; i++) {
                    var fson = fields[i];
                    var fval = fson.name + ',' + fson.type + ',' + fson.alias + ',';
                    if (fson['length'] !== undefined) {
                        fval += fson['length'];
                    } else {
                        fval += '0';
                    }
                    fvals.push(fval);
                }
                if ($(urid + '-fields') !== null) {
                    addmsg('Put ' + urid + ' fields data');
                    $(urid + '-fields').value = fvals.join('|');
                }
            }
        });
    }
    //----------------------------- OLD NOT USED -------------------------------
    // *****************************************************
    // Highlights the clicked incident feature and display
    // the feature form with the incident's attributes.
    // *****************************************************
    function selectFeature(objectId) {
        // query feature from the server
        bookmarksLayer.queryFeatures({
            objectIds: [objectId],
            outFields: ["*"],
            returnGeometry: true
        }).then(function (results) {
            if (results.features.length > 0) {
                editFeature = results.features[0];
                // display the attributes of selected feature in the form
                featureForm.feature = editFeature;
                // highlight the feature on the mapview
                mapview.whenLayerView(editFeature.layer).then(function (layerView) {
                    highlight = layerView.highlight(editFeature);
                });
                attributeEditing.style.display = "block";
                updateInstructionDiv.style.display = "none";
            }
        });
    }//duped

    // *****************************************************//duped bmtool.init
    // Set up editing.
    // *****************************************************
    function setupEditing() {
        // input boxes for the attribute editing
        editArea = document.getElementById("editArea");
        updateInstructionDiv = document.getElementById("updateInstructionDiv");
        attributeEditing = document.getElementById("featureUpdateDiv");
        // Create a new feature form and set its layer to
        // 'incidents' featureLayer. Feature form displays
        // attributes of the fields specified in fieldConfig.
        featureForm = new FeatureForm({
            container: "formDiv",
            layer: bookmarksLayer//,
        });
        // Listen to the feature form's submit event.
        featureForm.on("submit", function () {
            if (editFeature) {
                // Grab updated attributes from the form.
                const updated = featureForm.getValues();
                // Loop through updated attributes and assign
                // the updated values to feature attributes.
                Object.keys(updated).forEach(function (name) {
                    editFeature.attributes[name] = updated[name];
                });
                // Setup the applyEdits parameter with updates.
                const edits = {
                    updateFeatures: [editFeature]
                };
                applyEdits(edits);
            }
        });
        // Expand widget for the editArea div.
        const editExpand = new Expand({
            expandIconClass: "esri-icon-edit",
            expandTooltip: "Expand Edit",
            expanded: true,
            view: mapview,
            content: editArea
        });
        mapview.ui.add(editExpand, "top-right");
        // *****************************************************
        // Update attributes of the selected feature.
        // *****************************************************
        document.getElementById("btnUpdate").onclick = function () {
            // Fires feature form's submit event.
            featureForm.submit();
        }//duped
        // *****************************************************
        // Create a new point feature at the click location SAMPLE
        // *****************************************************
        document.getElementById("btnAddFeature").onclick = function () {
            unselectFeature();
            const handler = mapview.on("click", function (event) {
                handler.remove();
                event.stopPropagation();
                if (event.mapPoint) {
                    point = event.mapPoint.clone();
                    point.z = undefined;
                    point.hasZ = false;
                    // Create a new feature with incident type of "other".
                    editFeature = new Graphic({
                        geometry: point,
                        attributes: {
                            "IncidentType": 7
                        }
                    });
                    // Setup the applyEdits parameter with adds.
                    const edits = {
                        addFeatures: [editFeature]
                    };
                    applyEdits(edits);
                    document.getElementById("mapview").style.cursor = "auto";
                } else {
                    console.error("event.mapPoint is not defined");
                }
            });
            // Change the mapview's mouse cursor once user selects
            // a new incident type to create.
            document.getElementById("mapview").style.cursor = "crosshair";
            editArea.style.cursor = "auto";
        }
        // *****************************************************
        // Delete button click event. ApplyEdits is called
        // with the selected feature to be deleted.
        // *****************************************************
        document.getElementById("btnDelete").onclick = function () {
            // setup the applyEdits parameter with deletes.
            const edits = {
                deleteFeatures: [editFeature]
            };
            applyEdits(edits);
        }
    }//setupEditing_duped
    app.add = function (x) {
        map.add(x);
        //toc.add(x);// TODO-20181211
    }
    console.log('DONE REQUIRED');
});//END REQUIRED

let sampleBookmarkItem = {
    "geometry": {"spatialReference": {"latestWkid": 3857, "wkid": 102100}, "xmin": -13632735.800643975, "ymin": 4609217.17164636, "xmax": -13411221.292673448, "ymax": 4713018.656057669},
    "symbol": null,
    "attributes": {
        "UserName": "guest", "UserGroup": "Public",
        "Author": "guest", "Description": "test bookmark",
        "Created": "2018-10-17T21:23:00.987Z",
        "Immortal": 0, "LastUsed": "2018-10-17T21:23:00.987Z",
        "Basemap": {"baseMapLayers": [{"id": "dark-gray-base-layer", "showLegend": false, "opacity": 1, "title": "World Dark Gray Base", "url": "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer", "visibility": true, "layerType": "ArcGISTiledMapServiceLayer"}, {"isReference": true, "id": "dark-gray-reference-layer", "showLegend": false, "opacity": 1, "title": "World Dark Gray Reference", "url": "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer", "visibility": true, "layerType": "ArcGISTiledMapServiceLayer"}], "title": "Dark Gray Canvas"},
        "Center": [-121.46999999999794, 38.57599999999935],
        "DSList": null, "Filters": null, "Graphics": null,
        "Labels": null, "Layers": null, "Link": null, "Queries": null,
        "Scale": 577790, "Selections": null, "Summary": null, "Symbols": null,
        "Tags": null, "Title": null, "Tool": "identify", "Visible": 1, "Zoom": 10
    },
    "popupTemplate": null
}
function urlquery() {
    addmsg('DO urlquery: ' + location.search);
    if (location.search !== '') {
        var s = location.search.substr(1);
        urlsearch = {};
    } else {
        return 0;
    }
    var ss = decodeURIComponent(s);
    if (ss.indexOf('&') < 0) {
        var kva = [ss];
    } else {
        var kva = ss.split('&');
    }
    for (var i = 0; i < kva.length; i++) {
        var kvp = kva[i];
        var kv = kvp.split('=');
        var key = kv[0];
        var val = kv[1];
        urlsearch[key] = val; //TIP 20181120 CANNOT SET NULL[KEY]=VALUE
        if (app[key] !== undefined) {
            app[key] = val;
        }
        if ($(key) !== null) {
            $(key).value = val;
        }
    }
    return kva.length;
}
// BIOS FUN
var gflags = {
    "point": "m", "line": "n", "polygon": "p", "raster": "r"
}
function getftype(dstype) {
    return dstype.replace('Digital data: ', '').replace('vector - ', '').replace('/image', '');
}
function getbiosurids(feature) {
    // Returns BIOSDS codename based on a Manifest record 20181123
    // like biosds69_cmu, biosds69_fmu, biosds620_dru
    addmsg('DO getbiosurids: ' + feature.attributes['DATASOURCEID']);
    var attributes = feature.attributes;
    var dsid = attributes['DATASOURCEID'];
    var dsname = attributes['DATASOURCENAME'];
    var dstype = attributes['DATASOURCETYPE'];
    var secgroups = attributes['SECURITYGROUPS'];
    var dyn = parseInt(attributes['DYNAMICSERVICE']);
    var fs = parseInt(attributes['FEATURESERVICE']);
    var tiles = parseInt(attributes['MAPTILE']);
    var biosds = 'biosds' + dsid;
    if (dyn === 1) {
        var cflag = 'd';
    } else {
        var cflag = 'f';
    }
    var ftype = getftype(dstype);
    var gflag = gflags[ftype];//m,n,p,r
    if (secgroups === 'Public') {
        var sflag = 'u';
    } else {
        var sflag = 's';
    }
    var urids = [];
    urids[0] = biosds + '_' + cflag + gflag + sflag;
    if (tiles === 1) {
        urids[1] = biosds + '_c' + gflag + sflag;
    }
    return urids;
}
function biosrasterurl(urid) {
    // RETURNS BIOS RASTER SERVICE REST URL 20181001 by urid like biosds620_dru
    //addmsg('DO biosraster: ' + urid);
    let h = parseInt(parseInt(urid.split('_')[0].replace('biosds', ''))/100);
    addmsg('h=' + h);
    let ps = 'Public';
    if (urid.slice(-1) === 's') {
        ps = 'Secure';
    }
    addmsg('ps=' + ps);
    if (h < 10) {
        var sid = 'q_BIOS_' + ps + '_rasters0' + h;
    } else {
        var sid = 'q_BIOS_' + ps + '_rasters' + h;
    }
    addmsg('sid=' + sid);
    var url = 'https://map.dfg.ca.gov/arcgis/rest/services/Project_BIOS_' + ps + '/' + sid + '/MapServer';
    //addmsg('DONE biosraster: url=' + url);
    return url;
}
function biosurl(urid) {
    // RETURNS BIOS LAYER REST URL 20180930
    if (urid.indexOf('_c') > 0) {
        return 'https://tiles.arcgis.com/tiles/Uq9r85Potqm3MfRV/arcgis/rest/services/' + urid + '/MapServer';
    } else if (urid.indexOf('_f') > 0) {
        return 'https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/' + urid + '/FeatureServer/0';
    } else if (urid.indexOf('_dr') > 0) {
        //return 'https://map.dfg.ca.gov/arcgis/rest/services/Project_BIOS_Public/' + urid.replace(':', '/MapServer/');
        return biosrasterurl(urid);
    }
}

console.log('Loaded min.js');
