export interface Violation {
    ruleName: string;
    message: string;
    filePath: string;
    line: number;
    column?: number;
    severity: 'error' | 'warning';
}
