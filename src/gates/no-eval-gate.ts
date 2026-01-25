import * as ts from "typescript";
import { Violation } from "../core/types.js";

export function checkNoEval(sourceCode: string, filePath: string): Violation[] {
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ESNext, false);
    const violations: Violation[] = [];

    function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {        // Check if this is a function call
            const expression = node.expression;
            if (ts.isIdentifier(expression) && expression.escapedText === 'eval') {
                // console.log('\t\t❌ Violation: Found eval!');
                const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
                violations.push({
                    gate: "no-eval-gate",
                    file: filePath,
                    line: line + 1,
                    column: character + 1,
                    message: 'Usage of eval() is forbidden'
                });
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return violations;
}
