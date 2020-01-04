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
var bs = {
    biosman: {
        dsids: [],
        features: [],
        oids: [],
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosmanpub/FeatureServer/0"
    },
    dscount: 0,
    id: "bsh",
    name: "BiosSearchHost",
    oids: []
}
if (app.userName === 'guest') {
    var biosmanurl = biosmanpub.url;
    //https://cdfw.maps.arcgis.com/home/item.html?id=aba2b52d4840416783191b4dba972d89
} else {
    var biosmanurl = manifestpro.url;
}

const ESRI_ICON_FTYPES = {
    "point": "esri-icon-map-pin",
    "line": "esri-icon-polyline",
    "polygon": "esri-icon-polygon",
    "raster": "esri-icon-default-action"
}

function getbiosids(dsid, dssec, dstype, dyn, ftr, tl) {
    //addmsg('DO getbiosids: ' + [dsid, dssec, dstype, dyn, ftr, tl]);
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
    var querytask = new EsriQueryTask(biosmanurl);
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
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bsall/querytask: results= ' + result.features.length);
        var list = $('biosq-all'); // document.createElement('ol');
        list.innerHTML = '';
        //$('biosq-msg').appendChild(list);
        var features = result.features;
        var k = bslist(features, list);
        bs.biosman.features = features;
    });
}

function bsinit() {
    bsall();
    $('biosq').onkeyup = function (event) {
        var kc = (event.keyCode || event.which);
        if (kc === 13) {
            if (this.value !== '') {
                var s = decodeURIComponent(this.value);
                var q = s.trim();
                if (q === '') {
                    var msg = 'Please enter a non-blank search string';
                    $('biosq-msg').innerHTML = msg;
                    return;
                } else {
                    bsque(q);
                }
            }
        }
    }
    $('biosq').value = '';
}

function bslist(features, list) {
    addmsg('DO bslist: ' + features.length + ' items into ' + list.id);
    var k = list.length;
    for (var i = 0; i < features.length; i++) {
        var attr = features[i].attributes;
        //for (key in attr) {
        //    console.log(key + '=' + attr[key]);
        //}
        var dsid = attr['DataSourceID'];
        var dsname = attr['DataSourceName'];
        var dssec = attr['SecurityGroups'];
        var dstype = attr['DataSourceType'].replace('Digital data: ', '').replace('vector - ', '').replace('/image', ''); // point|line|polygon|raster
        var abst = attr['Abstract'];
        var dyn = attr['dynamicService'];
        var ftr = attr['featureService'];
        var tl = attr['mapTile'];
        //var dsrec = [dsid, dssec, dstype, dyn, ftr, tl];
        var biosids = getbiosids(dsid, dssec, dstype, dyn, ftr, tl);
        //if (i === 0) {
        //    addmsg('biosids=' + biosids);
        //}
        if (list.id === 'biosq-all') {
            var itemid = 'biosmanoid-' + attr['OBJECTID'];
        } else if (list.id === 'biosq-list') {
            var itemid = 'bsid-' + attr['OBJECTID'];
        }
        if ($(itemid) === null) {
            var item = document.createElement('li');
            item.id = itemid;
            // TODO--ON HOVER IVORY HIGHLIGHT ITEM
            var labeler = document.createElement('label');
            labeler.innerHTML = dsname;
            item.appendChild(labeler);
            var ftyper = document.createElement('span');
            let esricon = ESRI_ICON_FTYPES[dstype];
            //if (i === 0) {
            //    addmsg('esricon=' + esricon);
            //}
            ftyper.classList.add(esricon);
            ftyper.title = dstype;
            item.appendChild(ftyper);
            var adder = document.createElement('button');
            adder.style.borderColor = 'transparent';
            adder.classList.add('esri-icon-plus');
            adder.value = biosids;
            item.appendChild(adder);
            var qinfo = document.createElement('span');
            qinfo.classList.add('esri-icon-documentation');
            //qinfo.title = 'About ds' + dsid;
            qinfo.title = abst; // TODO--MOVE THIS OUT TO ITS OWN PANEL OF ALL ABSTRACTS
            // TODO--CLICK BUTTON TO SEE ABSTRACT, PURPOSE, OR MINI-METADATA
            item.appendChild(qinfo);
            list.appendChild(item);
            k = k + 1;
        }
    }
    $('bscount').innerHTML = list.length;
    return k;
}

function bsque(q) {
    bs.biosman.oids = [];
    $('bsqued').innerHTML = '';
    $('bscount').innerHTML = '';
    $('bsmanfields').innerHTML = '';
    if (('imagery,point,line,polygon,raster').indexOf(q.toLocaleLowerCase()) > 0) {
        bstype(q);
    } else {
        bstitle(q);
    }
}

function bstitle(q) {
    var querytask = new EsriQueryTask(biosmanurl);
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
        //var msg = 'Found BIOS Catalog Dataset count=' + count + ' matching <q>' + q + '</q>';
        //$('biosq-msg').innerHTML = msg;
        $('bsqued').innerHTML = q;
        $('bscount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bstitle oids.len=' + ids.length);
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bstitle/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        //$('biosq-msg').appendChild(list);
        var features = result.features;
        var k = bslist(features, list);
        $('bsmanfields').innerHTML += ' DataSourceName,';
        bsabstract(q);
    });
}

