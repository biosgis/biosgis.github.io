// biosf.js 20191023 dfgchiang
// REQ amdjs
/*global console*/
/* eslint no-console: "off" */

console.log('Loading biosf.js');

function bbclear(bbids) {
    //20191023 biosBookmarksClear: BookmarkIdArray
    // NEW DYNAMIC REPLACEMENT BY BACKUP BBBLANK LAYER FEATURES
    var query = bbblankLayer.createQuery();
    query.objectIds = bbids; //where = 'OBJECTID IN (' + bbids + ')';
    query.outFields = ['*'];
    query.returnGeometry = true;
    bbblankLayer.queryFeatures(query).then(function (results) {
        if (results.features.length === 0) {
            console.log('bbclearError: No blanks found?');
            return;
        }
        var editFeatures = results.features;
        var edits = {
            updateFeatures: editFeatures
        }
        bookmarksLayer.applyEdits(edits).then(function (res) {
            if (res.updateFeatureResults.length > 0) {
                var oid = res.updateFeatureResults[0].objectId;
                console.log('Updated bbids[0]=' + oid);
            }
        }).catch(function (err) {
            console.log('bbclearError: ' + err.name);
            console.log('bbclearBug: ' + err.message);
        });
    });
}

function bbgo(x) {
    // ENGAGE BIOSBOOKMARKS ACTION DEPENDING ON INPUT CLICKED
    var a = x.value;
    var s = $('bbq').value.trim();
    var bbids = [];
    if (s.indexOf(',') < 0) { // TODO LIKE #234
        bbids = [parseInt(s)];
    } else {
        var x = s.split(',');
        for (var i = 0; i < x.length; i++) {
            bbids.push(parseInt(x[i]));
        }
    }
    if (a === 'Maps') {
        console.log('List bookmarks' + s);
        bbquery(s);
    } else if (a.indexOf('Links') >= 0) {
        console.log('List external data links like ' + s);
        qqbuery('_DATA_LINKS_');
    } else if (a.indexOf('List') >= 0) {
        console.log('Search and show bookmarks like ' + s);
        bbquery(s);
    } else if (a === 'Load') {
        console.log('Load bookmark=' + bbids[0]);
        // TODO METHOD TO LOAD BOOKMARK
    } else if (a === 'Remove') {
        if (s === '') {
            return;
        }
        bbclear(bbids);
    }
}

function bbquery(x) {
    // biosBookmarkQuery
    // BookmarkID IS NEVER NULL AND ALWAYS GT 0
    var sql = 'Description IS NOT NULL'; //TODO SECURITY CONDITION
    if (typeof x === 'number') {
        sql += " AND BookmarkID=" + x;
    } else if (typeof x === 'object') {
        // array of bbids
        sql += " AND BookmarkID IN (" + x + ") ";
    } else if (typeof x === 'string') {
        if (x === '_DATA_LINKS_') {
            sql += " Type = 'MapService' ";
        } else {
            sql += " AND Description LIKE '%" + x + "%' ";
        }
    }
    var query = bookmarksLayer.createQuery();
    //query.objectIds = bbids; //where = 'OBJECTID IN (' + bbids + ')';
    query.outFields = ['OBJECTID', 'BookmarkID', 'Author', 'Description', 'DSList', 'Link', 'Viewer', 'UserGroups']; //['*'];//
    query.returnGeometry = true;
    query.where = sql;
    bookmarksLayer.queryFeatures(query).then(function (results) {
        if (results.features.length === 0) {
            console.log('bbqueryError: No bookmarks found?');
            return;
        }
        var j = fs2table(results);
        console.log(j + ' bookmarks table rows built');
    });
}

