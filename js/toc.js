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
