import * as ts from "typescript";
import { Rule } from "./Rule.js";
import { Violation } from "../types/Violation.js";

export class NoEvalRule implements Rule {
    name = 'noEval';
    severity = 'error' as const;

    analyze(source: string, filePath: string): Violation[] {
        const ruleName = this.name;
        const severity = this.severity;
        
        const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.ESNext, false);
        const violations: Violation[] = [];
        
        function visit(node: ts.Node) {
            if (ts.isCallExpression(node)) {        // Check if this is a function call
                const expression = node.expression;
                if (ts.isIdentifier(expression) && expression.escapedText === 'eval') {
                    // Found an eval. Create a violation
                    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
                    violations.push({
                        ruleName: ruleName,
                        message: 'Usage of eval() is forbidden',
                        filePath: filePath,
                        line: line + 1,
                        column: character + 1,
                        severity: severity
                    });
                }
            }
            ts.forEachChild(node, visit);
        }

        visit(sourceFile);
        return violations;
    }
}
