var fs = require('fs');

var instruction_set = [];

function ingestInstructionSet() {
    var file_array = fs.readFileSync('instruction_set.txt').toString().split("\n");
    for (instruciton of file_array) { instruction_set.push(instruciton.split(" "));}
}

function accumulateToInfiniteLoop() {
    var system_value = 0;
    var ran_instruction_array = [];
    var next_instruction = 0;
    while(true) {
        if (ran_instruction_array.includes(next_instruction)) {
            console.log(`${JSON.stringify(ran_instruction_array)}`);
            console.log(`Repeated Instruction: ${next_instruction}`);
            console.log(`Final Value: ${system_value}`);
            break;
        }
        ran_instruction_array.push(next_instruction);

        var current_instruction = instruction_set[next_instruction];
        if (current_instruction[0]=="acc") {
            system_value += parseInt(current_instruction[1]);
            next_instruction++;
        } else if (current_instruction[0]=="jmp") {
            next_instruction += parseInt(current_instruction[1]);
        } else if (current_instruction[0]=="nop") {
            next_instruction++;
        }
    }
}

ingestInstructionSet();

accumulateToInfiniteLoop();

// node problem1.js