// biosv.js 20190927 dfgchiang
console.log('Loading biosv.js');
const esriFieldTypesNumber = 'esriFieldTypeDouble,esriFieldTypeFloat,esriFieldTypeInteger,esriFieldTypeOID,esriFieldTypeSmallInteger';
const esriFieldTypeToColumnType = {
    "esriFieldTypeBlob": "image",
    "esriFieldTypeDate": "date",
    "esriFieldTypeDouble": "number",
    "esriFieldTypeGeometry": "object",
    "esriFieldTypeGlobalID": "text",
    "esriFieldTypeGUID": "text",
    "esriFieldTypeInteger": "number",
    "esriFieldTypeOID": "number",
    "esriFieldTypeRaster": "image",
    "esriFieldTypeSingle": "number",
    "esriFieldTypeSmallInteger": "number",
    "esriFieldTypeString": "text",
    "esriFieldTypeXML": "text"
}

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

function geturlarg(key) {
    // GET LOCATION.SEARCH PARAMETER KEY VALUE--20190128
    var val = '';
    if (location.search.indexOf(key + '=') > 0) {
        var val = location.search.split(key + '=')[1].split('&')[0];
        if (val !== undefined && val !== null & val !== '') {
            val = decodeURIComponent(val);
        }
    }
    return val;
}

function toctugtiletwin(urid, vis) {
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

function xysplit(s) {
    return [parseFloat(s.split(',')[0]), parseFloat(s.split(',')[1])];
}
console.log('Loaded biosv.js');
