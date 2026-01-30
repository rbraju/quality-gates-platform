import { runGates } from "../src/core/runner";
import { Rule } from "../src/rules/Rule";
import fs from "fs";
import path from "path";
import os from "os";

describe("runner", () => {
  let tempDir: string;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'runner-test-'));
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
    consoleLogSpy.mockRestore();
  });

  test("Run gates on empty directory", async () => {
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [];
      }
    };

    const violations = await runGates(tempDir, [mockRule]);
    expect(violations.length).toBe(0);
  });

  test("Run gates on directory with single file", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.promises.writeFile(testFile, 'const x: number = 42;');

    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [];
      }
    };

    const violations = await runGates(tempDir, [mockRule]);
    expect(violations.length).toBe(0);
  });

  test("Run gates on directory with file containing violations", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.promises.writeFile(testFile, 'const x: any = 42;');

    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'testRule',
          message: 'Test violation',
          filePath: filePath,
          line: 1,
          column: 10,
          severity: 'error'
        }];
      }
    };

    const violations = await runGates(tempDir, [mockRule]);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('testRule');
    expect(violations[0]!.filePath).toBe(testFile);
  });

  test("Run gates on directory with multiple files", async () => {
    const testFile1 = path.join(tempDir, 'test1.ts');
    const testFile2 = path.join(tempDir, 'test2.ts');
    await fs.promises.writeFile(testFile1, 'const x: any = 42;');
    await fs.promises.writeFile(testFile2, 'const y: any = 43;');

    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'testRule',
          message: 'Test violation',
          filePath: filePath,
          line: 1,
          column: 10,
          severity: 'error'
        }];
      }
    };

    const violations = await runGates(tempDir, [mockRule]);
    expect(violations.length).toBe(2);
    expect(violations.some(v => v.filePath === testFile1)).toBe(true);
    expect(violations.some(v => v.filePath === testFile2)).toBe(true);
  });

  test("Run gates with multiple rules", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.promises.writeFile(testFile, 'const x: any = 42; eval("test");');

    const mockRule1: Rule = {
      name: 'rule1',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        if (source.includes('any')) {
          return [{
            ruleName: 'rule1',
            message: 'Violation 1',
            filePath: filePath,
            line: 1,
            column: 10,
            severity: 'error'
          }];
        }
        return [];
      }
    };

    const mockRule2: Rule = {
      name: 'rule2',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        if (source.includes('eval')) {
          return [{
            ruleName: 'rule2',
            message: 'Violation 2',
            filePath: filePath,
            line: 1,
            column: 25,
            severity: 'error'
          }];
        }
        return [];
      }
    };

    const violations = await runGates(tempDir, [mockRule1, mockRule2]);
    expect(violations.length).toBe(2);
    expect(violations.some(v => v.ruleName === 'rule1')).toBe(true);
    expect(violations.some(v => v.ruleName === 'rule2')).toBe(true);
  });

  test("Run gates on directory with nested subdirectories", async () => {
    const subDir = path.join(tempDir, 'subdir');
    await fs.promises.mkdir(subDir);
    
    const rootFile = path.join(tempDir, 'root.ts');
    const subFile = path.join(subDir, 'sub.ts');
    await fs.promises.writeFile(rootFile, 'const x: any = 42;');
    await fs.promises.writeFile(subFile, 'const y: any = 43;');

    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'testRule',
          message: 'Test violation',
          filePath: filePath,
          line: 1,
          column: 10,
          severity: 'error'
        }];
      }
    };

    const violations = await runGates(tempDir, [mockRule]);
    expect(violations.length).toBe(2);
    expect(violations.some(v => v.filePath === rootFile)).toBe(true);
    expect(violations.some(v => v.filePath === subFile)).toBe(true);
  });

  test("Run gates ignores non-.ts files", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    const jsFile = path.join(tempDir, 'test.js');
    await fs.promises.writeFile(testFile, 'const x: any = 42;');
    await fs.promises.writeFile(jsFile, 'const x: any = 42;');

    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        return [{
          ruleName: 'testRule',
          message: 'Test violation',
          filePath: filePath,
          line: 1,
          column: 10,
          severity: 'error'
        }];
      }
    };

    const violations = await runGates(tempDir, [mockRule]);
    expect(violations.length).toBe(1);
    expect(violations[0]!.filePath).toBe(testFile);
  });

  test("Run gates processes files in parallel", async () => {
    const testFile1 = path.join(tempDir, 'test1.ts');
    const testFile2 = path.join(tempDir, 'test2.ts');
    const testFile3 = path.join(tempDir, 'test3.ts');
    await fs.promises.writeFile(testFile1, 'const x = 42;');
    await fs.promises.writeFile(testFile2, 'const y = 43;');
    await fs.promises.writeFile(testFile3, 'const z = 44;');

    const analyzeOrder: string[] = [];
    const mockRule: Rule = {
      name: 'testRule',
      severity: 'error',
      analyze: (source: string, filePath: string) => {
        analyzeOrder.push(filePath);
        return [];
      }
    };

    await runGates(tempDir, [mockRule]);
    // All files should be processed (order may vary due to parallel execution)
    expect(analyzeOrder.length).toBe(3);
    expect(analyzeOrder).toContain(testFile1);
    expect(analyzeOrder).toContain(testFile2);
    expect(analyzeOrder).toContain(testFile3);
  });

  test("Run gates with no rules", async () => {
    const testFile = path.join(tempDir, 'test.ts');
    await fs.promises.writeFile(testFile, 'const x: any = 42;');

    const violations = await runGates(tempDir, []);
    expect(violations.length).toBe(0);
  });
});
