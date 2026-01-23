import * as ts from "typescript";

export function checkNoEval(sourceCode: string): string[] {

    const sourceFile = ts.createSourceFile(sourceCode, "file.ts", ts.ScriptTarget.ESNext, true);

    const violations: string[] = [];

    function visit(node: ts.Node) {
        // Check if this is a function call
        if (ts.isCallExpression(node)) {
            const expression = node.expression;
            if (ts.isIdentifier(expression) && expression.escapedText === 'eval') {
                console.log("Found eval!");
                violations.push('Usage of eval() is forbidden');
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return violations;
}
