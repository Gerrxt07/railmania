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

Local macOS packages use a hardened ad-hoc signature so bundle integrity can be tested. Public release must replace it with a Developer ID Application signature and Apple notarization.
