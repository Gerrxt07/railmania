# Railmania

Minimal Electron base for Railmania. App has no game content yet.

## Commands

```sh
bun install
bun start
bun run check
bun run audit
bun run package
```

Production packages are written to `out/`.

`bunfig.toml` disables implicit package installs, automatic `.env` loading, and telemetry. It uses exact versions, isolated dependency links, Bun's global store, and current registry metadata. CI should use `bun run install:ci`. Production targets Electron's bundled Node 24 and Chromium 150 engines, avoiding old-browser transforms.

## Security baseline

- Renderer sandbox enabled.
- Context isolation enabled.
- Node integration disabled.
- No preload bridge or IPC API.
- Local custom protocol instead of `file://` in production.
- All permissions, popups, webviews, and external navigation denied.
- Device and Bluetooth permission paths denied.
- Strict production Content Security Policy and response headers.
- DevTools disabled in production.
- Production JavaScript minified and obfuscated; source maps disabled.
- App packed into ASAR with embedded integrity validation.
- Electron runs only code from `app.asar`.
- Node mode, `NODE_OPTIONS`, and CLI inspector Electron fuses disabled.
- Cookie encryption fuse enabled.
- Browser-process-specific V8 snapshot enabled; extra `file://` privileges disabled.
- WebAssembly trap handlers enabled for current V8 memory guards and speed.
- Fuse build fails if any present Electron fuse lacks an explicit setting.
- Final post-package hook gives local macOS packages a fresh hardened ad-hoc signature after fuse and ASAR changes.

Obfuscation does not make client code secret. Signed releases, prompt Electron updates, dependency review, and no embedded secrets remain required.

Renderer obfuscation avoids dynamic-code anti-debug traps because strict CSP correctly blocks `eval` and `Function`. Main-process bundles use stronger traps because CSP does not govern Node code.
