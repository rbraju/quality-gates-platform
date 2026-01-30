import fs from "fs";
import { Violation } from "../types/Violation.js";
import { FileWalker } from "./FileWalker.js";
import { Analyzer } from "./Analyzer.js";
import { Rule } from "../rules/Rule.js";

export async function runGates(targetDir: string, rulesToRun: Rule[]): Promise<Violation[]> {

    console.log("\n🔥 RUNNER LOADED 🔥");
    console.log('------------------------------------------------------------------------');
    console.log("Running quality gates on:", targetDir);
    console.log('------------------------------------------------------------------------');

    // Get the list of files to analyze
    const walker = new FileWalker();
    const files = await walker.walk(targetDir);

    const analyzer = new Analyzer(rulesToRun);
    let allViolations: Violation[] = [];
    
    // Analyzing each file in parallel. Each file returns a promise of violations.
    // Collecting all promises in an array and then flattening it.
    const tasks: Promise<Violation[]>[] = [];
    for (const file of files) {
        const task: Promise<Violation[]> = (async () => {
            console.log(`\t- Checking file: ${file}`);
            const source = await fs.promises.readFile(file, 'utf-8');
            const violations = analyzer.analyzeFile(source, file);
            return violations;
        })();
        tasks.push(task);
    }

    allViolations = (await Promise.all(tasks)).flat();
    return allViolations;
 }
 