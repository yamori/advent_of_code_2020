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
        if (!summing_pair_found) { return {'bad_number': candidate_number, 'bad_number_index': n}; }
    }
}

function findContiguousSummingSet(bad_item) {
    var target_value = bad_item.bad_number;
    var max_index = bad_item.bad_number_index;
    // traveling frame iteration...
    for (var x=0; x<max_index-1; x++) {
        for (var y=x+1; y<max_index; y++) {
            var candidate_summing_set = xmas_stream_int_array.slice(x,y+1);
            if (candidate_summing_set.reduce((a, b) => a + b, 0) == target_value) {
                console.log(`Summing Set Found:\n${JSON.stringify(candidate_summing_set)}`);
                console.log(`Max: ${Math.max(...candidate_summing_set)}`);
                console.log(`Min: ${Math.min(...candidate_summing_set)}`);
                console.log(`Sum: ${Math.max(...candidate_summing_set)+Math.min(...candidate_summing_set)}`);
                return candidate_summing_set;
            }
        }
    }
}

ingestXmasStream("xmas_stream.txt");
//console.log(JSON.stringify(xmas_stream_int_array));
var bad_item = detectFirstBadNumber();
console.log(JSON.stringify(bad_item));

var summing_set = findContiguousSummingSet(bad_item);

// node problem2.js