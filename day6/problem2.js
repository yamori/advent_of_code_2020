var fs = require('fs');

function ingestRawDeclarationFeed() {
    var file_array = fs.readFileSync('group_responses.txt').toString().split("\n\n");
    var groupDeclarationAffirmatives = [];
    for (group_declaration_section of file_array) {
        var group_declaration_array = group_declaration_section.split("\n");
        groupDeclarationAffirmatives.push(group_declaration_array);
    }
    return groupDeclarationAffirmatives;
}

function countEveryoneQs(group_declaration_array) {
    console.log(JSON.stringify(group_declaration_array));
    var questionCounter = {};
    for (declaration_line of group_declaration_array) {
        console.log(declaration_line);
        for (var n = 0; n<declaration_line.length; n++) {
            (declaration_line[n] in questionCounter) ? questionCounter[declaration_line[n]]++ : 
                questionCounter[declaration_line[n]] = 1;
        }
    }

    var everyoneAnswered = 0;
    for (questionChar in questionCounter) {
        if (questionCounter[questionChar]==group_declaration_array.length) { everyoneAnswered++; } 
    }

    console.log(`Covered_Qs: ${everyoneAnswered} ... ${JSON.stringify(questionCounter)}`);
    return everyoneAnswered;
}

var groupDeclarationAffirmatives = ingestRawDeclarationFeed();
console.log(JSON.stringify(groupDeclarationAffirmatives));
var totalCount = 0;
for (group_declaration_array of groupDeclarationAffirmatives) {
    totalCount += countEveryoneQs(group_declaration_array);
}

console.log(`\nTotal Sum: ${totalCount}`);

// node problem2.js