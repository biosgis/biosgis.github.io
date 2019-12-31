// biosv.js 20190927 dfgchiang
console.log('Loading biosv');
var manifestpub = {
    url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/manifestpub/FeatureServer/0",
    id: "manifestpub",
    type: "table"
}
var manifestpro = {
    url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/BIOS_ManifestPro/FeatureServer/0",
    id: "BIOS_ManifestPro",
    type: "Table"
}
var biosmanpub = {
    url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosmanpub/FeatureServer/0",
    portalItemId: "26737056dda24b4d8947f85064ac8978", // UID, PIID
    id: "biosmanpub",
    type: "feature"
}
if (app.userName === 'guest') {
    var biosurl = biosmanpub.url;
    //https://cdfw.maps.arcgis.com/home/item.html?id=aba2b52d4840416783191b4dba972d89
} else {
    var biosurl = manifestpro.url;
}

const ESRI_ICON_FTYPES = {
    "point": "esri-icon-map-pin",
    "line": "esri-icon-polyline",
    "polygon": "esri-icon-polygon",
    "raster": "esri-icon-default-action"
}

function getbiosids(dsid, dssec, dstype, dyn, ftr, tl) {
    var biosids = [];
    var biosds = 'biosds' + dsid;
    if (dssec === 'Public') {
        var sflag = 'u';
    } else {
        var sflag = 's';
    }
    var gflags = {
        "point": "m",
        "line": "n",
        "polygon": "p",
        "raster": "r"
    }
    if (dyn === 1) {
        var biosid = biosds + '_dr' + sflag; // ONLY RASTERS USE DYNAMIC MAPSERVICE
    } else if (ftr === 1) {
        var biosid = biosds + '_f' + gflags[dstype] + sflag;
    }
    biosids.push(biosid);
    if (tl === 1) {
        biosids.push(biosds + '_t' + gflags[dstype] + sflag);
    }
    return biosids;
}

function bsall() {
    var querytask = new EsriQueryTask(biosurl);
    var query = new EsriQuery();
    var sqlwhere = "DataSourceID IS NOT NULL";
    query.where = sqlwhere;
    query.orderByFields = ['DataSourceID ASC', 'DataSourceName ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        $('biosmancount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bsearch oids.len=' + ids.length);
        app.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bsall/querytask: results= ' + result.features.length);
        var list = $('biosq-all'); // document.createElement('ol');
        list.innerHTML = '';
        //$('biosq-msg').appendChild(list);
        var features = result.features;
        bslist(features, list);
    });
}

function bsinit() {
    bsall();
    $('biosq').onkeyup = function (event) {
        var kc = (event.keyCode || event.which);
        if (kc === 13) {
            bstitle(this.value);
        }
    }
}

function bslist(features, list) {
    for (var i = 0; i < features.length; i++) {
        var attr = features[i].attributes;
        var dsid = attr['DataSourceID'];
        var dsname = attr['DataSourceName'];
        var dssec = attr['SecurityGroups'];
        var dstype = attr['DataSourceType'].replace('Digital data: ', '').replace('vector - ', '').replace('/image', ''); // point|line|polygon|raster
        var abst = attr['Abstract'];
        var dyn = attr['dynamicService'];
        var ftr = attr['featureService'];
        var tl = attr['mapTile'];
        var biosids = getbiosids(dsids, dssec, dstype, dyn, ftr, tl);
        var dft = [dyn, ftr, tl];
        var dsrec = [dsname, dstype, dsid, dft];
        var item = document.createElement('li');
        //item.innerHTML = dsrec;
        var labeler = document.createElement('label');
        labeler.innerHTML = dsname;
        labeler.title = abst;
        item.appendChild(labeler);
        var ftyper = document.createElement('span');
        ftyper.classList.add(ESRI_ICON_FTYPES[dstype]);
        ftyper.title = dstype;
        item.appendChild(ftyper);
        var adder = document.createElement('input');
        adder.type = 'button';
        adder.classList.add('esri-icon-plus');
        adder.value = biosids;
        item.appendChild(adder);
        list.appendChild(item);
    }
}

function bstitle(s) {
    var q = decodeURIComponent(s);
    q = q.trim();
    if (q === '') {
        var msg = 'Please enter a search string';
        return;
    }
    var querytask = new EsriQueryTask(biosurl);
    var query = new EsriQuery();
    var sqlwhere = "DataSourceName LIKE '%" + q + "%'";
    if (q.indexOf(' ') > 0) {
        var q2 = q.replace(/ /g, '%'); //q.split(' ').join('%')
        sqlwhere += " OR DataSourceName LIKE '%" + q2 + "%'";
    }
    query.where = sqlwhere;
    query.orderByFields = ['DataSourceName ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        var msg = 'Found BIOS Catalog Dataset count=' + count;
        $('biosq-msg').innerHTML = msg;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bstitle oids.len=' + ids.length);
        app.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bstitle/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        //$('biosq-msg').appendChild(list);
        var features = result.features;
        bslist(features, list);
    });
}
console.log('Loaded biosv');
