var fs = require('fs');

var xmas_stream_int_array = [];
function ingestXmasStream(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (number_string of file_array) {
        xmas_stream_int_array.push(parseInt(number_string));
    }
}

function detectFirstBadNumber() {
    for (n=25; n<xmas_stream_int_array.length;n++) {
        var candidate_number = xmas_stream_int_array[n];
        var preamble_arr = xmas_stream_int_array.slice(n-25,n);
        var summing_pair_found = false;
        for (var x=0; x<25; x++) {
            for (var y=0; y<25; y++) {
                if (x==y) {continue;} //xmas encryption doesn't use same preamble number
                if ((preamble_arr[x]+preamble_arr[y])==candidate_number) {summing_pair_found = true;} 
            }
        }
        if (!summing_pair_found) { console.log(`Bad stream item ${candidate_number} at index ${n}`);}
    }
}

ingestXmasStream("xmas_stream.txt");
//console.log(JSON.stringify(xmas_stream_int_array));
detectFirstBadNumber();

// node problem1.js