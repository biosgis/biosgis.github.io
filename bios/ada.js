//dotty.js 20160523 dchiang 20171208
var br = "<br />";
function $(id) {
    return document.getElementById(id);
}
function hide(id) {
    $(id).style.display = 'none';
}
function show(id) {
    $(id).style.display = '';
}
function tagtitle(s) {
    this.title = s;
}
function toggle(id) {
    if ($(id).style.display !== 'none') {
        hide(id);
    } else {
        show(id);
    }
}
function hidex(node) {
    node.hidden = true;
}
function showx(node) {
    node.hidden = false;
}
function tog(node) {
    if (node.hidden !== 'hidden') {
        hidex(node);
    } else {
        showx(node);
    }
}
function poplinks() {
    var links = document.getElementsByTagName('a');
    var atotal = 0;
    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a.href !== undefined && a.href !== '') {
            if (a.href.indexOf(location.href) >= 0 && a.href.indexOf('#') >= 0) {
                a.target = "_self";
            } else if ((a.href.indexOf("mailto:") < 0 && a.href.indexOf("javascript:void") < 0)
                    || a.href.indexOf('http') !== 0) {
                a.target = "_blank";
            }
            if (a.innerHTML === '' && a.className === '') {
                a.style.lineHeight = '150%';
                if (a.title !== '') {
                    a.innerHTML = a.title + ' <br/>';
                } else {
                    a.innerHTML = a.href.replace('https://', '').replace('http://', '').replace(/\/$/, '') + ' <br/>';
                }
            }
            if (a.parentNode.className === 'klinks') {
                a.className = 'ab';
            }
        }
        atotal = i + 1;
    }
    console.log(atotal + ' Links')
    return atotal;
}
console.log('DONE ABC');
var app = {
    avn: 20180102,
    addmsg: function (s) {}
}
function addmsg(s) {
    $('msgbox').innerHTML += s + '<br>';
}
console.log('DONE app');
// AMD-REQUIRE
require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/Layer",
    "esri/Graphic",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/geometry/Extent",
    "esri/Viewpoint",
    "esri/core/watchUtils",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/layers/FeatureLayer",
    "dojo/_base/array",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
], function (
    Portal, OAuthInfo, esriId, PortalQueryParams,
    Map, MapView, SceneView, Layer, Graphic, Expand,
    Home, Extent, Viewpoint, watchUtils,
    QueryTask, Query, FeatureLayer,
    arrayUtils,
    domStyle, domAttr, dom, on
    ) {

    var map = new Map({
        basemap: "streets"
    });

    var mapview = new MapView({
        container: "mapview",
        map: map,
        zoom: 7,
        center: [-121, 38] // longitude, latitude
    });

});
console.log('DONE AMD-REQUIRE');

console.log('LOADED ada.js');
