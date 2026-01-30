import { ConsoleReporter } from "../src/reporters/ConsoleReporter";
import { Violation } from "../src/types/Violation";

describe("ConsoleReporter", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("Report with no violations", async () => {
    const reporter = new ConsoleReporter();
    const violations: Violation[] = [];

    await reporter.report(violations);

    expect(consoleLogSpy).toHaveBeenCalledWith("Quality gate passed!");
    expect(consoleLogSpy).toHaveBeenCalledWith('------------------------------------------------------------------------');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test("Report with single violation", async () => {
    const reporter = new ConsoleReporter();
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

    expect(consoleLogSpy).toHaveBeenCalledWith('------------------------------------------------------------------------');
    expect(consoleLogSpy).toHaveBeenCalledWith('❌ QUALITY GATE FAILED!!! Found 1 violations\n');
    expect(consoleLogSpy).toHaveBeenCalledWith('📄 Violations:');
    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- example.ts:1:10 Usage of "any" is forbidden');
  });

  test("Report with multiple violations", async () => {
    const reporter = new ConsoleReporter();
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

    expect(consoleLogSpy).toHaveBeenCalledWith('------------------------------------------------------------------------');
    expect(consoleLogSpy).toHaveBeenCalledWith('❌ QUALITY GATE FAILED!!! Found 3 violations\n');
    expect(consoleLogSpy).toHaveBeenCalledWith('📄 Violations:');
    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- example.ts:1:10 Usage of "any" is forbidden');
    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- example.ts:2:15 Usage of eval() is forbidden');
    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- other.ts:5:20 Usage of "any" is forbidden');
  });

  test("Report violations with undefined column", async () => {
    const reporter = new ConsoleReporter();
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

    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- example.ts:1:undefined Usage of "any" is forbidden');
  });

  test("Report violations with different severities", async () => {
    const reporter = new ConsoleReporter();
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

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- example.ts:1:10 Error violation');
    expect(consoleErrorSpy).toHaveBeenCalledWith('\t- example.ts:2:15 Warning violation');
  });
});
