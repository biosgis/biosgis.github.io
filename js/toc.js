// toc.js 20191104 dfgchiang
console.log('Loading toc');
// TODO--CONSTRUCT TOC AS AN ESRICOLLECTION OBJECT?
var toc = {
    created: 20191030,
    id: "toc",
    name: "contents",
    title: "Contents",
    urid: "",
    uridlast: "",
    urids: ['basemap']
};
//=================
// TOC CONTENTS
//=================
toc.LayerItem = function (layer) {
    addmsg('DO LayerItem: ' + layer.id);
    var urid = layer.id;
    var url = layer.url;
    var type = layer.type;
    if (layer.title !== undefined && layer.title !== null) {
        var title = layer.title;
    }
    var item = document.createElement('li');
    item.id = urid + '-item';
    return item;
}
toc.picklayer = function (urid) {
    if (app.layers[urid] === undefined) {
        app.layers[urid] = {
            "def": null,
            "filterg": null,
            "oids": [],
            "selectg": null,
            "sql": null
        };
    }
    return urid;
}

function TocLayer(ar) {
    //addmsg('DO TocLayers ' + ar[0].urid);
    var a = ar[0];
    if (ar.length > 1) {
        var b = ar[1];
    }
    var urid = a.id;
    var jo = ar[0];
    var urid = jo.urid; //ids[0];
    var url = jo.url; //urls[0];
    var name = jo.name;
    var type = jo.type;
    var tiled = jo.tiled;
    if (jo.defaultVisibility !== undefined) {
        var visible = jo.defaultVisibility;
    } else {
        var visible = jo.visible;
    }
    if (jo.visibles !== undefined) {
        var vls = jo.visibles;
    }
    if (jo.ftype === undefined) {
        var ftype = '';
    } else {
        var ftype = jo.ftype;
    }
    if (urid.indexOf(':') > 0) {
        var sid = urid.split(':')[0];
        var lid = parseInt(urid.split(':')[1]);
    } else {
        var sid = urid;
        var lid = -1;
    }
    var item = document.createElement('li');
    item.classList.add('layeritem');
    item.id = urid + '-item';
    var toggler = document.createElement('span');
    toggler.id = urid + '-toggle';
    if (type.indexOf('MapServer') >= 0 || type.indexOf('MapImageLayer') >= 0 || type.indexOf('map-image') >= 0 || type.indexOf('Group Layer') >= 0) {
        toggler.classList.add('esri-icon-right');
    } else if (type.indexOf('FeatureServer') >= 0 || type.indexOf('feature') >= 0) {
        toggler.classList.add('esri-icon-feature-layer');
        if (ftype.toLowerCase().indexOf('line') >= 0) {
            toggler.classList.add('esri-icon-polyline');
        } else if (ftype.toLowerCase().indexOf('line') >= 0) {
            toggler.classList.add('esri-icon-polyline');
        } else if (ftype.toLowerCase().indexOf('line') >= 0) {
            toggler.classList.add('esri-icon-polyline');
        }
    } else if (type.indexOf('Raster Layer') >= 0 || ftype.toLowerCase().indexOf('raster') >= 0) {
        toggler.classList.add('esri-icon-default-action');
    } else {
        toggler.classList.add('esri-icon-right-triangle-arrow');
    }
    var types = type.split(' ');
    for (var i = 0; i < types.length; i++) {
        item.classList.add(types[i]);
    }
    if (ftype !== '') {
        item.classList.add(ftype);
    }
    toggler.classList.add('layericon');
    item.appendChild(toggler);
    toggler.onclick = function () {
        togglex(list);
    }
    var checker = document.createElement('input');
    checker.type = 'checkbox';
    checker.id = urid + '-check';
    checker.setAttribute('name', 'vislayers');
    checker.checked = visible;
    if (urid.indexOf(':') > 0) {
        checker.value = lid;
    } else { // feature
        checker.value = urid;
    }
    checker.classList.add('layericon');
    item.appendChild(checker);
    var picker = document.createElement('input');
    picker.type = 'radio';
    picker.id = urid + '-pick';
    picker.setAttribute('name', 'ace3');
    picker.value = urid;
    picker.classList.add('layericon');
    picker.style.border = '1px solid hotpink';
    picker.style.display = 'none';
    item.appendChild(picker);
    var chooser = document.createElement('input');
    chooser.type = 'radio';
    chooser.id = urid + '-radio';
    chooser.setAttribute('name', 'toollayer');
    chooser.value = urid;
    chooser.classList.add('layericon');
    chooser.style.display = 'none';
    item.appendChild(chooser);
    var labeler = document.createElement('label');
    labeler.id = urid + '-name';
    labeler.innerHTML = name;
    labeler.style.marginRight = '5px';
    if (type === 'feature' || type === 'sublayer') {
        labeler.htmlFor = urid + '-radio';
    } else if (type === 'tile' || type === 'TileLayer') {
        labeler.onclick = function () {
            checker.checked = true;
            tocchecked(checker);
            //togglex(list); // TODO SHOW LEGENDKEYS?
        }
    } else {
        labeler.onclick = function () {
            togglex(list);
        }
    }
    item.appendChild(labeler);
    if (url.indexOf('Project_ACEIII/ace3') > 0 && type === 'sublayer') {
        checker.style.display = 'none';
        //picker.style.display = 'inline';
        chooser.style.display = 'inline';
    }
    if (type.indexOf('feature') >= 0 || type === 'sublayer') {
        labeler.classList.add('feature');
    }
    checker.onclick = function () {
        addmsg('CLICKED ' + checker.id);
        tocchecked(checker);
    }
    chooser.onclick = function () {
        addmsg('CLICKED ' + chooser.id);
        if (chooser.checked) {
            checker.checked = true;
            tocchecked(checker);
            if (toc.urid !== '') {
                $(toc.urid + '-item').classList.remove('activeLayer');
                if (urid.indexOf('ace3') === 0 && toc.urid.indexOf('ace3') === 0) {
                    //$(toc.urid + '-check').click();//uncheck last ace3layer
                    $(toc.urid + '-check').checked = false;
                    tocchecked($(toc.urid + '-check'));
                }
            }
            toc.urid = urid;
            $('al').value = urid;
            document.getElementsByClassName('alname')[0].innerHTML = labeler.innerHTML;
            item.classList.add('activeLayer');
            // if (urid.indexOf('ace3') === 0) {
            //     picker.click();// IS THIS REALLY NECESSARY?
            // }
            // TODO ACTIVATE LAYER REQUESTS
        }
    }
    // chooser.onchange = function () {
    //     addmsg(chooser.id + ' CHANGED');//DOESNT DETECT UNCHECK WHEN ANOTHER RADIO CLICKED?
    //     if (urid.indexOf('ace3') === 0) {
    //         picker.checked = chooser.checked;
    //         checker.checked = chooser.checked;
    //         tocchecked(checker);
    //     }
    // }
    chooser.addEventListener('change', function () {
        addmsg(chooser.id + ' CHANGED'); //DOESNT DETECT UNCHECK WHEN ANOTHER RADIO CLICKED?
        picker.checked = chooser.checked;
    });
    // BUG--CHECKER CHANGED OK BUT NOT CALLING CLICK ACTION?
    var dots = document.createElement('span');
    dots.classList.add('esri-icon-handle-horizontal');
    dots.classList.add('layericon');
    item.appendChild(dots);
    var menu = document.createElement('div');
    menu.style.backgroundColor = 'ghostwhite';
    menu.style.border = '1px solid gainsboro';
    menu.style.display = 'none';
    menu.style.marginLeft = '15px';
    item.appendChild(menu);
    dots.onclick = function () {
        togglex(menu);
    }
    var linker = document.createElement('a');
    linker.classList.add('esri-icon-link');
    linker.classList.add('layericon');
    linker.id = urid + '-link';
    linker.href = url;
    linker.target = '_blank';
    menu.appendChild(linker);
    var list = document.createElement('ol');
    list.id = urid + '-list';
    if (type.indexOf('Server') > 0 || type.indexOf('Group') > 0) {
        list.classList.add('layerlist');
    }
    list.style.marginLeft = '10px';
    list.style.padding = '0px';
    list.style.display = 'none';
    item.appendChild(list);

    function chooseItem() {
        //itemselected
        if (urid.indexOf('ace3') >= 0) {
            picker.checked = true;
        }
    }
    return item;
}

