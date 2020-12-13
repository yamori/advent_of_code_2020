var fs = require('fs');
const { parse } = require('path');

var earliest_departure = -1;
var bus_ID_array = [];
function ingestBusIds(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    earliest_departure = parseInt(file_array[0]);
    for (const [i,v] of file_array[1].split(",").entries()) {
        if (v=="x") {continue;}
        bus_ID_array.push({'busID':parseInt(v),'time_offset':i});
    }
}

function findTimeForConsecutiveDepartures() {
    //bad approach
    // var candidate_timestamp = 0;
    // var increment = bus_ID_array[0].busID;
    // for (var n=1; n<bus_ID_array.length; n++) { //skip first bus
    //     while (true) {
    //         candidate_timestamp += increment;
    //         var mod = (candidate_timestamp) % bus_ID_array[n].busID;
    //         if (mod == bus_ID_array[n].time_offset) {break;}
    //     }
    //     increment *= bus_ID_array[n].busID;
    // }
    // console.log(candidate_timestamp);


    var candidate_timestamp = 0;
    var bus1 = bus_ID_array.shift();
    var increment = bus1.busID;
    for (bus of bus_ID_array) {
        var remainder = -1;
        do {
            candidate_timestamp = candidate_timestamp + increment
            remainder = (candidate_timestamp + bus.time_offset) % bus.busID
          } while (remainder !== 0)
          increment *= bus.busID
    }

    console.log(`h: ${candidate_timestamp}`)
}

// ingestBusIds("example_input.txt");
// ingestBusIds("example2_input.txt");
ingestBusIds("actual_input.txt");
console.log(`bus_ID_array: ${JSON.stringify(bus_ID_array)}`);

findTimeForConsecutiveDepartures();

// 103928495884, too low
// 576733777518291700 too high
