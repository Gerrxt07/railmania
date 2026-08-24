# Security

Report security issues privately to project owner. Do not open a public issue with exploit details.

## Release requirements

- Update Electron and dependencies before each release.
- Run type checks, package checks, and dependency audit.
- Sign and notarize macOS builds.
- Sign Windows builds.
- Publish checksums through trusted release channel.
- Never ship API secrets, signing keys, private map credentials, or server trust rules in client.
- Treat save files, mods, network data, and imported map data as untrusted input.

ASAR and obfuscation slow inspection. They are not encryption and do not replace server-side checks for any future online feature.

Runtime network access is denied by default. Any future online feature must add a narrow origin and method allowlist, validate all remote data, and keep trust decisions on a server.

Local macOS packages use an ad-hoc signature so bundle integrity can be tested. Ad-hoc signatures cannot safely enforce same-team hardened library validation across Electron's nested frameworks. Set `RAILMANIA_MAC_SIGN_IDENTITY` to a Developer ID Application identity for a hardened signed build, then notarize it before public release.