function tocAddLayers(layers) {
    addmsg('DO tocAddLayers');
    for (var urid in layers) {
        var jo = layers[urid];
        if (urid.indexOf('biosds') !== 0) {
            var biosds = null; // NO NEED TO QUERY BIOSMANIFEST
        }
        if (jo.type.toLowerCase().indexOf('feature') >= 0) {
            addFeatureLayer(jo);
        }
        if (jo.type.indexOf('map-image') >= 0) {
            addMapImageLayer(jo);
        }
    }
}

function addFeatureLayer(jo) {
    if (jo.id === undefined) {
        addmsg('DO addFeatureLayer: ' + jo.url);
        if (jo.url.indexOf('/FeatureServer/') > 0) {
            var pieces = jo.url.split('/FeatureServer/');
            if (pieces[1] === undefined) {
                var lid = 0;
            } else {
                var lid = parseInt(pieces[1]);
            }
        } else {
            var pieces = jo.url.split('/FeatureServer');
            var lid = 0;
        }
        var url = pieces[0] + '/FeatureServer/' + lid;
        jo.url = url;
        var parts = pieces[0].split('/');
        var sid = parts[(parts.length - 1)];
        var urid = sid + ':' + lid;
        // TODO IF ONLY URL SUPPLIED REQUEST MORE REST INFO
        jo['id'] = urid;
        jo['urid'] = urid;
        jo['name'] = urid;
        jo['type'] = 'feature';
        jo['visible'] = true;
    } else {
        addmsg('DO addFeatureLayer: ' + jo.id);
        if (jo.id.indexOf(':') < 0) { // POSSIBLY MISSING LAYERINDEX
            var url = jo.url.split('FeatureServer')[0] + 'FeatureServer/0';
            jo.url = url;
        }
        if (jo.urid === undefined) {
            var urid = jo.id;
            jo['urid'] = urid;
        }
        if (jo.name === undefined) {
            jo['name'] = jo.urid.split(':')[0];
        }
        if (jo.tiled === undefined) {
            jo['tiled'] = false;
        }
        if (jo.visible === undefined) {
            jo['visible'] = true;
        }
    }
    var layer = new EsriFeatureLayer({
        id: jo.id,
        opacity: 0.77,
        title: jo.name,
        url: jo.url,
        visible: jo.visible
    });
    map.add(layer);
    var item = new TocLayer([jo]);
    var list = $('proj-layers-list');
    //if (jo.urid.indexOf('biosds') === 0 || jo.url.indexOf('BIOS_') > 0) {
    //    var tocgroup = 'bios';
    //}
    if (jo.tocgroup !== undefined && $(jo.tocgroup + '-layers-list') !== null) {
        var list = $(tocgroup + '-layers-list');
    }
    list.insertBefore(item, list.childNodes[0]);
    // DONE AddFeatureLayerByJson
}
// SUBLAYERS--https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-Sublayer.html
function addMapImageLayer(jo) {
    addmsg('DO addMapImageLayer ' + jo.id);
    // TODO FIGURE AND FILL OUT ALL ATTRIBUTES IF MISSING LIKE NAME AND URID IF ID IS INTEGER
    if (jo.urid === undefined) {
        var urid = jo.id;
        jo['urid'] = urid;
    }
    if (jo.name === undefined) {
        jo['name'] = jo.urid;
    }
    if (jo.tiled === undefined) {
        jo['tiled'] = false;
    }
    if (jo.visible === undefined) {
        jo['visible'] = true;
    }
    var sid = jo.urid;
    var surl = jo.url;
    // TODO DIFF BLOKS FOR IF LAYERINFO HAS FULL SUBLAYERS OR NOT
    asRequest(surl + "?f=json", {
        responseType: "json"
    }).then(function (response) {
        addmsg(sid + '/currentVersion: ' + response.data.currentVersion);
        ENV = 'CDFW';
        var sublayers = [];
        var layers = response.data.layers;
        for (var i = 0; i < layers.length; i++) {
            var sublayer = {
                id: layers[i].id,
                visible: layers[i].defaultVisibility
            }
            sublayers.push(sublayer);
            //addmsg([layers[i].id, layers[i].name]);
        }
        var layer = new EsriMapImageLayer({
            id: sid,
            url: surl,
            sublayers: sublayers,
            opacity: 0.77,
            visible: jo.visible
        });
        map.add(layer);
        jo['sublayers'] = layers;
        var k = tocAddMapImageLayerItem(jo);
    }).catch(function (err) {
        console.error('Error encountered', err);
    });
}

