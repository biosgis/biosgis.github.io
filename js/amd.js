/* 
 * [open-license](https://project-open-data.cio.gov/open-licenses/)
 * [opengov3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
 * [FreeBSD](https://www.freebsd.org/copyright/freebsd-license.html)
 */
// amd.js 20180620 dfgchiang

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/ImageryLayer",
    "dojo/domReady!"
], function (Map, MapView, ImageryLayer) {
    console.log('DO AMD REQUIRED LOADER');
    var NLCDLandCover2001_layer = new ImageryLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/NLCDLandCover2001/ImageServer",
        format: "jpgpng" // server exports in either jpg or png format
    });
    var map = new Map({
        basemap: "topo",
        layers: [NLCDLandCover2001_layer]
    });
    var mapview = new MapView({
        container: "mapview",
        map: map,
        zoom: 8,
        center: [-121.33, 38.45] // longitude, latitude
    });
    console.log('DONE AMD REQUIRED LOADER')
});


console.log('LOADED amd.js');