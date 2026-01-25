import fs from "fs";
import path from "path";
import { gateFunctions, QualityGatesConfig } from "./types.js";
import { gateRegistry } from "./gate-registry.js";

console.log("\n🔥 RUNNER LOADED 🔥");

export function runGates(targetDir: string, configPath: string = "./gates-config.json") {

    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    const gatesConfig: QualityGatesConfig = JSON.parse(rawConfig);

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
                for (const gate of gatesConfig.gates) {
                    if (gate.enabled) {
                        const gateFunction = gateRegistry[gate.name];
                        if (!gateFunction) {
                            console.error(`\t- Gate function for ${gate.name} not found`);
                            continue;
                        }
                        const violations = gateFunction(source, fullPath);
                        results.push(...violations);
                    }
                }
            }
        }
    }

    readFiles(targetDir);
    
    if (results.length > 0) {
        console.log('------------------------------------------------------------------------');
        console.log(`❌ QUALITY GATE FAILED!!! Found ${results.length} violations`);
        results.forEach(error => console.error('\t-', error));
        console.log('------------------------------------------------------------------------');
        process.exit(1);
    }

    console.log("Quality gate passed!");
    console.log('------------------------------------------------------------------------');
}
