<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

Every agent (Claude Code, Codex, Cursor) follows these. Full text lives in
`.cursor/rules/*.mdc` — read the matching file before working in its area.

| Rule file | Covers |
|---|---|
| `.cursor/rules/pelloux-guidelines.mdc` | Execution discipline: assumptions, simplicity, surgical changes, size limits |
| `.cursor/rules/strict-coding-rules.mdc` | TypeScript / Next.js / security standards |
| `.cursor/rules/anti-ai-slop.mdc` | Design, copy, and code anti-slop rules + Impeccable process |
| `.cursor/rules/testing-standards.mdc` | Real tests, minimal mocking |
| `.cursor/rules/pre-commit-enforcement.mdc` | What the git hooks block |
| `.cursor/rules/git-workflow.mdc` | Conventional Commits, one logical change per commit |

## Pelloux essentials

- State assumptions; surface interpretations; ask when unsure.
- Minimum code for the request. No speculative abstractions. Touch only what you must.
- Plan as `step → verify: check`.
- File ≤ 300 lines (400 hard), function ≤ 25 lines, ≤ 3 parameters.
- No `any`, `@ts-ignore`, `console.*`, commented-out code, or debug leftovers.
- Behavior changes ship with happy-path and failure-path tests.

## Design: Impeccable + anti-slop

Any UI work uses the **Impeccable** skill (`/impeccable`, installed in `.claude/`, `.agents/`,
`.cursor/`). Its hook scans every UI file an agent edits. Read
`.claude/skills/impeccable/reference/craft-floor.md` before UI edits. No reflex fonts
(Inter/Geist/Arial…), purple gradients, card-grid templates, buzzword copy, or invented facts.

## Commands

```bash
pnpm dev                 # dev server
pnpm lint                # eslint
pnpm typecheck           # tsc --noEmit
pnpm quality             # Pelloux gate on staged files
pnpm design:detect       # Impeccable anti-slop scan of src/
pnpm design:detect:live  # scan the running dev server (contrast, tiny text)
pnpm build               # must pass before push
pnpm setup-hooks         # once after clone: enables .husky hooks
```

No test runner yet — add one (and wire it into `.husky/`) with the first behavior to test.
