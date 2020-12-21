var fs = require('fs');

var RULES_TREE = {};
// three types of node: series, option, letter
var N_TYPE_LTR = "LETTER"; var N_TYPE_OPT = "OPTION"; var N_TYPE_SER = "SERIES";

function createRulesTree(filename) {
    var rule_lines_arr = fs.readFileSync(filename).toString().split("\n");
    for (rule_line of rule_lines_arr) {
        rule_tokens = rule_line.split(" ");
        var rule_number = parseInt( rule_tokens.shift().replace(":","") );
        if (rule_tokens[0].indexOf("a")>0 | rule_tokens[0].indexOf("b")>0) {
            // letter
            RULES_TREE[rule_number] = {"type": N_TYPE_LTR, letter:rule_tokens[0].replace(/"/g,'')};
        } else if (rule_tokens.indexOf("|")>0) {
            var pipe_index = rule_tokens.indexOf("|");
            var left_path = rule_tokens.slice(0,pipe_index);
            var right_path = rule_tokens.slice(pipe_index+1, rule_tokens.length);
            RULES_TREE[rule_number] = {"type": N_TYPE_OPT, left_path: left_path, right_path: right_path};
        } else {
            RULES_TREE[rule_number] = {"type": N_TYPE_SER, series: rule_tokens};
        }
    }
}

// this function lifted from https://stackoverflow.com/a/57015870/1463784
const combine = ([head, ...[headTail, ...tailTail]]) => {
    console.log("combining....");
    if (!headTail) return head
    const combined = headTail.reduce((acc, x) => {
        return acc.concat(head.map(h => `${h}${x}`))
    }, [])
    return combine([combined, ...tailTail])
}

function recurseBuildAllCombos(rule_number) {
    console.log(`rule_number: ${rule_number}`);

    if (RULES_TREE[rule_number].type==N_TYPE_SER) {
        var string = "";
        var series_array = [];
        for (next_rule of RULES_TREE[rule_number].series) {
            series_array.push(recurseBuildAllCombos(next_rule));
        }
        // console.log(JSON.stringify(series_array));
        
        var combined = combine(series_array);
        // console.log(JSON.stringify(combined));
        return combined;
    } else if (RULES_TREE[rule_number].type==N_TYPE_OPT) {
        // recurseBuildAllCombos returns an array, this block must build array then return
        var left_paths = [];
        for (left_path_rule of RULES_TREE[rule_number].left_path) {
            left_paths.push(recurseBuildAllCombos(left_path_rule));
        }
        var right_paths = [];
        for (right_path_rule of RULES_TREE[rule_number].right_path) {
            right_paths.push(recurseBuildAllCombos(right_path_rule));
        }
        return [].concat(combine(left_paths)).concat(combine(right_paths));
    } else {
        return [RULES_TREE[rule_number].letter];
    }
}

function readThenQualifyInputs(filename, all_combos) {
    var input_lines_arr = fs.readFileSync(filename).toString().split("\n");
    var count = 0;
    for (input_line of input_lines_arr) {
        console.log(input_line);
        if (all_combos.indexOf(input_line)>0) { count++; }
    }
    console.log(`count: ${count}`);
}

// createRulesTree("example_rules.txt");
createRulesTree("actual_rules.txt");
console.log(JSON.stringify(RULES_TREE));

var all_combos = recurseBuildAllCombos(0); // very large

readThenQualifyInputs("actual_inputs.txt",all_combos);

// 50mb+, TODO haven't read it back in yet
fs.writeFile('all_combos.json', JSON.stringify(all_combos), function(err, result) {
    if(err) console.log('error', err);
});

// node problem1.js  // yields 126
// Takes 7+mins to run, all_combos is written to file for quicker matching but I not
// implemeted yet is the load... 
