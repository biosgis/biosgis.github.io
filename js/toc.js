// toc.js 20191104 dfgchiang
console.log('Loading toc');
var toc = {
    id: "toc",
    name: "Contents"
}

function TocLayer(args) {
    //addmsg('DO TocLayers ' + args.urid);
    var urid = args.urid; //ids[0];
    var url = args.url; //urls[0];
    var name = args.name;
    var type = args.type;
    var tiled = args.tiled;
    var show = args.visible;
    var vis = args.visibles;
    if (args.ftype === undefined) {
        ftype = '';
    } else {
        ftype = args.ftype;
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
    var labeler = document.createElement('label');
    labeler.id = urid + '-name';
    labeler.innerHTML = name;
    labeler.style.marginRight = '5px';
    item.appendChild(labeler);
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
    item.appendChild(list);
    toggler.onclick = function () {
        togglex(list);
    }
    return item;
}

function tocAddLayers(layers) {
    addmsg('DO tocAddLayers');
    for (var urid in layers) {
        var args = layers[urid];
        if (urid.indexOf('biosds') !== 0) {
            var biosds = null; // NO NEED TO QUERY BIOSMANIFEST
        }
        if (args.type.indexOf('map-image') >= 0) {
            addMapImageLayer(args);
        }
    }
}
// SUBLAYERS--https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-Sublayer.html
function addMapImageLayer(args) {
    addmsg('DO addMapImageLayer ' + args.urid);
    var sid = args.urid;
    var surl = args.url;
    asRequest(surl + "?f=json", {
        responseType: "json"
    }).then(function (response) {
        console.log('currentVersion: ' + response.data.currentVersion);
        ENV = 'CDFW';
        addmsg(sid);
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
            sublayers: sublayers
        });
        map.add(layer);
        args['sublayers'] = layers;
        var k = tocAddMapImageLayerItem(args);
    }).catch((err) => {
        console.error('Error encountered', err);
    });
}

function tocAddMapImageLayerItem(args) {
    addmsg('DO tocAddMapImageLayerItem ' + args.urid);
    var k = 0;
    var item = new TocLayer(args);
    if (args.tocgroup === undefined) {
        //if (args.urid.indexOf('biosds') === 0 || args.url.indexOf('BIOS_') > 0) {
        //    var layergroup = 'bios';
        //}
        var tocgroup = 'proj';
    } else {
        var layergroup = args.tocgroup;
    }
    if ($(layergroup + '-layers-list') === null) {
        var tocgroup = 'proj';
    }
    var list = $(tocgroup + '-layers-list');
    //list.appendChild(item);
    list.insertBefore(item, list.childNodes[0]);
    k += 1;
    if (args.sublayers !== undefined) {
        var sid = args.urid;
        var surl = args.url;
        var sublayers = args.sublayers;
        for (var i = 0; i < sublayers.length; i++) {
            var info = sublayers[i];
            var urid = sid + ':' + info.id;
            var url = surl + '/' + info.id;
            info.urid = urid;
            info.url = url;
            info.type = 'sublayer'; // DONT KNOW WHETHER FEATURE, GROUP, OR RASTER
            if (info.subLayerIds !== null && info.subLayerIds.length > 0) {
                info.type = 'Group Layer';
            }
            info.ftype = ''; // FEATUREGEOMETRYTYPE UNKNOWN
            if (info.parentLayerId === -1) {
                var prid = sid;
            } else {
                var prid = sid + ':' + info.parentLayerId;
            }
            var subitem = new TocLayer(info);
            $(prid + '-list').appendChild(subitem);
        }
    }
    return k;
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
