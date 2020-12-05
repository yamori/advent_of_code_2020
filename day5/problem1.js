var fs = require('fs');

function interpretBoardingCode(rawString) {
    rawString = rawString.replace(/B/g,"1").replace(/R/g,"1").replace(/F/g,"0").replace(/L/g,"0");
    var row = parseInt(rawString.substring(0,7),2);
    var column = parseInt(rawString.substring(7,10),2);
    var seatID = row*8 + column;
    return seatID;
}

var maxSeatID = 0;
var file_array = fs.readFileSync('boarding_pass_codes.txt').toString().split("\n");
for (raw_data_line of file_array) {
    var seatID = interpretBoardingCode(raw_data_line);
    if (seatID > maxSeatID) { maxSeatID = seatID;}
}
console.log(`Max SeatID: ${maxSeatID}`);

// node problem1.js