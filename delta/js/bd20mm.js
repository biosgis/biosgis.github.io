// bd20mm.js 2022-02-02
const APIKEY = {
    apikey: "AAPK6b0985992bc5430a889d0bfbcaad4c69S9fMoriHLkizvSxx26HhyZhFUcjkiiYumHUbC_ASe3k4vCU9MpnRAG_2BVUVIowF"
    // Replace with your API key FROM https://developers.arcgis.com
};
let cpuefield = 'CPUE';
let ll = [38.12, -121.89];// [38, -122];//38.118314, -121.892487
let zl = 10;
let map = null;
let stations = null;
let stationlabels = null;
let stationsmarked = null;
const app = {
    layers: {
        "stations": {
            id: "bd20mm:0",
            name: "stationsid",
            type: "feature",
            urid: "stations",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mm/FeatureServer/0"
        },
        "bd20mmpct": {
            id: "bd20mm:1",
            name: "bd20mmAreaPercentage",
            type: "feature",
            urid: "bd20mmpct",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mm/FeatureServer/1"
        },
        "bd20mmfish": {
            id: "bd20mm:2",
            name: "bd20mmFishDistribution",
            type: "feature",
            urid: "bd20mmfish",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mm/FeatureServer/2"
        },
        "bd20mmzoopct": {
            id: "bd20mm:3",
            name: "bd20mmZooplanktonAreaPercentage",
            type: "feature",
            urid: "bd20mmzoopct",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mm/FeatureServer/3"
        },
        "bd20mmzoo": {
            id: "bd20mm:4",
            name: "bd20mmZooplanktonDistribution",
            type: "feature",
            urid: "bd20mm:4",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/bd20mm/FeatureServer/4"
        }
    },
    cname: null,
    species: null,
    survey: null,
    syear: null
}
// SAMPLED BUT NO CATCH STATIONS FROM--https://www.dfg.ca.gov/delta/data/20mm/map.asp?syear=2018&survey=7&SPECIES=3
sampledstationids = [323, 340, 342, 343, 344, 345, 346, 405, 411, 418, 501, 504, 508, 513, 519, 520, 602, 606, 609, 610, 703, 704, 705, 706, 707, 711, 716, 718, 719, 720, 723, 724, 801, 804, 809, 812, 815, 902, 906, 910, 912, 914, 915, 918, 919];

