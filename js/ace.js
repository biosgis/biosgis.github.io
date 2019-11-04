// ace.js 20191103 dfgchiang
console.log('Loading ace');

var ace = {
    al: "ace3:3",
    bl: "topo",
    id: "ace",
    name: "ACE",
    title: "Alwways Conserve the Environment",
    viewer: "ace"
};
ace.layerIds = ["stressors", "swap", "ace3"];
ace.layers = {
    //"essentialConnectivity": {
    //    "id": "essentialConnectivity",
    //    "name": "Essential Connectivity",
    //    "urid": "essentialConnectivity",
    //    "url": GISSERVER + "/arcgis/rest/services/Project_ACEII/essentialConnectivity/MapServer",
    //    "tocgroup": "operational",
    //    "type": "MapServer",
    //    "tiled": false,
    //    "mapIndex": 10
    //},
    "stressors": {
        "id": "stressors",
        "name": "Stressors",
        "urid": "ace2stressors",
        "url": GISSERVER + "/arcgis/rest/services/Project_ACEIII/stressors/MapServer",
        "tocgroup": "ace",
        "type": "MapServer map-image MapImageLayer",
        "tiled": false,
        "visible": true,
        "mapIndex": 11
    },
    "swap": {
        "id": "swap",
        "name": "State Wildlife Action Plan",
        "urid": "swap",
        "url": GISSERVER + "/arcgis/rest/services/Project_ACEIII/swap/MapServer",
        "tocgroup": "ace",
        "type": "MapServer map-image MapImageLayer",
        "tiled": false,
        "visible": true,
        "mapIndex": 12
    },
    "ace3": {
        "id": "ace3",
        "name": "ACE v3.0 Model",
        "urid": "ace3",
        //"url": GISSERVER + "/arcgis/rest/services/Project_ACEIII/ace3/MapServer",
        "url": "https://map.dfg.ca.gov/arcgis/rest/services/Project_ACEIII/ace3/MapServer",
        "tocgroup": "ace",
        "type": "MapServer map-image MapImageLayer",
        "tiled": false,
        "visible": true,
        "mapIndex": 13
    }
};
ace.init = function () {
    for (var urid in ace.layers) {
        var layer = new EsriMapImageLayer({
            url: ace.layers[urid].url,
            id: urid
        });
    }
}
// SUBLAYERS--https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-Sublayer.html
function loadmaplayers(url, urid) {
    asRequest(url + "f=json", {
        responseType: "json"
    }).then(function (response) {
        console.log('currentVersion: ' + response.data.currentVersion);
        ENV = 'CDFW';
        var sublayers = [];
        var layers = response.data.layers;
        for (var i = 0; i < layers.length; i++) {
            var sublayer = {
                id: layers[i].id,
                visible: layers[i].defaultVisibility
            }
            sublayers.push(sublayer);
        }
    }).catch((err) => {
        console.error('Error encountered', err);
    });

}
console.log('LOADED ace');
