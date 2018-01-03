// workbee_js 20171009 dchiang
// Request REST info from ArcGIS Server outside of the calling html
// https://www.w3schools.com/html/html5_webworkers.asp
// https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webworker
// Ajax XMLHttpRequest https://www.w3schools.com/xml/xml_http.asp

//20171010 FAIL: CANNOT use AMD since no JSAPI is loaded by html header.
//----------------------------------------------------------------------
var i = 0;
var indata = null;
var cat = null;
var spaths = null; // array of serverpaths
var dpaths = []; // array of featurelayer datapaths
//function timedCount() {
//    i = i + 1;
//    postMessage(i);
//    setTimeout('timedCount()', 1000);
//}
//timedCount();
function ajaxget(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById('demo').innerHTML = xhr.responseText;
            callback(xhr.responseText);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}
function parson(response) {
    if (typeof response !== 'object') {
        return JSON.parse(response);
    } else {
        return response;
    }
}
function work(indata) {
    //20171010 Process the input
    var args = indata.args;
    var op = indata.op;
    if (op === 'getfolders') {
        cat = args;
        var url = cat.url + '?f=json';
        if (cat.btoken !== '') {
            url = url + '&token=' + cat.btoken;
        }
        ajaxget(url, function (response) {
            //console.log('NEED to parse responseText to JSON');//=YES! NOTE: this line stops thread-20171010
            var json = parson(response);
            var folders = json.folders;
            postMessage('workbee||getfolders|folders=' + folders);
            //20171022 TEST if DOM works outside of caller page=FAIL CANNOT RECOGNIZE OBJ
            //var dirs = document.createElement('h3');
            //dirs.innerHTML = folders;
            //dirs.style.border = '1px solid yellow';
            //dirs.style.color = 'red';
            //dirs.onclick = function (e) {
            //    this.style.color = 'lightgreen';
            //}
            // TIP: html text below will be interpreted by caller page
            var dirs = '<h3 style="border: 1px solid yellow; color: red; padding: 5px;" ';
            dirs += 'onclick="this.style.color=\'lightgreen\'">';
            dirs += folders.join(', ') + '</h3>';
            postMessage(dirs);//folders);
        });
    } else if (op === 'loopservers') {
        spaths = args;
        //while (spaths.length > 0) {
        //    i = i + 1;
        //    var serverpath = spaths.pop();
        //    var msg = spaths.length + ': ' + cat.url + '/' + serverpath;
        //    postMessage(msg);
        //}//OK
        getservicelayers();
    } else if (op === 'listlayers') {
        serverpath = args;
        servicename = serverpath.split('/')[1];
        //20171022 TODO getservicelayers
        msg = 'get layers for ' + servicename;
        postMessage(msg);
    } else {
        postMessage('ERROR: Requested operation not found');
    }
}
onmessage = function (e) {
    // the passed-in data is available via e.data
    indata = e.data;
    work(indata);
};

