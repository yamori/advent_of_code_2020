var fs = require('fs');

var adapter_list_int_array = [];
function ingestAdapterListAndSort(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (number_string of file_array) { adapter_list_int_array.push(parseInt(number_string)); }
    adapter_list_int_array.pop(-1); // remove last line
    adapter_list_int_array.sort(function(a, b){return a - b});
}

function countJoltJumps() {
    var jump_counter = []; jump_counter[1]=0;jump_counter[2]=0;jump_counter[3]=0;
    var jolt_level = 0;
    for (var index = 0; index < adapter_list_int_array.length; index++) {
        var next_adapter = adapter_list_int_array[index];
        jump_counter[next_adapter - jolt_level]++;
        jolt_level = next_adapter;
    }
    jump_counter[3]++; // for final jump to +3 past highest adapter
    return jump_counter;
}

ingestAdapterListAndSort("adapter_list.txt");
// ingestAdapterListAndSort("x.txt");
console.log(JSON.stringify(adapter_list_int_array));

var jump_counter = countJoltJumps();
console.log(JSON.stringify(jump_counter));
console.log(`1 jumps x 3 jumps: ${jump_counter[1]*jump_counter[3]}`);