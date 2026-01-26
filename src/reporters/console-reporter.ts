import { Reporter } from "./reporter.js";
import { Violation } from "../core/types.js";

export class ConsoleReporter implements Reporter {
    report(violations: Violation[]): void {
        if (violations.length == 0) {
            console.log("Quality gate passed!");
            console.log('------------------------------------------------------------------------');
            return;
        }

        // Print violations
        console.log('------------------------------------------------------------------------');
        console.log(`❌ QUALITY GATE FAILED!!! Found ${violations.length} violations`);
        violations.forEach(v => console.error(`\t- ${v.file}:${v.line}:${v.column} ${v.message}`));
    }
}
