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

var ship_position = {'x':0,'y':0};
function findFinalCoordinate() {
    for (nav_instruction of nav_instructions_array) {
        if (nav_instruction[0]=="F") {
            console.log(`heading: ${heading_index}`);
            ship_position.x += heading_map[heading_index][0]*nav_instruction[1];
            ship_position.y += heading_map[heading_index][1]*nav_instruction[1];
        }
        if (nav_instruction[0]=="N") { ship_position.y += nav_instruction[1]; }
        if (nav_instruction[0]=="S") { ship_position.y -= nav_instruction[1]; }
        if (nav_instruction[0]=="E") { ship_position.x += nav_instruction[1]; }
        if (nav_instruction[0]=="W") { ship_position.x -= nav_instruction[1]; }
        if (nav_instruction[0]=="R") { 
            heading_index = (heading_index + nav_instruction[1]/90 + 4) % (heading_map.length); 
            console.log(`R ${nav_instruction[1]} ${nav_instruction[1]/90} ${heading_index}`);
        }
        if (nav_instruction[0]=="L") { 
            heading_index = ((heading_index - nav_instruction[1]/90) + 4) % (heading_map.length); 
            console.log(`L ${nav_instruction[1]} ${nav_instruction[1]/90} ${heading_index}`);
        }
    }
}

// ingestNavInstructions("example.txt");
ingestNavInstructions("real_input.txt");
console.log(JSON.stringify(nav_instructions_array));
findFinalCoordinate();
console.log(JSON.stringify(ship_position));

// node problem1.js