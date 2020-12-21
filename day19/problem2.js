var fs = require('fs');

var RULES_GRAPH = {};
// three types of node: series, option, letter
var N_TYPE_LTR = "LETTER"; var N_TYPE_OPT = "OPTION"; var N_TYPE_SER = "SERIES";

function createRulesTree(filename) {
    var rule_lines_arr = fs.readFileSync(filename).toString().split("\n");
    for (rule_line of rule_lines_arr) {
        rule_tokens = rule_line.split(" ");
        var rule_number = parseInt( rule_tokens.shift().replace(":","") );
        if (rule_tokens[0].indexOf("a")>0 | rule_tokens[0].indexOf("b")>0) {
            // letter
            RULES_GRAPH[rule_number] = {"type": N_TYPE_LTR, letter:rule_tokens[0].replace(/"/g,'')};
        } else if (rule_tokens.indexOf("|")>0) {
            var pipe_index = rule_tokens.indexOf("|");
            var left_path = rule_tokens.slice(0,pipe_index);
            var right_path = rule_tokens.slice(pipe_index+1, rule_tokens.length);
            RULES_GRAPH[rule_number] = {"type": N_TYPE_OPT, left_path: left_path, right_path: right_path};
        } else {
            RULES_GRAPH[rule_number] = {"type": N_TYPE_SER, series: rule_tokens};
        }
    }
}

function recurseBuildRegex(rule_number) {
    // ... having spent my career so far stackoverflowing all my regex, I shall now learn.
    // (x|y)    find any of the alternatives specified
    // n+       match any string that contains at least 1 n
    // n*       match any string that contains 0 or more n
    // n?       Matches any string that contains zero or one occurrences of n
    // n$ 	    Matches any string with n at the end of it
    // ^n 	    Matches any string with n at the beginning of it
    // n{X} 	Matches any string that contains a sequence of X n's
    // n{X,Y} 	Matches any string that contains a sequence of X to Y n's

    // will be of the form `^  $` to match start and end?
    // `|` will be used to join together nodes

    // new rule `8: 42 | 42 8` could translate to (42)(8){0,n} where n might have to be played with
    // new rule `11: 42 31 | 42 11 31` could translate to (42)(11)(31) etc., or (42){n}(31){n}|...{n-1}|...{1}, minimum 1

    // intercept special rules, 
    if (rule_number==8) { // param to be played with, see if matches change
        return `(${recurseBuildRegex(42)}){1,${nParam}}`;
    }
    if (rule_number==11) {
        var multiples = [];
        for (var n=1; n<nParam; n++) {
            multiples.push( `((${recurseBuildRegex(42)}){${n}}(${recurseBuildRegex(31)}){${n}})` );
        }
        return `(${multiples.join("|")})`;
    }

    if (RULES_GRAPH[rule_number].type==N_TYPE_SER) {
        var series_array = [];
        for (next_rule of RULES_GRAPH[rule_number].series) {
            series_array.push(recurseBuildRegex(next_rule));
        }
        var concat = `(${series_array.join(")(")})`;
        return concat;
    } else if (RULES_GRAPH[rule_number].type==N_TYPE_OPT) {
        var left_paths = [];
        for (left_path_rule of RULES_GRAPH[rule_number].left_path) {
            left_paths.push(recurseBuildRegex(left_path_rule));
        }
        var right_paths = [];
        for (right_path_rule of RULES_GRAPH[rule_number].right_path) {
            right_paths.push(recurseBuildRegex(right_path_rule));
        }
        return `((${left_paths.join(")(")})|(${right_paths.join(")(")}))`
    } else {
        return [RULES_GRAPH[rule_number].letter];
    }
}

function readThenQualifyInputs(filename, regex) {
    var input_lines_arr = fs.readFileSync(filename).toString().split("\n");
    var count = 0;
    for (input_line of input_lines_arr) {
        if (new RegExp(regex).test(input_line)) {count++;}
    }
    console.log(`count: ${count}`);
}

// createRulesTree("example2_rules.txt");
createRulesTree("actual_rules.txt");
console.log(JSON.stringify(RULES_GRAPH));

var regex = `^${recurseBuildRegex(0)}$`;
console.log(regex);

// readThenQualifyInputs("example2_inputs.txt",regex);
readThenQualifyInputs("actual_inputs.txt",regex);

// node problem2.js