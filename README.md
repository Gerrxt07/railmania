# Railmania

Minimal Electron base for Railmania. App has no game content yet.

The app starts fullscreen with a light, railway-themed startup sequence. Reduced-motion system settings shorten the sequence and remove motion.

## Commands

```sh
bun install
bun run install:ci
bun start
bun run check
bun run audit
bun run package
bun run smoke:package
bun run verify
```

Production packages are written to `out/`.

App icon source lives at `build-resources/railmania-logo.png`. Rebuild the macOS icon with `bun run icon:build` after changing the source.

`bun run smoke:package` starts the packaged executable directly and observes its process tree for a renderer. Test mode is not exposed inside the app. The check catches dyld, signature, fuse, main-process, and early renderer startup failures.

`bunfig.toml` disables implicit package installs, automatic `.env` loading, and telemetry. It uses exact versions, isolated dependency links, Bun's global store, and a three-day minimum package release age. CI uses `bun ci` through `bun run install:ci`. Only Electron is trusted to run dependency lifecycle scripts. Production targets Electron's bundled Node 24 and Chromium 150 engines, avoiding old-browser transforms.

Type checks are split: `tsconfig.main.json` has Node types for Electron and build scripts; `tsconfig.renderer.json` has browser types only.

## Security baseline

- Renderer sandbox enabled globally and per window.
- Context isolation enabled.
- Node integration disabled.
- No preload bridge or IPC API.
- Local custom protocol instead of `file://` in production. Approved asset types are read directly from ASAR; `file:` requests are always denied.
- Static protocol is GET-only and rejects malformed encoding, invalid authority fields, NUL bytes, and path traversal.
- Downloads and network access are denied by default. Only packaged app resources or the exact Vite development host are allowed.
- Global rules deny popups, webviews, external navigation, redirects, Bluetooth selection, context menus, and DevTools for every `WebContents`.
- Common DevTools shortcuts are blocked. Other keyboard shortcuts and normal game input remain available.
- Application menu is removed. Main and renderer console methods are disabled.
- All permissions are denied.
- Device and Bluetooth permission paths denied.
- Strict production Content Security Policy and response headers.
- Blob workers are not allowed. Add them only if a future worker design requires them.
- DevTools and remote-debugging switches disabled in every build.
- Normal launch arguments are allowed. Security-breaking switches for sandbox bypass, inspectors, remote debugging, unsafe Chromium features, extensions, process launchers, certificate bypass, logging, proxy overrides, and alternate user-data paths are rejected.
- Production JavaScript minified and obfuscated; source maps disabled.
- App packed into ASAR with embedded integrity validation.
- Electron runs only code from `app.asar`.
- Node mode, `NODE_OPTIONS`, and CLI inspector Electron fuses disabled.
- Cookie encryption fuse enabled.
- Browser-process-specific V8 snapshot disabled because no custom snapshot is shipped; extra `file://` privileges disabled.
- WebAssembly trap handlers enabled for current V8 memory guards and speed.
- Forge's Fuses Plugin applies the current `@electron/fuses` package and fails if any present Electron fuse lacks an explicit setting.
- Final post-package hook gives local macOS packages a fresh ad-hoc signature after fuse and ASAR changes.

Obfuscation does not make client code secret. Signed releases, prompt Electron updates, dependency review, and no embedded secrets remain required.

Renderer obfuscation avoids dynamic-code anti-debug traps because strict CSP correctly blocks `eval` and `Function`. Main-process bundles use stronger traps because CSP does not govern Node code.

Ad-hoc macOS signatures cannot enforce same-team hardened library validation across Electron's nested frameworks. Local packages therefore omit hardened runtime. Set `RAILMANIA_MAC_SIGN_IDENTITY` to a Developer ID Application identity for a hardened signed build, then notarize it before public release.
