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
    },
    "Hydrography:10": {
        "url": "https://gisdev.ad.dfg.ca.gov/arcgis/rest/services/Base_Hydrography/Hydrography/MapServer/10",
        "id": "Hydrography:10",
        "name": "WBD HUC12 Watersheds",
        "tocgroup": "ace",
        "type": "Feature Layer",
        "tiled": false,
        "urid": "Hydrography:10",
        "visible": false,
        "mapIndex": 14
    },
    "Ecoregions_1997GVNS:0": {
        "url": "https://services2.arcgis.com/Uq9r85Potqm3MfRV/ArcGIS/rest/services/Ecoregions_1997GVNS/FeatureServer/0",
        "id": "Ecoregions_1997GVNS:0",
        "name": "Ecoregion Sections",
        "tocgroup": "ace",
        "type": "feature",
        "tiled": false,
        "urid": "Ecoregions_1997GVNS:0",
        "visible": true,
        "mapIndex": 15
    }
};
ace.init = function () {
    addmsg('DO ace.init');
    tocAddLayers(ace.layers);
}
console.log('Loaded ace');
