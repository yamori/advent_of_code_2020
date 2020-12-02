var fs = require('fs');

var numbersArray = [];
var array = fs.readFileSync('input_data.txt').toString().split("\n");
for(i in array) {
    numbersArray.push(parseInt(array[i]));
}

var comboFound = false;
for (n of numbersArray) {
    for (m of numbersArray) {
        if (n+m==2020) { 
            console.log(`answer: ${n} x ${m} = ${n*m}`); comboFound = true; break; 
        }
    }
    if (comboFound==true) {break;}
}

// node problem1.js