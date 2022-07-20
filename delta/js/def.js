// def.js 2022-01-25 dchiang
let dn = (new Date()).getTime();
function addcss(files, dir = 'css/', n = Date.now()) {
    for (var i = 0; i < files.length; i++) {
        var x = document.createElement('link');
        x.setAttribute('rel', 'stylesheet');
        x.href = dir + files[i] + '?v=' + Date.now();
        document.head.appendChild(x);
        console.log('ADDED ', dir, files[i]);
    }
}
function addjs(filename, dir = 'js/', callback) {
    var x = document.createElement('script');
    x.type = 'text/javascript';
    x.src = dir + filename + '?v=' + Date.now(); // 'js/ignit.js?v='
    if (callback != undefined) {
        x.onload = function () {
            callback(); //initpage();
        }
    }
    document.head.appendChild(x);
}
let DEVICE = 'notMobile';
if (/Android|iPhone|iPad|Kindle/i.test(navigator.userAgent)) {
    // console.log('this is mobile device');
    DEVICE = 'mobile';
} else {
    console.log('Not a mobile device');
}
function $(id) { return document.getElementById(id); }
function add(a, b) { return a + b; }
function addmsg(s) { $('msgbox').innerHTML += '<div>' + s + '</div>'; }
function msgput(s) {
    let args = Array.from(arguments);
    $('msgbox').innerHTML += '<div>' + args.join(' ') + '</div>';
}
function dohide(id) { $(id).classList.add('hide'); }
function dohidex(x) { x.classList.add('hide'); }
function hide(id) { $(id).style.display = 'none'; }
function hidex(x) { x.style.display = 'none'; }
function show(id) { $(id).style.display = ''; }
function showx(x) { x.style.display = ''; }
function toggle(id) { $(id).style.display = ($(id).style.display === 'none' ? '' : 'none'); }
function togglex(x) { x.style.display = (x.style.display === 'none' ? '' : 'none'); }
function unhide(id) { $(id).classList.remove('hide'); }
function unhidex(x) { x.classList.remove('hide'); }
if (location.hostname.indexOf('apps.wildlife') < 0) {
    wlog = console.log;
} else {
    wlog = function () { };
}
function fatable(features, fieldnames) {
    var table = document.createElement('table');
    table.classList.add('center');
    table.style.width = 'auto';
    var thead = document.createElement('thead');
    table.appendChild(thead);
    var toprow = document.createElement('tr');
    thead.appendChild(toprow);
    fieldnames.forEach(name => {
        var th = document.createElement('th');
        th.innerHTML = name;
        toprow.appendChild(th);
    });
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    var j = 0;
    features.forEach(feature => {
        var tr = document.createElement('tr');
        tbody.appendChild(tr);
        var fa = feature.properties;
        var k = 0;
        fieldnames.forEach(name => {
            var cell = tr.insertCell(k);
            var val = fa[name];
            // msgput(name, val);
            if (name.indexOf('CPUE') >= 0 && val > 0) {
                cell.innerHTML = (parseFloat(val)).toFixed(2);
            } else if (name.indexOf('Date') > -1) {
                cell.innerHTML = new Date(val).toLocaleDateString();
            } else {
                cell.innerHTML = val;
            }
            // cell.innerHTML = fa[name];
            k += 1;
        });
    });
    return table;
}

