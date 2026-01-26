import { Violation } from "../types/Violation.js";
import { Reporter } from "./Reporter.js";

export class ConsoleReporter implements Reporter {

    async report(violations: Violation[]): Promise<void> {
        if (violations.length == 0) {
            console.log("Quality gate passed!");
            console.log('------------------------------------------------------------------------');
            return;
        }

        // Print violations
        console.log('------------------------------------------------------------------------');
        console.log(`❌ QUALITY GATE FAILED!!! Found ${violations.length} violations\n`);
        console.log('📄 Violations:')
        violations.forEach(v => console.error(`\t- ${v.filePath}:${v.line}:${v.column} ${v.message}`));
    }
}