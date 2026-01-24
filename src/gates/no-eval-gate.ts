import * as ts from "typescript";

export function checkNoEval(sourceCode: string, filePath: string): string[] {
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ESNext, false);
    const violations: string[] = [];

    function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {        // Check if this is a function call
            const expression = node.expression;
            if (ts.isIdentifier(expression) && expression.escapedText === 'eval') {
                // console.log('\t\t❌ Violation: Found eval!');
                const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
                violations.push(`${filePath}:${line + 1}:${character + 1}: Usage of eval() is forbidden`);
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return violations;
}
