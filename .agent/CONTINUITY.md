# Railmania Continuity

## [PROGRESS]

- 2026-08-24T17:09:26+0200 [CODE] Minimal Electron base is being created with no game content.
- 2026-08-27T22:16:45+0200 [CODE] Removed startup markup, timing code, animation styles, and unused Three.js startup dependencies. App now renders the game grid on first paint.
- 2026-08-27T22:20:30+0200 [CODE] Native window and page now start black, then the game grid fades in over 1.6 seconds with a short reduced-motion variant.
- 2026-08-27T22:53:06+0200 [CODE] Added one-command `bun run release` pipeline for macOS ARM64 and Windows x64 with frozen install, checks, audit, production obfuscation/package, ASAR and fuse validation, host smoke test, and macOS signature validation.
- 2026-08-27T23:17:37+0200 [CODE] Added supplied title to menu at 10vh with an off-screen fall and soft bounce entrance. Synced supplied logo into package assets and rebuilt macOS and Windows icons.
- 2026-08-27T23:19:38+0200 [CODE] Refined menu title to a smaller responsive size at 3vh with stronger squash, lift, and playful tilt across several settling bounces.
- 2026-08-27T23:21:26+0200 [CODE] Removed title rotation from every bounce frame so left and right edges move evenly while centered squash and lift remain.
- 2026-08-27T23:23:55+0200 [CODE] Replaced title squash/stretch with rigid vertical trampoline motion: one accelerated fall followed by 56px, 26px, and 9px decaying hops.
- 2026-08-27T23:25:19+0200 [CODE] Kept trampoline path and added subtle symmetric flex: 1.2%, 0.7%, and 0.3% landing squash with smaller apex recovery.
- 2026-08-27T23:31:11+0200 [CODE] Made settled title an accessible button. Click, Enter, or Space replays a short two-hop bounce with subtle flex; reduced-motion mode uses a 4px hop.

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

- 2026-08-27T22:16:45+0200 [TOOL] Type checks, production package, packaged renderer smoke test, and diff check passed after startup removal.
- 2026-08-27T22:20:30+0200 [TOOL] Type checks, production package, packaged renderer smoke test, and diff check passed for the black-to-grid fade.
- 2026-08-27T22:53:06+0200 [TOOL] Full release pipeline passed for macOS ARM64 and Windows x64. Both artifacts passed ASAR and fuse checks; macOS launch smoke and signature verification passed. Vulnerability audit found no known issues.
- 2026-08-27T23:17:37+0200 [TOOL] Full release pipeline passed with supplied title and logo assets for macOS ARM64 and Windows x64; audit found no known vulnerabilities.
- 2026-08-27T23:19:38+0200 [TOOL] Full verify passed after title size, position, and bounce refinement; audit found no known vulnerabilities.
- 2026-08-27T23:21:26+0200 [TOOL] Type checks, vulnerability audit, package build, and diff check passed for balanced title bounce. Smoke launch was blocked by an already-running Railmania instance.
- 2026-08-27T23:23:55+0200 [TOOL] Type checks, production package build, and diff check passed for rigid trampoline-style title motion.
- 2026-08-27T23:25:19+0200 [TOOL] Type checks, production package build, and diff check passed for subtle title flex. Smoke remained unavailable while Railmania was open.
- 2026-08-27T23:31:11+0200 [TOOL] Type checks, production package build, and diff check passed for interactive title bounce.
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
- 2026-08-24T21:43:14+0200 [USER] Start fullscreen and add a unique light-themed loading animation inspired by 2010-era simulation games, without neon or cyberpunk styling.
- 2026-08-24T21:43:14+0200 [CODE] Added a warm paper, steel-blue, muted-red switchyard intro with animated rail routes, logo reveal, route switch, progress marker, staged status text, and reduced-motion behavior. Window now starts fullscreen.
- 2026-08-24T21:43:14+0200 [TOOL] Split type checks, zero-vulnerability audit, production package, real fullscreen launch, packaged renderer smoke, fuse readback, and deep signature verification passed. macOS denied automated screen capture permission.
