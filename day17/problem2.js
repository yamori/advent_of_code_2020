var fs = require('fs');

function initEmptyPocket(N) {
    var emptyPocket = [];
    for (var w = 0; w<N; w++) {
        emptyPocket[w] = [];
        for (var z = 0; z<N; z++) {
            emptyPocket[w][z] = [];
            for (var y = 0; y<N; y++) {
                emptyPocket[w][z][y] = ".".repeat(N);
            }
        }
    }   
    return emptyPocket; // size N^4
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function ingestInitState(filename) {
    var input_chunks = fs.readFileSync(filename).toString().split("\n");
    var N = input_chunks[0].length;
    var init_pocket = initEmptyPocket(N);
    var w = Math.floor(N/2);
    var z = Math.floor(N/2);
    for (y=0; y<N; y++) {
        for (x=0; x<N; x++) {
            init_pocket[w][z][y] = setCharAt(init_pocket[w][z][y],x,input_chunks[y][x]);
        }
    }
    return init_pocket;
}

function evaluateRules(pocket,oX,oY,oZ,oW) {
    var pocket_size = pocket.length;
    var active_counter = 0;
    for (w of [oW-1,oW,oW+1]) { for (z of [oZ-1,oZ,oZ+1]) { for (y of [oY-1,oY,oY+1]) { for (x of [oX-1,oX,oX+1]) {
        if (x==oX & y==oY & z==oZ & w==oW) {continue;} // ignore own cell
        if (x<0 | y<0 | z<0 | w<0 | x>=pocket_size | y>=pocket_size | z>=pocket_size | w>=pocket_size) { continue; }
        if (pocket[w][z][y][x]=="#") {active_counter++;}
    }}}}
    // evaluate
    var char_to_compare = "";
    if ( oX<0 | oY<0 | oZ<0 | oW<0 | oX>=pocket_size | oY>=pocket_size | oZ>=pocket_size  | oW>=pocket_size) {
        char_to_compare = ".";
    } else { char_to_compare = pocket[oW][oZ][oY][oX]; }

    if (char_to_compare=="#" && (active_counter==2 | active_counter==3)) { return "#"; }
    if (char_to_compare=="." && active_counter==3) { return "#"; }
    return ".";
}

function iteratePocket(current_pocket) {
    var newN = current_pocket.length + 2; // increase bounds by 2 (+1x, -1x, etc.)
    var new_pocket = initEmptyPocket(newN);
    for (w=0; w<newN; w++) { for (z=0; z<newN; z++) { for (y=0; y<newN; y++) { for (x=0; x<newN; x++) {
                newChar = evaluateRules(current_pocket,x-1,y-1,z-1,w-1); // map coords back to current_pocket
                new_pocket[w][z][y] = setCharAt(new_pocket[w][z][y],x,newChar);
    }}}}
    return new_pocket;
}

// not updated for 4D
// function printPocket(pocket) {
//     var N = pocket.length;
//     for (z=0; z<N; z++) { 
//         for (y=0; y<N; y++) { 
//             console.log(pocket[z][y]);
//         }
//         console.log("\n");
//     }
// }

function countActives(pocket) {
    var count = 0;
    var N = pocket.length;
    for (w=0; w<N; w++) { for (z=0; z<N; z++) { for (y=0; y<N; y++) { for (x=0; x<N; x++) { 
        if (pocket[w][z][y][x]=="#") {count++; }
    }}}}
    console.log(`count: ${count}`);
}

// var filename = "example_input.txt";
var filename = "actual_input.txt";
init_pocket = ingestInitState(filename);
console.log(JSON.stringify(init_pocket));
for (var n=0; n<6; n++) {
    console.log(n);
    var next_pocket = iteratePocket(init_pocket);
    init_pocket = next_pocket;
}
// printPocket(next_pocket); // not updated for 4D
countActives(next_pocket);