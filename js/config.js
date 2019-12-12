// config.js 20191128 dfgchiang
//TODO CONFIGURE VIEWER
let configs = {
    "ace": {},
    "bios": {},
    "cwhr": {},
    "delta": {},
    "dfg": {},
    "fire": {},
    "fishing": {},
    "habitrak": {},
    "imaps": {},
    "lands": {},
    "marine": {},
    "min": {},
    "rarefind": {},
    "veg": {}
};
var dfg = {
    id: "dfg",
    layers: {
        "Land_Ownership": {
            id: "Land_Ownership",
            name: "Land Ownership",
            tiled: false,
            title: "Land Ownership",
            tocgroup: "ref",
            type: "MapServer map-image",
            urid: "DFG_Lands",
            url: "https://map.dfg.ca.gov/arcgis/rest/services/Base_Land_Ownership/Land_Ownership/MapServer",
            visible: true
        },
        "Natural_Resources": {
            id: "Natural_Resources",
            name: "Natural_Resources",
            tiled: false,
            title: "Natural_Resources",
            tocgroup: "ref",
            type: "MapServer map-image",
            urid: "Natural_Resources",
            url: "https://map.dfg.ca.gov/arcgis/rest/services/Base_Natural_Resources/Natural_Resources/MapServer",
            visible: true
        },
        "Hydrography": {
            id: "Hydrography",
            name: "Hydrography",
            tiled: false,
            title: "Hydrography",
            tocgroup: "ref",
            type: "MapServer map-image",
            urid: "Hydrography",
            url: "https://map.dfg.ca.gov/arcgis/rest/services/Base_Hydrography/Hydrography/MapServer",
            visible: true
        },
        "GeoReference": {
            id: "GeoReference",
            name: "Geolocation Reference",
            tiled: false,
            title: "Geolocation Reference",
            title: "Geolocation Reference",
            tocgroup: "ref",
            type: "MapServer map-image",
            urid: "DFG_Lands",
            url: "https://map.dfg.ca.gov/arcgis/rest/services/Base_Maps/GeoReference/MapServer",
            visible: true
        }
    }
};
var imaps = {
    id: "imaps",
    layers: {
        "CalTrans_Lane_Closures": {
            id: "CalTrans_Lane_Closures",
            name: "CalTrans Lane Closures",
            type: "kml",
            urid: "Wetlands",
            url: "https://cdfw.maps.arcgis.com/home/item.html?id=566c65d5f9e44b118c0aded153b1fc8e",
            visible: true
        },
        "DFG_Properties:0": {
            id: "DFG_Properties:0",
            name: "CDFW Facilities",
            type: "feature",
            urid: "Wetlands",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/0",
            visible: true
        },
        "Soil_Survey_Map": {
            url: "https://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer",
            id: "Soil_Survey_Map",
            name: "Soil Survey Map",
            tiled: true,
            title: "Soil Survey Map",
            tocgroup: "ref",
            type: "MapServer tile",
            urid: "Soil_Survey_Map",
            visible: false
        },
        "EVEG": {
            id: "EDW_ExistingVegetationRegion05_01",
            name: "Existing Vegetation",
            type: "MapServer",
            tiled: false,
            tocgroup: "ref",
            urid: "EDW_ExistingVegetationRegion05_01",
            url: "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_ExistingVegetationRegion05_01/MapServer",
            visible: true
        },
        "Wetlands": {
            id: "Wetlands",
            name: "Wetlands",
            tiled: true,
            tocgroup: "ref",
            type: "MapServer map-image",
            urid: "Wetlands",
            url: "https://www.fws.gov/wetlands/arcgis/rest/services/Wetlands/MapServer",
            visible: true,
            website: "https://www.fws.gov/wetlands/"
        }
    }
};

var lands = {
    al: "DFG_Lands:0",
    bl: "topo",
    id: "lands",
    name: "CDFW Lands",
    title: "Lands And Niche System",
    viewer: "lands",
    layers: {
        "DFG_Lands": {
            id: "DFG_Lands",
            name: "DFG Lands",
            tiled: false,
            title: "DFG Lands",
            tocgroup: "proj",
            type: "MapServer map-image",
            urid: "DFG_Lands",
            url: "https://map.dfg.ca.gov/arcgis/rest/services/Project_Lands/DFG_Lands/MapServer",
            visible: true
        },
        "DFG_Properties:0": {
            id: "DFG_Properties:0",
            name: "CDFW Facilities",
            type: "feature",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/0",
            visible: true
        }
    }
};
