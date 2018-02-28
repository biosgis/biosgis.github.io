//dotty.js 20160523 dchiang 20171208
var br = "<br />";
function $(id) {
    return document.getElementById(id);
}
function hide(id) {
    $(id).style.display = 'none';
}
function show(id) {
    $(id).style.display = 'block';
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
    node.style.display = 'none';
}
function showx(node) {
    node.style.display = '';
}
function togglex(node) {
    if (node.style.display !== 'none') {
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
function navigatorInfo() {
    var msg = 'navigator.appName=' + navigator.appName + '<br />' +
        'navigator.cookieEnabled=' + navigator.cookieEnabled + '<br />' +
        'navigator.platform(operating system)=' + navigator.platform + '<br />' +
        'navigator.userAgent=' + navigator.userAgent + '<br />';
    return msg;
}
function windowInfo() {
    var br = '<br />';
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
function init() {
    var msg = poplinks();
    console.log(msg + ' links parsed');
}

//window.addEventListener('load', init);// turn on in page

function ablinks() {
    // Auto Build links list items from bare a-tag source code 20171128
    var k = 0;
    var libs = document.getElementsByClassName('linkpool');
    for (var i = 0; i < libs.length; i++) {
        var lib = libs[i];
        var links = lib.childNodes;
        for (var j = 0; j < links.length; j++) {
            var a = links[j];
            if (a.innerHTML === '') {
                if (a.className !== '') {
                    a.className = a.className + ' ali';
                } else {
                    a.className = 'ali';
                }
                if (a.title !== '') {
                    a.innerHTML = '&bull;&nbsp;' + a.title;
                } else {
                    a.innerHTML = a.href;
                }
                a.target = '_blank';
                k = k + 1;
            }
        }
    }
    return k;
}
function showall() {
    var hidden = document.getElementsByClassName('hide');
    for (var i = 0; i < hidden.length; i++) {
        var x = hidden[i];
        x.className.replace('hide', 'show')
    }
}
function hideall() {
    var shown = document.getElementsByClassName('show');
    for (var i = 0; i < shown.length; i++) {
        var x = shown[i];
        x.className.replace('show', 'hide')
    }
}

function showhidden(id) {
    var hidden = document.getElementsByClassName('hidden');
    var yes = id.replace('showhidden', '');
    for (var i = 0; i < hidden.length; i++) {
        var x = hidden[i];
        x.style.display = yes;
    }
    hide(id);
    if (id.indexOf('none') < 0) {
        show(id + 'none');
    } else {
        show(id.replace('none', ''));
    }
}

//20171206 Created autolink in poplinks instead of ablinks

