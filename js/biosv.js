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
if (app.userName === 'guest') {
    var biosurl = manifestpub.url;
    //https://cdfw.maps.arcgis.com/home/item.html?id=aba2b52d4840416783191b4dba972d89
} else {
    var biosurl = manifestpro.url;
}

function bsall() {
    var querytask = new EsriQueryTask(biosurl);
    var query = new EsriQuery();
    var sqlwhere = "DataSourceID IS NOT NULL";
    query.where = sqlwhere;
    query.orderByFields = ['DATASOURCEID ASC', 'DATASOURCENAME ASC'];
    query.outFields = ['*'];
    //query.returnGeometry = true; // TODO--FOR FEATURELAYER
    querytask.executeForCount(query).then(function (count) {
        var msg = 'Available BIOS Catalog Dataset count=' + count;
        $('biosq-msg').innerHTML = msg;
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
        var dsid = attr['DATASOURCEID'];
        var dsname = attr['DATASOURCENAME'];
        var dstype = attr['DATASOURCETYPE'];
        var dsrec = [dsid, dsname, dstype];
        var item = document.createElement('li');
        item.innerHTML = dsrec;
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
    query.orderByFields = ['DATASOURCENAME'];
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
