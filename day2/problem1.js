var fs = require('fs');

function evaluatePwdDataLine(rawLine) {
    var tokens = rawLine.split(" ");

    var bounds_tokens = tokens[0].split("-");
    var lowerBound = parseInt(bounds_tokens[0]);
    var upperBound = parseInt(bounds_tokens[1]);

    var restrictedChar = tokens[1].replace(":","");
    var charOccurences = (tokens[2].match(new RegExp(restrictedChar, "g")) || []).length;

    return(lowerBound <= charOccurences && charOccurences <= upperBound);
}

var validCount = 0;
var array = fs.readFileSync('password_data.txt').toString().split("\n");
for(item of array) {
    if (evaluatePwdDataLine(item)) {validCount++; console.log(item);}
}
console.log(`Number valid: ${validCount}`);

// node problem1.js