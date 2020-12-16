var fs = require('fs');

var_rules_set = {};
function ingestRules(filename) {
    var input_chunks = fs.readFileSync(filename).toString().split("\n\n");
    var rules_chunks = input_chunks[0].split("\n");
    console.log(JSON.stringify(rules_chunks));

    for (rule_string of rules_chunks) {
        rule_tokens = rule_string.split(" ");
        var rule_name = rule_tokens[0].replace(":","");
        var rule_bounds = [
            rule_tokens[1].split("-").map(number => parseInt(number)),
            rule_tokens[3].split("-").map(number => parseInt(number))
        ];
        var_rules_set[rule_name] = rule_bounds;
    }
    console.log(JSON.stringify(var_rules_set));
}

var nearby_tix_set = [];
function ingestNearbyTix(filename) {
    var input_chunks = fs.readFileSync(filename).toString().split("\n\n");
    var tix_chunks = input_chunks[2].split("\n");
    tix_chunks.shift(); // dispose of first line
    for (tix_chunk of tix_chunks) {
        nearby_tix_set.push(tix_chunk.split(",").map(x => parseInt(x)));
    }
}

function sumBadFields() {
    var sum = 0;
    for (nearby_ticket of nearby_tix_set) {
        field_loop:
        for (field of nearby_ticket) {
            for (rule_key of Object.keys(var_rules_set)) {
                if ((var_rules_set[rule_key][0][0] <= field && field <= var_rules_set[rule_key][0][1])) { continue field_loop;}
                if ((var_rules_set[rule_key][1][0] <= field && field <= var_rules_set[rule_key][1][1])) { continue field_loop;}
            }
            console.log(`-->${field}`);
            sum += field;
        }
    }
    console.log(`sum: ${sum}`)
}

// var filename = "example_input.txt";
var filename = "actual_input.txt";
ingestRules(filename);
ingestNearbyTix(filename);
sumBadFields();