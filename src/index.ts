import { runGates } from "./runner";

const target = process.argv[2];

if (!target) {
    console.error('Usage: quality-gate <path>');
    process.exit(1);
}

runGates(target);