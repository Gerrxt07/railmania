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
- 2026-08-24T18:55:57+0200 [USER] Add global sandboxing, strict protocol decoding and methods, deny-by-default downloads and network, global `WebContents` rules, split TypeScript configs, safer Bun CI and release-age settings, and Forge Fuses Plugin.
- 2026-08-24T18:55:57+0200 [USER] Disable DevTools, consoles, menus, shortcuts, and potentially dangerous launch arguments or commands.
- 2026-08-24T18:55:57+0200 [CODE] All renderer sessions now deny permissions, downloads, and non-allowlisted requests. Every `WebContents` blocks popups, navigation, redirects, webviews, Bluetooth, context menus, DevTools, menu shortcuts, modifier shortcuts, and function keys.
- 2026-08-24T18:55:57+0200 [CODE] Static protocol is GET-only and rejects invalid URL authority, queries, malformed encoding, NUL bytes, and traversal. Packaged launches reject arguments except the macOS Finder process token; file and URL open events are denied.
- 2026-08-24T18:55:57+0200 [CODE] Main and renderer TypeScript configs are isolated. Bun uses `bun ci`, a three-day minimum release age, and only Electron as a trusted lifecycle dependency. Forge Fuses Plugin replaced manual fuse-path logic.
- 2026-08-24T18:55:57+0200 [DISCOVERY] Node URL `.origin` is `null` for the custom scheme; direct scheme and host matching is required. Packaged security smoke checks found and verified this fix.
- 2026-08-24T18:55:57+0200 [TOOL] Split type checks, Bun CI, no-untrusted-script check, dependency freshness check, zero-vulnerability audit, production package, protocol security checks, renderer readiness, dangerous-argument rejection, ASAR integrity, no-source-map check, fuse readback, and deep signature verification passed.
- 2026-08-24T19:06:32+0200 [USER] Allow normal launch arguments, block only dangerous switches, and limit keyboard filtering to DevTools shortcuts.
- 2026-08-24T19:06:32+0200 [USER] Use an explicit real NUL check and remove the unused `blob:` worker CSP source instead of allowing Blob requests.
- 2026-08-24T19:06:32+0200 [DISCOVERY] Source already used the real `\0` escape; it was changed to the clearer equivalent `\u0000` and gained a packaged `%00` rejection test.
- 2026-08-24T19:06:32+0200 [CODE] Normal arguments now pass. A named denylist rejects sandbox bypass, inspector, remote debug, unsafe Chromium, extension, process launcher, certificate, logging, proxy, and alternate-profile switches. Only common DevTools shortcuts are filtered.
- 2026-08-24T19:06:32+0200 [CODE] CSP now uses `worker-src 'self'`; Blob workers remain blocked by both CSP and network policy.
- 2026-08-24T19:06:32+0200 [TOOL] Split type checks, package build, normal-argument launch, renderer readiness, malformed encoding, NUL path, forbidden method, external-network policy, dangerous-switch rejection, fuse readback, and deep signature verification passed.
- 2026-08-24T19:09:22+0200 [USER] Reported that the environment-controlled internal smoke mode was externally activatable.
- 2026-08-24T19:09:22+0200 [CODE] Removed smoke environment handling, readiness marker, protocol self-tests, and test-only exit behavior from the application. Smoke testing now observes the spawned Electron process tree externally for a renderer process.
- 2026-08-24T19:09:22+0200 [TOOL] Split type checks, package build, external renderer-process smoke check, normal-argument launch, dangerous-switch rejection, no-smoke-hook packaged bundle check, fuse readback, and deep signature verification passed.
- 2026-08-24T19:10:30+0200 [USER] Add the packaged smoke check to the `verify` script.
- 2026-08-24T19:10:30+0200 [CODE] `verify` now runs type checks, dependency audit, production package, and external packaged smoke test in sequence.
- 2026-08-24T19:10:30+0200 [TOOL] Full `bun run verify` passed with no known vulnerabilities.
- 2026-08-24T19:11:44+0200 [USER] Add stricter shared TypeScript checks for overrides, returns, switch fallthrough, index signatures, unused code, and forced module detection.
- 2026-08-24T19:11:44+0200 [CODE] Added all requested TypeScript rules. Signing environment access now uses bracket notation required by `noPropertyAccessFromIndexSignature`.
- 2026-08-24T19:11:44+0200 [TOOL] Full `bun run verify` passed with the stricter TypeScript base and no known vulnerabilities.
- 2026-08-24T21:23:35+0200 [USER] Remove the remaining internal `file:` protocol allowance.
- 2026-08-24T21:23:35+0200 [CODE] Custom protocol assets now use direct ASAR-aware file reads with an explicit MIME allowlist. All session `file:` requests are denied.
- 2026-08-24T21:23:35+0200 [TOOL] Type checks, zero-vulnerability audit, production package, packaged renderer smoke test, dangerous-switch test, fuse readback, and deep signature verification passed.
- 2026-08-24T21:30:12+0200 [USER] Use the supplied Railmania logo as the application icon.
- 2026-08-24T21:30:12+0200 [CODE] Logo master moved to `build-resources`; a reproducible Bun script builds a multi-size macOS ICNS, and Forge now applies it to the app bundle.
- 2026-08-24T21:30:12+0200 [TOOL] Icon readback and packaged checksum matched. Full verify, renderer launch, blocked-switch test, fuse readback, and deep signature verification passed.
- 2026-08-24T21:35:10+0200 [USER] Change the application executable name from lowercase `railmania` to `Railmania`.
- 2026-08-24T21:35:10+0200 [CODE] Forge and cross-platform packaged smoke paths now use the `Railmania` executable name. Lowercase machine identifiers remain unchanged.
- 2026-08-24T21:35:10+0200 [TOOL] Bundle name, display name, and executable all read `Railmania`; full verify, fuse readback, and deep signature verification passed.
