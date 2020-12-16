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
    console.log("rules_bounds-->   " + JSON.stringify(rules_set) + "\n");
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
    console.log(`valid_tix_set.length: ${valid_tix_set.length} \n`);
}

var field_valid_indices = {};
function determineValidIndicesForFields() {
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
    }
    console.log(`field_valid_indices:${JSON.stringify(field_valid_indices)} \n`);
}

function findSingleKey(obj) {
    for (key of Object.keys(obj)) {
        if (obj[key].length==1) {return key;}
    }
    return -1;
}
function distillValidIndices() {
    var determined_field = findSingleKey(field_valid_indices);
    while (determined_field != -1) {
        var position_to_remove = field_valid_indices[determined_field][0];
        console.log(`${determined_field} is index ${position_to_remove}`);
        delete field_valid_indices[determined_field];
        for (key of Object.keys(field_valid_indices)) {
            var index = field_valid_indices[key].indexOf(position_to_remove);
            if (index>-1) {field_valid_indices[key].splice(index,1);}
        }
        determined_field = findSingleKey(field_valid_indices);
    }
}

// var filename = "example2_input.txt";
var filename = "actual_input.txt";
ingestRules(filename);
ingestNearbyTix(filename);
extractValidTix();
determineValidIndicesForFields();
distillValidIndices();