function tocAddMapImageLayerItem(jo) {
    addmsg('DO tocAddMapImageLayerItem ' + jo.urid);
    var k = 0;
    var item = new TocLayer([jo]);
    if (jo.tocgroup === undefined) {
        //if (jo.urid.indexOf('biosds') === 0 || jo.url.indexOf('BIOS_') > 0) {
        //    var tocgroup = 'bios';
        //}
        var tocgroup = 'proj';
    } else {
        var tocgroup = jo.tocgroup;
    }
    if ($(tocgroup + '-layers-list') === null) {
        var tocgroup = 'proj';
    }
    var list = $(tocgroup + '-layers-list');
    //list.appendChild(item);
    list.insertBefore(item, list.childNodes[0]);
    k += 1;
    if (jo.sublayers !== undefined) {
        var sid = jo.urid;
        var surl = jo.url;
        var sublayers = jo.sublayers;
        for (var i = 0; i < sublayers.length; i++) {
            var info = sublayers[i];
            var urid = sid + ':' + info.id;
            var url = surl + '/' + info.id;
            info.urid = urid;
            info.url = url;
            info.type = 'sublayer'; // DONT KNOW WHETHER FEATURE, GROUP, OR RASTER
            if (info.subLayerIds !== undefined && info.subLayerIds !== null && info.subLayerIds.length > 0) {
                info.type = 'Group Layer';
            }
            info.ftype = ''; // FEATUREGEOMETRYTYPE UNKNOWN
            if (info.parentLayerId === undefined) {
                var prid = sid;
            } else if (info.parentLayerId === -1) {
                var prid = sid;
            } else {
                var prid = sid + ':' + info.parentLayerId;
            }
            var subitem = new TocLayer([info]);
            $(prid + '-list').appendChild(subitem);
        }
    }
    return k;
}

