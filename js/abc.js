/* 
Copyright © 2019, State of Grace, Department of Fun and Games
[MIT License](https://mit-license.org/)
[GNU GPL v3](https://www.gnu.org/licenses/)
 * [open-license](https://project-open-data.cio.gov/open-licenses/)
 * [OpenGov3](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
 * [FreeBSD](https://www.freebsd.org/copyright/freebsd-license.html)
 */
// abc.js 20140910 dfgchiang 20180919
// All Basic Convenience Generic Helper fxns
var br = "<br />";
var rv = (Math.random() * 10).toFixed(5);
//================================
// CORE COMMON Helpers (Dottyjs)
//================================
function $(id) {
    return document.getElementById(id);
}

function $class(x) {
    return document.getElementsByClassName(x);
}

function $name(x) {
    return document.getElementsByName(x);
}

function $tag(x) {
    return document.getElementsByTagName(x);
}

function add(a, b) {
    return a + b;
}

function addbrk(x) {
    return x + '<br />';
} //-20141111
function addCss(id, x) {
    $(id).className += ' ' + x;
}

function bolden(x) {
    return '<b>' + x + '</b>';
} //-20141112
function datestampoo() {
    return (new Date()).getTime();
}

function echo(s) {
    console.log(s);
} //-20170428
function fillval(x, val) {
    $(x).innerHTML = val;
    show(x);
}

function tagh3(x) {
    return '<h3>' + x + '</h3>';
} //-20141112
function hide(id) {
    $(id).style.display = 'none';
}

function hid(id) {
    if ($(id).style.display === 'none') {
        return true;
    } else {
        return false;
    }
}

function pass(s) {
    var x = s;
}

function removeCss(id, x) {
    $(id).className.replace(x, '');
}

function show(id) {
    $(id).style.display = '';
}

function showing(id) {
    if ($(id).style.display !== 'none') {
        return true;
    } else {
        return false;
    }
}

function shown(id) {
    if ($(id).style.display !== 'none') {
        return true;
    } else {
        return false;
    }
}

function showTable(id) {
    $(id).style.display = 'table';
}

function tagtitle(s) {
    this.title = s;
}
//function toggle(id) { if (hid(id)) { show(id); } else { hide(id); } }
function toggle(id) {
    if (shown(id)) {
        hide(id);
    } else {
        show(id);
    }
}

function wtrim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

function pl(s) {
    console.log(s);
}

function hidex(x) {
    x.style.display = 'none';
}

function showx(x) {
    x.style.display = '';
} //expo
function togglex(x) {
    (x.style.display !== 'none') ? hidex(x): showx(x);
}

function addscript(x) {
    var tag = document.createElement('script');
    tag.type = 'text/javascript';
    tag.src = x;
    document.head.appendChild(tag);
}

function ajaxget(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById('demo').innerHTML = xhr.responseText;
            callback(xhr.responseText);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

function parson(response) {
    if (typeof response !== 'object') {
        return JSON.parse(response);
    } else {
        return response;
    }
}

function iconflip(x) {
    // Toggle jslib icon when clicked 20170516
    var y = x.className;
    if (y.indexOf('-up') > 0) {
        x.className = y.replace('-up', '-down');
    } else if (y.indexOf('-down') > 0) {
        x.className = y.replace('-down', '-up');
    } else if (y.indexOf('-left') > 0) {
        x.className = y.replace('-left', '-right');
    } else if (y.indexOf('-right') > 0) {
        x.className = y.replace('-right', '-left');
    } else if (y.indexOf('-bottom-left') > 0) {
        x.className = y.replace('-bottom-left', '-top-right');
    } else if (y.indexOf('-top-right') > 0) {
        x.className = y.replace('-top-right', '-bottom-left');
    } else if (y.indexOf('-expand') > 0) {
        x.className = y.replace('-expand', '-collapse');
    } else if (y.indexOf('-collapse') > 0) {
        x.className = y.replace('-collapse', '-expand');
    }
}

function non(x) {
    if (x === undefined || x === null || x === '') {
        return true;
    } else {
        return false;
    }
}

function notnon(x) {
    if (x !== undefined && x !== null && x !== '') {
        return true;
    } else {
        return false;
    }
}

function poplinks() {
    var links = document.getElementsByTagName('a');
    var atotal = 0;
    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a.href !== undefined && a.href !== '') {
            if ((a.href.indexOf('#') > 0 && a.href.indexOf(location.href) > -1)) {
                a.target = "_self";
            } else if (a.href.indexOf("javascript:void") < 0 &&
                a.href.indexOf("mailto:") < 0 && a.target !== '_self') {
                a.target = "_blank";
            }
            if (a.innerHTML === '' && a.className === '') {
                a.style.lineHeight = '150%';
                if (a.title !== '') {
                    a.innerHTML = a.title + ' <br/>';
                } else {
                    a.innerHTML = a.href.replace('https://', '').replace('http://', '').replace(/\/$/, '').replace('www.', '') + ' <br/>'; //.replace(/\.(com|gov|net|org|io)/, '')
                }
            }
        }
        atotal = i + 1;
    }
    console.log(atotal + ' Links')
    return atotal;
}

