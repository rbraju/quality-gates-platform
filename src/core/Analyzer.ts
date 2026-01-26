import { Rule } from "../rules/Rule.js";
import { Violation } from "../types/Violation.js";

export class Analyzer {
    
    constructor(private rules: Rule[]) {
        console.log("Rules to run: " + rules);
    }

    // Analyze all the rules for the given source
    analyzeFile(source: string, filePath: string): Violation[] {
        return this.rules.flatMap(rule => {
            return rule.analyze(source, filePath)
        });
    }
}