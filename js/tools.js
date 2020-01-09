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
        if (id !== 'ass') {
            $('tool').value = id;
            document.getElementsByClassName('atool')[0].innerHTML = event.target.innerHTML;
        }
    }
}
/***********************************************
 *** NOT YET *** 
 ***********************************************/
function queryalf(ar) {
    // Query activelayer feature by user input like a map click 20180816
    addmsg('DO queryalf: activeFeatureLayer.geometryType= ' + activeLayer.geometryType); //point | mulitpoint | polyline | polygon | extent | mesh
    // Get a query object for the layer's current configuration
    let queryParams = activeLayer.createQuery();
    queryParams.outFields = ['*'];
    if (ar.geometry !== undefined && ar.geometry !== null) {
        // set a geometry for filtering features by a region of interest
        queryParams.geometry = ar.geometry;
    }
    if (ar.where !== undefined && ar.where !== null) {
        // Add to the layer's current definitionExpression
        queryParams.where = queryParams.where + ' AND ' + ar.where; // " AND TYPE = 'Extreme'";
    }
    // query the layer with the modified params object
    activeLayer.queryFeatures(queryParams).then(function (results) {
        // prints the array of result graphics to the console
        //console.log('results.features=' + results.features);//FAIL IF RESULTISNONE
        addmsg('CALLBACK queryalf/results(FeatureSet).features len=' + results.features.length);
        //addmsg('results.displayFieldName=' + results.displayFieldName);
        //addmsg('results.geometryType=' + results.geometryType);
        //addmsg('results.fields[1].fieldName=' + results.fields[1].fieldName);
        //addmsg('results.features[0].attributes[results.displayFieldName]=' + results.features[0].attributes[results.displayFieldName]);
        //addmsg('results.fields=' + JSON.stringify(results.fields));
        //addmsg('results.features[0].attributes=' + JSON.stringify(results.features[0].attributes));
        var msg = resultput(results);
        addmsg('Results written: ' + msg);
    });
}

function queryalm(ar) {
    // Query activelayer mapimage sublayer by user input like idclick 20180904
    addmsg('DO queryalm: activeMapImageLayer.url=' + activeLayer.url);
    //let query = {
    //    geometry: ar.geometry,
    //    outFields: ["*"]
    //};
    let query = new Query();
    query.returnGeometry = true;
    if (ar.geometry !== undefined && ar.geometry !== null) {
        query.geometry = ar.geometry;
    }
    if (ar.where !== undefined && ar.where !== null) {
        query.where = queryParams.where + ' AND ' + ar.where;
    }
    query.outFields = ['*'];
    let queryTask = new QueryTask({
        url: app.alayer.url
    });
    queryTask.execute(query).then(function (results) {
        //console.log(results.features);
        addmsg('CALLBACK queryalm/results(FeatureSet).features len=' + results.features.length);
        var msg = resultput(results);
        addmsg('Results written: ' + msg);
    });
    queryTask.executeForCount(query).then(function (results) {
        console.log(results);
    });
}

function reqlayerinfo(urid, url) {
    // Get related extended table info and save into app and dom--20180306
    asRequest(url, {
        responseType: "json"
    }).then(function (response) {
        var type = null;
        if (response.type !== undefined) {
            type = response.type;
        }
        var displayField = null;
        if (response.displayField !== undefined) {
            displayField = response.displayField;
            app.alayer.dfield = displayField;
        }
        var relationships = null;
        if (response.relationships !== undefined) {
            relationships = response.relationships;
            var urel = url.split('Server/')[0] + 'Server/' + relationships.relatedTableId;
            var keyfield = relationships.keyField; //Hex_ID
        }
    });
}

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
