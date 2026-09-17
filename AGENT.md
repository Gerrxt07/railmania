# Railmania — Agent Instructions

## 1. Project

Railmania is an Electron-based railway management / career simulation game.

The project is intended to be maintainable, performant, secure and reliable.

Primary technologies currently include:

- Electron
- TypeScript
- Vite
- Electron Forge
- Bun

The source code is the technical truth.

---

## 2. Required Context

Before making changes:

1. Read `AGENTS.md`.
2. Read `CONTINUITY.md`.
3. Inspect the relevant source files.
4. Read relevant files in `docs/` when they apply to the task.
5. Search the repository before introducing new abstractions, utilities or systems.

Do not assume that documentation is more accurate than the implementation.

If documentation and source code conflict:

`source code > project requirements > documentation`

---

## 3. Development Principles

Prefer:

1. Correctness
2. Security
3. Maintainability
4. Simplicity
5. Clear ownership
6. Predictable behaviour
7. Performance

Avoid:

- unnecessary abstractions
- duplicated logic
- global mutable state
- monolithic modules
- magic values
- dead code
- speculative features
- dependencies that are not required

Do not refactor unrelated code unless required for the requested change.

Prefer the smallest correct change.

---

## 4. Architecture

Keep these responsibilities separated:

- Electron main process
- preload / IPC boundaries
- renderer
- UI
- game logic
- persistence
- external services

Game logic should remain independent of Electron whenever practical.

Do not move privileged Electron functionality into the renderer.

Prefer explicit, narrow IPC interfaces.

Do not expose Node.js, filesystem or operating-system capabilities to the renderer unless explicitly required.

---

## 5. TypeScript

TypeScript is the default implementation language.

Prefer:

- explicit types at important boundaries
- small focused functions
- predictable return types
- narrow interfaces
- existing project types

Avoid:

- `any`
- unnecessary type assertions
- implicit `any`
- duplicated type definitions
- overly generic abstractions

Before creating a new type or utility, search the repository for an existing equivalent.

---

## 6. Electron Security

Preserve the existing Electron security model.

Do not weaken security settings simply to make development easier.

Pay particular attention to:

- context isolation
- sandboxing
- IPC boundaries
- navigation restrictions
- external URL handling
- CSP
- protocol handling
- filesystem access
- downloads
- WebContents permissions
- developer tools / remote debugging restrictions

Any security-sensitive change must be intentional and verified.

---

## 7. Performance

Railmania may contain:

- simulation ticks
- game loops
- rendering
- pathfinding
- large railway networks
- many vehicles
- UI updates
- persistence operations

Avoid unnecessary work in:

- render loops
- simulation ticks
- input handlers
- high-frequency IPC
- repeated pathfinding
- large collection scans

Do not optimize blindly.

First understand the bottleneck and measure where practical.

Prefer predictable algorithms and data ownership over premature micro-optimizations.

---

## 8. Dependencies

Do not add a dependency merely because it is convenient.

Before adding one:

1. Check whether the project already provides the functionality.
2. Check whether a small local implementation is more appropriate.
3. Consider bundle size, maintenance and security implications.
4. Use the dependency only when there is a clear benefit.

---

## 9. Changes

For non-trivial changes:

1. Inspect the existing implementation.
2. Identify affected systems.
3. Explain the intended approach briefly.
4. Implement incrementally.
5. Verify the result.
6. Update `CONTINUITY.md` if the project state changed.

Do not rewrite large parts of the project without a concrete reason.

Preserve existing behaviour unless the task explicitly changes it.

---

## 10. Verification

Use the project's existing commands.

Relevant commands currently include:

```bash
bun run check
bun run audit
bun run package
bun run smoke:package
bun run verify
bun run release
```

Do not invent verification commands when an existing project command covers the same purpose.

After meaningful changes, run the smallest relevant verification first.

For larger changes, run the project's broader verification pipeline.

Never claim a check passed unless it was actually run.

11. Continuity

CONTINUITY.md is persistent project memory.

Update it after meaningful changes involving:

architecture
systems
APIs
data structures
dependencies
configuration
development workflow
important bugs
important technical decisions

Keep continuity concise.

Record:

important decisions
current state
relevant trade-offs
unfinished work
known issues

Do not turn CONTINUITY.md into a detailed changelog.

Remove or update obsolete information.

12. Documentation

Documentation should explain stable project knowledge.

Use:

AGENTS.md for agent behaviour and development rules
CONTINUITY.md for current project state
docs/ for system and domain documentation
README.md for human-facing project setup and usage

Do not duplicate the same information across all files.

13. Git

Inspect Git state before making meaningful changes.

Do not:

force-push
reset unrelated work
delete user changes
rewrite history

Do not commit changes unless explicitly requested.

Do not modify unrelated files.

14. Communication

Before implementation:

state the approach for non-trivial tasks.

During implementation:

make focused changes.

After implementation:

summarize what changed
mention verification performed
mention remaining issues or uncertainty

Do not claim functionality exists if it has not been implemented and verified.

15. Final Rule

Understand the current implementation before changing it.

Read the relevant context.

Search before creating abstractions.

Make the smallest correct change.

Verify it.

Keep project memory current.