import { checkNoAny } from "../gates/no-any-gate.js";
import { checkNoEval } from "../gates/no-eval-gate.js";

export interface GateConfig {
    name: string;
    description: string;
    enabled: boolean;
}

export interface QualityGatesConfig {
    gates: GateConfig[];
}

// Type for gate functions
export type GateFunction = (source: string, filePath: string) => Violation[];

/**
 * Map of quality gate names to functions
 * 
 * Key: Name of the gate
 * Value: Function to run the gate
 */
export const gateFunctions: Record<string, GateFunction> = {
    "no-any": checkNoAny,
    "no-eval": checkNoEval
}
 
// Types for violation
export interface Violation {
    gate: string,
    file: string,
    line: number,
    column: number,
    message: string
}