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

export type GateFunction = (source: string, filePath: string) => string[];

/**
 * Map of quality gate names to functions
 * 
 * Key: Name of the gate
 * Value: Function to run the gate
 */
export const gateFunctions: Record<string, (source: string, filePath: string) => string[]> = {
    "no-any": checkNoAny,
    "no-eval": checkNoEval
}
 
