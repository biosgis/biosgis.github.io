// biosf.js 20191023 dfgchiang
// REQ amdjs
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
        const edits = {
            updateFeatures: editFeatures
        }
        bookmarksLayer.applyEdits(edits).then(function (res) {
            if (res.updateFeatureResults.length > 0) {
                let oid = res.updateFeatureResults[0].objectId;
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
    let s = $('bbq').value;
    if (s.trim() === '') {
        return;
    }
    let bbids = [];
    if (s.indexOf(',') < 0) {
        bbids = [parseInt(s)];
    } else {
        let x = s.split(',');
        for (var i = 0; i < x.length; i++) {
            bbids.push(parseInt(x[i]));
        }
    }
    if (a === 'Show') {
        console.log('Show bookmarks ' + bbids);
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
    $('bb-show').onclick = function () {
        bbgo($('bb-show').value); //recall
    }
    $('bb-load').onclick = function () {
        bbgo($('bb-load').value); //restore
    }
    $('bb-remove').onclick = function () {
        bbgo($('bb-remove').value);
    }
    console.log('INIT biosBookmarksLayers DONE');
}

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
    const edits = {
        updateFeatures: editFeatures
    }
    bookmarksLayer.applyEdits(edits).then(function (res) {
        if (res.updateFeatureResults.length > 0) {
            let oid = res.updateFeatureResults[0].objectId;
            console.log('Updated bbids[0]=' + oid);
        }
    }).catch(function (err) {
        console.log('bbclearError: ' + err.name);
        console.log('bbclearBug: ' + err.message);
    });
}
console.log('LOADED biosf.js');
