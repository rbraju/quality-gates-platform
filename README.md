# Quality Gates Platform

A TypeScript-based quality assurance tool that enforces coding standards by running configurable quality gates on your codebase. This platform provides a foundation for maintaining code quality through automated static analysis.

## Overview

The Quality Gates Platform scans TypeScript codebases and checks for violations of predefined quality rules. Each "gate" is a specialized check that analyzes code using the TypeScript Compiler API to detect patterns, anti-patterns, or violations of coding standards.

### Current Gates

- **No-Any Gate**: Detects usage of the `any` type, which can undermine TypeScript's type safety
- **No-Eval Gate**: Detects usage of `eval()`, which poses security risks and should be avoided

## Architecture & Design

### Project Structure

```
quality-gates-platform/
├── src/
│   ├── gates/           # Individual quality gate implementations
│   │   ├── no-any-gate.ts
│   │   └── no-eval-gate.ts
│   ├── runner.ts        # Core orchestration logic
│   └── index.ts         # CLI entry point
├── package.json
└── tsconfig.json
```

### Design Principles

1. **Modular Gate System**: Each gate is a self-contained module that exports a check function
   - Gates receive source code and file path as inputs
   - Gates return an array of violation messages (empty if no violations)
   - Violation messages follow the format: `filePath:line:column: message`

2. **TypeScript Compiler API**: Gates leverage TypeScript's built-in parser and AST traversal
   - Uses `ts.createSourceFile()` to parse code
   - Recursively visits AST nodes using `ts.forEachChild()`
   - Provides precise line and column information for violations

3. **Extensible Architecture**: New gates can be easily added by:
   - Creating a new file in `src/gates/`
   - Implementing a check function that follows the gate interface
   - Registering it in `runner.ts`

### How It Works

1. **Entry Point** (`index.ts`): Accepts a target directory path via command-line argument
2. **Runner** (`runner.ts`): 
   - Recursively traverses the target directory
   - Filters for `.ts` files
   - Runs all registered gates on each file
   - Aggregates violations from all gates
   - Exits with code 1 if violations are found, 0 if all gates pass
3. **Gates**: Each gate analyzes the AST and reports violations with precise location information

## Usage

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running Quality Gates

Run quality gates on a target directory:

```bash
npm run gate <path-to-directory>
```

**Example:**
```bash
npm run gate ./src
```

### Output

When gates pass:
```
🔥 RUNNER LOADED 🔥
------------------------------------------------------------------------
Running quality gates on: ./src
------------------------------------------------------------------------
	- Checking file: ./src/index.ts
	- Checking file: ./src/runner.ts
Quality gate passed!
------------------------------------------------------------------------
```

When violations are found:
```
🔥 RUNNER LOADED 🔥
------------------------------------------------------------------------
Running quality gates on: ./src
------------------------------------------------------------------------
	- Checking file: ./src/example.ts
------------------------------------------------------------------------
❌ QUALITY GATE FAILED!!! Found 2 violations
	- ./src/example.ts:5:10: Usage of 'any' type is forbidden
	- ./src/example.ts:10:15: Usage of eval() is forbidden
------------------------------------------------------------------------
```

The process exits with code 1 when violations are detected, making it suitable for CI/CD pipelines.

## Next Steps: Library Distribution

To make this repository available as a library for consumers (e.g., plugin repositories), the following steps are planned:

### 1. Build Configuration
- [ ] Configure TypeScript compilation to output to `dist/` directory
- [ ] Set up build scripts in `package.json`
- [ ] Ensure proper module exports (ESM/CommonJS compatibility)
- [ ] Generate type definitions (`.d.ts` files)

### 2. Package Configuration
- [ ] Update `package.json` with:
  - Proper `main`, `module`, and `types` fields pointing to built files
  - Repository URL and package metadata
  - Keywords for discoverability
  - License information
- [ ] Add `.npmignore` or configure `files` field to include only necessary files

### 3. Public API Design
- [ ] Export a clean, stable API from `src/index.ts`:
  ```typescript
  export { runGates } from './runner';
  export { checkNoAny } from './gates/no-any-gate';
  export { checkNoEval } from './gates/no-eval-gate';
  ```
- [ ] Create a programmatic API for library consumers:
  ```typescript
  import { QualityGateRunner } from 'quality-gates-platform';
  
  const runner = new QualityGateRunner();
  runner.addGate(customGate);
  runner.run('./src');
  ```

### 4. Configuration System
- [ ] Add support for configuration files (e.g., `quality-gates.config.json`)
- [ ] Allow consumers to:
  - Enable/disable specific gates
  - Configure gate-specific options
  - Define custom file patterns (not just `.ts`)
  - Set custom violation reporting formats

### 5. Gate Plugin System
- [ ] Design a plugin interface for custom gates
- [ ] Allow consumers to register their own gates
- [ ] Provide utilities for common gate patterns

### 6. Documentation
- [ ] Create API documentation (JSDoc comments)
- [ ] Add usage examples for library consumers
- [ ] Document how to create custom gates
- [ ] Add migration guide for breaking changes

### 7. Testing & Quality
- [ ] Add unit tests for gates
- [ ] Add integration tests for the runner
- [ ] Set up CI/CD pipeline
- [ ] Add code coverage reporting

### 8. Publishing
- [ ] Set up npm publishing workflow
- [ ] Configure semantic versioning
- [ ] Create changelog
- [ ] Set up automated releases

### 9. Developer Experience
- [ ] Add CLI improvements (better error messages, progress indicators)
- [ ] Support for watch mode
- [ ] Support for excluding files/directories
- [ ] Add verbose/debug logging options

### 10. Integration Examples
- [ ] Create example projects showing library usage
- [ ] Add integration guides for popular CI/CD platforms
- [ ] Provide pre-commit hook examples

## Contributing

Contributions are welcome! When adding new gates:

1. Create a new file in `src/gates/` following the naming convention `*-gate.ts`
2. Export a function that accepts `(sourceCode: string, filePath: string): string[]`
3. Use the TypeScript Compiler API to analyze the code
4. Return violation messages in the format: `filePath:line:column: message`
5. Register the gate in `src/runner.ts`

## License

ISC
