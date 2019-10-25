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

function bbgo(a) {
    // ENGAGE BIOSBOOKMARKS ACTION DEPENDING ON INPUT CLICKED
    var s = $('bbq').value;
    if (s.trim() === '') {
        return;
    }
    var bbids = [];
    if (s.indexOf(',') < 0) {
        bbids = [parseInt(s)];
    } else {
        var x = s.split(',');
        for (var i = 0; i < x.length; i++) {
            bbids.push(parseInt(x[i]));
        }
    }
    if (a === 'Details') {
        console.log('Show bookmark details ' + bbids);
    } else if (a === 'Data Links') {
        console.log('List data links ' + bbids);
    } else if (a === 'List') {
        console.log('List bookmarks' + bbids);
    } else if (a === 'Load') {
        console.log('Load bookmark=' + bbids[0]);
    } else if (a === 'Remove') {
        bbclear(bbids);
    }
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
    $('bb-details').onclick = function () {
        bbgo($('bb-details').value); //recall
    }
    $('bb-links').onclick = function () {
        bbgo($('bb-links').value); //restore
    }
    $('bb-list').onclick = function () {
        bbgo($('bb-list').value); //restore
    }
    $('bb-load').onclick = function () {
        bbgo($('bb-load').value); //restore
    }
    $('bb-remove').onclick = function () {
        bbgo($('bb-remove').value);
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
