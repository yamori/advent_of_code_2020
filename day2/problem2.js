var fs = require('fs');

function evaluatePwdDataLine(rawLine) {
    var tokens = rawLine.split(" ");

    var index_tokens = tokens[0].split("-");
    var index1 = parseInt(index_tokens[0])-1;
    var index2 = parseInt(index_tokens[1])-1;

    var restrictedChar = tokens[1].replace(":","");

    return(Boolean(tokens[2][index1].localeCompare(restrictedChar)==0) ^ 
        (Boolean(tokens[2][index2].localeCompare(restrictedChar))==0));
}

var validCount = 0;
var array = fs.readFileSync('password_data.txt').toString().split("\n");
for(item of array) {
    if (evaluatePwdDataLine(item)) {validCount++; console.log(item);}
}
console.log(`Number valid: ${validCount}`);

// node problem2.js