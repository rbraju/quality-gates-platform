import * as ts from "typescript";

export function checkNoAny(sourceCode: string): string[] {

    const sourceFile = ts.createSourceFile("file.ts", sourceCode, ts.ScriptTarget.ESNext, true);
    const violations: string[] = [];

    function visit(node: ts.Node) {
        console.log(ts.SyntaxKind[node.kind]);
        ts.forEachChild(node, visit);
        if (node.kind == ts.SyntaxKind.AnyKeyword) {
            console.log("Found any type!");
            violations.push('Usage of "any" type is forbidden.')
        }
    }

    visit(sourceFile);
    return violations;
}