function picklistfill(list, ar) {
    ar.forEach(x => {
        var opt = document.createElement('option');
        opt.value = x[0];
        opt.innerHTML = x[1];
        list.appendChild(opt);
    });
    return ar.length;
}
function pickfirst(list) {
    if (list.length > 0) {
        for (i = 0; i < list.length; i++) {
            if (list.options[i].value !== '') {
                list.options[i].selected = true;
                return list.options[i].value;
            }
        }
    }
}
function pickvalue(sel, val) {
    let ops = sel.options;
    for (var i = 0; i < ops.length; i++) {
        if (ops[i].value === val) {
            sel.selectedIndex = i;
            return i
        }
    }
    return -1;
}
function pickonload(key, val) {
    if (urlfind(key)) {
        pickvalue($(key), urlfind(key));
        urlloaded[key] = urlfind(key);
    } else {
        if (val) {
            pickvalue($(key), val);
        } else {
            pickfirst($(key));
        }
    }
}
function poplinks() {
    var links = document.getElementsByTagName('a');
    var atotal = 0;
    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a.href && a.href !== '' && !a.className) {
            if ((a.href.indexOf('#') > 0 && a.href.indexOf(location.href) > -1)) {
                a.target = "_self";
            } else if (a.href.indexOf("javascript:void") < 0 &&
                a.href.indexOf("mailto:") < 0 && a.target !== '_self') {
                a.target = "_blank";
            }
        }
        atotal = i + 1;
    }
    console.log('Poplinks=' + atotal);
    return atotal;
}
function selectortext(x, s) {
    // if (x.indexOf('.') < 0) {
    //     x = '.' + x;
    // }
    let y = document.querySelectorAll(x);
    for (var i = 0; i < y.length; i++) {
        y[i].innerHTML = s;
    }
    return y.length;
}
function csshide(x) {
    // if (x.indexOf('.') < 0) {
    //     x = '.' + x;
    // }
    let y = document.querySelectorAll(x);
    for (var i = 0; i < y.length; i++) {
        y[i].classList.add('hide');
    }
    return y.length;
}
function cssunhide(x) {
    let y = document.querySelectorAll(x);
    for (var i = 0; i < y.length; i++) {
        y[i].classList.remove('hide');
    }
    return y.length;
}
function targetblanks() {
    let a = document.getElementsByTagName('A');
    var k = 0;
    for (let i = 0; i < a.length; i++) {
        var x = a[i];
        if (x.href.indexOf('#') !== 0 && x.href.indexOf('mailto:') < 0 && x.href.indexOf('tel:') < 0) {
            x.target = '_blank';
            // x.classList.add('esri-icon-link');
        }
        k = i;
    }
    console.log(k, 'links');
}
function telluser(s, t) {
    var x = 'telluser';
    if (s == undefined || s == null) {
        dohide(x);
    } else {
        if (s.toLowerCase().indexOf('error') === 0) {
            $(x).style.borderColor = 'red';
        } else if (s.toLowerCase().indexOf('please') === 0) {
            $(x).style.borderColor = 'gold';
        } else if (s.toLowerCase().indexOf('success') === 0) {
            $(x).style.borderColor = 'green';
        } else if (s.toLowerCase().indexOf('warning') === 0) {
            $(x).style.borderColor = 'orange';
        } else {
            $(x).style.borderColor = 'slateblue';
        }
        $('telluser-msg').innerHTML = s;
        unhide(x);
        if (t != undefined && typeof t === 'number') {
            var t = t;
        } else {
            var t = 3000;
        }
        setTimeout(() => {
            dohide(x);
        }, t);
    }
}
const urlargs = {};
const urlloaded = {};
let urlqued = false;
function urlload(s) {
    console.log('DO urlload', s);
    if (s.indexOf('?') === 0 || s.indexOf('#') === 0) {
        s = s.substring(1);
    }
    if (s.indexOf('&') > 0) {
        var kvp = s.split('&');
    } else {
        var kvp = [s];
    }
    kvp.forEach(kvt => {
        if (kvt.indexOf('=') > 0) {
            var kva = kvt.split('=');
            urlargs[kva[0]] = kva[1];
            urlqued = true;
        }
    });
    if (location.hash.indexOf('msgx=') > 0) {
        var a = document.querySelectorAll('.msgx');
        console.log('msgx elems', a.length);
        for (var i = 0; i < a.length; i++) {
            a[i].classList.remove('msgx');
        }
    }
}
function urlgo(s = location.search) {
    console.log('DO urlgo', location.search);
    if (s.indexOf('?') === 0 || s.indexOf('#') === 0) {
        s = s.substring(1);
    }
    if (s.indexOf('&') > 0) {
        var kvs = s.split('&');
    } else {
        var kvs = [s];
    }
    var ps = kvs.length * -1; // NUMBER OF URLPARAMS TO CHECK
    kvs.forEach(kvt => {
        if (kvt.indexOf('=') > 0) {
            var kv = kvt.split('=');
            var key = kv[0];
            var val = kv[1];
            if ($(key) != null && $(key).hasAttribute('value')) {
                if ($(key).value == val) {
                    ps = ps + 1;
                }
            } else {
                ps = ps + 1;
            }
        }
    });
    console.log('DONE urlgo', ps);
    return ps;
}
function urlfind(key, s = location.search) {
    var val = null;
    if (s.indexOf(key + '=') > 0) {
        val = s.split(key + '=')[1].split('&')[0];
        if (val !== undefined && val !== null & val !== '') {
            val = decodeURIComponent(val);
        }
        // TODO FOR COMPOUND ARGS LIKE col=x&op=y&val=z
    } else if (s.indexOf('#' + key) >= 0) {
        val = key;
    }
    return val;
}
window.addEventListener('hashchange', function () {
    console.log('DO urlhashchanged');
    urlload(location.hash);
});

window.addEventListener('load', function () {
    let msg = poplinks();
    urlload(location.href);
});

