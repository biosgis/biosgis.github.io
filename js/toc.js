// toc.js 20191104 dfgchiang
console.log('Loading toc');
var toc = {
    id: "toc",
    name: "Contents"
}

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
