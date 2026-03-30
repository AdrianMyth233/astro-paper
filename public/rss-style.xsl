<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  exclude-result-prefixes="atom dc">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="zh">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>RSS · <xsl:value-of select="/rss/channel/title"/></title>
        <style>
          :root {
            --bg: #fafafa;
            --fg: #1a1a1a;
            --muted: #6b7280;
            --border: #e5e7eb;
            --accent: #6366f1;
            --accent-light: #eef2ff;
            --card-bg: #ffffff;
            --radius: 0.5rem;
            --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif;
            --font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0f0f0f;
              --fg: #e5e7eb;
              --muted: #9ca3af;
              --border: #27272a;
              --accent: #818cf8;
              --accent-light: #1e1b4b;
              --card-bg: #18181b;
            }
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            background: var(--bg);
            color: var(--fg);
            font-family: var(--font-sans);
            font-size: 15px;
            line-height: 1.6;
            min-height: 100vh;
          }

          .container {
            max-width: 720px;
            margin: 0 auto;
            padding: 2rem 1.25rem 4rem;
          }

          /* ── Header ── */
          .header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
          }

          .header-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.75rem;
          }

          .rss-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
            background: #f97316;
            border-radius: 0.25rem;
          }

          .rss-icon svg { display: block; }

          .site-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--fg);
            text-decoration: none;
            line-height: 1.2;
          }

          .site-title:hover { color: var(--accent); }

          .site-desc {
            margin-top: 0.375rem;
            color: var(--muted);
            font-size: 0.9rem;
          }

          .header-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }

          .header-links a {
            font-size: 0.8rem;
            color: var(--muted);
            text-decoration: none;
            border: 1px solid var(--border);
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            transition: color 0.15s, border-color 0.15s;
          }

          .header-links a:hover {
            color: var(--accent);
            border-color: var(--accent);
          }

          /* ── Notice ── */
          .notice {
            background: var(--accent-light);
            border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
            border-radius: var(--radius);
            padding: 0.875rem 1rem;
            font-size: 0.825rem;
            color: var(--muted);
            margin-bottom: 2rem;
            display: flex;
            gap: 0.625rem;
            align-items: flex-start;
          }

          .notice-icon { flex-shrink: 0; margin-top: 0.1rem; color: var(--accent); }

          .notice a { color: var(--accent); text-decoration: none; }
          .notice a:hover { text-decoration: underline; }

          /* ── Post list ── */
          .post-count {
            font-size: 0.8rem;
            color: var(--muted);
            margin-bottom: 1rem;
          }

          .post-list { list-style: none; }

          .post-item {
            border-bottom: 1px solid var(--border);
            padding: 1.25rem 0;
          }

          .post-item:first-child { padding-top: 0; }
          .post-item:last-child { border-bottom: none; }

          .post-date {
            font-size: 0.75rem;
            color: var(--muted);
            font-family: var(--font-mono);
            margin-bottom: 0.35rem;
          }

          .post-title {
            font-size: 1.05rem;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 0.35rem;
          }

          .post-title a {
            color: var(--fg);
            text-decoration: none;
          }

          .post-title a:hover { color: var(--accent); }

          .post-desc {
            font-size: 0.85rem;
            color: var(--muted);
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* ── Footer ── */
          .footer {
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
            font-size: 0.775rem;
            color: var(--muted);
            text-align: center;
          }

          .footer a { color: var(--muted); text-decoration: none; }
          .footer a:hover { color: var(--accent); }
        </style>
      </head>
      <body>
        <div class="container">

          <!-- Header -->
          <div class="header">
            <div class="header-meta">
              <span class="rss-icon">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                  <circle cx="6.18" cy="17.82" r="2.18"/>
                  <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
                </svg>
              </span>
              <span>RSS 订阅</span>
            </div>
            <a class="site-title" href="{/rss/channel/link}">
              <xsl:value-of select="/rss/channel/title"/>
            </a>
            <p class="site-desc">
              <xsl:value-of select="/rss/channel/description"/>
            </p>
            <div class="header-links">
              <a href="{/rss/channel/link}">← 返回博客</a>
              <a href="/rss.xml">复制 RSS 地址</a>
            </div>
          </div>

          <!-- Notice -->
          <div class="notice">
            <span class="notice-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span>
            <span>
              这是一个 RSS 订阅源。将此地址添加到你的 RSS 阅读器（如
              <a href="https://feedly.com" target="_blank">Feedly</a>、
              <a href="https://netnewswire.com" target="_blank">NetNewsWire</a>、
              <a href="https://www.inoreader.com" target="_blank">Inoreader</a>
              ），即可自动获取新文章。
            </span>
          </div>

          <!-- Post count -->
          <p class="post-count">
            共 <xsl:value-of select="count(/rss/channel/item)"/> 篇文章
          </p>

          <!-- Posts -->
          <ul class="post-list">
            <xsl:for-each select="/rss/channel/item">
              <li class="post-item">
                <div class="post-date">
                  <xsl:value-of select="pubDate"/>
                </div>
                <div class="post-title">
                  <a href="{link}" target="_blank">
                    <xsl:value-of select="title"/>
                  </a>
                </div>
                <xsl:if test="description">
                  <p class="post-desc">
                    <xsl:value-of select="description"/>
                  </p>
                </xsl:if>
              </li>
            </xsl:for-each>
          </ul>

          <!-- Footer -->
          <div class="footer">
            <a href="{/rss/channel/link}">
              <xsl:value-of select="/rss/channel/title"/>
            </a>
            · 由 Astro 生成
          </div>

        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
