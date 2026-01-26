import * as ts from "typescript";
import { Rule } from "./Rule.js";
import { Violation } from "../types/Violation.js";

export class NoAnyRule implements Rule {
    name = 'noAny';
    severity = "error" as const;

    analyze(source: string, filePath: string): Violation[] {
        const ruleName = this.name;
        const severity = this.severity;

        const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.ESNext, false);
        const violations: Violation[] = [];

        function visit(node: ts.Node) {
            if (node.kind === ts.SyntaxKind.AnyKeyword) {
                const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
                violations.push({
                        ruleName: ruleName,
                        message: 'Usage of "any" is forbidden',
                        filePath: filePath,
                        line: line + 1,
                        column: character + 1,
                        severity: severity
                });
            }
            ts.forEachChild(node, visit);
        }

        visit(sourceFile);
        return violations;
    }
}
