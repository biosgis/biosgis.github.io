// https://www.w3schools.com/html/html5_webworkers.asp
// https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webworker
// demo_workers.js
var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    if (i < 1235) {
        setTimeout("timedCount()", 1000);
    }
}

timedCount();

onmessage = function (e) {
    // the passed-in data is available via e.data
    i = e.data;
};