function initbb() {
    //20191023 initBiosBookmarkLayers
    markupsLayer = new EsriFeatureLayer({
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/biosmarkups/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: false,
        id: "biosmarkups",
        visible: false
    });
    map.add(markupsLayer);
    bookmarksLayer = new EsriFeatureLayer({
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/bios6bookmarks/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: false,
        id: "biosbookmarks",
        visible: false
    });
    map.add(bookmarksLayer);
    bbfeatureForm = new EsriFeatureForm({
        container: "bb-form",
        layer: bookmarksLayer //, feature: bb
    });
    bookmarksLayer.when(function () {
        if (location.search.indexOf('bookmark=') > 0) {
            var bbid = geturlarg('bookmark');
            console.log('RECALLING bookmark=' + bbid);
            //getbb(bbid);
        }
    });
    bbblankLayer = new EsriFeatureLayer({
        url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/bbblank/FeatureServer/0",
        outFields: ["*"],
        popupEnabled: false,
        id: "bbblank",
        visible: false
    });
    map.add(bbblankLayer);
    $('bb-maps').onclick = function () {
        bbgo($('bb-maps')); //recall
    }
    $('bb-links').onclick = function () {
        bbgo($('bb-links')); //external data
    }
    $('bb-list').onclick = function () {
        bbgo($('bb-list')); //browse
    }
    $('bb-load').onclick = function () {
        bbgo($('bb-load')); //restore
    }
    $('bb-remove').onclick = function () {
        bbgo($('bb-remove'));
    }
    console.log('INIT biosBookmarksLayers DONE');
}

function navview(id) {
    if (id === 'viewDiv') {
        show('viewdivide');
        show('viewDiv');
    } else if (id === 'view3div') {
        hide('viewDiv');
        hide('viewdivide');
    } else {
        toggle(id);
        var tag = $(id).tagName;
        if (tag === 'ASIDE') {
            var a = document.getElementsByTagName('aside');
            for (var i = 0; i < a.length; i++) {
                if (a[i].id !== id) {
                    hidex(a[i]);
                }
            }
        } else if (tag === 'SECTION') {
            var b = document.getElementsByTagName('section');
            for (var i = 0; i < b.length; i++) {
                if (b[i].id !== id) {
                    hidex(b[i]);
                }
            }
            hide('tools');
            hide('toolsbin');
        }
    }
}

function fs2table(fset) {
    // featureSetToTable
    var features = fset.features;
    if (features.length === 0) {
        return;
    }
    var table = $('bbtable');
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (i === 0) {
            var toprow = table.insertRow(i); // $('bbtoprow');
            toprow.classList.add('bbtable');
            for (var fieldname in feature.attributes) {
                var col = document.createElement('th');
                toprow.appendChild(col);
                col.innerHTML = fieldname;
            }
        }
        var j = i + 1; // RECNO
        var row = table.insertRow(j);
        var k = 0; // COLUMN POSITION
        for (var fieldname in feature.attributes) {
            var rval = feature.attributes[fieldname];
            var cell = row.insertCell(k);
            cell.innerHTML = rval;
            k = k + 1;
        }
    }
    return j;
}

function f2topcols(feature, row) {
    // featureToHeaderColumns
    var i = 0;
    for (var fieldname in feature.attributes) {
        var col = document.createElement('th');
        row.appendChild(col);
        col.innerHTML = fieldname;
    }
}

function h4toggle(x) {
    // toggleContentUnderH4bar
    var pn = x.parentNode;
    var hding = false;
    for (var i = 0; i < pn.childNodes.length; i++) {
        var n = pn.childNodes[i];
        var tag = n.tagName;
        if (tag === 'H4') {
            hding = true;
        }
        if (tag === 'DIV' && hding === true) {
            togglex(n);
            hding = false;
        }
    }
}

function bbincr() {
    //TODO biosbookmarkUsageIncrementEachTimeBookmarkLoaded
}

function cleanupExpiredBookmarks() {
    //TODO Daily routine job to check Permanent status and LastUsed date up to today
}
/* ************************** NOT USED ************************** */
function bbupdate() {
    // biosbookmarkUpdate DETAIL PROPERTIES STATIC PROCEDURE
    var editFeatures = [];

    function resetrow(bbid) {
        var rec = new EsriGraphic({
            geometry: null,
            attributes: {
                "OBJECTID": bbid,
                "Author": null,
                "BookmarkID": bbid
            }
        });
        return rec;
    }
    for (var i = 0; i < bbids.length; i++) {
        editFeatures.push(resetrow(bbids[i]));
    }
    var edits = {
        updateFeatures: editFeatures
    }
    bookmarksLayer.applyEdits(edits).then(function (res) {
        if (res.updateFeatureResults.length > 0) {
            var oid = res.updateFeatureResults[0].objectId;
            console.log('Updated bbids[0]=' + oid);
        }
    }).catch(function (err) {
        console.log('bbclearError: ' + err.name);
        console.log('bbclearBug: ' + err.message);
    });
}
console.log('LOADED biosf.js');