//========================
// Additional Helpers
//========================
function addEventHandler(target, evtype, listener) {
    if (window.attachEvent) {
        target.attachEvent("on" + evtype, listener); // can return boolean
    } else {
        target.addEventListener(evtype, listener, false); // returns void
    }
}

function arrayAddItem(arr, it) {
    var addnew = true;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === it) {
            addnew = false;
        }
    }
    if (addnew === true) {
        arr.push(it);
    }
    return arr;
}

function arrayHasItem(arr, it) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === it) {
            return true;
        }
    }
    return false;
}
//--- Return array minus item to remove
function arrayRemoveItem(arr, it) {
    var a = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== it) {
            a.push(arr[i]);
        }
    }
    return a;
}
//--- Shuffles an array by moving an item to the end or beginning--20110728-20150113
function arrayShuffle(arr, arg, it) {
    var a = [];
    if (non(arg)) {
        var arg = "MOVE_BEHIND";
    }
    if (non(it)) {
        return arr;
    }
    for (var i in arr) {
        if (arr[i] !== it) {
            a.push(arr[i]);
        }
    }
    if (arg === "MOVE_BEHIND") {
        a.push(it);
    } else if (arg === "MOVE_AHEAD") {
        a.unshift(it);
    }
    return a;
}
//--- Shuffles an array by moving an item to the end of line or bottom or order--20150113
function arrayShuffleToEnd(arr, it) {
    var a = [];
    for (var i in arr) {
        if (arr[i] !== it) {
            a.push(arr[i]);
        }
    }
    a.push(it);
    return a;
}
//--- Shuffles an array by moving an item to the front of line or top or order--20120113
function arrayShuffleToFront(arr, it) {
    var a = [];
    for (var i in arr) {
        if (arr[i] !== it) {
            a.push(arr[i]);
        }
    }
    a.unshift(it);
    return a;
}
//-- capitalizeFirstLetter(string)--20160920
function capword(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function datetimenow() {
    return (new Date()).getTime();
}
//--- Interpret keycode into word-20150113
function decodeKey(e) {
    var keycode = (window.event ? event.keyCode : e.keyCode);
    switch (keycode) {
        case 9:
            return "Tab";
        case 13:
            return "Enter";
        case 16:
            return "Shift";
        case 17:
            return "Ctrl";
        case 18:
            return "Alt";
        case 27:
            return "Esc";
        case 46:
            return "Delete";
        default:
            return null;
    }
}
//---keyCodes
//Backspace=8
//Tab=9
//Enter=13
//Shift=16
//Ctrl=17
//Alt=18
//CapsLock=20
//Esc=27
//Delete=46
function arrayItemById(arr, id) {
    // Find JSON item in arrray by id property
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return arr[i];
        }
    }
    return null;
}

function getTarget(e) {
    e = e || window.event;
    return (e.target || e.srcElement);
};

