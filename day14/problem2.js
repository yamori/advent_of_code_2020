var fs = require('fs');

var program_file = [];
function parseProgram(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (line of file_array) { program_file.push(line); }
}

function applyMask(memIndex,mask) {
    // do the mask in big-endian for easier indexing
    var mask_reversed_string = mask.split("").reverse().join(""); // reversed
    var memIndex_bin_reversed_string = memIndex.toString(2).split("").reverse().join(""); //bin reversed
    var final_value_reversed = "0".repeat(36).split("");
    for (var n=0; n<memIndex_bin_reversed_string.length; n++) {
        final_value_reversed[n] = memIndex_bin_reversed_string[n];
    }
    for (var n=0; n<mask_reversed_string.length; n++) {
        if (mask_reversed_string[n]=="0") {continue;}
        final_value_reversed[n] = mask_reversed_string[n];
    }
    // Mask rules now applied

    // revert back to little-endian
    var mask_with_fluctuations_arr = final_value_reversed.reverse();

    var indices_x = []; //collect where all the Xs (fluctuations) live
    for (var n=0; n<mask_with_fluctuations_arr.length; n++) {
        if (mask_with_fluctuations_arr[n]=="X") {indices_x.push(n);}
    }
    
    // number of fluctuations
    var fluctuations = Math.pow(2,indices_x.length);

    // iterate over all possible fluctuations
    var accumulated_addresses = [];
    for (var flux = 0; flux<fluctuations; flux++) {
        var mask_with_fluctuations_arr_copy = JSON.parse(JSON.stringify(mask_with_fluctuations_arr));

        var flux_bin_string = flux.toString(2); // get into binary
        while (flux_bin_string.length < indices_x.length) {flux_bin_string = "0" + flux_bin_string;} //forward pad to get correct length
        var flux_bin_array = flux_bin_string.split("");

        // for a given flux, fill in the corresponding floating bit
        for (var n=0; n<indices_x.length; n++) {
            mask_with_fluctuations_arr_copy[indices_x[n]] = flux_bin_array[n];
        }
        accumulated_addresses.push(mask_with_fluctuations_arr_copy.join("")); //mash it together, then add as an address
    }
    return accumulated_addresses; // note we don't convert back to dec, easier to do memory with an object map of strings
}

var memory_bank = {};
function executeProgram() {
    var mask = "";
    for (line of program_file) {
        if (line.indexOf("mask")>-1) {
            mask = line.split("=")[1].trim(); // mask
        } else if (line.indexOf("mem")>-1) {
            var tokens = line.split("=");
            var memIndex = parseInt(tokens[0].replace("mem[","").replace("]","").trim());
            var value = parseInt(tokens[1]);

            var addresses = applyMask(memIndex,mask);
            
            for (address of addresses) {
                memory_bank[address] = value; //address here is a string, not dec (would be too big)
            }
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

