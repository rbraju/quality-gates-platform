import { NoAnyRule } from "../src/rules/NoAnyRule";

describe("NoAnyRule", () => {

  test("Source without violation", () => {
    const rule = new NoAnyRule();
    const source = 'const x: number = 42;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("Report violation for using 'any'", () => {
    const rule = new NoAnyRule();
    const source = 'const x: any = 42;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);

    const violation = violations[0]!;
    expect(violation.ruleName).toBe('noAny');
    expect(violation.message).toBe('Usage of "any" is forbidden');
    expect(violation.filePath).toBe(filePath);
    expect(violation.severity).toBe('error');
    expect(typeof violation.column).toBe("number");
    expect(violation.column).toBeGreaterThanOrEqual(1);
  });

  test("Report violation for 'any' in function parameter", () => {
    const rule = new NoAnyRule();
    const source = 'function foo(x: any) { return x; }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
    expect(violations[0]!.message).toBe('Usage of "any" is forbidden');
  });

  test("Report violation for 'any' in function return type", () => {
    const rule = new NoAnyRule();
    const source = 'function foo(): any { return null; }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in arrow function parameter", () => {
    const rule = new NoAnyRule();
    const source = 'const foo = (x: any) => x;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in array type", () => {
    const rule = new NoAnyRule();
    const source = 'const arr: any[] = [1, 2, 3];';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in type alias", () => {
    const rule = new NoAnyRule();
    const source = 'type MyType = any;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in interface property", () => {
    const rule = new NoAnyRule();
    const source = 'interface Foo { prop: any; }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report multiple violations in same source", () => {
    const rule = new NoAnyRule();
    const source = 'const x: any = 1; const y: any = 2;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(2);
    violations.forEach(violation => {
      expect(violation.ruleName).toBe('noAny');
      expect(violation.message).toBe('Usage of "any" is forbidden');
      expect(violation.filePath).toBe(filePath);
      expect(violation.severity).toBe('error');
    });
  });

  test("Report violation for 'any' in union type", () => {
    const rule = new NoAnyRule();
    const source = 'const x: string | any = "test";';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in intersection type", () => {
    const rule = new NoAnyRule();
    const source = 'const x: string & any = "test";';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in optional property", () => {
    const rule = new NoAnyRule();
    const source = 'interface Foo { prop?: any; }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in method return type", () => {
    const rule = new NoAnyRule();
    const source = 'class Foo { method(): any { return null; } }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("Report violation for 'any' in method parameter", () => {
    const rule = new NoAnyRule();
    const source = 'class Foo { method(x: any) { return x; } }';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.ruleName).toBe('noAny');
  });

  test("No violation for 'any' in string literal", () => {
    const rule = new NoAnyRule();
    const source = 'const x = "This is any string";';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("No violation for 'any' in comment", () => {
    const rule = new NoAnyRule();
    const source = '// This is any comment\nconst x: number = 42;';
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(0);
  });

  test("Report violation with correct line number for multi-line source", () => {
    const rule = new NoAnyRule();
    const source = `
    const x: number = 42;
    const y: any = 100;
    const z: string = "test";`;
    const filePath = "example.ts"

    const violations = rule.analyze(source, filePath);
    expect(violations.length).toBe(1);
    expect(violations[0]!.line).toBe(3);
    expect(violations[0]!.ruleName).toBe('noAny');
  });
});
