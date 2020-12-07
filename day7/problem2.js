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

var totalBagsUnderParentBag = 0;
function recursiveCountFromBag(current_bag, path_count) {
    if (rule_tree[current_bag].length==0) { return; }
    for (sub_bag of rule_tree[current_bag]) {
        totalBagsUnderParentBag += sub_bag.number_of_bags*path_count;
        console.log(`bags count increase: ${sub_bag.number_of_bags*path_count} ${sub_bag.bag_reference}`);
        recursiveCountFromBag(sub_bag.bag_reference, sub_bag.number_of_bags*path_count); // recurse
    }
}

buildBagRuleTree();
recursiveCountFromBag("shiny gold bag", 1); // search only from node 'shiny gold'
console.log(`Total Bags under Shiny Gold: ${totalBagsUnderParentBag}`);

// node problem2.js