function Hob(uiid) {
    var ho = $(uiid);
    this.put = function (msg) {
        ho.innerHTML += addbrk(msg);
        msg = null;
        return null;
    }
    return this;
}
// Toggle icon when clicked on--20170516
function iconswap(x) {
    var y = x.className;
    if (y.indexOf('-up') > 0) {
        x.className = y.replace('-up', '-down');
    } else if (y.indexOf('-down') > 0) {
        x.className = y.replace('-down', '-up');
    } else if (y.indexOf('-left-') > 0) {
        x.className = y.replace('-left-', '-right-');
    } else if (y.indexOf('-right-') > 0) {
        x.className = y.replace('-right-', '-left-');
    } else if (y.indexOf('-bottom-left') > 0) {
        x.className = y.replace('-bottom-left', '-top-right');
    } else if (y.indexOf('-top-right') > 0) {
        x.className = y.replace('-top-right', '-bottom-left');
    } else if (y.indexOf('-expand') > 0) {
        x.className = y.replace('-expand', '-collapse');
    } else if (y.indexOf('-collapse') > 0) {
        x.className = y.replace('-collapse', '-expand');
    }
}

function icontogglex(x) {
    var y = x.className;
    if (y.indexOf('-right-triangle-') > 0) {
        x.className = y.replace('-right-triangle-', '-down-');
    } else if (y.indexOf('-down-arrow') > 0) {
        x.className = y.replace('-down-arrow', '-right-triangle-arrow');
    } else if (y.indexOf('-right') > 0) {
        x.className = y.replace('-right', '-down');
    } else if (y.indexOf('-down') > 0) {
        x.className = y.replace('-down', '-right');
    } else if (y.indexOf('-expand') > 0) {
        x.className = y.replace('-expand', '-collapse');
    } else if (y.indexOf('-collapse') > 0) {
        x.className = y.replace('-collapse', '-expand');
    }
}
//new-20170803-append-json-prop-into-json
function jsonAddProp(json, name, prop) {
    json[name] = prop;
    var i = 0;
    for (var key in json) {
        i += 1;
    }
    return i;
}
//--- Deserialize a key-value string by certain separators and returns a JSON --20160427
/*
 * @param {String} kvchain: a serialized key-value string like 'key1=val1&key2=val2&key3=val3'.
 * @param {String} ksep: OPTIONAL key separator character delimiting each key-value pair, like '&' or '|'.
 * @param {String} vsep: OPTIONAL value separator between an field name and its value, like '=' or ':'.
 */
function jsonize(kvchain, ksep, vsep) {
    var json = {};
    if (ksep === undefined) {
        if (kvchain.indexOf("&") > 0) {
            ksep = "&";
        } else if (kvchain.indexOf("|") > 0) {
            ksep = "|";
        }
    } //key-separator
    if (vsep === undefined) {
        vsep = "=";
    } //value-separator
    var kvpairs = kvchain.split(ksep);
    for (var i = 0; i < kvpairs.length; i++) {
        var keyval = kvpairs[i].split(vsep);
        json[keyval[0]] = keyval[1];
    }
    return json;
}

function matchk(key, keys) {
    for (k = 0; k < keys.length; k++) {
        if (key === keys[k]) {
            return k;
        }
    }
    return -1;
}

function nontype(x) {
    // Check what Nonetype 20180329
    if (x === undefined) {
        return 'undefined';
    } else if (x === null) {
        return 'null';
    } else if (x === '') {
        return 'empty string';
    }
}

function notfalse(x) {
    if (x !== undefined && x !== null && x !== false) {
        return true;
    } else {
        return false;
    }
}

function nulldefy(x) {
    if (x === undefined) {
        return null;
    } else {
        return x;
    }
}

