// abide.js 20191114 dfgchiang
// All Basic App Setup and Universal Functions
console.log('Loading abide.js');
//==== GLOBAL VARIABLES
var avn = 20191209;
var bvn = ((avn - 20000000) / 10000).toFixed(2);
//avn.toString().subst(2, 2) + '.' + avn.toString().subst(4, 2);
var fullversion = bvn + '.' + avn.toString().substr(6, 2);
var rv = (Math.random() * 10).toFixed(5);
var ssid = 't' + Date.now() + 'r' + parseInt(rv * 10000);
//parseInt(Math.random() * 1000000);//=SESSIONID
//==== GLOBAL CONSTANTS
const basemap2id = {
    "Imagery": "satellite",
    "Imagery Hybrid": "hybrid",
    "Streets": "streets",
    "Topographic": "topo",
    "Navigation": "streets-navigation-vector",
    "Streets (Night)": "streets-night-vector",
    "Terrain with Labels": "terrain",
    "Light Gray Canvas": "gray",
    "Dark Gray Canvas": "dark-gray",
    "Oceans": "oceans",
    "National Geographic Style Map": "national-geographic",
    "OpenStreetMap": "osm",
    "xxx": "topo",
    "Charted Territory Map": "topo-vector",
    "Community Map": "topo-vector",
    "Navigation (Dark Mode)": "streets-night-vector",
    "Newspaper Map": "topo",
    "Human Geography Map": "topo",
    "Human Geography Dark Map": "dark-gray-vector",
    "Modern Antique Map": "topo",
    "Mid-Century Map": "topo",
    "Nova Map": "streets-night-vector",
    "Colored Pencil Map": "topo",
    "Firefly Imagery Hybrid": "topo",
    "USA Topo Maps": "streets-relief-vector"
}

function btitle2id(title) {
    return (basemap2id[title] ? basemap2id[title] : 'topo');
}
//==== GLOBAL FUNCTIONS
function addcss(files, rv, dir) {
    for (var i = 0; i < files.length; i++) {
        let x = document.createElement('link');
        x.setAttribute('rel', 'stylesheet');
        x.href = dir + cssfiles[i] + '?' + rv; // ie '../css/'
        document.head.appendChild(x);
    }
}

function addlibs(files, rv, dir) {
    if (files.length === 0) {
        return;
    }
    let f = dir + files.shift(); // ie '../js/'
    let x = document.createElement('script');
    x.type = 'text/javascript';
    x.src = f + '?v=' + rv;
    x.onload = function () {
        addlibs(files, rv, dir);
    }
    document.head.appendChild(x);
}

function addmsg(s) {
    document.getElementById('msgbox').innerHTML += s + '<br/>';
    var msgbox = document.getElementById('msgbox');
    msgbox.scrollTop = msgbox.scrollHeight;
}
// TO CLEAN UP UNWANTED OUTPUTS IN PRODUCTION RENAME ABOVE FUNCTION TO BELOW
function xxaddmsg(s) {
    return false;
}

function arrayhas(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === b) {
            return true;
        }
    }
    return false;
}

function datestamp() {
    let d = new Date();
    // Starting 2018 as year 1
    let y = d.getFullYear() - 2017;
    // DayNumberOfYear/CurrentDayNumber: 1..365
    let m = d.getMonth();
    let mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var n = 0;
    for (let i = 0; i < m; i++) {
        n = n + mdays[i];
    }
    n = n + d.getDate();
    // SecondsOfTheDay 1..86400
    let s = (d.getHours() * 60 * 60) + (d.getMinutes() * 60) + d.getSeconds();
    return y * 100000000 + n * 100000 + s;
}

function extn2poly(extent) {
    // Convert extent to polygon for addfeature geometry
    var xmax = extent.xmax;
    var xmin = extent.xmin;
    var ymax = extent.ymax;
    var ymin = extent.ymin;
    var rings = [
        [
            [xmin, ymin],
            [xmin, ymax],
            [xmax, ymax],
            [xmax, ymin],
            [xmin, ymin]
        ]
    ];
    var polygon = new EsriPolygon({
        hasZ: false,
        hasM: false,
        rings: rings,
        spatialReference: extent.spatialReference
    });
    return polygon;
}

function urlarg(key) {
    // GET LOCATION.SEARCH PARAMETER KEY VALUE--20190128
    var val = '';
    if (location.search.indexOf(key + '=') > 0) {
        var val = location.search.split(key + '=')[1].split('&')[0];
        if (val !== undefined && val !== null & val !== '') {
            val = decodeURIComponent(val);
        }
    }
    return val;
}

function tcall(a) {
    var f = a[0];
    var x = a[1];
    var t = a[2];
    setTimeout(function () {
        f(x);
    }, t);
}

function xysplit(s) {
    return [parseFloat(s.split(',')[0]), parseFloat(s.split(',')[1])];
}

console.log('Loaded abide.js');
