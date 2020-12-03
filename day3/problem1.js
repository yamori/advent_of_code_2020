var fs = require('fs');

function ingestTreeMap() {
    var treeMapArray = [];
    var file_array = fs.readFileSync('tree_map.txt').toString().split("\n");
    for(row of file_array) { treeMapArray.push( row.split("") );}
    return treeMapArray;
}

function countTreesForTraversal(treeMapArray) {
    var mapWidth = treeMapArray[0].length;
    var x_pos = 0;
    var treeEncounterCount = 0;
    for (var y_pos = 1; y_pos < treeMapArray.length;  y_pos++ ) {
        x_pos+=3;
        if (treeMapArray[y_pos][x_pos % mapWidth] == "#") { treeEncounterCount++; }
    }
    console.log(`Trees encountered: ${treeEncounterCount}`);
}

var treeMapArray = ingestTreeMap();
countTreesForTraversal(treeMapArray);