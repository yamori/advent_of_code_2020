var fs = require('fs');

var RAW_TILES = {}
const ingestTiles = filename => {
    RAW_TILES = {};
    var raw_tiles_arr = fs.readFileSync(filename).toString().split("\n\n").map((x) => x.split("\n"));
    for (raw_tile of raw_tiles_arr) {
        var tile_number = parseInt(raw_tile.shift().replace(":","").replace("Tile ",""));
        RAW_TILES[tile_number] = raw_tile.map((x) => x.split(""));
    }
}

var EDGE_COUNTS = {};
var TILE_EDGES = {};
function countUniqueEdges() {
    EDGE_COUNTS = {};
    for (key of Object.keys(RAW_TILES)) {
        var top = RAW_TILES[key][0].join("");
        var bottom = RAW_TILES[key][9].join("");
        var left = ""; var right = "";
        var x = 0;
        while (x<10) {
            left += RAW_TILES[key][x][0];
            right += RAW_TILES[key][x][9];
            x++;
        }
        TILE_EDGES[key] = [top,bottom,left,right];
        // console.log(JSON.stringify(RAW_TILES[key].map((x) => x.join(""))));
        // console.log(`${top} ${bottom} ${left} ${right}`);

        for (edge of [top,bottom,left,right]) {
            if (edge in EDGE_COUNTS) { EDGE_COUNTS[edge]++; continue; } 
            var rev_edge = edge.split("").reverse().join("");
            if (rev_edge in EDGE_COUNTS) { EDGE_COUNTS[rev_edge]++; continue; }
            EDGE_COUNTS[edge] = 1;
        }
    }
    console.log(JSON.stringify(EDGE_COUNTS));
    console.log(`uniq edges: ${Object.keys(EDGE_COUNTS).length}`);

    var counts = {};
    for (key of Object.keys(EDGE_COUNTS)) {
        if (EDGE_COUNTS[key] in counts) {
            counts[EDGE_COUNTS[key]]++;
        } else {
            counts[EDGE_COUNTS[key]] = 1;
        }
    }
    console.log(`edge use freq: ${JSON.stringify(counts)}`);
}

function findCorners() {
    var corner_boxes = [];
    for (key of Object.keys(TILE_EDGES)) {
        var edge_metric = 0;
        for (edge of TILE_EDGES[key]) {
            if (edge in EDGE_COUNTS) { edge_metric += EDGE_COUNTS[edge]; continue; }
            var rev_edge = edge.split("").reverse().join("");
            if (rev_edge in EDGE_COUNTS) { edge_metric += EDGE_COUNTS[rev_edge]; continue; }
        }
        if (edge_metric==6) {console.log(`box_number: ${key}`); corner_boxes.push(key);}
    }
    return corner_boxes;
}

// ingestTiles("example_input.txt");
ingestTiles("actual_input.txt"); // 144 raw tiles
console.log(`RAW_TILES: ${Object.keys(RAW_TILES).length}`);

countUniqueEdges();
var corner_boxes = findCorners();
console.log(corner_boxes.reduce( (a, b) => a * b ) );

// Thought process
/**
 * 144 => square?
 * tile width 10, 2^10 = 1024 possible unique edges
 * but with reversals, 2^5 = 32, too few
 * count unique edges of the set?
 * 312 unique (with flipping) edges
 *  48 used 1x, 264 used 2x, perfect 12x2
 */