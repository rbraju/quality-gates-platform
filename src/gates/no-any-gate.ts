import * as ts from "typescript";
import { Violation } from "../core/types.js";

export function checkNoAny(sourceCode: string, filePath: string): Violation[] {
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    const violations: Violation[] = [];

    function visit(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            // console.log('\t\t❌ Violation: Any type found!');
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
            violations.push({
                gate: "no-any-gate", 
                file: filePath, 
                line: line + 1,
                column: character + 1,
                message: 'Usage of "any" type is forbidden'
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return violations;
}
