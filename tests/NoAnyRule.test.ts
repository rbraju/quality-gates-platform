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
});
