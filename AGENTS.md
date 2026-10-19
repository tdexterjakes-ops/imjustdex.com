# IMJUSTDEX publishing

This repository is public. Grace in the Dark published October 18, 2026 at
10:00 AM America/Chicago; its MDX, study JSON and share image are committed
here, and the encrypted release package, loader and one-service timer have been
retired. Private review evidence and manuscript source stay out of this
repository. Future sermon notes are held until their own authorized release.

Preserve all 43 passages open, the approved wording, and existing outbound links.

The page carries one outbound link by design: the broadcast sermon video,
authorized October 18, 2026. `SermonVideo.astro` renders a poster and injects
the YouTube iframe only after a reader presses play, so no page load contacts
Google. Do not remove it as an outbound-link violation; the social sharing
links stay off. Its mapping is `src/data/sermons/videos.json`, keyed by slug,
so a video touches no content file. It depends on `frame-src
https://www.youtube-nocookie.com` in the netlify.toml CSP — without that
directive the player blanks with no visible error. Do not widen it to
`www.youtube.com`. The poster is built by `scripts/sermon-poster.mjs`; pin
`--vol` to the entry's own volume so it matches the share plate.
Do not infer a preached date from the scheduled release. Do not merge the local
`codex/grace-in-the-dark-draft` branch wholesale: it contains unpublished sources
and review evidence that were deliberately excluded from the public repository.

The cloud materializer runs before every build. Tests can use an isolated fixture;
never alter the production clock or release timestamp to test publication.