function init() {
    map = L.map('map').setView(ll, zl);
    // , { zoomControl: false }
    // map.dragging.disable();
    // map.touchZoom.disable();
    // map.doubleClickZoom.disable();
    // map.scrollWheelZoom.disable();
    // map.boxZoom.disable();
    // map.keyboard.disable();
    map.on('click', function (ev) {
        addmsg(ev.latlng); //20170825-REF--https://leafletjs.com/reference-1.2.0.html#renderer
    });
    if (map.tap) map.tap.disable();
    document.getElementById('map').style.cursor = 'default';
    L.esri.Vector.vectorBasemapLayer('ArcGIS:Community', APIKEY).addTo(map);
    // Topographic
    stations = L.esri.featureLayer({
        url: app.layers.stations.url,
        //where: 'Station NOT IN (328,334,335,336)',// defquery feature works
        // where: "STATION NOT IN (" + sampledstationids + ")",
        pointToLayer: function (geojson, latlng) {
            return L.marker(latlng, {
                icon: L.divIcon({
                    iconSize: null,
                    className: "base-icon",
                    html: '<div style="left: -5px; top: -5px; position: relative;"><b style="color: crimson; font-size: medium;">&plus;</b></div>'
                })//icons[geojson.properties.direction.toLowerCase()]
            });
        }
        //style: function () {// for styling GeoJson as source
        //    return {
        //        color: "#5B7CBA",
        //        weight: 2
        //    };
        //}
    }).addTo(map);
    stationlabels = L.esri.featureLayer({
        url: app.layers.stations.url,
        pointToLayer: function (geojson, latlng) {
            return L.marker(latlng, {
                icon: L.divIcon({
                    iconSize: null,
                    className: "stationlabel",
                    html: '<div>' + geojson.properties['STATION'] + '</div>'
                })//icons[geojson.properties.direction.toLowerCase()]
            });
        }
    }).addTo(map);
    // STATIONS LAYER FOR DYNAMICALLY SYMBOLIZING QUERY RESULTS
    stationsmarked = L.esri.featureLayer({
        url: app.layers.stations.url
    });
    // Percentages Regions Vector Layers--20170920
    //REF--[LeafletJS/Doc/Vector Layers/Rectangle](https://leafletjs.com/reference-1.2.0.html#rectangle)
    var upbounds = [[38.204, -121.82], [38.5, -121.1]];
    var upbounds = [[38.204, -121.82], [39, -120]];
    upstreampoly = L.rectangle(upbounds, {
        color: 'silver',
        fillColor: 'antiquewhite',
        fillOpacity: 0.5,
        weight: 1
    });//.addTo(map);
    var delbounds = [[37.5, -121.82], [38.204, -121.1]];
    var delbounds = [[37, -121.82], [38.204, -120]];
    deltapoly = L.rectangle(delbounds, {
        color: 'silver',
        fillColor: 'lemonchiffon',//cornsilk
        fillOpacity: 0.5,
        weight: 1
    });//.addTo(map);
    var baybounds = [[37.5, -122.6], [38.5, -121.82]];
    var baybounds = [[37, -123.4], [39, -121.82]];
    baypoly = L.rectangle(baybounds, {
        color: 'silver',
        fillColor: 'white',
        fillOpacity: 0.3,
        weight: 1
    });//.addTo(map);

    // CONNECT UI ACTIONS
    $("showlabels").onclick = function () {
        if (this.checked === true) {
            map.addLayer(stationlabels);
        } else {
            map.removeLayer(stationlabels);
        }
    }
    $("showpct").onclick = function () {
        if (this.checked === true) {
            mappct();
        } else {
            hidepct();
        }
    }
    $("godrawmap").onclick = drawMap;
    // ONLOAD
    //$('showlabels').click();
    map.removeLayer(stationlabels);
    listspecies();
    listyears();
    pickonload('Survey');
    listnocatch();
    if (urlfind('godrawmap')) {
        setTimeout(() => {
            gomaponload(drawMap);
        }, 1000);
    }
    // DONE INIT
}
function drawMap() {
    app.syear = $('SurveyYear').value;
    app.survey = $('Survey').value;
    app.species = $('Species').value;
    app.cname = $('Species').options[$('Species').selectedIndex].innerHTML;
    var k = selectortext('.species', app.cname);
    var k = selectortext('.syear', app.syear);
    var k = selectortext('.survey', app.survey);
    var k = selectortext('.datespan', '');
    if ($('SurveyYear').value === '2022') {
        var k = selectortext('.syear', app.syear + '&nbsp;*** Survey in progress ***');
    }
    var sql = "SurveyYear = " + $("SurveyYear").value + " AND Survey = " + $("Survey").value + " AND (Species = '" + $("Species").value + "' OR Species = 'SPECIES')";
    addmsg('DO drawMap ' + sql);
    querySamples(sql);
}
function mappct() {
    // addmsg('DO mappct');
    map.addLayer(upstreampoly);
    map.addLayer(deltapoly);
    map.addLayer(baypoly);
    querypct();
}
function hidepct() {
    map.removeLayer(upstreampoly);
    map.removeLayer(deltapoly);
    map.removeLayer(baypoly);
    // hide('Bay-pct');
    // hide('Delta-pct');
    // hide('Upstream-pct');
    labelpcts();
}
function listspecies() {
    var query = L.esri.query({
        url: app.layers.bd20mmfish.url
    });
    var sql = "CommonName IS NOT NULL"
    query.where(sql).fields(["Species", "CommonName"])
        .orderBy('CommonName').distinct();
    query.run(function (error, featureCollection, response) {
        addmsg('CALLBACK listspecies queryrun: ' + featureCollection.features.length + ' features found');
        // var tbl = $('outtable');
        var features = featureCollection.features;
        var ar = [];
        features.forEach(fi => {
            ar.push([fi.properties['Species'], fi.properties['CommonName']]);
        });
        var k = picklistfill($('Species'), ar);
        // pickfirst($('Species'));
        // pickvalue($('Species'), '3');
        pickonload('Species', '3');
    });
}
function listyears() {
    var query = L.esri.query({
        url: app.layers.bd20mmfish.url
    });
    var sql = "SurveyYear IS NOT NULL";
    query.where(sql).fields(["SurveyYear"])
        .orderBy('SurveyYear', 'DESC').distinct();
    query.run(function (error, featureCollection, response) {
        addmsg('CALLBACK listyears queryrun: ' + featureCollection.features.length + ' features found');
        var features = featureCollection.features;
        var ar = [];
        features.forEach(fi => {
            ar.push([fi.properties['SurveyYear'], fi.properties['SurveyYear']]);
        });
        var k = picklistfill($('SurveyYear'), ar);
        pickonload('SurveyYear');
    });
}

