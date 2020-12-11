const { count } = require('console');
var fs = require('fs');

var seating_array = [];
function ingestAdapterListAndSort(filename) {
    var file_array = fs.readFileSync(filename).toString().split("\n");
    for (seating_row of file_array) { seating_array.push( seating_row.split("")); }
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

function iterateSeatMap() {
    // Based on prescribed rules
    var ROWS = seating_array.length;
    var COLS = seating_array[0].length;
    var seating_array_copy = JSON.parse(JSON.stringify(seating_array));
    for (var r = 0; r<ROWS; r++) {
        for (var c = 0; c<COLS; c++) {
            if (seating_array_copy[r][c]=='.') { continue; }

            if (seating_array_copy[r][c]=="L") {
                var adjacent_filled_seats = 0;
                //left
                if (c-1>=0 && seating_array_copy[r][c-1]=="#") {adjacent_filled_seats++;}
                //right
                if (c+1<COLS && seating_array_copy[r][c+1]=="#") {adjacent_filled_seats++;}
                //down
                if (r+1<ROWS && seating_array_copy[r+1][c]=="#") {adjacent_filled_seats++;}
                //up
                if (r-1>=0 && seating_array_copy[r-1][c]=="#") {adjacent_filled_seats++;}
                //upleft
                if (r-1>=0 && c-1>=0 && seating_array_copy[r-1][c-1]=="#") {adjacent_filled_seats++;}
                //upright
                if (r-1>=0 && c+1<COLS && seating_array_copy[r-1][c+1]=="#") {adjacent_filled_seats++;}
                //downleft
                if (r+1<ROWS && c-1>=0 && seating_array_copy[r+1][c-1]=="#") {adjacent_filled_seats++;}
                //downright
                if (r+1<ROWS && c+1<COLS && seating_array_copy[r+1][c+1]=="#") {adjacent_filled_seats++;}

                if(adjacent_filled_seats==0) {seating_array[r][c]="#"; continue;}
            } else if (seating_array_copy[r][c]=="#") {
                var adjacent_filled_seats = 0;
                //left
                if (c-1>=0 && seating_array_copy[r][c-1]=="#") {adjacent_filled_seats++;}
                //right
                if (c+1<COLS && seating_array_copy[r][c+1]=="#") {adjacent_filled_seats++;}
                //down
                if (r+1<ROWS && seating_array_copy[r+1][c]=="#") {adjacent_filled_seats++;}
                //up
                if (r-1>=0 && seating_array_copy[r-1][c]=="#") {adjacent_filled_seats++;}
                //upleft
                if (r-1>=0 && c-1>=0 && seating_array_copy[r-1][c-1]=="#") {adjacent_filled_seats++;}
                //upright
                if (r-1>=0 && c+1<COLS && seating_array_copy[r-1][c+1]=="#") {adjacent_filled_seats++;}
                //downleft
                if (r+1<ROWS && c-1>=0 && seating_array_copy[r+1][c-1]=="#") {adjacent_filled_seats++;}
                //downright
                if (r+1<ROWS && c+1<COLS && seating_array_copy[r+1][c+1]=="#") {adjacent_filled_seats++;}
                // final
                if(adjacent_filled_seats>=4) {seating_array[r][c]="L"; continue;}
            }
        }
    }
}




// ingestAdapterListAndSort("example_seating.txt");
ingestAdapterListAndSort("seating_map.txt");
// printSeatMap();
// console.log(JSON.stringify(seating_array));

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
