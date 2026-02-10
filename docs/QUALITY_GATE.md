# Quality Gate Guide - OpsBoard Pro

## Quality Standards
To maintain high code quality, every contribution must pass the following gates.

## Automated Checks

### 1. Linting (ESLint)
We use ESLint 9+ with flat config. Rules are strictly enforced to prevent common errors and ensure consistency.
- **Command**: `npm run lint`
- **Key Rules**:
  - `no-explicit-any`: Specific types are required.
  - `prefer-inject`: Use `inject()` for DI.
  - `no-unused-vars`: Clean code is mandatory.

### 2. Formatting (Prettier)
Standardized code style across all files (TS, HTML, SCSS).
- **Command**: `npm run format`
- **Hook**: Automatically runs on staged files via Husky.

### 3. Git Hooks (Husky)
- **Pre-commit**: Runs `lint-staged` which executes Prettier and ESLint on changed files only.
- **Purpose**: Prevents "dirty" code from reaching the repository.

### 4. CI/CD (GitHub Actions)
Every Pull Request triggers a workflow that:
1. Installs dependencies.
2. Runs Lint.
3. Runs Unit Tests (`test:ci`).
4. Builds the application.

## Manual Reviews
- **Clean Architecture**: Ensure correct layer separation.
- **Performance**: Monitor Signal usage and template efficiency.
- **UX/UI**: Verify adherence to standard design tokens.
