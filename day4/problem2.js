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
        passportObjectArray.push(passportObject);
    }
    return passportObjectArray;
}

function validatePassportObj(psptObj) {

    if ('byr' in psptObj && psptObj.byr.length==4 && 
    parseInt(psptObj.byr)>=1920 && parseInt(psptObj.byr)<=2002) {} else {
        return false;
    }

    if ('iyr' in psptObj && psptObj.iyr.length==4 && 
    parseInt(psptObj.iyr)>=2010 && parseInt(psptObj.iyr)<=2020) {} else {
        return false;
    }

    if ('eyr' in psptObj && psptObj.eyr.length==4 && 
    parseInt(psptObj.eyr)>=2020 && parseInt(psptObj.eyr)<=2030) {} else {
        return false;
    }

    var heightGood = false;
    if ('hgt' in psptObj && psptObj.hgt.includes('cm')) {
        var heightNumber = parseInt(psptObj.hgt.replace("cm",""));
        if (heightNumber>=150 && heightNumber<=193) { heightGood = true; }
    }
    if ('hgt' in psptObj && psptObj.hgt.includes('in')) {
        var heightNumber = parseInt(psptObj.hgt.replace("in",""));
        if (heightNumber>=59 && heightNumber<=76) { heightGood = true;  }
    }
    if (heightGood==false) {
        return false;
    }

    if ('hcl' in psptObj && psptObj.hcl.length==7 && 
    psptObj.hcl.match(/#([a-f0-9]{6})$/)) { } else {
        return false;
    }

    if ('ecl' in psptObj && ["amb","blu","brn","gry","grn","hzl","oth"].includes(psptObj.ecl)) {} else {
        return false;
    }

    if ('pid' in psptObj && psptObj.pid.length==9 && psptObj.pid.match(/([0-9]{9})$/)) {} else {
        return false;
    }

    return true;
}

passportObjectArray = ingestRawPassportFeed();


var validCount = 0;
for (psptObj of passportObjectArray) {
    if (validatePassportObj(psptObj)) {
        validCount++;
    }
}
console.log(`Valid Passport Count: ${validCount} of total ${passportObjectArray.length}`);

// node problem2.js