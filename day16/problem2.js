var fs = require('fs');

var rules_set = {};
function ingestRules(filename) {
    var input_chunks = fs.readFileSync(filename).toString().split("\n\n");
    var rules_chunks = input_chunks[0].split("\n");

    for (rule_string of rules_chunks) {
        rule_tokens = rule_string.replace("departure ", "departure").replace("arrival ", "arrival").split(" "); // note spae fix
        var rule_name = rule_tokens[0].replace(":","");
        var rule_bounds = [
            rule_tokens[1].split("-").map(number => parseInt(number)),
            rule_tokens[3].split("-").map(number => parseInt(number))
        ];
        rules_set[rule_name] = rule_bounds;
    }
    console.log(JSON.stringify(rules_set));
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

var valid_tix_set = [];
function extractValidTix() {
    tix_loop:
    for (nearby_ticket of nearby_tix_set) {
        var ticket_validity = true; // assume true
        field_loop:
        for (field of nearby_ticket) {
            for (rule_key of Object.keys(rules_set)) {
                if ((rules_set[rule_key][0][0] <= field && field <= rules_set[rule_key][0][1])) { continue field_loop;}
                if ((rules_set[rule_key][1][0] <= field && field <= rules_set[rule_key][1][1])) { continue field_loop;}
            }
            continue tix_loop;
        }
        valid_tix_set.push(nearby_ticket);
    }
    console.log(`valid_tix_set.length:${valid_tix_set.length}`);
    console.log(`nearby_tix_set.length:${nearby_tix_set.length}`);
    // console.log(`valid_tix_set:${JSON.stringify(valid_tix_set)}`);
}

var field_valid_indices = {};
function determineValidIndicesForFields() {
    var combinations = 1;
    for (ruleName of Object.keys(rules_set)) {
        var valid_indices_for_rule = [];
        index_loop:
        for (var n=0; n<Object.keys(rules_set).length; n++) {
            for (valid_tik of valid_tix_set) {
                if ((rules_set[ruleName][0][0] <= valid_tik[n] && valid_tik[n] <= rules_set[ruleName][0][1]) || 
                (rules_set[ruleName][1][0] <= valid_tik[n] && valid_tik[n] <= rules_set[ruleName][1][1]) ) {

                } else {
                    continue index_loop;
                }
            }
            valid_indices_for_rule.push(n);
        }
        field_valid_indices[ruleName] = valid_indices_for_rule;
        combinations *= valid_indices_for_rule.length;
    }
    console.log(`field_valid_indices:${JSON.stringify(field_valid_indices)}`);
    console.log(combinations); //2 432 902 008 176 640 000
}

// var filename = "example2_input.txt";
var filename = "actual_input.txt";
ingestRules(filename);
ingestNearbyTix(filename);
extractValidTix();
determineValidIndicesForFields();