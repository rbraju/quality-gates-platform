import fs from "fs";
import { Violation } from "../types/Violation.js";
import { FileWalker } from "./FileWalker.js";
import { Analyzer } from "./Analyzer.js";
import { Rule } from "../rules/Rule.js";

console.log("\n🔥 RUNNER LOADED 🔥");

export async function runGates(targetDir: string, rulesToRun: Rule[]): Promise<Violation[]> {

    console.log('------------------------------------------------------------------------');
    console.log("Running quality gates on:", targetDir);
    console.log('------------------------------------------------------------------------');

    // Get the list of files to analyze
    const walker = new FileWalker();
    const files = await walker.walk(targetDir);

    const analyzer = new Analyzer(rulesToRun);
    const allViolations: Violation[] = [];
    
    // Analyze each file
    for (const file of files) {
        console.log(`\t- Checking file: ${file}`);
        const source = await fs.promises.readFile(file, 'utf-8');
        const violations = analyzer.analyzeFile(source, file);
        allViolations.push(...violations);
    }

    return allViolations;
}
