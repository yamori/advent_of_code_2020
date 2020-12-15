var fs = require('fs');

var starter_sequence_arr = [];
function parseNumberSequence(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    starter_sequence_arr = file_array[0].split(",").map(val => parseInt(val));
}

function executeSequenceToTurn(last_turn) {

    // 3 1 2
    // var previous_seen = {3:2,1:1}; //object to keep track of previous references
    // var next_number = 2;
    // last_turn = 2020;

    // 1 3 2
    // var previous_seen = {1:2,3:1}; //object to keep track of previous references
    // var next_number = 2;
    // last_turn = 2020;

    // 0 3 6
    // var previous_seen = {0:2,3:1}; //object to keep track of previous references
    // var next_number = 6;

    // 0,3,6
    var previous_seen = {0:2,3:1}; //object to keep track of previous references
    var next_number = 6;
    last_turn = 30000000;

    for (var n=Object.keys(previous_seen).length+1; n<last_turn; n++) {
        if (!(next_number in previous_seen)) {
            previous_seen[next_number] = 0;
            next_number = 0;
            for (seen_number of Object.keys(previous_seen)) { previous_seen[seen_number]++; }
        } else {
            var tmp = next_number;
            next_number = previous_seen[next_number];
            previous_seen[tmp] = 0;
            for (seen_number of Object.keys(previous_seen)) { previous_seen[seen_number]++; }
        }
        // console.log(`previous_seen: ${JSON.stringify(previous_seen)}`);
        // console.log(`next_number: ${JSON.stringify(next_number)}`);
        if ((n%10000)==0) {console.log(n);}
        // console.log(n);
    }
    
    console.log(next_number);
    return next_number;
}

// parseNumberSequence("example_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
executeSequenceToTurn(10);

// parseNumberSequence("example2_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(2020);

// parseNumberSequence("actual_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(2020);

// parseNumberSequence("example2_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(30000000);

// parseNumberSequence("actual_input.txt");
// console.log(`${JSON.stringify(starter_sequence_arr)}`);
// executeSequenceToTurn(30000000);
