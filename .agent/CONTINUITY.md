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

- 2026-08-24T17:35:12+0200 [TOOL] Type check, dependency freshness check, frozen Bun install, Bun audit, production package, ASAR integrity, fuse readback, and static macOS signature verification passed. Initial smoke command did not validate process survival.
- 2026-08-24T17:35:12+0200 [TOOL] Bun audit reported no known vulnerabilities. Packaged renderer contains no source maps, loose app directory, `eval(`, or `Function(` calls.
- 2026-08-24T17:40:24+0200 [USER] Crash report showed dyld rejecting mixed ad-hoc Team IDs under hardened library validation.
- 2026-08-24T17:40:24+0200 [DISCOVERY] Local ad-hoc hardened runtime caused nested Electron framework library validation failure. Browser-specific V8 snapshot fuse also caused startup failure because no custom snapshot was shipped.
- 2026-08-24T17:40:24+0200 [CODE] Local ad-hoc package omits hardened runtime; Developer ID builds can use `RAILMANIA_MAC_SIGN_IDENTITY`. Browser-specific V8 snapshot fuse is explicitly disabled.
- 2026-08-24T17:40:24+0200 [TOOL] Corrected package passed deep strict signature verification, fuse readback, ASAR integrity, and repeatable five-second process-survival smoke test with empty logs.
- 2026-08-24T17:49:53+0200 [USER] Packaged app showed `require is not defined in ES module scope` from `.vite/build/main.js`.
- 2026-08-24T17:49:53+0200 [DISCOVERY] Vite emitted CommonJS main code while package `type` marked `.js` as ESM. Earlier survival-only smoke test could miss an Electron error dialog.
- 2026-08-24T17:49:53+0200 [CODE] Main bundle now has explicit CommonJS format and `.cjs` extension. Smoke test enables Electron logs and rejects reported JavaScript startup errors.
- 2026-08-24T17:49:53+0200 [TOOL] Type check, package build, ASAR entry check, deep code-sign check, fuse readback, diff check, and five-second packaged launch passed.
- 2026-08-24T17:52:03+0200 [USER] CommonJS main then failed because `fileURLToPath(import.meta.url)` received undefined.
- 2026-08-24T17:52:03+0200 [DISCOVERY] CommonJS output cannot use `import.meta.url`; survival testing also cannot distinguish a ready app from a blocking error dialog.
- 2026-08-24T17:52:03+0200 [CODE] Renderer root now derives from `app.getAppPath()`. Packaged smoke mode exits only after renderer `ready-to-show` and emits a checked readiness marker.
- 2026-08-24T17:52:03+0200 [TOOL] Type check, package build, renderer readiness test, no-`import.meta` bundle check, deep code-sign check, fuse readback, and diff check passed.
