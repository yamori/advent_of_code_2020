var fs = require('fs');

var rule_tree = {};
function buildBagRuleTree() {
    var file_array = fs.readFileSync('bag_rules.txt').toString().split("\n");
    for (rule of file_array) {
        rule = rule.replace(/bags/g,"bag").replace(".","");
        var first_tokens = rule.split("contain");
        var bag_node = first_tokens[0].trim();

        rule_tree[bag_node] = [];

        if (first_tokens[1].includes("no other bag")) { continue; }

        var node_references = [];
        var relations = first_tokens[1].trim().split(",");
        for (relation of relations) {
            var relation_tokens = relation.trim().split(" ");
            var number_of_bags = parseInt(relation_tokens.shift());
            var bag_reference = relation_tokens.join(" ");
            //console.log(`${number_of_bags} ${bag_reference}`);
            rule_tree[bag_node].push({'number_of_bags':number_of_bags, 'bag_reference':bag_reference});
        }
    }
}

var bags_eventually_to_shiny_gold = {};
function recursiveTraverseForShinyGoldBag(current_bag, current_path = [], found_bags_to_gold = []) {
    //console.log(current_path);
    for (var n=0; n<rule_tree[current_bag].length; n++) {
        if (rule_tree[current_bag][n].bag_reference.includes("shiny gold bag")) {
            console.log(`path 2 shiny gold: ${current_path} --> shiny gold`);
            for (bag_path_item of current_path) {bags_eventually_to_shiny_gold[bag_path_item] = true;}
            return;
        }
    }
    if (rule_tree[current_bag].length==0) { return; } 

    for (sub_bag of rule_tree[current_bag]) {
        var extended_path = JSON.parse(JSON.stringify(current_path)); extended_path.push(sub_bag.bag_reference);
        recursiveTraverseForShinyGoldBag(sub_bag.bag_reference, extended_path); // depth first recurse
    }
}

buildBagRuleTree();

// recursiveTraverseForShinyGoldBag("dark cyan bag", ["dark cyan bag"]); // immediate to shiny gold
// recursiveTraverseForShinyGoldBag("dull red bag", ["dull red bag"]); // one degree away
// recursiveTraverseForShinyGoldBag("dim red bag", ["dim red bag"]); // never reaches shiny gold

// Every bag can be the root node...
for (var beginning_bag in rule_tree) {
    recursiveTraverseForShinyGoldBag(beginning_bag, [beginning_bag]);
}

console.log(`Bags Eventaully Containing shiny gold: ${Object.entries(bags_eventually_to_shiny_gold).length}`);