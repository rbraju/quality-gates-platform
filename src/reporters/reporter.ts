import { Violation } from "../core/types.js";

export interface Reporter {
    report(violations: Violation[]): void;
}
