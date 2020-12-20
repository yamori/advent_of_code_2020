var fs = require('fs');

function ingestExpressions(filename) {
    var input_chunks = fs.readFileSync(filename).toString().split("\n").map((s) => s.replace(/ /g,''));
    return input_chunks;
}

function createDepthMap(line) {
    // matching array to line.length, with topology of parentheses
    var depth = 0;
    var line_depth_arr = [];
    for (var n=0; n<line.length; n++) {
        if (line[n]=="(") { line_depth_arr.push(++depth); }
         else if (line[n]==")") { line_depth_arr.push(depth--);}
        else { line_depth_arr.push(depth);  }
    }
    return line_depth_arr;
}

function evaluateLeftToRightOps(line) {
    // naive evaluation L to R, returns int
    line_tokens = line.split("+").join(" + ").split("*").join(" * ").split(" ");
    var value = parseInt(line_tokens[0]);
    for (var n=1; n<line_tokens.length; n++) {
        if (line_tokens[n]=="*") { value *= parseInt(line_tokens[n+1]); }
        else { value += parseInt(line_tokens[n+1]); } n++;
    }
    return value;
}

function evaluateLine(line) {
    var depth_arr = createDepthMap(line);

    while (Math.max(...depth_arr)>0) {
        console.log(` ${JSON.stringify(line)}`);
        console.log(`  ${depth_arr.join("")}`);
        var max_depth = Math.max(...depth_arr);
        var open_parens_index = depth_arr.findIndex(x => x==max_depth);
        var close_parens_index = line.indexOf(")",open_parens_index);
        var value = evaluateLeftToRightOps(line.substring(open_parens_index+1,close_parens_index));
        console.log(` ${line.substring(open_parens_index+1,close_parens_index)}`);
        console.log(` ${value}`);

        line = line.substring(0,open_parens_index) + value + line.substring(close_parens_index+1,line.length);
        depth_arr = createDepthMap(line);
    }
    var final_value = evaluateLeftToRightOps(line); // line should have no parens by this point
    console.log(`line_value: ${final_value}`);
    return final_value;
}

// var expressions = ingestExpressions("example_input.txt");
var expressions = ingestExpressions("actual_input.txt");
var sum = 0;
for (expression of expressions) {
    console.log(`\n ${expression}`);
    sum += evaluateLine(expression);
}
console.log(`\nfinal sum: ${sum}`);


// testing
// evaluateLeftToRightOps("1+20*3+4*5+60"); //395
// createDepthMap("5*9*(7*3*3+9*3+(8+6*4))");
// evaluateLine("5*9*(7*3*3+9*3+(8+6*4))"); //12240
// evaluateLine("((2+4*9)*(6+9*8+6)+6)+2+4*2"); //13632

// node problem1.js