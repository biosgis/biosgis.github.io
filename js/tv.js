// tv.js 20191104 dfgchiang
console.log('Loading tv');

function getsymbol(feature, tool) {
    addmsg('DO tv.getSymbol: ' + [feature.geometry.type, tool]);
    if (tool === undefined) {
        var linecolor = [0, 255, 255, 0.5];
    } else if (tool === 'gfilter') {
        var linecolor = [255, 255, 0, 0.5];
    } else if (tool === 'gselect') {
        linecolor = [255, 0, 255, 0.5];
    }
    if (feature.geometry.type.indexOf('line') > -1) {
        var symbol = {
            type: "simple-line",
            color: linecolor,
            width: 5
        }
    } else if (feature.geometry.type.indexOf('point') > -1) {
        var symbol = {
            type: "simple-marker",
            color: [255, 255, 255, 0.2],
            outline: {
                color: linecolor,
                width: 5
            }
        }
    } else if (feature.geometry.type.indexOf('polygon') > -1) {
        var symbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [255, 255, 255, 0.2],
            outline: {
                color: linecolor,
                width: 5
            }
        }
    } else { //if (feature.geometry.type === null || app.alayer.type.indexOf('Raster') >= 0 || activeLayer.url.indexOf('raster') > 0) 
        // POSSIBLE RASTER CELL 20180910
        var symbol = {
            type: "simple-marker",
            style: "square",
            size: "16px",
            color: [255, 255, 255, 0.2],
            outline: {
                color: [0, 255, 255, 1], //[255, 0, 255, 1],//
                width: 3
            }
        }
    }
    //pink(255, 192, 203) orange(255, 165, 0)
    return symbol;
}

console.log('Loaded tv');
