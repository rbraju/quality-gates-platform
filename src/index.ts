#!/usr/bin/env node
import { availableReporters, Reporter } from "./reporters/Reporter.js";
import { runGates } from "./core/runner.js";
import { Violation } from "./types/Violation.js";
import fs from "fs";
import { availableRules, Rule } from "./rules/Rule.js";

const target = process.argv[2];

if (!target) {
    console.error('Usage: quality-gate <path>');
    process.exit(1);
}

// Load config
const config = JSON.parse(await fs.promises.readFile('.analyzerrc', 'utf-8'));
const rulesToRun: Rule[] = config.rules.map((name: keyof typeof availableRules) => {
    const rule = availableRules[name];
    if (!rule) {
        throw new Error(`Rule ${name} not found in availableRules.`)
    }
    return rule;
});

// Run quality gates
const violations: Violation[] = await runGates(target, rulesToRun);

// Generate reports
const reporters: Reporter[] = config.reporters.map((name: string) => {
    const reporterType = availableReporters[name];
    if (!reporterType) {
        throw new Error(`Reporter ${name} not found`);
    }
    return name == 'json' ? new reporterType(config.outputFile || 'violations.json') : new reporterType();
});

for (const reporter of reporters) {
    reporter.report(violations);
}
console.log('------------------------------------------------------------------------');

if (violations.length > 0) {
    process.exit(1);
}
