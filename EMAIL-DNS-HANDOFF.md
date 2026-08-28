# Email DNS Setup — Handoff for a Local Session

**Goal:** Get Microsoft 365 email (purchased through GoDaddy) delivering for **imjustdex.com**.

## Why this handoff exists
Work started in a Claude Code **web** session that was blocked on two fronts:
- **No DNS egress** — live `dig`/DoH lookups are blocked by the environment allowlist, so the published DNS state couldn't be inspected.
- **Read-only Netlify integration** — the MCP tools available could not read or write DNS records.

A **local** session removes both limits: `dig` works, and the user is logged into both **GoDaddy** and **Netlify** in the browser. Start at **STEP 1**.

## Established facts (don't re-derive)
- **DNS host = Netlify DNS.** The user confirmed imjustdex.com's nameservers point to Netlify. → **All email records must be added in Netlify**, not GoDaddy. GoDaddy's DNS panel is inert for this domain.
- **GoDaddy status:** the setup page (`productivity.godaddy.com/#/externaldomain/39083573`) reported *"We were not able to detect your DNS provider" → DNS Provider: Other*. GoDaddy therefore cannot auto-write records; they must be added by hand at the DNS host.
- **Email product = "Microsoft 365 from GoDaddy."** Its SPF is `v=spf1 include:secureserver.net -all` — this is **correct** (GoDaddy routes its resold M365 through `secureserver.net`); it is not a conflict with Microsoft 365.
- **Hosting:** site is on Netlify — project `imjustdex-com`, site_id `ff389de6-02d3-4738-b48b-6c59701f6b7d`, serving https://imjustdex.com. Email records (MX/TXT/sub-CNAME) coexist with the site's apex A/Netlify record, so **adding them will not affect the live site.**

## Records to publish (Netlify → Domains → imjustdex.com → DNS records)
Netlify quirk: leave **Name blank** for the apex; for subdomains use just the label (e.g. `autodiscover`). Never type the full domain into the Name field (causes `imjustdex.com.imjustdex.com`).

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | *(blank / @)* | `imjustdex-com.mail.protection.outlook.com` | `0` |
| TXT (SPF) | *(blank / @)* | `v=spf1 include:secureserver.net -all` | — |
| CNAME | `autodiscover` | `autodiscover.outlook.com` | — |
| CNAME (DKIM, optional) | `selector1._domainkey` | `selector1-imjustdex-com._domainkey.<TENANT>.onmicrosoft.com` | — |
| CNAME (DKIM, optional) | `selector2._domainkey` | `selector2-imjustdex-com._domainkey.<TENANT>.onmicrosoft.com` | — |

The first three are what mail delivery needs. DKIM is optional to start.

⚠ **Copy the exact MX target and the DKIM `<TENANT>.onmicrosoft.com` value from the GoDaddy setup page** — they're tenant-specific. The values above are the standard GoDaddy-M365 pattern, not necessarily this tenant's literal strings. Paste the SPF value raw (no surrounding quotes — Netlify adds them).

## STEP 1 — Inspect live DNS (run locally; network works there)
```bash
dig +short NS    imjustdex.com
dig +short MX    imjustdex.com
dig +short TXT   imjustdex.com
dig +short CNAME autodiscover.imjustdex.com
dig +short CNAME selector1._domainkey.imjustdex.com
dig +short CNAME selector2._domainkey.imjustdex.com
```
Expected once correct:
- **NS** → Netlify (`dns1.p0X.nsone.net`, `dns2…`, `dns3…`, `dns4…`). If NS is **not** Netlify, the "nameservers are in Netlify" assumption is wrong — stop and recheck the registrar.
- **MX** → `0 imjustdex-com.mail.protection.outlook.com.`
- **TXT** → exactly **one** line `"v=spf1 include:secureserver.net -all"`.
- **autodiscover** → `autodiscover.outlook.com.`

To bypass resolver caching and read what Netlify is actually serving:
```bash
NS=$(dig +short NS imjustdex.com | head -1)
dig MX  imjustdex.com @"$NS" +short
dig TXT imjustdex.com @"$NS" +short
```

## STEP 2 — Diagnose (most → least likely)
1. **Records in the wrong place.** `dig` shows nothing but the user "added them" → they were added in GoDaddy's (inert) DNS panel. Re-add in Netlify.
2. **Nothing added yet.** `dig` empty → add the 3 core records in Netlify.
3. **Duplicate SPF.** More than one `v=spf1` TXT → collapse to one (two = both fail).
4. **Doubled name.** A record shows as `*.imjustdex.com.imjustdex.com` → the domain was typed into Netlify's Name field; fix Name to blank/label.
5. **Wrong MX.** MX missing, or not `*.mail.protection.outlook.com` (e.g. points at `secureserver.net`) → set the M365 target, priority `0`.
6. **Propagation only.** Records correct at the Netlify NS but GoDaddy still says "not detected" → wait (minutes–48h) and recheck the GoDaddy page.

## STEP 3 — Verify
- GoDaddy setup page flips to "all set" once it detects the records.
- Send a test email to a new M365 mailbox (e.g. from a personal Gmail) and confirm delivery.
- Optional hardening once mail flows: add DKIM (rows above) and a `_dmarc` TXT record.

## Open items
- DKIM `<TENANT>` and the exact MX host still need to be read off the GoDaddy setup page.
- This file lives at the repo root and is **not** published (Netlify publishes `dist/` only), so it won't appear on the live site.
