var fs = require('fs');

var instruction_set = [];
function ingestInstructionSet() {
    var file_array = fs.readFileSync('instruction_set.txt').toString().split("\n");
    for (instruciton of file_array) { instruction_set.push(instruciton.split(" "));}
}

function interpretInstrutionSetNoLoops(instruction_set_modified) {
    var system_value = 0;
    var ran_instruction_array = [];
    var next_instruction = 0;
    while(true) {
        if (ran_instruction_array.includes(next_instruction)) {
            break;
        } else if (next_instruction==instruction_set_modified.length) {
            return system_value;
        }
        ran_instruction_array.push(next_instruction);

        var current_instruction = instruction_set_modified[next_instruction];
        if (current_instruction[0]=="acc") {
            system_value += parseInt(current_instruction[1]);
            next_instruction++;
        } else if (current_instruction[0]=="jmp") {
            next_instruction += parseInt(current_instruction[1]);
        } else if (current_instruction[0]=="nop") {
            next_instruction++;
        }
    }
    return null;
}

ingestInstructionSet();

for (var n = 0; n<instruction_set.length; n++) {
    var instruction_set_modified = JSON.parse(JSON.stringify(instruction_set));
    // Make the jmp-nop modification
    if (instruction_set_modified[n][0]=="jmp") {
        instruction_set_modified[n][0]="nop";
    } else if (instruction_set_modified[n][0]=="nop") {
        instruction_set_modified[n][0]="jmp";
    }
    var full_run_value = interpretInstrutionSetNoLoops(instruction_set_modified);
    if (full_run_value!=null) {
        console.log(`Changing instruction @ ${n}, yields system value ${full_run_value}`);
    }
}

// node problem2.js