var fs = require('fs');

var adapter_list_int_array = [];
function ingestAdapterListAndSort(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (number_string of file_array) { adapter_list_int_array.push(parseInt(number_string)); }
    adapter_list_int_array.pop(-1); // remove last line
    adapter_list_int_array.sort(function(a, b){return a - b});
}



// This funciton works for small sets, but not full set.  REcursion stack was too big
function recurseAdapterPaths2(current_joltage, path) {
    // console.log(`currentJolt: ${current_joltage}`);
    for (var jolt_jump = 1; jolt_jump<4; jolt_jump++) {
        // console.log(current_joltage+jolt_jump);
        var index_of_next_adapter = adapter_list_int_array.indexOf(current_joltage+jolt_jump);
        // console.log(`nextIndex: ${index_of_next_adapter}`);
        if (index_of_next_adapter == adapter_list_int_array.length-1) {
            valid_paths_counter++;
            //console.log(JSON.stringify(path));
            return;
        } else if (index_of_next_adapter > -1) {
            recurseAdapterPaths2(current_joltage+jolt_jump,path+","+adapter_list_int_array[index_of_next_adapter]);
        }
    }
}

var paths = [1,1,2,4,7,13];
var running_counter = 1;
function determinePaths2() {
    var contiguous_counter = 1;
    for (var index=1; index<adapter_list_int_array.length; index++) {
        if (adapter_list_int_array[index] - adapter_list_int_array[index-1] == 1) {
            contiguous_counter++;
        } else { 
            // console.log(`index:${index} counter:${contiguous_counter}`);
            running_counter = running_counter * paths[contiguous_counter-1];
            Math.pow(paths[contiguous_counter-1], contiguous_counter);
            console.log(paths[contiguous_counter-1]);
            contiguous_counter = 1; 
        } 
        if (index == adapter_list_int_array.length-1) {
            running_counter = running_counter * paths[contiguous_counter-1];
            // console.log(`index:${index} counter:${contiguous_counter}`);
            console.log(paths[contiguous_counter-1]);
        } 
    }
}

ingestAdapterListAndSort("adapter_list.txt");
// ingestAdapterListAndSort("y.txt");
// ingestAdapterListAndSort("x.txt");
console.log(JSON.stringify(adapter_list_int_array));

// var jump_counter = countJoltJumps();
// console.log(JSON.stringify(jump_counter));
// console.log(`1 jumps x 3 jumps: ${jump_counter[1]*jump_counter[3]}`);

// recurseAdapterPaths2(0,"");
// console.log(valid_paths_counter);

determinePaths2();

