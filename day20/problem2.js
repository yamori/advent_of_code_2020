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

function findSituatedTilesByEdgeFreq(edge_freq_count) {
    collect_array = [];
    for (key of Object.keys(TILE_EDGES)) {
        var edge_metric = 0;
        for (edge of TILE_EDGES[key]) {
            if (edge in EDGE_COUNTS) { edge_metric += EDGE_COUNTS[edge]; continue; }
            var rev_edge = edge.split("").reverse().join("");
            if (rev_edge in EDGE_COUNTS) { edge_metric += EDGE_COUNTS[rev_edge]; continue; }
        }
        if (edge_metric==edge_freq_count) {console.log(`tile with edge freq-${edge_freq_count}: ${key}`); collect_array.push(key);}
    }
    return collect_array;
}

function rotateTileEdges90Deg(tile) {
    // where tile is from TILE_EDGES, of form [top,bottom,left,right]
    // rotation 90deg clockwise
    var new_top = tile[2].split("").reverse().join("");
    var new_btm = tile[3].split("").reverse().join("");
    var new_lft = tile[1];
    var new_rgt = tile[0];
    return [new_top,new_btm,new_lft,new_rgt];
}

function flipTileEdgesVertically(tile) {
    // where tile is from TILE_EDGES, of form [top,bottom,left,right]
    var new_top = tile[1];
    var new_btm = tile[0];
    var new_lft = tile[2].split("").reverse().join("");
    var new_rgt = tile[3].split("").reverse().join("");
    return [new_top,new_btm,new_lft,new_rgt];
}

function flipTileEdgesHorizontally(tile) {
    // where tile is from TILE_EDGES, of form [top,bottom,left,right]
    var new_top = tile[0].split("").reverse().join("");
    var new_btm = tile[1].split("").reverse().join("");
    var new_lft = tile[3];
    var new_rgt = tile[2];
    return [new_top,new_btm,new_lft,new_rgt];
}

var TRANSFORM_SEQ = "0rvhvhrvhvhrvhvhrvhvh"; // full cycle
function transformTile(tile_edge, transform_index) {
    switch(TRANSFORM_SEQ[transform_index]) {
        case "0":
            return tile_edge;
        case "r":
            return rotateTileEdges90Deg(tile_edge);
        case "v":
            return flipTileEdgesVertically(tile_edge);
        case "h":
            return flipTileEdgesHorizontally(tile_edge);
        default:
            console.error("Incorrect params to transformTile()");
    }
}

function findEdgeCount(edge_string) {
    if (edge_string in EDGE_COUNTS) { return EDGE_COUNTS[edge_string]; }
    var reverse_edge_string = edge_string.split("").reverse().join("");
    if (reverse_edge_string in EDGE_COUNTS) { return EDGE_COUNTS[reverse_edge_string]; }
    console.error("Invalid Edge given to findEdgeCount()"); return null;
}

var PLACEMENT_STRUCT = {}; // will contain tile number, and rotation operation
function placeCornerTiles() {
    // First corner tile, doesn't matter which one, but rotate to get in upper left
    var UL_tile_number = CORNER_TILES.shift();
    var transform_index = 0;
    while ((findEdgeCount(TILE_EDGES[UL_tile_number][0]) + findEdgeCount(TILE_EDGES[UL_tile_number][2])) != 2) {
        transform_index++;
        TILE_EDGES[UL_tile_number] = transformTile(TILE_EDGES[UL_tile_number],transform_index);
    }
    console.log(transform_index); 
    PLACEMENT_STRUCT["1x1"] = {tile_number: UL_tile_number, transform_index: transform_index, tile_edges_oriented: TILE_EDGES[UL_tile_number]};


    outer:
    for (key of EDGE_TILES) { // Iterate over all EDGE_TILES
        for (var transform_index = 1; transform_index<TRANSFORM_SEQ.length; transform_index++) { // iterate through the TRANSFORM_SEQ
            if (TILE_EDGES[key][2]==PLACEMENT_STRUCT["1x1"].tile_edges_oriented[3]) {
                // match is found: place into PLACEMENT_STRUCT and reove from EDGE_TILES
                PLACEMENT_STRUCT["1x2"] = {tile_number: key, transform_index: transform_index, tile_edges_oriented: TILE_EDGES[key]};
                EDGE_TILES.splice(EDGE_TILES.indexOf(key),1);
                break outer;
            }
            TILE_EDGES[key] = transformTile(TILE_EDGES[key], transform_index);
        }
    }
    // for (var n=2; n<=11; n++) {
    //     // iterate over top row
    // }

    // (for loop these two)
    // across, lay down 10 tiles from EDGE_TILES, append 1 from CORNER_TILES
    // down, lay down 10 tiles from EDGE_TILES, append 1 from CORNER_TILES

    // place last CORNER_TILES into BR
    // across bottom, lay down 10 tiles from EDGE_TILES, verify it matches at end
    // down right, lay down 10 tiles from EDGE_TILES, verify it maches at end

    // INTERIOR

}

// ingestTiles("example_input.txt");
ingestTiles("actual_input.txt"); // 144 raw tiles
console.log(`RAW_TILES: ${Object.keys(RAW_TILES).length}`);

countUniqueEdges(); // TILE_EDGES[tile_nmbr] = [top,bottom,left,right];
var CORNER_TILES = findSituatedTilesByEdgeFreq(6);
var EDGE_TILES = findSituatedTilesByEdgeFreq(7);
var INTERIOR_TILES = Object.keys(TILE_EDGES).filter(function(x) { return CORNER_TILES.indexOf(x) < 0 }).filter(function(x) { return EDGE_TILES.indexOf(x) < 0 });

placeCornerTiles();
//hoorah, first tile laid down
console.log(JSON.stringify(PLACEMENT_STRUCT));

// findEdgeCount("c");


// node problem2.js

// Thought process
/**
 * x identify corner_tiles (4)
 * x identify edge_tiles (40)
 * x create set of all interior_tiles
 * 
 * transforms and permutations
 * -- define function for rotate, flip
 * -- be able to permute through all
 * -- rvhvh rvhvh rvhvh rvhvh <-- should cycle through all permutations of rot,vert,hor
 * 
 * align
 * --keep track of operations once settled
 * --find corners, special case where 1-edge are outwards
 * --find border tiles
 */

 // Testing
 // console.log(JSON.stringify(rotateTileEdges90Deg(["xxo","xoo","xox","oxo"])));
//  console.log(JSON.stringify(flipTileEdgesHorizontally(["xxo","xoo","xox","oxo"])));
// console.log(JSON.stringify(rotateTileEdges90Deg(["xxo","xoo","xox","oxo"])));
// console.log(JSON.stringify(transformTile(["xxo","xoo","xox","oxo"],1)));