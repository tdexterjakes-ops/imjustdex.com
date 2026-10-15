# Grace in the Dark — cloud release

Dexter authorized these sermon notes for October 18, 2026 at 10:00 AM Central
(15:00 UTC), superseding the earlier after-preaching requirement. No preached
date is implied. All 43 passages remain open and outbound links are unchanged.

The repository is public. `grace-in-the-dark.enc.json` is an AES-256-GCM encrypted
release package, not public-readable study content. Its key is kept only in
Netlify's production **builds** environment as `GRACE_RELEASE_KEY`. Never commit
the key or generated plaintext files before release. Private manuscripts and
review evidence are not in this package.

`npm run build` checks the actual clock before decrypting the approved MDX,
study JSON, and share image. Before October 18 at 15:00 UTC it writes none of
them. At or after release, missing/incorrect keys fail the build closed.

The production Netlify scheduled function `release-grace-notes` triggers the
existing main-branch build hook at 15:00 UTC. It checks again at 15:05 and 15:10,
requesting another build only while the study is absent. An explicit date/year
guard prevents future annual releases. `GRACE_RELEASE_BUILD_HOOK` is scoped to
production **functions**. The function cannot be invoked through a public URL.
No Mac, Codex session, GitHub Actions timer, or local process is required.

The page becomes public after the Netlify build completes; this is a scheduled
build trigger, not a promise of an exact-second switch. Native cloud logs and
deploy history are the verification record. Future builds continue to materialize
the approved release so a daily rebuild cannot remove it.

After publication, maintainers may move the released plaintext sources into the
repository and retire the encrypted loader and one-service schedule together.
Do not retire the loader while the source remains encrypted.

Validation: `node scripts/check-cloud-release.mjs` exercises the time boundary,
no-op/retry behavior, and missing-key failure. Production output must contain no
held study route, preview route, share image, or study prose before release.
