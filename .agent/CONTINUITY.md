# Railmania Continuity

## [PROGRESS]

- 2026-08-24T17:09:26+0200 [CODE] Minimal Electron base is being created with no game content.

## [DECISIONS]

- 2026-08-24T17:09:26+0200 [USER] Use current, fast Electron base with sandboxing, isolation, minification, obfuscation, ASAR integrity, and other base hardening.
- 2026-08-24T17:09:26+0200 [CODE] TypeScript, Vite, and Electron Forge selected. Renderer has no Node access, preload bridge, IPC, webviews, popups, external navigation, or granted permissions.
- 2026-08-24T17:09:26+0200 [CODE] Production uses custom local protocol, strict CSP, minification, no source maps, obfuscation, ASAR integrity, ASAR-only loading, and restrictive Electron fuses.
- 2026-08-24T17:09:26+0200 [USER] Use Bun and newest direct dependencies, including newest Electron fuses.
- 2026-08-24T17:09:26+0200 [CODE] Bun selected for package management and scripts. Current fuses v2 wired through direct Forge hook because Forge fuses plugin still requires fuses v1.
- 2026-08-24T17:09:26+0200 [CODE] Bun config disables implicit installs, automatic env-file loading, and telemetry; uses exact versions, isolated links, global store, and a locked CI install path.
- 2026-08-24T17:09:26+0200 [DISCOVERY] Stable Forge 7.11.2 had known vulnerable transitive build tools. Forge 8.0.0-alpha.10 removes them; full Bun audit then passed with no known vulnerabilities.
- 2026-08-24T17:09:26+0200 [CODE] Renderer obfuscation excludes dynamic-code traps so strict CSP stays effective. Main process retains stronger obfuscation. Vite targets Electron 43 engines: Node 24 and Chromium 150.

## [DISCOVERIES]

- 2026-08-24T17:09:26+0200 [TOOL] Workspace had one concept Markdown file and was not a Git repository before setup.
- 2026-08-24T17:09:26+0200 [TOOL] Dedicated security and attack-path skills requested by global guidance were not installed in this session.

## [OUTCOMES]

- 2026-08-24T17:35:12+0200 [TOOL] Type check, dependency freshness check, frozen Bun install, Bun audit, production package, ASAR integrity, fuse readback, strict macOS signature verification, and packaged-app smoke launch all passed.
- 2026-08-24T17:35:12+0200 [TOOL] Bun audit reported no known vulnerabilities. Packaged renderer contains no source maps, loose app directory, `eval(`, or `Function(` calls.