function removeTrailingSlash(s) {
    return s.replace(/\/$/, '');
}
//swap styles for toggling icons
function swapstyle(id, s, t) {
    if ($(id).className === s) {
        $(id).className = t;
    } else {
        $(id).className = s;
    }
}
//swap innertext
function swapt(id, s1, s2) {
    if ($(id).innerHTML === s1) {
        $(id).innerHTML = s2;
    } else {
        $(id).innerHTML = s1;
    }
}
//--- Switch between 2 texts in one toggle button--20160519
function swapt(id, a, b) {
    if ($(id).innerHTML !== a) {
        $(id).innerHTML = a;
    } else {
        $(id).innerHTML = b;
    }
}
// Get URL filedirname for window_location_pathname--20160302
function urldir(pathname) {
    var path = pathname.slice(1);
    if (path.slice(-1) === '/') {
        path = path.slice(0, -1);
    }
    if (path.indexOf('/') > 0) {
        var parts = path.split('/');
    } else {
        return path;
    }
    var filedir = parts[(parts.length - 1)];
    if (filedir.indexOf('.') > 0) {
        return parts[(parts.length - 2)];
    } else {
        return filedir;
    }
}
//--- Return a URL parameter value from a serialized string like in URL search key-value pairs--20160428
function urlpval(key) {
    var s = "";
    if (location.search.length > 0) {
        s = location.search.substr(1);
    } else if (location.hash.length > 0) {
        s = location.hash.substr(1);
    }
    if (s.length > 0 && location.search.indexOf(key) > -1) {
        var k_start = s.indexOf(key + "=");
        if (k_start !== -1) {
            k_start = k_start + key.length + 1;
            var k_end = s.indexOf("&", k_start);
            //msglog.push('key_start=' + k_start + ', key_end=' + k_end);
            if (k_end === -1) {
                k_end = s.length;
            }
            return unescape(s.substring(k_start, k_end));
        }
    } else {
        return "";
    }
}
//--- Switch between 2 cssZindex values--20160310
function zswap(id, a, b) {
    if ($(id).style.zIndex !== a) {
        $(id).style.zIndex = a;
    } else {
        $(id).style.zIndex = b;
    }
}

//=============================================
// AJAX REQUESTS
//=============================================
//--- Request data async by GET with callback function to handle response in text
function ajaxGetText(url, params, callback) {
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open("GET", url + "?" + params, true);
    xhr.onreadystatechange = function () { //handler;
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    }
    xhr.send("");
    //return xhr.responseText; //for synch
}
//--- Requesting data by POST with callback to handle resonse in text
function ajaxPostText(url, params, callback) {
    //console.log("DO ajaxPostText: " + [url, params]);
    var xhr;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest();
    } else { // code for IE6-
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader("Content-length", params.length);
    xhr.send(params);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(xhr.responseText);
            callback(xhr.responseText);
        }
    }
}

function ajaxGetXml(url, params, callback) {
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open("GET", url + "?" + params, true);
    //xhr.open("POST", url, true);//do post to get back lots of data
    //-Send the proper header infomation along with the POST request
    //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader("Content-length", params.length);
    //xhr.setRequestHeader("Connection", "close");
    xhr.onreadystatechange = function () { //handler;
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseXML);
        }
    }
    xhr.send(""); //if GET
    //xhr.send(params); //if POST
    //return xhr.responseXML; //for loading local xml data synchronously but dont use for remote
}
//--- Load Local XML Document as DOM object synchronously
function loadXmlDoc(file) {
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open("GET", file, false);
    xhr.send("");
    return xhr.responseXML;
}
//--- Get Ajax Response directly as JSON REF(http://mathiasbynens.be/notes/xhr-responsetype-json)
var ajaxGetJson = function (url, callback, errorHandler) {
    var xhr = typeof XMLHttpRequest !== 'undefined' ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        var status;
        var data;
        // http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState === 4) { // `DONE`
            status = xhr.status;
            if (status === 200) {
                callback && callback(xhr.response);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};

/* ----------------------- BASIC AJAX CALL BLOCK TEMPLATE ----------------------------
    var url = app.baseUrl + "/rest/Imaps.ashx";
    var params = "o=GetOidsWhere&q=" + tableName + "&a=" + encodeURIComponent(where);
    var callback = function (res) {
        console.log("CALLBACK queryOidsWhere/callback... ");
    }
    ajaxPostText(url, params, callback);

    var url = app.baseUrl + "/rest/BiosRegistrar.ashx";
    //-- Get bios info from manifest and not old registry catalog
    params = "o=GetSdeNamePublishedForDsId&q=" + parseInt(dscode);
    callback = function (response) {
        console.log("CALLBACK getJoinInfo/callback... ");
    }
    ajaxGetText(url, params, callback);
----------------------------------------- */
//addscript
function loadScript(url) {
    var s = document.createElement('script');
    s.src = url;
    document.getElementsByTagName('head')[0].appendChild(s);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + ";path=/; SameSite=None; Secure";
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start === -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start === -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end === -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}
// FROM--https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
}

