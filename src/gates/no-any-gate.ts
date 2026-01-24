import * as ts from "typescript";

export function checkNoAny(sourceCode: string, filePath: string): string[] {
    const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
    const violations: string[] = [];

    function visit(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            console.log('\t\t❌ Violation: Any type found!');
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
            violations.push(`${filePath}:${line + 1}:${character + 1}: Usage of 'any' type is forbidden`);
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return violations;
}
