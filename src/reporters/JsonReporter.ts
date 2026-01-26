import fs from "fs";
import { Reporter } from "./Reporter.js";
import { Violation } from "../types/Violation.js";

export class JsonReporter implements Reporter {

    constructor(private outputFile: string){
    }

    async report(violations: Violation[]): Promise<void> {
        const json = JSON.stringify(violations, null, 4);
        fs.writeFileSync(this.outputFile, json, 'utf-8');
        console.log(`\n📄 JSON report generated to ${this.outputFile}`);
    }
}
