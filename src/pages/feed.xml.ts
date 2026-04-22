import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://imjustdex.com';
const TITLE = 'DX — Dexter Jakes';
const SUBTITLE = 'Faith, weight, and the words that carry both.';
const RIGHTS = `© ${new Date().getUTCFullYear()} Dexter Jakes. All rights reserved.`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoZ(dateStr: string): string {
  // Accept YYYY-MM-DD or full ISO; emit UTC Z format for Atom.
  const d = dateStr.length === 10
    ? new Date(`${dateStr}T00:00:00Z`)
    : new Date(dateStr);
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export const GET: APIRoute = async () => {
  const today = new Date();
  const entries = (await getCollection('words'))
    .filter((e) => e.data.status === 'published')
    .filter((e) => new Date(e.data.publishedDate) <= today)
    .sort(
      (a, b) =>
        new Date(b.data.publishedDate).getTime() -
        new Date(a.data.publishedDate).getTime()
    );

  const feedUpdated = entries.length > 0 ? toIsoZ(entries[0].data.publishedDate) : toIsoZ(new Date().toISOString());

  const entryXml = entries
    .map((e) => {
      const d = e.data;
      const url = `${SITE}/words/${e.slug}/`;
      const published = toIsoZ(d.publishedDate);
      const updated = toIsoZ(d.updatedDate ?? d.publishedDate);
      return `  <entry>
    <title>${escapeXml(d.title)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <summary type="html">${escapeXml(d.description)}</summary>
    <author>
      <name>Dexter Jakes</name>
      <uri>${SITE}/about/</uri>
    </author>
  </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(TITLE)}</title>
  <subtitle>${escapeXml(SUBTITLE)}</subtitle>
  <link href="${SITE}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE}/" rel="alternate" type="text/html"/>
  <id>${SITE}/</id>
  <updated>${feedUpdated}</updated>
  <rights>${escapeXml(RIGHTS)}</rights>
  <author>
    <name>Dexter Jakes</name>
    <uri>${SITE}/about/</uri>
  </author>
  <icon>${SITE}/img/favicon-32.png</icon>
  <logo>${SITE}/img/og-default.png</logo>

${entryXml}
</feed>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
};
