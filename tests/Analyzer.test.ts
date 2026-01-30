import { Analyzer } from "../src/core/Analyzer";
import { Rule } from "../src/rules/Rule";

describe("Analyzer", () => {

  test("Analyze file with no rules", () => {
    const analyzer = new Analyzer([]);
    const source = 'const x: any = 42;';
    const filePath = "example.ts";

    const violations = analyzer.analyzeFile(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("Analyze file with single rule finding violations", () => {
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'testRule',
          message: 'Test violation',
          filePath: filePath,
          line: 1,
          column: 1,
          severity: 'error'
        }];
      }
    };

    const analyzer = new Analyzer([mockRule]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    const violations = analyzer.analyzeFile(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('testRule');
  });

  test("Analyze file with single rule finding no violations", () => {
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [];
      }
    };

    const analyzer = new Analyzer([mockRule]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    const violations = analyzer.analyzeFile(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("Analyze file with multiple rules", () => {
    const mockRule1: Rule = {
      name: 'rule1',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'rule1',
          message: 'Violation 1',
          filePath: filePath,
          line: 1,
          column: 1,
          severity: 'error'
        }];
      }
    };

    const mockRule2: Rule = {
      name: 'rule2',
      severity: 'warning',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'rule2',
          message: 'Violation 2',
          filePath: filePath,
          line: 2,
          column: 1,
          severity: 'warning'
        }];
      }
    };

    const analyzer = new Analyzer([mockRule1, mockRule2]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    const violations = analyzer.analyzeFile(source, filePath);
    expect(violations.length).toBe(2);
    expect(violations[0]!.ruleName).toBe('rule1');
    expect(violations[1]!.ruleName).toBe('rule2');
  });

  test("Analyze file with multiple rules, some finding violations", () => {
    const mockRule1: Rule = {
      name: 'rule1',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'rule1',
          message: 'Violation 1',
          filePath: filePath,
          line: 1,
          column: 1,
          severity: 'error'
        }];
      }
    };

    const mockRule2: Rule = {
      name: 'rule2',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [];
      }
    };

    const analyzer = new Analyzer([mockRule1, mockRule2]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    const violations = analyzer.analyzeFile(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('rule1');
  });

  test("Analyze file with rule finding multiple violations", () => {
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [
          {
            ruleName: 'testRule',
            message: 'Violation 1',
            filePath: filePath,
            line: 1,
            column: 1,
            severity: 'error'
          },
          {
            ruleName: 'testRule',
            message: 'Violation 2',
            filePath: filePath,
            line: 2,
            column: 1,
            severity: 'error'
          }
        ];
      }
    };

    const analyzer = new Analyzer([mockRule]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    const violations = analyzer.analyzeFile(source, filePath);
    expect(violations.length).toBe(2);
    expect(violations[0]!.message).toBe('Violation 1');
    expect(violations[1]!.message).toBe('Violation 2');
  });

  test("Passes correct filePath to rules", () => {
    const receivedFilePath: string[] = [];
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        receivedFilePath.push(filePath);
        return [];
      }
    };

    const analyzer = new Analyzer([mockRule]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    analyzer.analyzeFile(source, filePath);
    expect(receivedFilePath[0]).toBe(filePath);
  });

  test("Passes correct source to rules", () => {
    const receivedSource: string[] = [];
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        receivedSource.push(source);
        return [];
      }
    };

    const analyzer = new Analyzer([mockRule]);
    const source = 'const x = 42;';
    const filePath = "example.ts";

    analyzer.analyzeFile(source, filePath);
    expect(receivedSource[0]).toBe(source);
  });
});
