// tools.js 20191104 dfgchiang
var gfilter = {
    id: "gfilter"
}
gfilter.filterbygraphic = function (graphic) {
    if (activeLayer !== null && activeLayer.type === 'feature') {
        featureFilter = {
            geometry: graphic.geometry,
            spatialRelationship: "intersect"
        };
        if (activeLayerView) {
            addmsg('FILTER BY GEOMETRY ON ' + activeLayerView.layer.id);
            activeLayerView.filter = featureFilter;
            app.layers[activeLayer.id]['filterg'] = featureFilter; // JSON.stringify(filterGeometry.toJSON()) + '/' + selectedFilter;
            toc.toctugtiletwin(activeLayer.id, false);
        } else {
            addmsg('FILTER ERROR: NO activeLayerView? ');
        }
    }
}
gfilter.filterbytext = function (sqlwhere) {
    //TODO--CHANGE METHOD DEPENDING ON LAYERTYPE
    //map.findLayerById(app.alayer.urid).definitionExpression = $('gselect-where').value;
    //$(app.alayer.urid + '-filter').title = $('gselect-where').value;
    $(activeLayer.id + '-filter').title = sqlwhere;
    app.layers[activeLayer.id]['def'] = sqlwhere;
    if (activeLayer.type === 'feature') {
        activeLayer.definitionExpression = sqlwhere;
        if ($(activeLayer.id + '-check').value.indexOf(',') > 0) {
            activeLayer.minScale = 10000000;
            var tlid = activeLayer.id.replace('_f', '_c');
            if (map.findLayerById(tlid) !== undefined) {
                map.findLayerById(tlid).visible = false;
                addmsg('SET buddy tile layer ' + tlid + ' invisible to apply filter on features only');
            }
        }
    }
}
gfilter.filterclear = function () {
    //TODO--CHANGE METHOD DEPENDING ON LAYERTYPE
    $(activeLayer.id + '-filter').title = '';
    activeLayer.definitionExpression = '';
    if (activeLayer.type === 'feature') {
        if ($(activeLayer.id + '-check').value.indexOf(',') > 0) {
            activeLayer.minScale = 30000;
            var tlid = activeLayer.id.replace('_f', '_c');
            if (map.findLayerById(tlid) !== undefined) {
                map.findLayerById(tlid).visible = true;
                addmsg('SET buddy tile layer ' + tlid + ' visible again when cleared filter');
            }
        }
    }
    app.layers[activeLayer.id]['def'] = null;
}

console.log('Loaded tools');
