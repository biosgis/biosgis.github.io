// test.js 20191102 dfgchiang 

function testOidstr() {
    // TEST OIDstring length of 1..500 takes 1893 varchar column space
    var ar = [];
    for (var i = 1; i < 2001; i++) {
        ar.push(i);
    }
    return ar;
}

function testOfLoop() {
    // TEST SHOWS FOR-OF-LOOP ITERATION OF HTML COLLECTION FAILS IN IE&EDGE
    for (var x of document.getElementsByClassName('closer')) {
        x.style.border = '1px solid pink';
    }
}

function jtests() {
    //$('msgdiv').innerHTML = nup().toString();
    //testOfLoop();//FAIL-IE            
}
