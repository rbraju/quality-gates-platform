import { checkNoAny } from "../gates/no-any-gate.js";
import { checkNoEval } from "../gates/no-eval-gate.js";
import { GateFunction } from "./types.js";

export const gateRegistry: Record<string, GateFunction> = {
    "no-any": checkNoAny,
    "no-eval": checkNoEval
}