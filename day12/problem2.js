var fs = require('fs');

var heading_map = [[0,1],[1,0],[0,-1],[-1,0]]; // NESWest
var heading_index = 1;
var nav_instructions_array = [];
function ingestNavInstructions(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (instruction of file_array) { 
        nav_instructions_array.push( [instruction.slice(0,1), parseInt(instruction.slice(1,instruction.length)) ]); 
    }
}

var wypt_position = {'x':10,'y':1}; // starts "10 units E and 1 unit N"
var ship_position = {'x':0,'y':0};

function rotateWyptPosition(letter, times) {
    if (letter=="R") {
        for (var n=0;n<times;n++) {
            var x = wypt_position.x; 
            var y = wypt_position.y;
            wypt_position.x = y;
            wypt_position.y = -1 * x;
        }
    }
    if (letter=="L") {
        for (var n=0;n<times;n++) {
            var x = wypt_position.x; 
            var y = wypt_position.y;
            wypt_position.x = -1 * y;
            wypt_position.y = x;
        }
    }
}

function findFinalCoordinate() {
    for (nav_instruction of nav_instructions_array) {
        if (nav_instruction[0]=="F") {
            ship_position.x += wypt_position.x * nav_instruction[1];
            ship_position.y += wypt_position.y * nav_instruction[1];
        }
        if (nav_instruction[0]=="N") { wypt_position.y += nav_instruction[1]; }
        if (nav_instruction[0]=="S") { wypt_position.y -= nav_instruction[1]; }
        if (nav_instruction[0]=="E") { wypt_position.x += nav_instruction[1]; }
        if (nav_instruction[0]=="W") { wypt_position.x -= nav_instruction[1]; }
        
        if (nav_instruction[0]=="R") { rotateWyptPosition("R", nav_instruction[1]/90); }
        if (nav_instruction[0]=="L") { rotateWyptPosition("L", nav_instruction[1]/90); }

        console.log(`instruction: ${nav_instruction.join('')}; new_wpt: ${JSON.stringify(wypt_position)} new_pos: ${JSON.stringify(ship_position)}`);
    }
}

// ingestNavInstructions("example.txt");
ingestNavInstructions("real_input.txt");
console.log(JSON.stringify(nav_instructions_array));

findFinalCoordinate();

console.log(JSON.stringify(ship_position));
console.log(Math.abs(ship_position.x)+Math.abs(ship_position.y));

//{"x":108067,"y":-28865} 136932 too high