function tocchecked(checker) {
    addmsg('DO tocchecked: ' + checker.id);
    var urid = checker.id.split('-')[0];
    if (map.findLayerById(urid) !== undefined) {
        var layer = map.findLayerById(urid);
        layer.visible = checker.checked;
    }
    if (urid.indexOf(':') > 0) {
        var sid = urid.split(':')[0];
        var lid = parseInt(urid.split(':')[1]);
        if (map.findLayerById(sid) !== undefined) {
            var layer = map.findLayerById(sid);
            //layer.sublayers[lid] = checker.checked;
            var sublayer = layer.findSublayerById(lid);
            sublayer.visible = checker.checked;
        }
    } else {
        var sid = urid;
        var lid = -1;
    }
    // BIOSDSFXN TODO
    var val = checker.value;
    if (val.indexOf(',') > 0) {
        var urids = val.split(',');
        var tlid = urids[1];
    }
}

function tocFillMapImageLayerSubinfos(jo) {
    addmsg('DO tocFillMapImageLayerSubinfos ' + jo.id);
    // PASS SUBLAYER INFO LIKE SAMPLE USA CAN BE PASSED INTO TOCLAYER TO MAKE TOCITEM
    var sid = jo.id;
    var surl = jo.url;
    if (jo.urid === undefined) {
        jo.urid = sid;
    }
    if ((jo.sublayers !== undefined && jo.sublayers.length > 0) && jo.sublayers[0].urid === undefined) {
        for (var i = 0; i < jo.sublayers.length; i++) {
            var urid = sid + ':' + jo.sublayers[i].id;
            jo.sublayers[i].urid = urid;
            var url = surl + '/' + jo.sublayers[i].id;
            jo.sublayers[i]['url'] = url;
            // DONT EVEN KNOW TYPE GROUPLAYR OR WHAT
        }
    }
    return jo;
}

