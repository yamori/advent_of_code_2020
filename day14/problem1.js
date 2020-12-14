var fs = require('fs');

var program_file = [];
function parseProgram(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (line of file_array) { program_file.push(line); }
}

function applyMask(value,mask) {
    var val_bin_reversed_string = value.toString(2).split("").reverse().join(""); //bin reversed
    var mask_reversed_string = mask.split("").reverse().join(""); // reversed
    var final_value_reversed = "0".repeat(36).split("");
    for (var n=0; n<val_bin_reversed_string.length; n++) {
        final_value_reversed[n] = val_bin_reversed_string[n];
    }
    for (var n=0; n<mask_reversed_string.length; n++) {
        if (mask_reversed_string[n]=="X") {continue;}
        final_value_reversed[n] = mask_reversed_string[n];
    }
    return parseInt(final_value_reversed.reverse().join(""),2); // reverse back, parse from base 2, return dec
}

var memory_bank = {};
function executeProgram() {
    for (line of program_file) {
        if (line.indexOf("mask")>-1) {
            var mask = line.split("=")[1].trim(); // mask
        } else if (line.indexOf("mem")>-1) {
            var tokens = line.split("=");
            var memIndex = parseInt(tokens[0].replace("mem[","").replace("]","").trim());
            var value = parseInt(tokens[1]);
            // console.log(`${memIndex} ${value}`);

            var value_after_mask = applyMask(value,mask);
            memory_bank[memIndex] = value_after_mask;
            // console.log(`  ${value_after_mask}`);
        }
    }

    // tot it up
    var sum = 0;
    for (key of Object.keys(memory_bank)) { sum += memory_bank[key]; }
    console.log(`program sum: ${sum}`);
}

// parseProgram("example_input.txt");
parseProgram("actual_input.txt");
executeProgram();

