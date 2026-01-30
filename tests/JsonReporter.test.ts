import { JsonReporter } from "../src/reporters/JsonReporter";
import { Violation } from "../src/types/Violation";
import fs from "fs";
import path from "path";
import os from "os";

describe("JsonReporter", () => {
  let tempFile: string;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    tempFile = path.join(os.tmpdir(), `json-reporter-test-${Date.now()}.json`);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    consoleLogSpy.mockRestore();
  });

  test("Report with no violations", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations: Violation[] = [];

    await reporter.report(violations);

    expect(fs.existsSync(tempFile)).toBe(true);
    const content = fs.readFileSync(tempFile, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual([]);
    expect(consoleLogSpy).toHaveBeenCalledWith(`\n📄 JSON report generated to ${tempFile}`);
  });

  test("Report with single violation", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations: Violation[] = [
      {
        ruleName: 'noAny',
        message: 'Usage of "any" is forbidden',
        filePath: 'example.ts',
        line: 1,
        column: 10,
        severity: 'error'
      }
    ];

    await reporter.report(violations);

    expect(fs.existsSync(tempFile)).toBe(true);
    const content = fs.readFileSync(tempFile, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(violations);
    expect(parsed.length).toBe(1);
    expect(parsed[0].ruleName).toBe('noAny');
    expect(consoleLogSpy).toHaveBeenCalledWith(`\n📄 JSON report generated to ${tempFile}`);
  });

  test("Report with multiple violations", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations: Violation[] = [
      {
        ruleName: 'noAny',
        message: 'Usage of "any" is forbidden',
        filePath: 'example.ts',
        line: 1,
        column: 10,
        severity: 'error'
      },
      {
        ruleName: 'noEval',
        message: 'Usage of eval() is forbidden',
        filePath: 'example.ts',
        line: 2,
        column: 15,
        severity: 'error'
      },
      {
        ruleName: 'noAny',
        message: 'Usage of "any" is forbidden',
        filePath: 'other.ts',
        line: 5,
        column: 20,
        severity: 'error'
      }
    ];

    await reporter.report(violations);

    expect(fs.existsSync(tempFile)).toBe(true);
    const content = fs.readFileSync(tempFile, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(violations);
    expect(parsed.length).toBe(3);
    expect(consoleLogSpy).toHaveBeenCalledWith(`\n📄 JSON report generated to ${tempFile}`);
  });

  test("Report writes formatted JSON with indentation", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations: Violation[] = [
      {
        ruleName: 'noAny',
        message: 'Usage of "any" is forbidden',
        filePath: 'example.ts',
        line: 1,
        column: 10,
        severity: 'error'
      }
    ];

    await reporter.report(violations);

    const content = fs.readFileSync(tempFile, 'utf-8');
    // Check that JSON is formatted with indentation (contains newlines and spaces)
    expect(content).toContain('\n');
    expect(content).toContain('    '); // 4 spaces for indentation
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(violations);
  });

  test("Report with violations having undefined column", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations: Violation[] = [
      {
        ruleName: 'noAny',
        message: 'Usage of "any" is forbidden',
        filePath: 'example.ts',
        line: 1,
        severity: 'error'
      }
    ];

    await reporter.report(violations);

    const content = fs.readFileSync(tempFile, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed[0]).not.toHaveProperty('column');
  });

  test("Report with different severities", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations: Violation[] = [
      {
        ruleName: 'rule1',
        message: 'Error violation',
        filePath: 'example.ts',
        line: 1,
        column: 10,
        severity: 'error'
      },
      {
        ruleName: 'rule2',
        message: 'Warning violation',
        filePath: 'example.ts',
        line: 2,
        column: 15,
        severity: 'warning'
      }
    ];

    await reporter.report(violations);

    const content = fs.readFileSync(tempFile, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed[0].severity).toBe('error');
    expect(parsed[1].severity).toBe('warning');
  });

  test("Report overwrites existing file", async () => {
    const reporter = new JsonReporter(tempFile);
    const violations1: Violation[] = [
      {
        ruleName: 'rule1',
        message: 'First violation',
        filePath: 'example.ts',
        line: 1,
        column: 10,
        severity: 'error'
      }
    ];

    await reporter.report(violations1);

    const violations2: Violation[] = [
      {
        ruleName: 'rule2',
        message: 'Second violation',
        filePath: 'example.ts',
        line: 2,
        column: 15,
        severity: 'error'
      }
    ];

    await reporter.report(violations2);

    const content = fs.readFileSync(tempFile, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.length).toBe(1);
    expect(parsed[0].ruleName).toBe('rule2');
  });
});
