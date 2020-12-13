var fs = require('fs');
const { parse } = require('path');

var earliest_departure = -1;
var bus_ID_array = [];
function ingestBusIds(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    earliest_departure = parseInt(file_array[0]);
    for (item of file_array[1].split(",")) {
        if (item=="x") {continue;}
        bus_ID_array.push(parseInt(item));
    }
}

function findBusIDAndWait() {
    var lowest_wait_time = earliest_departure; //large
    var best_bus_id = -1;
    for (bus_id of bus_ID_array) {
        var calculated_wait = (bus_id-(earliest_departure%bus_id));
        console.log(`calculated_wait: ${calculated_wait}`);
        if ( calculated_wait < lowest_wait_time) {lowest_wait_time = calculated_wait; best_bus_id = bus_id; }; 
    }
    console.log(`best_bus_id:${best_bus_id}  lowest_wait_time:${lowest_wait_time}  product:${best_bus_id*lowest_wait_time}`);
}

// ingestBusIds("example_input.txt");
ingestBusIds("actual_input.txt");
console.log(`earliest_departure: ${earliest_departure}`);
console.log(`bus_ID_array: ${JSON.stringify(bus_ID_array)}`);

findBusIDAndWait();