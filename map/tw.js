/* 
[FreeBSD](https://www.freebsd.org/copyright/freebsd-license.html)
 */
// tw.js 20180816 dchiang
console.log('LOADING tw.js')
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/ImageryLayer",
    "dojo/domReady!"
], function (
    Map, MapView, ImageryLayer
) {
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
        padding: { right: 300 },
        zoom: 9,
        center: [121.4909628, 24.1939265] // longitude, latitude
    });
    console.log('DONE AMD REQUIRED LOADER')
});
console.log('LOADED tw.js');