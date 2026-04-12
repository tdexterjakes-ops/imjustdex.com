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
        <style>
          *,*::before,*::after{box-sizing:border-box}
          body{
            margin:0;font-family:'IBM Plex Sans',system-ui,-apple-system,sans-serif;
            font-size:16px;line-height:1.7;color:#050505;background:#f4f4f1;
            background-image:
              linear-gradient(to right,transparent 0,transparent calc(100% - 1px),rgba(0,0,0,.14) calc(100% - 1px)),
              linear-gradient(to bottom,transparent 0,transparent calc(100% - 1px),rgba(0,0,0,.14) calc(100% - 1px));
            background-size:46px 46px;
          }
          .shell{max-width:680px;margin:0 auto;padding:32px 28px 80px}
          .masthead{
            display:flex;align-items:center;justify-content:space-between;
            padding:14px 16px 13px;border:2px solid #0a0a0a;margin-bottom:32px;
          }
          .brand{
            font-family:'Anton',Impact,sans-serif;font-size:.88rem;
            letter-spacing:.03em;text-transform:uppercase;text-decoration:none;color:#050505;
          }
          .badge{
            font-family:'SF Mono','Fira Code',monospace;font-size:.72rem;
            font-weight:700;letter-spacing:.08em;text-transform:uppercase;
            padding:5px 8px 4px;border:2px solid #0a0a0a;background:#0a0a0a;color:#f5f5f1;
          }
          h1{
            font-family:'Anton',Impact,sans-serif;font-size:clamp(2rem,4vw,4rem);
            font-weight:400;line-height:.86;letter-spacing:-.03em;
            text-transform:uppercase;margin:0 0 8px;
          }
          .subtitle{color:rgba(5,5,5,.56);font-size:.88rem;margin:0 0 32px}
          .notice{
            font-family:'SF Mono','Fira Code',monospace;font-size:.75rem;
            letter-spacing:.1em;text-transform:uppercase;font-weight:700;
            color:rgba(5,5,5,.56);margin:0 0 32px;
            padding:16px;border:2px solid rgba(5,5,5,.18);background:rgba(5,5,5,.04);
          }
          .notice a{color:#c00;text-decoration:none}
          .notice a:hover{text-decoration:underline}
          .entry{
            border:3px solid #0a0a0a;background:#f8f8f6;margin-bottom:12px;
            display:flex;flex-direction:column;justify-content:space-between;
            text-decoration:none;color:inherit;transition:border-color .12s ease;
          }
          .entry:hover{border-color:#c00}
          .entry-body{padding:16px 16px 12px}
          .entry-title{
            font-family:'Anton',Impact,sans-serif;font-size:clamp(1.2rem,2.5vw,2rem);
            font-weight:400;line-height:.86;letter-spacing:-.03em;
            text-transform:uppercase;margin:0 0 8px;
          }
          .entry-summary{
            color:rgba(5,5,5,.82);font-size:.88rem;line-height:1.5;margin:0;
          }
          .entry-meta{
            align-self:flex-start;padding:7px 8px 6px;
            background:#0a0a0a;color:#f5f5f1;
            font-family:'SF Mono','Fira Code',monospace;
            font-size:.82rem;font-weight:700;letter-spacing:.08em;
            text-transform:uppercase;line-height:1;
            border-top:2px solid #0a0a0a;border-right:2px solid #0a0a0a;
          }
          .footer{
            margin-top:32px;padding:14px 0 0;
            border-top:2px solid rgba(5,5,5,.18);
            font-family:'SF Mono','Fira Code',monospace;font-size:.72rem;
            letter-spacing:.06em;text-transform:uppercase;color:rgba(5,5,5,.56);
            display:flex;justify-content:space-between;
          }
          .footer a{color:inherit;text-decoration:none}
          .footer a:hover{color:#c00}
        </style>
      </head>
      <body>
        <div class="shell">
          <nav class="masthead">
            <a class="brand" href="/">DX — Words</a>
            <span class="badge">RSS Feed</span>
          </nav>

          <h1><xsl:value-of select="atom:feed/atom:title"/></h1>
          <p class="subtitle"><xsl:value-of select="atom:feed/atom:subtitle"/></p>

          <div class="notice">
            This is an RSS feed. Subscribe by copying this URL into your feed reader.
            <br/>Or follow via <a href="/">the archive</a>.
          </div>

          <xsl:for-each select="atom:feed/atom:entry">
            <a class="entry" href="{atom:link[@rel='alternate']/@href}">
              <div class="entry-body">
                <h2 class="entry-title"><xsl:value-of select="atom:title"/></h2>
                <p class="entry-summary"><xsl:value-of select="atom:summary"/></p>
              </div>
              <div class="entry-meta">
                <xsl:value-of select="substring(atom:published, 1, 10)"/>
              </div>
            </a>
          </xsl:for-each>

          <div class="footer">
            <a href="/">← Back</a>
            <span>Est. 1994</span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