function listnocatch() {
    var query = L.esri.query({
        url: app.layers.bd20mmfish.url
    });
    var sql = "Species = 'NOSPECIES' OR Species = 'SPECIES'";
    query.where(sql).fields(["Station"])
        .orderBy('Station', 'ASC').distinct();
    query.run(function (error, featureCollection, response) {
        addmsg('CALLBACK listnocatch queryrun: ' + featureCollection.features.length + ' features found');
        var features = featureCollection.features;
        var ar = [];
        features.forEach(fi => {
            ar.push([fi.properties['Station']]);
        });
        stationsnocatch = L.esri.featureLayer({
            url: app.layers.stations.url,
            where: "STATION IN (" + ar + ")",
            pointToLayer: function (geojson, latlng) {
                // return L.marker(latlng, {
                //     icon: L.divIcon({
                //         iconSize: null,
                //         className: "stationlabel",
                //         html: '<div>' + geojson.properties['Station'] + '</div>'
                //     })//icons[geojson.properties.direction.toLowerCase()]
                // });
                return L.circleMarker(latlng, {
                    color: 'gray',
                    fillColor: 'white',
                    fillOpacity: 1.0,
                    radius: 5// ZERO CATCH DOTS
                })
            }//,
            // onEachFeature: function (feature, layer) {
            //     layer.bindPopup(feature.properties.STATION);
            // }
            // }).bindPopup(function (layer) {
            //     return layer.feature.properties.STATION;
        }).addTo(map);
        stations.setWhere("STATION NOT IN (" + ar + ")");
    });
}
function EXAMPLE_filter(feature) {
    // return feature.properties.STATION === "SDG";
    return sampledstationids.find(element => element != feature.properties.STATION);
}
function listsurveys() {
    let outfields = ["Survey"];
    let sqlwhere = "Species = " + $('Species').value + " AND SurveyYear = " + $('SurveyYear').value;
    let sqlorderby = "Survey ASC";
    let distinct = true;
    let queryurl = app.layers.bd20mmpct.url;
}
function querypct() {
    let sql = "Species = " + $('Species').value + " AND SurveyYear = " + $('SurveyYear').value + " AND Survey = " + $("Survey").value;
    addmsg('DO querypct ' + sql);
    var query = L.esri.query({
        url: app.layers.bd20mmpct.url
    });
    query.where(sql).orderBy('Area', 'ASC').orderBy('Percentage', 'ASC');
    // Result where cpue is gt zero will have 2 records per station--20170919
    query.run(function (error, featureCollection, response) {
        addmsg('CALLBACK querypct queryrun: ' + featureCollection.features.length + ' records found');
        // NOTE: MAY NOT RETURN ALL AREAS***
        let pcts = {
            Bay: 0,
            Delta: 0,
            Upstream: 0
        }
        var features = featureCollection.features;
        features.forEach(fi => {
            var key = fi.properties.Area;
            var val = fi.properties.Percentage;
            addmsg(key + '=' + val);
            if (val == 0 || val == 100) {
                var fval = parseInt(val);
            } else {
                var fval = val.toFixed(2);
            }
            pcts[key] = fval;
        });
        // for (key in pcts) {
        //     var val = pcts[key];
        //     $(key + '-pct').innerHTML = val + '%';
        //     show(key + '-pct');
        // }
        labelpcts(pcts);
    });
}
function labelpcts(x = null) {
    baylatlon = [38.2492, -122.0405];//Fairfield, CA
    daltalatlon = [38.1619, -121.6116];//Isleton
    upstreamlatlon = [38.2421, -121.5116];//Walnut Grove
    if (x) {
        if (typeof window.baylabel != 'undefined') {
            baylabel.remove();
            deltalabel.remove();
            upstreamlabel.remove();
        }
        baylabel = L.marker(baylatlon, {
            icon: L.divIcon({
                iconSize: null,
                className: 'pctlabel',
                html: '<div>' + x.Bay + '%</div>'
                // html: '<div id="baylabel">Bay %</div>'
            })
        }).addTo(map);
        deltalabel = L.marker(daltalatlon, {
            icon: L.divIcon({
                iconSize: null,
                className: 'pctlabel',
                html: '<div>' + x.Delta + '%</div>'
                // html: '<div id="deltalabel">Delta %</div>'
            })
        }).addTo(map);
        upstreamlabel = L.marker(upstreamlatlon, {
            icon: L.divIcon({
                iconSize: null,
                className: 'pctlabel',
                html: '<div>' + x.Upstream + '%</div>'
                // html: '<div id="upstreamlabel">Upsteam%</div>'
            })
        }).addTo(map);
    } else {
        if (window.baylabel != undefined) {
            baylabel.remove();
            deltalabel.remove();
            upstreamlabel.remove();
        }
    }
}

