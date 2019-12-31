// config.js 20191128 dfgchiang
//TODO CONFIGURE VIEWER
console.log('Loading config');
var GISSERVER = 'https://map.dfg.ca.gov';
var configs = {
    "ace": {},
    "bios": {},
    "bios6": {},
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
    "veg": {},
    "water": {},
    "www": {}
};
configs.bios = {
    homepage: "https://www.wildlife.ca.gov/Data/BIOS",
    id: "bios",
    layers: {},
    logo: "https://www.wildlife.ca.gov/Portals/0/Images/BDB/BIOS/iMap-Banner-BIOS.png", // "https://apps.wildlife.ca.gov/bios/images/MapViewerBanner-BIOS.png",
    name: "BIOS",
    site: "bios",
    title: "Biogeographic Integrated Observation Synthesis",
    viewer: "bios"
}
configs.bios.layers = {
    "gispublic.waterboards.ca.gov": {
        url: "https://gispublic.waterboards.ca.gov/arcgis/rest/services",
        id: "gispublic.waterboards.ca.gov",
        name: "gispublic.waterboards.ca.gov",
        tiled: false,
        title: "Water Boards AGS",
        tocgroup: "catalog",
        type: "restdir",
        urid: "gispublic.waterboards.ca.gov",
        visible: false
    },
    "FASS_Watersheds": {
        url: "https://gispublic.waterboards.ca.gov/arcgis/rest/services/FASS/FASS_Watersheds/MapServer",
        id: "FASS_Watersheds",
        name: "FASS Watersheds",
        tiled: false,
        title: "FASS Watersheds for DWR",
        tocgroup: "proj",
        type: "MapServer map-image",
        urid: "FASS_Watersheds",
        visible: false
    },
    "Points_of_Diversion": {
        url: "https://gispublic.waterboards.ca.gov/arcgis/rest/services/Water_Rights/Points_of_Diversion/MapServer",
        id: "Points_of_Diversion",
        name: "Points of Diversion",
        tiled: false,
        title: "Points of Diversion",
        tocgroup: "proj",
        type: "MapServer map-image",
        urid: "Points_of_Diversion",
        visible: false
    }
}
configs.bios6 = configs.bios;
var dfg = {
    id: "dfg",
    layers: {
        "NGA_US_National_Grid": {
            url: "https://maps1.arcgisonline.com/ArcGIS/rest/services/NGA_US_National_Grid/MapServer",
            id: "NGA_US_National_Grid",
            name: "Land Ownership",
            tiled: false,
            title: "US National Grid",
            tocgroup: "ref",
            type: "MapServer map-image",
            urid: "NGA_US_National_Grid",
            visible: false
        },
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
        "CongressionalDistricts": {
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CongressionalDistricts/FeatureServer/0",
            id: "CongressionalDistricts",
            name: "Congressional Districts",
            type: "feature",
            urid: "CongressionalDistricts",
            visible: true
        },
        "nlcd2016": {
            id: "NLCD_2016_Land_Cover_L48",
            name: "NLCD 2016 Land Cover Lower48",
            type: "wms",
            urid: "NLCD_2016_Land_Cover_L48",
            url: "https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2016_Land_Cover_L48/wms?service=WMS&request=GetCapabilities",
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
    al: "DFG_Properties:0",
    bl: "topo",
    homepage: "https://www.wildlife.ca.gov/Lands",
    id: "lands",
    layers: {},
    logo: "https://apps.wildlife.ca.gov/bios/images/MapViewerBanner-Lands.png",
    name: "CDFW Lands",
    title: "Lands And Niche Decision System",
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
        "DFG_Properties": {
            id: "CDFW_Properties",
            name: "CDFW Properties",
            tiled: false,
            tocgroup: "proj",
            type: "FeatureServer",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/CDFW_Properties/FeatureServer",
            visible: true
        },
        "DFG_Properties:2": {
            id: "DFG_Properties:0",
            name: "CDFW Regions",
            tocgroup: "proj",
            type: "feature",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/2",
            visible: false
        },
        "DFG_Properties:1": {
            id: "DFG_Properties:1",
            name: "CDFW Public Access Lands",
            tocgroup: "proj",
            type: "feature",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/1",
            visible: true
        },
        "DFG_Properties:0": {
            id: "DFG_Properties:0",
            name: "CDFW Facilities",
            tocgroup: "proj",
            type: "feature",
            url: "https://services2.arcgis.com/Uq9r85Potqm3MfRV/arcgis/rest/services/DFG_Properties/FeatureServer/0",
            visible: true
        }
    },
    viewer: "lands"
};
configs.lands = lands;
console.log('Loaded config');
