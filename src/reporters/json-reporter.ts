import { Violation } from "../core/types.js";
import { Reporter } from "./reporter.js";
import fs from "fs";

export class JsonReporter implements Reporter {

    private outputFileName: string = "violations.json";

    report(violations: Violation[]): void {
        const json = JSON.stringify(violations, null, 4);
        fs.writeFileSync(this.outputFileName, json, 'utf-8');
        console.log(`\t- JSON report generated to ${this.outputFileName}`);
    }
}
