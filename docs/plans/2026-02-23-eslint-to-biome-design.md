# ESLint + Prettier to Biome Migration

## Goal

Replace ESLint and Prettier with Biome for linting and formatting. Single tool, single config, faster execution.

## Decisions

- **Scope**: Biome replaces both ESLint and Prettier
- **Lost rules**: Next.js-specific lint rules and Tailwind class sorting are dropped (accepted trade-off)
- **Formatting**: Bulk-format the entire codebase in one commit

## Packages removed

| Package | Role |
|---|---|
| `eslint` | Linter |
| `eslint-config-next` | Next.js ESLint rules |
| `eslint-config-prettier` | Disables ESLint formatting rules |
| `eslint-plugin-prettier` | Runs Prettier as ESLint rule |
| `eslint-plugin-tailwindcss` | Tailwind class linting |
| `@typescript-eslint/eslint-plugin` | TS lint rules |
| `@typescript-eslint/parser` | TS parser for ESLint |
| `prettier` | Formatter |

## Packages added

| Package | Role |
|---|---|
| `@biomejs/biome` | Linter + formatter |

## Config changes

### Delete

- `.prettierrc.json`

### Create: `biome.json`

Formatter settings match current Prettier config:
- `lineWidth: 120`, `indentStyle: "space"`, `indentWidth: 2`
- `quoteStyle: "single"`, `trailingCommas: "none"`, `lineEnding: "lf"`, `semicolons: "always"`
- Linter: `recommended` rules enabled
- Ignore: `node_modules/`, `.next/`

### Update: `package.json` scripts

| Script | Old | New |
|---|---|---|
| `lint` | `pnpm run check-types && next lint` | `pnpm run check-types && biome check .` |
| `lint:fix` | `next lint --fix` | `biome check --write .` |
| `format` | (none) | `biome format --write .` |

### Update: `.lintstagedrc.json`

From:
```json
{ "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"] }
```

To:
```json
{ "*.{js,jsx,ts,tsx}": ["biome check --write --no-errors-on-unmatched"] }
```

## Unchanged

- Husky pre-commit hook (still runs `pnpm lint-staged`)
- commitlint (commit message validation)
- `check-types` script (`tsc --noEmit`)

## Migration steps

1. Install `@biomejs/biome`, remove old packages
2. Create `biome.json`, delete `.prettierrc.json`
3. Update `package.json` scripts
4. Update `.lintstagedrc.json`
5. Run `biome format --write .` (bulk format)
6. Run `biome check .` to verify
7. Update `CLAUDE.md`
