import { ConsoleReporter } from "./reporters/console-reporter.js";
import { Reporter } from "./reporters/reporter.js";
import { runGates } from "./core/runner.js";
import { Violation } from "./core/types.js";
import { JsonReporter } from "./reporters/json-reporter.js";

const target = process.argv[2];

if (!target) {
    console.error('Usage: quality-gate <path>');
    process.exit(1);
}

// Run quality gates
const violations: Violation[] = await runGates(target);

// Generate reports
const reporter: Reporter = new ConsoleReporter();
reporter.report(violations);

const jsonReporter: Reporter = new JsonReporter();
jsonReporter.report(violations);

console.log('------------------------------------------------------------------------');

if (violations.length > 0) {
    process.exit(1);
}
