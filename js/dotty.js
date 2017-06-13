//dotty.js 20160523 dchiang 20170309
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
    if ($(id).style.display != 'none') {
        hide(id);
    } else {
        show(id);
    }
}
function hid(node) {
    node.style.display = 'none';
}
function shw(node) {
    node.style.display = '';
}
function togl(node) {
    if (node.style.display != 'none') {
        hid(node);
    } else {
        shw(node);
    }
}
function poplinks() {
    var links = document.getElementsByTagName("a");
    var atotal = 0;
    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a.href !== undefined && a.href !== "") {
            if (a.href.indexOf("#") >= 0 || a.id.indexOf("goto") === 0) {//FAIL href.indexOf("#") == 0) {//
                a.target = "_self";
            } else if (a.href.indexOf("mailto:") < 0 && a.href.indexOf("javascript:void") < 0) {
                a.target = "_blank";
            }
        }
        atotal = i + 1;
    }
    console.log(atotal + " LInks")
    return atotal;
}
function navigatorInfo() {
    var msg = "navigator.appName=" + navigator.appName + "<br />" +
        "navigator.cookieEnabled=" + navigator.cookieEnabled + "<br />" +
        "navigator.platform(operating system)=" + navigator.platform + "<br />" +
        "navigator.userAgent=" + navigator.userAgent + "<br />";
    return msg;
}
function windowInfo() {
    var br = "<br />";
    var msg = "window.innerHeight=" + window.innerHeight + br +
        "window.innerWidth=" + window.innerWidth + br +
        "window.scrollX=" + window.scrollX + br + // Horizontal scrolling
        "window.scrollY=" + window.scrollY + br + // Vertical scrolling
        "window.screen.availHeight= " + window.screen.availHeight + br +
        "window.screen.availLeft= " + window.screen.availLeft + br +
        "window.screen.availTop= " + window.screen.availTop + br +
        "window.screen.availWidth= " + window.screen.availWidth + br +
        "window.screen.colorDepth= " + window.screen.colorDepth + br +
        "window.screen.height= " + window.screen.height + br +
        "window.screen.pixelDepth= " + window.screen.pixelDepth + br +
        "window.screen.width= " + window.screen.width;
    return msg;
}
