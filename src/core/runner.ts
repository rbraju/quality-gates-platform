import fs from "fs";
import path from "path";
import { QualityGatesConfig, Violation } from "./types.js";
import { gateRegistry } from "./gate-registry.js";
import { Reporter } from "../reporters/reporter.js";
import { ConsoleReporter } from "../reporters/console-reporter.js";

console.log("\n🔥 RUNNER LOADED 🔥");

export async function runGates(targetDir: string, configPath: string = "./gates-config.json"): Promise<Violation[]> {

    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    const gatesConfig: QualityGatesConfig = JSON.parse(rawConfig);

    console.log('------------------------------------------------------------------------');
    console.log("Running quality gates on:", targetDir);
    console.log('------------------------------------------------------------------------');
    const violations: Violation[] = [];

    async function readFiles(dir: string) {
        const entries = fs.readdirSync(dir);
        const tasks: Promise<void>[] = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                readFiles(fullPath);
            } else if (entry.endsWith(".ts")) {
                // Process files in parallel
                tasks.push((async () => {
                    const source = fs.readFileSync(fullPath, "utf-8");
                    console.log(`\t- Checking file: ${fullPath}`);
                    for (const gate of gatesConfig.gates) {
                        if (gate.enabled) {
                            const gateFunction = gateRegistry[gate.name];
                            if (!gateFunction) {
                                console.error(`\t- Gate function for ${gate.name} not found`);
                                continue;
                            }
                            const fileViolations = gateFunction(source, fullPath);
                            violations.push(...fileViolations);
                        }
                    }
                })());
            }
        }
        await Promise.all(tasks); // Wait for all tasks to complete
    }
    await readFiles(targetDir);
    return violations;
}