function getservicelayers() {
    //20171023 This self iterative ajax loop works in posting data to caller page
    if (spaths.length === 0) {
        var outmsg = 'workbee|getservicelayers|done|groupcount=' + cat.groupcount + '|layercount=' + cat.layercount + '|' + Date.now();
        postMessage(outmsg);
        getTopLayerRowCount();
        return;
    }
    var serverpath = spaths.pop();    
    //serverpath = args.serverpath;
    surl = cat.url + '/' + serverpath;//args.url;//
    servicename = serverpath.split('/')[1];
    stype = serverpath.split('/')[2];
    var sid = servicename;
    if (serverpath.indexOf('/FeatureServer') > 0) {
        var sid = servicename + '_f';
    }
    var url = surl + '?f=json';
    if (cat.btoken !== '') {
        url = url + '&token=' + cat.btoken;
    }
    //postMessage(url);
    ajaxget(url, function (response) {
        var json = parson(response);
        if (json.layers === undefined || json.layers === null) {
            var outmsg = 'workbee|getservicelayers|' + sid + '|No layers found|' + spaths.length + '|' + Date.now();
        } else {
            var layers = json.layers;
            var items = '';// '<ol>';
            var testcount = true;
            for (var i = 0; i < layers.length; i++) {
                var info = layers[i];
                var lid = info.id;
                var name = info.name;
                var urid = sid + ':' + lid;
                var url = cat.url + '/' + serverpath + '/' + lid;
                var subs = info.subLayerIds;
                if (subs === null) {
                    var type = 'Layer';
                    if (stype === 'FeatureServer') {
                        type = 'Feature';
                    }
                    cat.layercount += 1;
                    if (testcount === true) {
                        //getreccount(urid, url);//20171029 queryforcount onfirstdataset
                        if ((stype === 'MapServer' || stype === 'FeatureServer') 
                            && sid.indexOf('raster') < 0) { // skip rasters
                            dpaths.push(serverpath + '/' + lid);//20171112 Save featureLayerUrls for queryCount later
                        }
                        testcount = false;
                    }
                } else if (subs.length > 0) {
                    var type = 'Group';// 'Layer';//
                    cat.groupcount += 1;
                }
                var item = '<li id="' + urid + '-item" class="' + type + '" data-type="' + type + '">';
                item += name + ' (' + type + ')';
                item += ' <a id="' + urid + '-link" class="esri-icon-link alink" ';
                item += 'href="' + surl + '/' + lid + '" target="_blank"></a>';
                item += '<span id="' + urid + '-tug" class="esri-icon-right-arrow" ';
                item += 'onclick="getIdcount(\'' + urid + '\')"></span>';
                item += '<span id="' + urid + '-fcnt"></span>';
                item += '</li>';
                items += item;
            }
            //items += '</ol>';
            var outmsg = 'workbee|getservicelayers|' + sid + '|' + items + '|' + spaths.length + '|' + Date.now();
        }
        postMessage(outmsg);
        getservicelayers();
    });
}
function getreccount(urid, url) {
    var qurl = url + '/query?where=OBJECTID+>+0&returnCountOnly=true&f=json';
    if (cat.btoken !== '') {
        qurl = qurl + '&token=' + cat.btoken;
    }
    //SAMPLE OUTPUT {"count":63893}
    ajaxget(qurl, function (response) {
        json = parson(response);
        if (json.count === undefined) {
            var outmsg = 'workbee|getreccount|' + urid + '|FAIL|Nodata|' + Date.now();
        } else {
            var outmsg = 'workbee|getreccount|' + urid + '|OK|' + json.count + '|' + Date.now();
        }
        postMessage(outmsg);
    });
}
function getTopLayerRowCount() {
    // Check the feature count of first Feature Layer under each MapServer or FeatureServer
    if (dpaths.length === 0) {
        return;
    }
    var layerpath = dpaths.shift();
    var togo = dpaths.length;
    var servicename = layerpath.split('/')[1];
    var sid = servicename;
    if (layerpath.indexOf('/FeatureServer') > 0) {
        sid = servicename + '_f';
    }
    var lid = layerpath.split('/')[3];
    var urid = sid + ':' + lid;
    var url = cat.url + '/' + layerpath;
    //getreccount(urid, url);
    var qurl = url + '/query?where=OBJECTID+>+0&returnCountOnly=true&f=json';
    if (cat.btoken !== '') {
        qurl = qurl + '&token=' + cat.btoken;
    }
    ajaxget(qurl, function (response) {
        json = parson(response);
        if (json.count === undefined) {
            var outmsg = 'workbee|getTopLayerRowCount|' + urid + '|FAIL,' + dpaths.length + '|Nodata|' + Date.now();
        } else {
            var outmsg = 'workbee|getTopLayerRowCount|' + urid + '|OK,' + dpaths.length + '|' + json.count + '|' + Date.now();
        }
        postMessage(outmsg);
        getTopLayerRowCount();//20171114 self-iterates
    });
    //getfeaturecount(urid, url);
    //var outmsg = 'workbee|getTopLayerRowCount|' + urid + '|TEST|' + url + '|' + Date.now();
    //postMessage(outmsg);
    //setTimeout(function() {
    //    getTopLayerRowCount();
    //}, 500);
}
//20171112 Async method try
const funksion = async () => {
    let res = immediatefun();
    let resolved = await fxnReturnsPromise();
    console.log('result:', result);
    console.log(res);
};
//go();
async function getfeaturecount(urid, url) {
    var qurl = url + '/query?where=OBJECTID+>+0&returnCountOnly=true&f=json';
    if (cat.btoken !== '') {
        qurl = qurl + '&token=' + cat.btoken;
    }
    ajaxget(qurl, putfeaturecount);
    response = await putfeaturecount();//FAIL--NEED a promise returned
    var json = parson(response);
    if (json.count === undefined) {
        var outmsg = 'workbee|getreccount|' + urid + '|FAIL|Nodata|' + Date.now();
    } else {
        var outmsg = 'workbee|getreccount|' + urid + '|OK|' + json.count + '|' + Date.now();
    }
    postMessage(outmsg);
    getTopLayerRowCount();
}
//20171029 todo Making large number of getreccount ajax calls may not work; 
// better gather list of all 1stfeaturelayerurids and call them in series 
// like the servers.
//20171114 Assuming all feature attribute table has OBJECTID fails on ds1-- 
// Project_BIOS_Secure/q_BIOS_Secure_pointslines00/MapServer/0/query?where=ProID+>+0

