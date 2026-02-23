# ESLint + Prettier to Biome Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace ESLint + Prettier with Biome for all linting and formatting in the Caawi project.

**Architecture:** Remove 8 ESLint/Prettier packages, add `@biomejs/biome`. Create `biome.json` matching existing formatting conventions. Update all scripts and pre-commit hooks. Bulk-format the codebase.

**Tech Stack:** Biome, pnpm, Husky, lint-staged

---

### Task 1: Remove ESLint and Prettier packages

**Files:**
- Modify: `package.json` (devDependencies section, lines 78-107)

**Step 1: Remove packages**

Run:
```bash
pnpm remove eslint eslint-config-next eslint-config-prettier eslint-plugin-prettier eslint-plugin-tailwindcss @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
```

Expected: 8 packages removed from `devDependencies`. `pnpm-lock.yaml` updated.

**Step 2: Install Biome**

Run:
```bash
pnpm add -D @biomejs/biome
```

Expected: `@biomejs/biome` appears in `devDependencies`.

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: replace ESLint + Prettier with Biome

Remove eslint, eslint-config-next, eslint-config-prettier,
eslint-plugin-prettier, eslint-plugin-tailwindcss,
@typescript-eslint/eslint-plugin, @typescript-eslint/parser,
and prettier. Install @biomejs/biome."
```

---

### Task 2: Create Biome config and delete Prettier config

**Files:**
- Create: `biome.json`
- Delete: `.prettierrc.json`

**Step 1: Create `biome.json`**

Create this file at the project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "ignore": ["node_modules/**", ".next/**", "prisma/views/**"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 120,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "none",
      "semicolons": "always"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "warn"
      }
    }
  }
}
```

Key decisions in this config:
- `prisma/views/**` is ignored because those are auto-generated SQL view files
- `noUnusedImports` set to `warn` (helpful but not blocking)
- `organizeImports` enabled for auto-sorting

**Step 2: Delete `.prettierrc.json`**

Run:
```bash
rm .prettierrc.json
```

**Step 3: Verify config is valid**

Run:
```bash
pnpm biome check --max-diagnostics=5 .
```

Expected: Biome runs without config errors. May report formatting/lint issues (that's expected — we fix them in Task 4).

**Step 4: Commit**

```bash
git add biome.json
git rm .prettierrc.json
git commit -m "chore: add biome.json config, remove .prettierrc.json

Biome formatter matches previous Prettier conventions:
120 char width, single quotes, no trailing commas, LF line endings.
Linter uses recommended rules with unused import warnings."
```

---

### Task 3: Update package.json scripts and lint-staged config

**Files:**
- Modify: `package.json` (scripts section, lines 20-34)
- Modify: `.lintstagedrc.json`

**Step 1: Update `package.json` scripts**

Replace the following scripts:

Old:
```json
"lint": "pnpm run check-types && next lint",
"lint:fix": "next lint --fix",
```

New:
```json
"lint": "pnpm run check-types && biome check .",
"lint:fix": "biome check --write .",
"format": "biome format --write .",
```

All other scripts remain unchanged.

**Step 2: Update `.lintstagedrc.json`**

Replace entire contents with:

```json
{
  "*.{js,jsx,ts,tsx,json,css}": [
    "biome check --write --no-errors-on-unmatched"
  ]
}
```

Notes:
- Added `json` and `css` since Biome can format those too
- `--no-errors-on-unmatched` prevents failures when staged files don't match Biome's supported types

**Step 3: Commit**

```bash
git add package.json .lintstagedrc.json
git commit -m "chore: update scripts and lint-staged for Biome

- lint now runs biome check instead of next lint
- lint:fix uses biome check --write
- add format script for biome format
- lint-staged runs biome check --write on pre-commit"
```

---

### Task 4: Bulk format the codebase

**Files:**
- All `*.{js,jsx,ts,tsx,json,css}` files in the project

**Step 1: Run bulk format**

Run:
```bash
pnpm biome format --write .
```

Expected: Biome reformats files to match the new config. Output shows number of files formatted.

**Step 2: Run lint check**

Run:
```bash
pnpm biome check .
```

Expected: Ideally zero errors. If there are lint errors, review them — some may be legitimate issues caught by Biome's stricter rules. Fix or suppress as needed.

**Step 3: Run type check to ensure nothing broke**

Run:
```bash
pnpm check-types
```

Expected: No new TypeScript errors. Formatting changes should never affect type-checking.

**Step 4: Commit**

```bash
git add -A
git commit -m "style: bulk format codebase with Biome

One-time formatting pass to align all files with Biome's formatter.
No logic changes — formatting only."
```

---

### Task 5: Fix any Biome lint errors

**Files:**
- Various source files (depends on what Biome reports)

**Step 1: Run lint with auto-fix**

Run:
```bash
pnpm biome check --write .
```

Expected: Auto-fixable issues are resolved (unused imports removed, etc.).

**Step 2: Check remaining errors**

Run:
```bash
pnpm biome check .
```

If errors remain, evaluate each:
- If the rule is too noisy for this codebase, disable it in `biome.json` under `linter.rules`
- If it's a real bug, fix it
- If it's a false positive on generated/third-party code, add the path to `files.ignore`

**Step 3: Run full lint pipeline**

Run:
```bash
pnpm lint
```

Expected: Type check passes, Biome check passes. Zero errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: resolve Biome lint errors

Auto-fix unused imports and address lint warnings.
Disable rules that don't apply to this codebase where needed."
```

---

### Task 6: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update the Commands section**

Replace the commands block (lines 11-21) with:

```markdown
## Commands

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm lint             # TypeScript check + Biome lint
pnpm lint:fix         # Auto-fix lint + format issues
pnpm format           # Format all files with Biome
pnpm check-types      # TypeScript only
pnpm migrate          # Prisma migrate dev
pnpm studio           # Prisma Studio GUI
pnpm generate         # Regenerate Prisma client
pnpm seed             # Seed database (100 fake users)
```
```

**Step 2: Update Pre-commit convention**

Replace line 88:

Old: `- **Pre-commit**: Husky runs lint-staged (ESLint --fix + Prettier) on staged files`
New: `- **Pre-commit**: Husky runs lint-staged (Biome check --write) on staged files`

**Step 3: Update Prettier convention**

Replace line 89:

Old: `- **Prettier**: 120 char width, single quotes, no trailing commas`
New: `- **Biome**: 120 char width, single quotes, no trailing commas (formatter + linter)`

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for Biome migration

Replace ESLint/Prettier references with Biome commands and conventions."
```

---

### Task 7: Verify pre-commit hook works end-to-end

**Step 1: Make a small change to test the hook**

Create a trivial change in any source file (e.g., add a blank line to `lib/utils.ts`).

**Step 2: Stage and commit**

```bash
git add lib/utils.ts
git commit -m "test: verify pre-commit hook with Biome"
```

Expected: Husky triggers lint-staged, which runs `biome check --write`, and the commit succeeds.

**Step 3: Verify, then undo the test commit**

If the commit succeeded, the pre-commit hook works. Undo the test commit:

```bash
git reset HEAD~1
git checkout -- lib/utils.ts
```

---

## Summary of all commits

1. `chore: replace ESLint + Prettier with Biome` (package changes)
2. `chore: add biome.json config, remove .prettierrc.json`
3. `chore: update scripts and lint-staged for Biome`
4. `style: bulk format codebase with Biome`
5. `fix: resolve Biome lint errors` (if any)
6. `docs: update CLAUDE.md for Biome migration`
