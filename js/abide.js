// abide.js 20191114 dfgchiang
// All Basic App Setup and Universal Functions
console.log('Loading abide.js');
//==== GLOBAL VARIABLES
var avn = 20191121;
var bvn = ((avn - 20000000) / 10000).toFixed(2);
//avn.toString().subst(2, 2) + '.' + avn.toString().subst(4, 2);
var fullversion = bvn + '.' + avn.toString().substr(6, 2);
var rv = (Math.random() * 10).toFixed(5);
var ssid = 't' + Date.now() + 'r' + parseInt(rv * 10000);
//parseInt(Math.random() * 1000000);//=SESSIONID

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

function arrayhas(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === b) {
            return true;
        }
    }
    return false;
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
