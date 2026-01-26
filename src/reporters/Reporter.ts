import { Violation } from "../types/Violation.js";
import { ConsoleReporter } from "./ConsoleReporter.js";
import { JsonReporter } from "./JsonReporter.js";

export interface Reporter {
    report(violations: Violation[]): Promise<void>;
}

export const availableReporters: Record<string, any> = {
    json: JsonReporter,
    console: ConsoleReporter,
}
