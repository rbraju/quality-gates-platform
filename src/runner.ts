import fs from "fs";
import path from "path";
import { checkNoAny } from "./gates/no-any-gate.js";
import { checkNoEval } from "./gates/no-eval-gate.js";

console.log("\n🔥 RUNNER LOADED 🔥");

export function runGates(targetDir: string) {
    console.log('------------------------------------------------------------------------');
    console.log("Running quality gates on:", targetDir);
    console.log('------------------------------------------------------------------------');
    const results: string[] = [];

    function readFiles(dir: string) {
        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
            const fullPath = path.join(dir, entry);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                readFiles(fullPath);
            } else if (entry.endsWith(".ts")) {
                const source = fs.readFileSync(fullPath, "utf-8");
                console.log(`\t- Checking file: ${fullPath}`);
                results.push(...checkNoAny(source, fullPath));
                results.push(...checkNoEval(source, fullPath));
                console.log('');
            }
        }
    }

    readFiles(targetDir);
    
    if (results.length > 0) {
        console.log('------------------------------------------------------------------------');
        console.log("❌ QUALITY GATE FAILED!!!");
        results.forEach(error => console.error('\t-', error));
        console.log('------------------------------------------------------------------------');
        process.exit(1);
    }

    console.log("Quality gate passed!");
    console.log('------------------------------------------------------------------------');
}
