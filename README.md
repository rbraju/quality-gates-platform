# Quality Gates Platform

A TypeScript-based static code analysis tool that enforces coding standards through configurable rules. The platform scans TypeScript codebases, detects violations, and generates reports in multiple formats.

## Overview

The Quality Gates Platform analyzes TypeScript source files using the TypeScript Compiler API to detect violations of predefined quality rules. It provides a flexible, rule-based architecture that can be easily extended with custom rules and reporters.

## Features

- **Rule-based Analysis**: Configurable rules that analyze code using TypeScript's AST
- **Multiple Reporters**: Support for console and JSON output formats
- **Configurable**: Easy configuration via `.analyzerrc` file
- **Extensible**: Simple interfaces for adding custom rules and reporters
- **CI/CD Ready**: Exits with appropriate codes for integration into pipelines

## Architecture

### Project Structure

```
quality-gates-platform/
├── src/
│   ├── core/              # Core analysis engine
│   │   ├── Analyzer.ts    # Orchestrates rule execution
│   │   ├── FileWalker.ts  # Recursively finds TypeScript files
│   │   └── runner.ts      # Main execution flow
│   ├── rules/             # Quality rules
│   │   ├── Rule.ts        # Rule interface and registry
│   │   ├── NoAnyRule.ts   # Detects 'any' type usage
│   │   └── NoEvalRule.ts  # Detects eval() usage
│   ├── reporters/         # Output formatters
│   │   ├── Reporter.ts    # Reporter interface and registry
│   │   ├── ConsoleReporter.ts  # Console output
│   │   └── JsonReporter.ts     # JSON file output
│   ├── types/             # Type definitions
│   │   └── Violation.ts   # Violation data structure
│   └── index.ts           # CLI entry point
├── .analyzerrc            # Configuration file
├── package.json
└── tsconfig.json
```

### Core Components

#### 1. **Runner** (`src/core/runner.ts`)
- Orchestrates the analysis workflow
- Coordinates FileWalker and Analyzer
- Aggregates violations from all files

#### 2. **FileWalker** (`src/core/FileWalker.ts`)
- Recursively traverses directory trees
- Filters for TypeScript files (`.ts` extension)
- Returns list of files to analyze

#### 3. **Analyzer** (`src/core/Analyzer.ts`)
- Executes configured rules on source files
- Uses TypeScript Compiler API for AST parsing
- Returns structured violation data

#### 4. **Rules** (`src/rules/`)
- Each rule implements the `Rule` interface
- Rules analyze source code and return violations
- Currently available:
  - **NoAnyRule**: Detects usage of the `any` type
  - **NoEvalRule**: Detects usage of `eval()` function

#### 5. **Reporters** (`src/reporters/`)
- Format and output violation data
- Currently available:
  - **ConsoleReporter**: Prints violations to console
  - **JsonReporter**: Writes violations to JSON file

### Data Flow

1. **Entry Point** (`src/index.ts`):
   - Reads command-line arguments (target directory)
   - Loads configuration from `.analyzerrc`
   - Initializes rules and reporters based on config
   - Executes analysis and generates reports

2. **Analysis Flow**:
   ```
   Target Directory → FileWalker → List of Files
   ↓
   For each file:
   Source Code → Analyzer → Rules → Violations
   ↓
   All Violations → Reporters → Output
   ```

3. **Violation Structure**:
   ```typescript
   {
     ruleName: string;
     message: string;
     filePath: string;
     line: number;
     column?: number;
     severity: 'error' | 'warning';
   }
   ```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

```bash
npm install
```

## Configuration

The platform is configured via `.analyzerrc` file in the project root:

```json
{
  "rules": ["noAny", "noEval"],
  "reporters": ["console", "json"],
  "outputFile": "violations.json"
}
```

### Configuration Options

- **rules**: Array of rule names to enable (available: `noAny`, `noEval`)
- **reporters**: Array of reporter names to use (available: `console`, `json`)
- **outputFile**: Output file path for JSON reporter (optional, defaults to `violations.json`)