let automap = false;
function xxgomaponload(s, callback) {
    if (urlloaded[s] !== undefined && automap) {
        automaptik = setInterval(() => {
            callback();
            urlloaded = { done: true };
            clearInterval(automaptik);
        }, 1000);
    }
}
function gomaponload(callback) {
    if (typeof window.tlim == 'undefined') {
        tlim = 0;
    } else {
        tlim = tlim + 1;
    }
    let go = urlgo();
    if (go < 0 && tlim < 11) {
        automaptik = setInterval(() => {
            gomaponload(callback)
        }, 1000);
    } else if (go === 0 || tlim >= 10) {
        callback();
        if (window.automatik != undefined) {
            clearInterval(automaptik);
        }
    }
}
function classifive(x) {
    if (x === undefined || typeof x != 'number') {
        var a = [0, 'Max/5', '2*Max/5', '3*Max/5', '4*Max/5', 'Max'];
    } else {
        var a = [0];
        for (var i = 1; i < 6; i++) {
            a.push((x * i / 5).toFixed(2));
        }
    }
    for (var i = 1; i < 6; i++) {
        $('class' + i + 'val').innerHTML = '&lt;= ' + a[i];
    }
    // return a;
}
function val2rad(val, max) {
    // if (val === 0) {
    //     return 0;
    // }
    let radii = [500, 1000, 1500, 2000, 2500, 3000];
    let i = Math.ceil(val / (max / 5));
    return radii[i];// (d * i * 100);
}
function val2radpx(val, max) {
    let radii = [5, 8, 12, 16, 20, 25];
    // 5, 8, 12, 15, 18, 22
    let i = Math.ceil(val / (max / 5));
    return radii[i];
}
function val2color(val, max) {
    let colors = ['dimgray', 'limegreen', 'green', 'blue', 'purple', 'violet'];
    let i = Math.ceil(val / (max / 5));
    return colors[i];
}
function arsub(a, b) {
    let ar = [];
    let bs = ',' + b.join(',') + ',';
    while (a.length > 0) {
        var x = a.shift();
        if (bs.indexOf(x + ',') < 0) {
            ar.push(x);
        }
    }
    return ar;
}
function listlegend() {
    const legendvs = [
        {
            "height": 12,
            "width": 12,
            "graphic": "circle",
            "cx": 6,
            "cy": 6,
            "r": 5,
            "stroke": "dimgray",
            "strokeWidth": 2,
            "fill": "white",
            "opacity": "100%",
            "value": "= 0 (zero)"
        },
        {
            "height": 18,
            "width": 18,
            "graphic": "circle",
            "cx": 9,
            "cy": 9,
            "r": 8,
            "stroke": "limegreen",
            "strokeWidth": 2,
            "fill": "lightgreen",
            "opacity": "55%",
            "value": "LTE max/5"
        },
        {
            "height": 26,
            "width": 26,
            "graphic": "circle",
            "cx": 13,
            "cy": 13,
            "r": 12,
            "stroke": "green",
            "strokeWidth": 2,
            "fill": "lightgreen",
            "opacity": "55%",
            "value": "LTE 2*max/5"
        },
        {
            "height": 34,
            "width": 34,
            "graphic": "circle",
            "cx": 17,
            "cy": 17,
            "r": 16,
            "stroke": "blue",
            "strokeWidth": 2,
            "fill": "lightgreen",
            "opacity": "55%",
            "value": "LTE 3*max/5"
        },
        {
            "height": 42,
            "width": 42,
            "graphic": "circle",
            "cx": 21,
            "cy": 21,
            "r": 20,
            "stroke": "purple",
            "strokeWidth": 2,
            "fill": "lightgreen",
            "opacity": "55%",
            "value": "LTE 4*max/5"
        },
        {
            "height": 50,
            "width": 50,
            "graphic": "circle",
            "cx": 25,
            "cy": 25,
            "r": 24,
            "stroke": "violet",
            "strokeWidth": 2,
            "fill": "lightgreen",
            "opacity": "55%",
            "value": "LTE max"
        }
    ];
    for (var i = 1; i < legendvs.length; i++) {
        var info = legendvs[i];
        var cell = $('class' + i + 'key');
        cell.innerHTML = '<svg height="' + info.height + '" width="' + info.width + '">' +
            '<circle cx="' + info.cx + '" cy="' + info.cy + '" r="' + info.r + '" stroke="' + info.stroke + '"' +
            ' stroke-width="2" fill="lightgreen" fill-opacity="55%"></circle>' +
            // '<rect height="18" width="30" style="fill:' + color + ';stroke-width:1;stroke:silver" />' +
            '</svg>';
    }
}