function tocpicked(chooser) {
    addmsg('DO tocpicked: ' + chooser.id);
    var urid = chooser.id.split('-')[0];
    var checker = $(urid + '-check');
    if (urid.indexOf('ace3') === 0) {
        $(urid + '-pick').checked = true;
        $(app.alayer.urid + '-check').checked = false;
    } else {
        if (!checker.checked) {
            checker.click();
        }
    }
    var name = $(urid + '-name').innerHTML;
    var x = document.querySelectorAll('.alname');
    for (var i = 0; i < x.length; i++) {
        x[i].innerHTML = name;
    }
    app.alayer.uridlast = app.alayer.urid;
    app.alayer.urid = urid;
    $('al').value = urid;
    var y = document.querySelector('.activeLayer');
    y.classList.remove('activeLayer');
    $(urid + '-item').classList.add('activeLayer');
}
//************************************************ NOT YET
function applayerprops(urid) {
    if (app.layers[urid] === undefined) {
        app.layers[urid] = {
            "def": null,
            "filterg": null,
            "oids": [],
            "selectg": null,
            "sql": null
        };
    }

}

function tocActivate(urid) {
    if (urid.indexOf(':') > 0) {
        var sid = urid.split(':')[0];
        var lid = parseInt(urid.split(':')[1]);
    } else {
        var sid = urid;
        var lid = -1;
    }
    if (map.findLayerById(urid) !== undefined) {
        activeLayer = map.findLayerById(urid);
        $('altype').value = activeLayer.type;
        if (activeLayer.type === 'feature') {
            activeLayerView = mapview.layerViews.find(function (layerView) {
                return layerView.layer.id === urid;
            });
            //addmsg('Found activeLayerView.layer.id = ' + activeLayerView.layer.id);
        }
    } else if (map.findLayerById(sid) !== undefined) {
        activeLayer = map.findLayerById(sid);
        activeLayerView = mapview.layerViews.find(function (layerView) {
            return layerView.layer.id === urid;
        }, function (error) {
            console.log('Error activeLayerView: ' + error.message);
            return null;
        });
        $('altype').value = activeLayer.type;
    } else {
        console.log('ERROR: UNKNOWN Layer FAILed to activate');
    }
}

function tochelp(dsnum) {
    var href;
    switch (dsnum) {
        case 45:
            href = "https://nrm.dfg.ca.gov/FileHandler.ashx?DocumentID=72009";
            break;
        case 85:
            href = "https://nrm.dfg.ca.gov/FileHandler.ashx?DocumentID=72009";
            break;
        case 704:
            href = "https://nrm.dfg.ca.gov/FileHandler.ashx?DocumentID=71831";
            break;
    }
    return href;
}

function toctugtiletwin(urid, visible) {
    var tlid = urid.replace('_f', '_c');
    if (map.findLayerById(tlid) !== undefined) {
        map.findLayerById(tlid).visible = visible;
        if (visible === true) {
            map.findLayerById(urid).minScale = 72000;
        } else {
            map.findLayerById(urid).minScale = 0;
        }
        return tlid;
    } else {
        return null;
    }
}

function toggletiletwin(urid, visible) {
    // FIND THE TILE LAYER TWIN OF A BIOS FEATURE LAYER AND TURN IT ON OR OFF
    if ($(urid + '-check') !== undefined) {
        var val = $(urid + '-check').value;
        if (val !== null && val.indexOf(',') > 0) {
            var sids = val.split(',');
            for (var i = 0; i < sids.length; i++) {
                if (sids[i] !== urid) {
                    var tlid = sids[i];
                    map.findLayerById(tlid).visible = visible;
                    return tlid;
                }
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function tugtiletwin(urid, vis) {
    var tlid = urid.replace('_f', '_c');
    if (map.findLayerById(tlid) !== undefined) {
        map.findLayerById(tlid).visible = vis;
        if (vis === true) {
            map.findLayerById(urid).minScale = 72000;
        } else {
            map.findLayerById(urid).minScale = 0;
        }
        return tlid;
    } else {
        return null;
    }
}
toc.tugtiletwin = tugtiletwin;

console.log('Loaded toc');
