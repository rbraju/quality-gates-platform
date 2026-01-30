import { NoEvalRule } from "../src/rules/NoEvalRule";

describe("NoEvalRule", () => {

  test("Source without violation", () => {
    const rule = new NoEvalRule();
    const source = 'const x: number = 42;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("Report violation for using 'eval()'", () => {
    const rule = new NoEvalRule();
    const source = 'const result = eval("1 + 1");';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);

    const violation = violations[0]!;
    expect(violation.ruleName).toBe('noEval');
    expect(violation.message).toBe('Usage of eval() is forbidden');
    expect(violation.filePath).toBe(filePath);
    expect(violation.severity).toBe('error');
    expect(typeof violation.column).toBe("number");
    expect(violation.column).toBeGreaterThanOrEqual(1);
  });

  test("Report violation for 'eval()' in function", () => {
    const rule = new NoEvalRule();
    const source = 'function foo() { return eval("x"); }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
    expect(violations[0]!.message).toBe('Usage of eval() is forbidden');
  });

  test("Report violation for 'eval()' in arrow function", () => {
    const rule = new NoEvalRule();
    const source = 'const foo = () => eval("x");';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
  });

  test("Report violation for 'eval()' with variable argument", () => {
    const rule = new NoEvalRule();
    const source = 'const code = "1 + 1"; const result = eval(code);';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
  });

  test("Report violation for 'eval()' in method", () => {
    const rule = new NoEvalRule();
    const source = 'class Foo { method() { return eval("x"); } }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
  });

  test("Report multiple violations in same source", () => {
    const rule = new NoEvalRule();
    const source = 'const x = eval("1"); const y = eval("2");';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(2);
    violations.forEach(violation => {
      expect(violation.ruleName).toBe('noEval');
      expect(violation.message).toBe('Usage of eval() is forbidden');
      expect(violation.filePath).toBe(filePath);
      expect(violation.severity).toBe('error');
    });
  });

  test("Report violation for 'eval()' with complex expression", () => {
    const rule = new NoEvalRule();
    const source = 'const result = eval("function() { return 42; }")();';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
  });

  test("Report violation for 'eval()' in conditional", () => {
    const rule = new NoEvalRule();
    const source = 'if (true) { eval("x"); }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
  });

  test("Report violation for 'eval()' in try-catch", () => {
    const rule = new NoEvalRule();
    const source = 'try { eval("x"); } catch (e) {}';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noEval');
  });

  test("No violation for 'eval' as variable name", () => {
    const rule = new NoEvalRule();
    const source = 'const eval = "test";';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("No violation for 'eval' in string literal", () => {
    const rule = new NoEvalRule();
    const source = 'const x = "This is eval string";';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("No violation for 'eval' in comment", () => {
    const rule = new NoEvalRule();
    const source = '// This is eval comment\nconst x: number = 42;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("No violation for property access like 'obj.eval'", () => {
    const rule = new NoEvalRule();
    const source = 'const obj = { eval: () => {} }; obj.eval();';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("Report violation with correct line number for multi-line source", () => {
    const rule = new NoEvalRule();
    const source = `
    const x: number = 42;
    const result = eval("1 + 1");
    const z: string = "test";`;
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.line).toBe(3);
    expect(violations[0]!.ruleName).toBe('noEval');
  });
});