cpuefields = ['Station', 'SurfaceTemp', 'SurfaceEC', 'TURBIDITY', 'NumOfTows', 'CPUE'];
// 'SurveyYear', 'Survey', 'SurveyStartDate', 'SurveyEndDate', 'Species', 'CommonName', 
function querySamples(sql) {
    addmsg('DO querySamples: ' + sql);
    var query = L.esri.query({
        url: app.layers.bd20mmfish.url
    });
    query.where(sql).orderBy('Station', 'ASC').orderBy('Species', 'ASC').orderBy('CPUE', 'DESC');
    // Result where cpue is gt zero will have 2 records per station--20170919
    query.run(function (error, featureCollection, response) {
        addmsg('CALLBACK querySamples queryrun: ' + featureCollection.features.length + ' features found');
        // var tbl = $('outtable');
        // tbl.innerHTML = '';
        if (featureCollection.features.length === 0) {
            stationsmarked.remove();
            stations.setWhere('STATION > 0');
            $('outdiv').innerHTML = '';
            csshide('.legendtable');
            unhide('legendnot');
            // csshide('.datespan')
            // $('Bay-pct').innerHTML = '0%';
            // $('Delta-pct').innerHTML = '0%';
            // $('Upstream-pct').innerHTML = '0%';
            if ($('showpct').checked) {
                $('showpct').click();
            }
            return;
        }
        var features = featureCollection.features;
        // OUTPUT TABLE
        $('outdiv').innerHTML = '';
        var table = fatable(features, cpuefields);
        $('outdiv').appendChild(table);
        if ($('showpct').checked === true) {
            querypct();
        }
        // DRAW PERSTATION SYMBOL ON MAP 
        drawstations(features);
        var data = [];
        var vals = [];
        var sum = 0;
        var max = 0;
        var min = 0;
        var recno = 0;
        var laststation = 0;
        var stationcodes = [];
        for (var i = 0; i < features.length; i++) {
            var fi = features[i];
            // var id = fi.id;
            addmsg('FID=' + fi.id);
            var station = fi.properties['Station'];
            var lat = fi.properties['Latitude'];
            var lon = fi.properties['Longitude'];
            var cpue = fi.properties['CPUE'];
            if (i == 0 && fi.properties['SurveyStartDate'] != null) {
                var borntime = fi.properties['SurveyStartDate'];
                var endtime = fi.properties['SurveyEndDate'];
                var borndate = new Date(borntime);
                var enddate = new Date(endtime);
                var borned = borndate.getMonth() + 1 + '/' + borndate.getDate() + '/' + borndate.getFullYear();
                var ended = enddate.getMonth() + 1 + '/' + enddate.getDate() + '/' + enddate.getFullYear();
                var msg = ' (' + borned + ' - ' + ended + ')';
                selectortext('.datespan', borned + ' - ' + ended);
                // var row = tbl.insertRow(0);
                // row.style.backgroundColor = 'whitesmoke';
                // row.style.borderBottom = "2px solid dimgray";
                // for (var k = 0; k < app.tcols.length; k++) {
                //     var col = document.createElement('th');
                //     col.style.border = '1px solid darkgray';
                //     col.style.color = 'mediumblue';
                //     col.style.padding = '2px';
                //     col.innerHTML = app.tcols[k];
                //     row.appendChild(col);
                // }
                // } else {
                //     csshide('.datespan');
            }
        }//end_loop_features
        // addmsg('Collected ' + vals.length + ' values: min=' + min + ', max=' + max + ', sum=' + sum);
        // var markers = outmarkers(data, min, max, sum);
        // olayer = L.layerGroup(markers).addTo(map);
        // //map.removeLayer(stations);
        // var stationswhere = 'Station NOT IN (' + stationcodes + ')';
        // addmsg(stationswhere);
        // //stations.setWhere(stationswhere);
        // stations.setWhere('Station < 0'); // HIDE STATIONS LAYER AND SHOW ONLY STATIONS FILTERED
        // //map.addLayer(stations);//FAIL: STATIONS REMOVED PERMANENTLY
        // queryStations(stationswhere);//20171004
    });// END_queryrun
}// DONE_querySamples
// SYMBOLIZE QUERY RESULT PER STATION MAP LAYER
function drawstations(features) {
    msgput('DO drawstations');
    var stids = [];
    var vals = [];
    var stvals = {};
    var dates = [];
    features.forEach(feature => {
        var fa = feature.properties;
        var stid = fa['Station'];
        var val = fa[cpuefield];
        stids.push(stid);
        vals.push(val);
        if (stvals[stid] == undefined) {
            stvals[stid] = val;
        } else {
            if (stvals[stid] < val) {
                stvals[stid] = val;
            }
        }
        if (fa['SurveyStartDate'] != null) {
            dates.push(fa['SurveyStartDate']);
        }
        if (fa['SurveyEndDate'] != null) {
            dates.push(fa['SurveyEndDate']);
        }
    });
    // msgput(vals);
    console.log('StationVals= ', stvals);//=OK
    var max = Math.max(...vals);// WITHOUT ES6: Math.max.apply(null, vals)
    if ($('optmax').value !== '') {
        let umax = parseFloat($('optmax').value);
        if (umax >= max) {
            max = umax;
        }
    }
    if (max == 0) {
        unhide('legendnot');
    }
    // msgput('cpue max=', max);//=OK
    let stationswhere = "STATION IN (" + stids + ")";// zids + ")";//
    // map.removeLayer(stations);
    stations.setWhere("STATION NOT IN (" + stids + ")");
    if (map.hasLayer(stationsmarked)) {
        map.removeLayer(stationsmarked);
    }
    stationsmarked = L.esri.featureLayer({
        url: app.layers.stations.url,
        where: stationswhere,
        fields: ["*"],
        pointToLayer: function (geojson, latlng) {
            // console.log(geojson);
            // return L.marker(latlng, {
            //     icon: L.divIcon({
            //         iconSize: null,
            //         className: "stationlabel",
            //         html: '<div>' + geojson.properties['Station'] + '</div>'
            //     })//icons[geojson.properties.direction.toLowerCase()]
            // });
            let stid = geojson.properties['STATION'];
            let val = stvals[stid];
            msgput(stid, val);
            if (val == 0) {
                var fillco = 'white';
                var fillop = 1;
            } else {
                var fillco = 'lightgreen';
                var fillop = 0.66;
            }
            return L.circleMarker(latlng, {
                color: val2color(val, max),// 'green',
                fillColor: fillco, // 'lightgreen',
                fillOpacity: fillop, // 0.55,
                radius: val2radpx(val, max)// parseInt(val*100) //2000 // (geojson.properties[cpuefield]*100)=NaN
            });
            // },
            // onEachFeature: function (feature, layer) {
            //     layer.bindPopup(feature.properties.STATION);
        }
    }).bindPopup(function (layer) {
        return layer.feature.properties.STATION;
    }).addTo(map);
    // NOT SAMPLED STATIONS ***NOCATCH AND NOTSAMPLED BOTH SET BY LISTNOCATCH
    // stations.setWhere("Station NOT IN (" + zids + ")");
    // if (stationsnot != null) {
    //     map.removeLayer(stationsnot);
    // }
    // stationsnot = L.esri.featureLayer({
    //     url: app.layers.stations.url,
    //     where: "Station NOT IN (" + zids + ")",
    //     pointToLayer: function (geojson, latlng) {
    //         return L.marker(latlng, {
    //             icon: L.divIcon({
    //                 iconSize: null,
    //                 className: "notsampled",
    //                 html: '<div>+</div>'
    //             })
    //         });
    //     }
    // }).addTo(map);
    // NO CATCH STATIONS
    // if (stationsnocatch != null) {
    //     map.removeLayer(stationsnocatch);
    // }
    // var nocatchids = arsub(zids, stids);
    // stationsnocatch = L.esri.featureLayer({
    //     url: app.layers.stations.url,
    //     where: "STATION IN (" + nocatchids + ")",
    //     pointToLayer: function (geojson, latlng) {
    //         // return L.marker(latlng, {
    //         //     icon: L.divIcon({
    //         //         iconSize: null,
    //         //         className: "stationlabel",
    //         //         html: '<div>' + geojson.properties['Station'] + '</div>'
    //         //     })//icons[geojson.properties.direction.toLowerCase()]
    //         // });
    //         return L.circleMarker(latlng, {
    //             color: 'gray',
    //             fillColor: 'white',
    //             fillOpacity: 1.0,
    //             radius: 5// ZERO CATCH DOTS
    //         })
    //     },
    //     onEachFeature: function (feature, layer) {
    //         layer.bindPopup(feature.properties.Station);
    //     }
    // }).bindPopup(function (layer) {
    //     return layer.feature.properties.Station;
    // }).addTo(map);
    classifive(max);
    dohide('legendnot');
    cssunhide('.legendtable');
    // BEGIN-ENDDATES
    if (dates.length > 0) {
        datebegin = new Date(Math.min(...dates)).toLocaleDateString();
        datefin = new Date(Math.max(...dates)).toLocaleDateString();
        // $('beginspan').innerHTML = datebegin;
        // $('endspan').innerHTML = datefin;
        var k = selectortext('.datespan', datebegin + '-' + datefin);
    } else {
        csshide('.datespan');
    }
}

window.addEventListener('load', init);

console.log('LOADED bd20mmjs');
