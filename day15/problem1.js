var fs = require('fs');

var starter_sequence_arr = [];
function parseNumberSequence(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    starter_sequence_arr = file_array[0].split(",").map(val => parseInt(val));
}

function executeSequenceToTurn(last_turn) {
    // start the iteration
    var digits = {}; //keep track of what we've seen, add starters
    var full_sequence_arr = [];
    var previous_item = -1;
    var next_item = -1;
    for (var n = 0; n<last_turn; n++) {
        if (n<starter_sequence_arr.length) {
            next_item = starter_sequence_arr[n];
            if (n<(starter_sequence_arr.length-1)) {digits[next_item] = true;}
        } else if (!(full_sequence_arr[full_sequence_arr.length-1] in digits)) {
            digits[full_sequence_arr[full_sequence_arr.length-1]] = true;
            next_item = 0;
        } else { 
            // find previous occurence
            var target_val = full_sequence_arr[full_sequence_arr.length-1];
            for (var m=(full_sequence_arr.length-2); m>=0; m--) {
                if (full_sequence_arr[m]==target_val) {
                    // console.log(`lookback dist: ${full_sequence_arr.length-1-m}`);
                    next_item = full_sequence_arr.length-1-m;
                    break;
                }
            }
        }

        full_sequence_arr.push(next_item);
        // console.log(`digits: ${JSON.stringify(digits)}`);
        // console.log(`full_sequence_arr: ${JSON.stringify(full_sequence_arr)}`);

        if ((n%10000) == 0) {console.log(n);}
    }
    console.log(`full_sequence_arr: ${JSON.stringify(full_sequence_arr)}`);
}

// parseNumberSequence("example_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(10);

// parseNumberSequence("example2_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(2020);

// parseNumberSequence("actual_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(2020);

// parseNumberSequence("example2_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(30000000);

parseNumberSequence("actual_input.txt");
console.log(`${JSON.stringify(starter_sequence_arr)}`);
executeSequenceToTurn(30000000);
