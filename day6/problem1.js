var fs = require('fs');

function ingestRawDeclarationFeed() {
    var file_array = fs.readFileSync('group_responses.txt').toString().split("\n\n");
    var groupDeclarationAffirmatives = [];
    for (group_declaration_section of file_array) {
        var group_declaration_one_line = group_declaration_section.replace(/(\r\n|\n|\r)/gm, "");
        groupDeclarationAffirmatives.push(group_declaration_one_line);
    }
    return groupDeclarationAffirmatives;
}

function countUniqQs(group_declaration_one_line) {
    var uniqChars = group_declaration_one_line.split('').filter(
        function(item,i,ar){return ar.indexOf(item)===i;}).join('');
    console.log(`Group (one line): ${group_declaration_one_line}\nUnique_Chars: ${uniqChars.length} (${uniqChars})`);
    return uniqChars.length;
}

var groupDeclarationAffirmatives = ingestRawDeclarationFeed();
var totalCount = 0;
for (group_declaration_one_line of groupDeclarationAffirmatives) {
    totalCount += countUniqQs(group_declaration_one_line);
}

console.log(`\nTotal Sum: ${totalCount}`);

// node problem1.js