function sendpage() {
    window.location = "mailto:?body=" + window.location.href;
}
// Psuedo-GUID Generator from--http://guid.us/GUID/JavaScript
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function fooid() {
    // then to call it, plus stitch in '4' in the third group
    var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
}
//===============================
// BROWSER CLIENT INFO 20180612
//===============================
console.log('BROWSER=' + navigator.userAgent);
if (navigator.userAgent.indexOf("MSIE") > 0) {
    var MSIE = "IE" + navigator.userAgent.split("MSIE ")[1].split(" ")[0].split(".")[0];
    console.log("MSIE=" + MSIE);
}
console.log('PLATFORM=' + navigator.platform);
console.log('OBSERVER=' + Object.observe);
console.log('WEBWORKER=' + typeof (Worker));
console.log("innerHeight=" + innerHeight);
console.log("innerWidth=" + innerWidth);
// WEBASSEMBLY, ASYNC, AWAIT
// TEST--https://hacks.mozilla.org/2017/03/firefox-52-introducing-web-assembly-css-grid-and-the-grid-inspector/
if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    console.log('WebAssembly SUPPORTED');
} else {
    console.log('WebAssembly NOT SUPPORTED');
}

function navigatorInfo() {
    var msg = 'navigator.appName=' + navigator.appName + br +
        'navigator.cookieEnabled=' + navigator.cookieEnabled + br +
        'navigator.platform(operating system)=' + navigator.platform + br +
        'navigator.userAgent=' + navigator.userAgent + br;
    return msg;
}

function windowInfo() {
    var msg = 'window.innerHeight=' + window.innerHeight + br +
        'window.innerWidth=' + window.innerWidth + br +
        'window.scrollX=' + window.scrollX + br + // Horizontal scrolling
        'window.scrollY=' + window.scrollY + br + // Vertical scrolling
        'window.screen.availHeight= ' + window.screen.availHeight + br +
        'window.screen.availLeft= ' + window.screen.availLeft + br +
        'window.screen.availTop= ' + window.screen.availTop + br +
        'window.screen.availWidth= ' + window.screen.availWidth + br +
        'window.screen.colorDepth= ' + window.screen.colorDepth + br +
        'window.screen.height= ' + window.screen.height + br +
        'window.screen.pixelDepth= ' + window.screen.pixelDepth + br +
        'window.screen.width= ' + window.screen.width;
    return msg;
}

