var fs = require('fs');

function ingestTreeMap() {
    var treeMapArray = [];
    var file_array = fs.readFileSync('tree_map.txt').toString().split("\n");
    for(row of file_array) { treeMapArray.push( row.split("") );}
    return treeMapArray;
}

function countTreesForTraversal(treeMapArray, x_slop, y_slop) {
    var mapWidth = treeMapArray[0].length;
    var x_pos = 0;
    var treeEncounterCount = 0;
    // ... let's ski
    for (var y_pos = y_slop; y_pos < treeMapArray.length;  y_pos+=y_slop ) {
        x_pos+=x_slop;
        if (treeMapArray[y_pos][x_pos % mapWidth] == "#") { treeEncounterCount++; }
    }
    console.log(`Trees encountered: ${treeEncounterCount}`);
    return treeEncounterCount;
}

var treeMapArray = ingestTreeMap();
var productResult = 1;
for (slope of [[1,1],[3,1],[5,1],[7,1],[1,2]]) {
    productResult *= countTreesForTraversal(treeMapArray, slope[0], slope[1]);
}
console.log(`Final product: ${productResult}`);

// node problem2.js