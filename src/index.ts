import { runGates } from "./core/runner.js";

const target = process.argv[2];

if (!target) {
    console.error('Usage: quality-gate <path>');
    process.exit(1);
}

runGates(target);
