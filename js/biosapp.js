// biosap.js 20190927 dfgchiang
console.log('Loading biosapp.js');
let app = {
    id: "bios",
    al: "",
    bl: "",
    col: "",
    dslist: "",
    dsids: [],
    urlsearch: {}
};
const esriFieldTypesNumber = 'esriFieldTypeDouble,esriFieldTypeFloat,esriFieldTypeInteger,esriFieldTypeOID,esriFieldTypeSmallInteger';

function appstart() {
    // APP.START
    if (location.search.indexOf('al=') > 0) {
       var al = location.search.split('al=')[1].split('&')[0];
       if (al !== '') {
           var dsid = parseInt(al.toLowerCase().replace('biosds', '').replace('ds', ''));
           if (typeof dsid === 'number') {
               app.al = 'biosds' + al;
               $('al').value = app.al;
               // Load a BIOS layer
               app.dsid = dsid;
               $('dsid').value = dsid;
               // TODO: bios.addbiosds(dsid);
           }
       }
    }
    if (location.search.indexOf('dslist=') > 0) {
       var dslist = location.search.split('dslist=')[1].split('&')[0];
    } else if (location.search.indexOf('dsl=') > 0) {
       var dslist = location.search.split('dsl=')[1].split('&')[0];
    }
    if (dslist !== '') {
        if (dslist.indexOf('|') > 0) {
            var dsl = val.replace(/\|/g, ',');
        } else {
            var dsl = val;
        }
        app.dslist = dsl;
        $('dslist').value = dsl;
        if (dsl.indexOf(',') > 0) {
            let dsar = dsl.split(',');
            let dsids = [];
            for (let i = 0; i < dsar.length; i++) {
                var dsno = parseInt(dsar[i]);
                dsids.push(dsno);
            }
            app.dsids = dsids;
        } else {
            app.dsids = [parseInt(dsl)];
        }
        // TODO: bios.adddslist(dsl);
    }
}
app.start = appstart;
console.log('LOADED biosapp.js');