## Usage

### Basic Usage

Run quality gates on a target directory:

```bash
npm run gate <path-to-directory>
```

**Example:**
```bash
npm run gate ./src
```

### How It Works

1. The tool reads `.analyzerrc` to determine which rules and reporters to use
2. It recursively scans the target directory for TypeScript files
3. Each file is analyzed against all enabled rules
4. Violations are collected and passed to configured reporters
5. The process exits with code 1 if violations are found, 0 otherwise

## Sample Output

### When All Gates Pass

```
🔥 RUNNER LOADED 🔥
------------------------------------------------------------------------
Running quality gates on: ./src
------------------------------------------------------------------------
	- Checking file: ./src/index.ts
	- Checking file: ./src/core/runner.ts
	- Checking file: ./src/rules/NoAnyRule.ts
Quality gate passed!
------------------------------------------------------------------------
```

### When Violations Are Found

**Console Output:**
```
🔥 RUNNER LOADED 🔥
------------------------------------------------------------------------
Running quality gates on: ./src
------------------------------------------------------------------------
	- Checking file: ./src/example.ts
------------------------------------------------------------------------
❌ QUALITY GATE FAILED!!! Found 2 violations

📄 Violations:
	- ./src/example.ts:5:10 Usage of "any" is forbidden
	- ./src/example.ts:10:15 Usage of eval() is forbidden
------------------------------------------------------------------------
```

**JSON Output** (written to `violations.json`):
```json
[
  {
    "ruleName": "noAny",
    "message": "Usage of \"any\" is forbidden",
    "filePath": "./src/example.ts",
    "line": 5,
    "column": 10,
    "severity": "error"
  },
  {
    "ruleName": "noEval",
    "message": "Usage of eval() is forbidden",
    "filePath": "./src/example.ts",
    "line": 10,
    "column": 15,
    "severity": "error"
  }
]

📄 JSON report generated to violations.json
```

## Extending the Platform

### Adding a New Rule

1. Create a new rule class in `src/rules/`:

```typescript
import * as ts from "typescript";
import { Rule } from "./Rule.js";
import { Violation } from "../types/Violation.js";

export class MyCustomRule implements Rule {
    name = 'myCustomRule';
    severity = 'error' as const;

    analyze(source: string, filePath: string): Violation[] {
        const sourceFile = ts.createSourceFile(
            filePath, 
            source, 
            ts.ScriptTarget.ESNext, 
            false
        );
        const violations: Violation[] = [];

        function visit(node: ts.Node) {
            // Your analysis logic here
            ts.forEachChild(node, visit);
        }

        visit(sourceFile);
        return violations;
    }
}
```

2. Register it in `src/rules/Rule.ts`:

```typescript
export const availableRules: Record<string, Rule> = {
    noAny: new NoAnyRule(),
    noEval: new NoEvalRule(),
    myCustomRule: new MyCustomRule(), // Add your rule
};
```

3. Add it to `.analyzerrc`:

```json
{
  "rules": ["noAny", "noEval", "myCustomRule"]
}
```

### Adding a New Reporter

1. Create a new reporter class in `src/reporters/`:

```typescript
import { Violation } from "../types/Violation.js";
import { Reporter } from "./Reporter.js";

export class MyCustomReporter implements Reporter {
    async report(violations: Violation[]): Promise<void> {
        // Your reporting logic here
    }
}
```

2. Register it in `src/reporters/Reporter.ts`:

```typescript
export const availableReporters: Record<string, any> = {
    json: JsonReporter,
    console: ConsoleReporter,
    myCustom: MyCustomReporter, // Add your reporter
};
```

3. Add it to `.analyzerrc`:

```json
{
  "reporters": ["console", "json", "myCustom"]
}
```

## CI/CD Integration

The tool exits with code 1 when violations are detected, making it suitable for CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Quality Gates
  run: npm run gate ./src
```

## License
No license yet. All rights reserved. Contact the author for permissions.
