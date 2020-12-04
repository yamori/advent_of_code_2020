var fs = require('fs');

function ingestRawPassportFeed() {
    var file_array = fs.readFileSync('raw_passports.txt').toString().split("\n\n");
    var passportObjectArray = [];
    for (raw_data_line of file_array) {
        var single_line_raw = raw_data_line.replace(/(\r\n|\n|\r)/gm, " ");
        
        var passportObject = {};
        for (field_tokens of single_line_raw.split(" ")) {
            data_tokens = field_tokens.split(":");
            passportObject[data_tokens[0]] = data_tokens[1];
        }
        console.log(passportObject);
        passportObjectArray.push(passportObject);
    }
    return passportObjectArray;
}

passportObjectArray = ingestRawPassportFeed();

var validCount = 0;
for (psptObj of passportObjectArray) {
    if ('byr' in psptObj && 'iyr' in psptObj && 'eyr' in psptObj && 'hgt' in psptObj && 
    'hcl' in psptObj && 'ecl' in psptObj && 'pid' in psptObj) { validCount++; }
}
console.log(`Valid Passport Count: ${validCount}`);

// node problem1.js