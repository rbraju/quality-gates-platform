"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNoAny = checkNoAny;
var ts = require("typescript");
function checkNoAny(sourceCode) {
    var sourceFile = ts.createSourceFile("file.ts", sourceCode, ts.ScriptTarget.ESNext, true);
    var violations = [];
    function visit(node) {
        console.log(ts.SyntaxKind[node.kind]);
        ts.forEachChild(node, visit);
        if (node.kind == ts.SyntaxKind.AnyKeyword) {
            violations.push('Usage of "any" type is forbidden.');
        }
    }
    visit(sourceFile);
    return violations;
}
