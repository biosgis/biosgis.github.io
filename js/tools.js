// tools.js 20191104 dfgchiang
console.log('Loading tools');
var tools = {
    "toollist": {
        name: "Tools",
        iconclass: "esri-icon-settings2",
        group: "aside",
        title: "Pick a tool"
    },
    "def": {
        urid: "",
        where: ""
    },
    "gfilter": {
        urid: "",
        geometry: null,
        ototal: 0
    },
    "gselect": {
        intool: {
            urid: "",
            features: [],
            fields: ["*"],
            geometry: "",
            ototal: 0
        },
        name: "Select and Filter",
        iconclass: "esri-icon-cursor",
        group: "aside",
        title: "Select and Filter"
    },
    "query": {
        urid: "",
        fields: ["*"],
        where: ""
    }
}
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
//************************************************** NOT YET
function qrelated(reltblid, fieldname, val, orid) {
    addmsg('DO queryRelatedRestfully...');
    // #ace3-relationships-20171019
    //if (reltblid !== null && relkey !== null && fieldname === relkey) 
    var sid = activeLayer.id.split(':')[0];
    relurid = sid + ':' + reltblid;
    relurl = aLayer.url.split('Server/')[0] + 'Server/' + reltblid;
    kurl = relurl + '/query?where=' + fieldname + '=' + val + '&returnCountOnly=true&f=json';
    // #ace3-queryRelatedRecords-20171031 ***METHOD LACKS ORDERBYFIELDS SORTING-20171208
    qurl = aLayer.url + '/queryRelatedRecords?objectIds=' + orid + // attributes['OBJECTID'] +
        '&relationshipId=' + relid + '&outFields=*&definitionExpression=&returnGeometry=false&f=json';
    //20171208 Query related table directly
    qurl = relurl + '/query?where=' + fieldname + '=' + val + '&outFields=*&returnGeometry=false&f=json';
    if (activeLayer.id.indexOf('ace3') === 0) {
        qurl += '&orderByFields=Sci_Name'; // WARNING: WRONG FIELDNAME WILL RETURN ERROR!
    }
    if (userGroups !== 'Public') {
        qurl = qurl + '&token=' + biosToken;
    }
    //val = '<a target="_blank" href="' + qurl + '">' + val + '</a>';//TEST
    val = '<a id="' + relurid + '-qurl" href="javascript:void(0)" onclick="idqueRelated(\'' + qurl + '\')">' + val + '</a>';
}
console.log('Loaded tools');
