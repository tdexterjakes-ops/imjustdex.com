<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="atom:feed/atom:title"/> — Feed</title>
      </head>
      <body style="margin:0;font-family:'IBM Plex Sans',system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.7;color:#050505;background:#f4f4f1;background-image:linear-gradient(to right,transparent 0,transparent calc(100% - 1px),rgba(0,0,0,.14) calc(100% - 1px)),linear-gradient(to bottom,transparent 0,transparent calc(100% - 1px),rgba(0,0,0,.14) calc(100% - 1px));background-size:46px 46px;">
        <div style="max-width:680px;margin:0 auto;padding:32px 28px 80px;">
          <!-- Masthead -->
          <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px 13px;border:2px solid #0a0a0a;margin-bottom:32px;">
            <a href="/" style="font-family:Anton,Impact,sans-serif;font-size:.88rem;letter-spacing:.03em;text-transform:uppercase;text-decoration:none;color:#050505;">DX — Words</a>
            <span style="font-family:'SF Mono','Fira Code',monospace;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 8px 4px;border:2px solid #0a0a0a;background:#0a0a0a;color:#f5f5f1;">RSS Feed</span>
          </nav>

          <!-- Title -->
          <h1 style="font-family:Anton,Impact,sans-serif;font-size:clamp(2rem,4vw,4rem);font-weight:400;line-height:.86;letter-spacing:-.03em;text-transform:uppercase;margin:0 0 8px;">
            <xsl:value-of select="atom:feed/atom:title"/>
          </h1>
          <p style="color:rgba(5,5,5,.56);font-size:.88rem;margin:0 0 32px;">
            <xsl:value-of select="atom:feed/atom:subtitle"/>
          </p>

          <!-- Subscribe notice -->
          <div style="font-family:'SF Mono','Fira Code',monospace;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:rgba(5,5,5,.56);margin:0 0 32px;padding:16px;border:2px solid rgba(5,5,5,.18);background:rgba(5,5,5,.04);">
            This is an RSS feed. Subscribe by copying this URL into your feed reader.
            <br/>Or follow via <a href="/" style="color:#c00;text-decoration:none;">the archive</a>.
          </div>

          <!-- Entries -->
          <xsl:for-each select="atom:feed/atom:entry">
            <a href="{atom:link[@rel='alternate']/@href}" style="border:3px solid #0a0a0a;background:#f8f8f6;margin-bottom:12px;display:flex;flex-direction:column;justify-content:space-between;text-decoration:none;color:inherit;">
              <div style="padding:16px 16px 12px;">
                <h2 style="font-family:Anton,Impact,sans-serif;font-size:clamp(1.2rem,2.5vw,2rem);font-weight:400;line-height:.86;letter-spacing:-.03em;text-transform:uppercase;margin:0 0 8px;">
                  <xsl:value-of select="atom:title"/>
                </h2>
                <p style="color:rgba(5,5,5,.82);font-size:.88rem;line-height:1.5;margin:0;">
                  <xsl:value-of select="atom:summary"/>
                </p>
              </div>
              <div style="align-self:flex-start;padding:7px 8px 6px;background:#0a0a0a;color:#f5f5f1;font-family:'SF Mono','Fira Code',monospace;font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;line-height:1;border-top:2px solid #0a0a0a;border-right:2px solid #0a0a0a;">
                <xsl:value-of select="substring(atom:published, 1, 10)"/>
              </div>
            </a>
          </xsl:for-each>

          <!-- Footer -->
          <div style="margin-top:32px;padding:14px 0 0;border-top:2px solid rgba(5,5,5,.18);font-family:'SF Mono','Fira Code',monospace;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:rgba(5,5,5,.56);display:flex;justify-content:space-between;">
            <a href="/" style="color:inherit;text-decoration:none;">← Back</a>
            <span>Est. 1994</span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
