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

function testjsons() {
    let a = {};
    let b = {
        "ace3:3": {
            where: "OID=1"
        }
    };
    document.getElementById('msgbox').innerHTML += 'a={}; b={"ace3:3":{where:"OID=1"}}; <br>';
    document.getElementById('msgbox').innerHTML += 'Is a blank json? ' + (a === {}) + '<br>';
    document.getElementById('msgbox').innerHTML += 'Is a obj entries length zero? ' + (Object.entries(a).length === 0) + '<br>';
    document.getElementById('msgbox').innerHTML += 'Is a empty json string? ' + (JSON.stringify(a) === JSON.stringify({})) + '<br>';
    document.getElementById('msgbox').innerHTML += 'Is b blank json? ' + (b === {}) + '<br>';
    delete b['ace3:3'];
    document.getElementById('msgbox').innerHTML += 'Is b empty after delete? ' + (Object.entries(b).length === 0) + '<br>';
}

function jtests() {
    console.log('jtests to test HTML/CSS/JS code');
    //$('msgdiv').innerHTML = nup().toString();
    //testOfLoop();//FAIL-IE
    //testjsons();
}