function bstype(q) {
    var querytask = new EsriQueryTask(biosmanurl);
    var query = new EsriQuery();
    var sqlwhere = "DataSourceType LIKE '%" + q + "%'";
    query.where = sqlwhere;
    query.orderByFields = ['DataSourceName ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        //var msg = 'Found BIOS Catalog Dataset count=' + count + ' matching <q>' + q + '</q>';
        //$('biosq-msg').innerHTML = msg;
        $('bsqued').innerHTML = q;
        $('bscount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bstype oids.len=' + ids.length);
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bstype/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        var features = result.features;
        var k = bslist(features, list);
        $('bsmanfields').innerHTML += ' DataSourceType';
    });
}

function bskeywords(q) {
    var querytask = new EsriQueryTask(biosmanurl);
    var query = new EsriQuery();
    var sqlwhere = "Keywords LIKE '%" + q + "%'";
    sqlwhere += " OR BIOSKeywords LIKE '%" + q + "%'";
    query.where = sqlwhere;
    query.orderByFields = ['DataSourceName ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        //var msg = 'Found BIOS Catalog Dataset count=' + count + ' matching <q>' + q + '</q>';
        //$('biosq-msg').innerHTML = msg;
        $('bsqued').innerHTML = q;
        $('bscount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bstype oids.len=' + ids.length);
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bskeywords/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        var features = result.features;
        var k = bslist(features, list);
        $('bsmanfields').innerHTML += ' Keywords, BIOSKeywords,';
    });
}

function bsabstract(q) {
    var querytask = new EsriQueryTask(biosmanurl);
    var query = new EsriQuery();
    var sqlwhere = "Abstract LIKE '%" + q + "%'";
    if (q.indexOf(' ') > 0) {
        var q2 = q.replace(/ /g, '%'); //q.split(' ').join('%')
        sqlwhere += " OR Abstract LIKE '%" + q2 + "%'";
    }
    query.where = sqlwhere;
    query.orderByFields = ['DataSourceName ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        //var msg = 'Found BIOS Catalog Dataset count=' + count + ' matching <q>' + q + '</q>';
        //$('biosq-msg').innerHTML = msg;
        $('bsqued').innerHTML = q;
        $('bscount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bsabstract oids.len=' + ids.length);
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bsabstract/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        var features = result.features;
        var k = bslist(features, list);
        $('bsmanfields').innerHTML += ' Abstract,';
        bspurpose(q);
    });
}

function bspurpose(q) {
    var querytask = new EsriQueryTask(biosmanurl);
    var query = new EsriQuery();
    var sqlwhere = "purpose LIKE '%" + q + "%'";
    if (q.indexOf(' ') > 0) {
        var q2 = q.replace(/ /g, '%'); //q.split(' ').join('%')
        sqlwhere += " OR purpose LIKE '%" + q2 + "%'";
    }
    query.where = sqlwhere;
    query.orderByFields = ['DataSourceName ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        //var msg = 'Found BIOS Catalog Dataset count=' + count + ' matching <q>' + q + '</q>';
        //$('biosq-msg').innerHTML = msg;
        $('bsqued').innerHTML = q;
        $('bscount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bspurpose oids.len=' + ids.length);
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bspurpose/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        var features = result.features;
        var k = bslist(features, list);
        $('bsmanfields').innerHTML += ' purpose,';
        bscontribs(q);
    });
}

function bscontribs(q) {
    var querytask = new EsriQueryTask(biosmanurl);
    var query = new EsriQuery();
    var sqlwhere = "ContribNameFL LIKE '%" + q + "%'";
    sqlwhere += " OR ContribOrg LIKE '%" + q + "%'";
    sqlwhere += " OR ContribEmail LIKE '%" + q + "%'";
    //if (q.indexOf(' ') > 0) {
    //    var q2 = q.replace(/ /g, '%'); //q.split(' ').join('%')
    //    sqlwhere += " OR ContribNameFL LIKE '%" + q2 + "%'";
    //}
    query.where = sqlwhere;
    query.orderByFields = ['ContribEmail ASC', 'ContribOrg ASC', 'ContribEmail ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        //var msg = 'Found BIOS Catalog Dataset count=' + count + ' matching <q>' + q + '</q>';
        //$('biosq-msg').innerHTML = msg;
        $('bsqued').innerHTML = q;
        $('bscount').innerHTML = count;
    });
    querytask.executeForIds(query).then(function (ids) {
        console.log('bscontribs oids.len=' + ids.length);
        bs.biosman.oids = ids;
    });
    querytask.execute(query).then(function (result) {
        addmsg('CALLBACK biosv.bscontribs/querytask: results= ' + result.features.length);
        var list = $('biosq-list'); // document.createElement('ol');
        list.innerHTML = '';
        var features = result.features;
        var k = bslist(features, list);
        $('bsmanfields').innerHTML += ' Contributor_Email, Contributor_Organization, Contributor_Email';
    });
}

console.log('Loaded biosv');
// FUTURE TODO LIST--
// SEARCH BY FIELD NAME, SPECIES NAMES
