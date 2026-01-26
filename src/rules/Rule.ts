import { Violation } from "../types/Violation.js";
import { NoAnyRule } from "./NoAnyRule.js";
import { NoEvalRule } from "./NoEvalRule.js";

export interface Rule {
    name: string;
    severity: Violation['severity'];
    analyze(source: string, filePath: string): Violation[];
}

// All available rules
export const availableRules: Record<string, Rule> = {
    noAny: new NoAnyRule(),
    noEval: new NoEvalRule(),
};
