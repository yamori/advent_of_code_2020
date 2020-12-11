var fs = require('fs');

var seating_array = [];
var seating_array_copy = []; // copy is essential
var ROWS = -1;
var COLS = -1;
function ingestAdapterListAndSort(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (seating_row of file_array) { seating_array.push( seating_row.split("")); }
    ROWS = seating_array.length; COLS = seating_array[0].length;
}

function printSeatMap() {
    for (seating_row of seating_array) {console.log(seating_row.join(''))};
    console.log("");
}

function stringifySeatMap() {
    var final_string = "";
    for (seating_row of seating_array) {final_string += seating_row.join('');};
    return final_string;
}

function detectFirstSeenSeatPerDirection(row_sign, col_sign, row_seat, col_seat) {
    var seeing_distance = 1;
    while (true) { //learning on these while-trues too much, but blah
        var row_pointer = row_seat + row_sign*seeing_distance;
        var col_pointer = col_seat + col_sign*seeing_distance;
        if (row_pointer>=ROWS || col_pointer>=COLS || row_pointer<0 || col_pointer<0) {break;} 

        if (seating_array_copy[row_pointer][col_pointer]=="#") { return "#"; }
        if (seating_array_copy[row_pointer][col_pointer]=="L") { return "L"; }

        seeing_distance++;
    }
    return "."; // default
}

function iterateSeatMap() {
    // Based on prescribed rules
    seating_array_copy = JSON.parse(JSON.stringify(seating_array));
    for (var r = 0; r<ROWS; r++) {
        for (var c = 0; c<COLS; c++) {
            if (seating_array_copy[r][c]=='.') { continue; }

            var adjacent_filled_seats = 0;
            //left
            if (detectFirstSeenSeatPerDirection(0, -1, r, c)=="#")  { adjacent_filled_seats++; }    //left
            if (detectFirstSeenSeatPerDirection(0, 1, r, c)=="#")  { adjacent_filled_seats++; }     //right
            if (detectFirstSeenSeatPerDirection(1, 0, r, c)=="#")  { adjacent_filled_seats++; }     //down
            if (detectFirstSeenSeatPerDirection(-1, 0, r, c)=="#")  { adjacent_filled_seats++; }    //up
            if (detectFirstSeenSeatPerDirection(-1, -1, r, c)=="#")  { adjacent_filled_seats++; }   //upleft
            if (detectFirstSeenSeatPerDirection(-1, 1, r, c)=="#")  { adjacent_filled_seats++; }    //upright
            if (detectFirstSeenSeatPerDirection(1, -1, r, c)=="#")  { adjacent_filled_seats++; }    //downleft
            if (detectFirstSeenSeatPerDirection(1, 1, r, c)=="#")  { adjacent_filled_seats++; }     //downright

            if (seating_array_copy[r][c]=="L") {
                if(adjacent_filled_seats==0) {seating_array[r][c]="#"; continue;}
            } else if (seating_array_copy[r][c]=="#") {
                if(adjacent_filled_seats>=5) {seating_array[r][c]="L"; continue;}
            }
        }
    }
}

// trials
// ingestAdapterListAndSort("example_seating.txt");
// iterateSeatMap();printSeatMap();
// iterateSeatMap();printSeatMap();

ingestAdapterListAndSort("seating_map.txt");
var counter=0;
while (true) {
    var previousMap = stringifySeatMap();
    iterateSeatMap();
    var nextMap = stringifySeatMap();
    // printSeatMap();
    counter++;
    if (previousMap==nextMap) { console.log(nextMap.split("#").length-1); break; }
}
console.log(`loops: ${counter}`);