function geturlarg(key) {
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

function geturlkeyal() {
    // CONFORM BIOSDS VALUE IN URLSEARCH PARAM AL--20190128
    var al = null;
    if (location.search.indexOf('al=') > 0) {
        var val = location.search.split('al=')[1].split('&')[0];
        if (val !== undefined && val !== null) {
            var dsid = parseInt(val.toLowerCase().replace('biosds', '').replace('ds', ''));
            if (typeof dsid === 'number') {
                var al = 'biosds' + dsid;
            } else {
                al = val;
            }
        }
    }
    return al;
}

function xysplit(s) {
    return [parseFloat(s.split(',')[0]), parseFloat(s.split(',')[1])];
}
//======================================================================
// COMMON CONSTANTS, CONVERSIONS, AND WELL-KNOWN VALUES
//======================================================================
var OPERATOR_LIST = "|(|)|=|<>|>|>=|<|<=|NOT|LIKE|AND|OR|IS NULL|IS NOT NULL|IN (|";
var DEFAULT_OPACITY = 0.77;
var ESRIFIELDTYPE_LIST = '|esriFieldTypeOID|esriFieldTypeString|esriFieldTypeSmallInteger|esriFieldTypeGeometry|esriFieldTypeDouble|esriFieldTypeInteger|esriFieldTypeDate';
var GDATATYPE_LIST = "'string', 'number', 'boolean', 'date', 'datetime', and 'timeofday'";
var GEOMETRY_FIELD_LIST = "|Shape|Shape.STArea()|Shape.STLength()|"; //esriFieldTypeGeometry,esriFieldTypeDouble
var GEOMETRY_TYPE_LIST = '|point|multipoint|polyline|polygon|extent';
var LINK_FIELD_LIST = '|LINK|LINK1|Link|PHOTO|REPORT|REPORT_|REPORT1|REPORT2|URL|';
var OID_FIELD_LIST = '|OBJECTID|ObjectID|OID|FID';
var SIMPLEMARKERSTYLES = '|STYLE_CIRCLE|STYLE_CROSS|STYLE_DIAMOND|STYLE_PATH|STYLE_SQUARE|STYLE_X';
var SKIP_FIELD_LIST = '|AREA|AREA_|Area|LENG|LENG_|LENGTH|Length|SHAPE|Shape|SHAPE.STArea()|SHAPE.STLength()|Shape.STArea()|Shape.STLength()';
//--- Convert from SQLserver.type to Google Table column type
var GDATATYPE_FROM_SQLTYPE = {
    "bit": "boolean",
    "datetime": "string",
    "float": "number",
    "int": "number",
    "numeric": "number",
    "nvarchar": "string",
    "real": "number",
    "smalldatetime": "string",
    "smallint": "number",
    "tinyinte": "number",
    "varchar": "string"
}
var kMaxRecordCount = 1000; //=max number of records returned from ArcGIS Server map service tasks
var MAX_RECORD_COUNT = 1000;
//--- Convert from dudNET System.type or MSSQL datatype to Google Table column type
var GDATATYPE_FROM_SYSTYPE = {
    "DateTime": "string",
    "Decimal": "number",
    "Int": "number",
    "Int16": "number",
    "Int32": "number",
    "String": "string"
}
var GDATATYPE_FROM_OTHER = {
    "DateTime": "string",
    "Decimal": "number",
    "Int": "number",
    "Int16": "number",
    "Int32": "number",
    "Int64": "number",
    "String": "string",
    "bool": "boolean",
    "datetime": "string",
    "double": "number",
    "float": "number",
    "int": "number",
    "numeric": "number",
    "nvarchar": "string",
    "smallint": "number",
    "varchar": "string",
    "esriFieldTypeOID": "number",
    "esriFieldTypeInteger": "number",
    "esriFieldTypeSmallInteger": "number",
    "esriFieldTypeString": "string",
    "esriFieldTypeGeometry": "binary",
    "string": "string",
    "number": "number"
}
var ESRI_FIELD_TYPES = ["esriFieldTypeOID", "esriFieldTypeString", "esriFieldTypeInteger", "esriFieldTypeSmallInteger", "esriFieldTypeGeometry"];
//--- SQL WHERE Clause operators abbrev and codes //NOT USED YET
var QUERY_OPERATOR_CODES = {
    "eq": "=",
    "ne": "<>",
    "gt": ">",
    "gte": ">=",
    "in": "IN (",
    "lpar": "(",
    "rpar": ")",
    "lt": "<",
    "lte": "<=",
    "like": "LIKE",
    "not": "NOT",
    "isnull": "IS NULL",
    "notnull": "IS NOT NULL",
    "blank": "= ''"
}
var NUMERIC_OPERATOR_LIST = "|eq|gt|gte|lt|lte|ne|=|>|>=|<|<=|<>|&gt;|&gt;=|&lt;|&lt;=|&lt;&gt;|";
var STRING_OPERATOR_LIST = "|like|not like|is null|is not null|in (|";
var BASEMAP_IDS = ["streets", "satellite", "hybrid", "topo", "gray", "dark-gray", "oceans", "national-geographic", "terrain", "osm", "dark-gray-vector", "gray-vector", "streets-vector", "topo-vector", "streets-night-vector", "streets-relief-vector", "streets-navigation-vector"];
var BASEMAP_LIST = "|streets|satellite|hybrid|topo|gray|dark-gray|oceans|national-geographic|terrain|osm|dark-gray-vector|gray-vector|streets-vector|topo-vector|streets-night-vector|streets-relief-vector|streets-navigation-vector";
var DFGCOLORS = {
    "cream": "ffe7a4",
    "richgold": "fbad23",
    "orange": "ce770e",
    "darkorange": "cc6600",
    "babyblue": "a6c9e2",
    "deepblue": "185b93",
    "downblue": "0d569e",
    "jazzblue": "1f70a7",
    "richblue": "1f66be",
    "sootheblue": "014e77",
    "colorname": "hexvalue"
};
