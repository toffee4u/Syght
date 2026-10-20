"""
Custom Branded Documentation Portal for Syght Enterprise.
Ultra-high-tech Swagger UI and ReDoc interface styled with Team Pulse aesthetics.
"""

def get_custom_docs_html(
    openapi_url: str = "/openapi.json",
    title: str = "Syght Enterprise API — Team Pulse Documentation",
) -> str:
    """Generates an ultra-premium, custom-styled Swagger UI HTML page matching Syght's UI."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='m9 12 2 2 4-4'/></svg>">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Swagger UI CSS -->
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.18.2/swagger-ui.css">

  <style>
    /* ==============================================================================
       Root Variables & Base Reset
       ============================================================================== */
    :root {{
      --syght-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --syght-font-heading: 'Space Grotesk', sans-serif;
      --syght-font-mono: 'JetBrains Mono', monospace;
      --syght-cyan: #0284c7;
      --syght-emerald: #059669;
      --syght-rose: #e11d48;
      --syght-purple: #7c3aed;
      --syght-dark: #09090b;
      --syght-border: #e2e8f0;
      --syght-bg: #f8fafc;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: var(--syght-font-sans);
      background-color: var(--syght-bg);
      color: #0f172a;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      background-image: 
        linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      background-size: 32px 32px;
    }}

    /* ==============================================================================
       Custom Syght Floating Island Navbar
       ============================================================================== */
    .docs-navbar-wrapper {{
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 0.75rem 1rem 0 1rem;
      pointer-events: none;
    }}

    .docs-navbar {{
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      max-width: 1340px;
      height: 60px;
      padding: 0 1.25rem;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border: 1px solid rgba(226, 232, 240, 0.85);
      border-radius: 20px;
      box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.7), 0 4px 20px -4px rgba(0, 0, 0, 0.06);
    }}

    .navbar-left {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }}

    .brand-logo-link {{
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: inherit;
    }}

    .brand-icon-gem {{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(124, 58, 237, 0.08));
      border: 1px solid rgba(2, 132, 199, 0.25);
      border-radius: 10px;
      color: var(--syght-cyan);
    }}

    .brand-title {{
      font-family: var(--syght-font-heading);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #09090b;
    }}

    .team-pulse-pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      background: rgba(5, 150, 105, 0.08);
      border: 1px solid rgba(5, 150, 105, 0.25);
      border-radius: 9999px;
      font-family: var(--syght-font-mono);
      font-size: 0.68rem;
      font-weight: 600;
      color: #059669;
      letter-spacing: 0.05em;
    }}

    .beacon-dot {{
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #059669;
      box-shadow: 0 0 8px #059669;
      animation: pulseBeacon 2s infinite;
    }}

    @keyframes pulseBeacon {{
      0%, 100% {{ opacity: 0.8; transform: scale(1); }}
      50% {{ opacity: 1; transform: scale(1.3); }}
    }}

    .navbar-center-links {{
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 9999px;
    }}

    .nav-tab-link {{
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.75rem;
      font-size: 0.78rem;
      font-weight: 500;
      color: #64748b;
      text-decoration: none;
      border-radius: 9999px;
      transition: all 0.15s ease;
    }}

    .nav-tab-link:hover {{
      color: #0f172a;
      background: rgba(255, 255, 255, 0.8);
    }}

    .nav-tab-link.active {{
      background: #09090b;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }}

    .navbar-right {{
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    .btn-return-dashboard {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.42rem 0.95rem;
      background: #09090b;
      color: #ffffff;
      text-decoration: none;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }}

    .btn-return-dashboard:hover {{
      background: #27272a;
      transform: translateY(-1px);
    }}

    /* ==============================================================================
       Hero Header Container
       ============================================================================== */
    .docs-hero-section {{
      width: 100%;
      max-width: 1340px;
      margin: 1.5rem auto 1rem auto;
      padding: 2.25rem 2rem 2rem 2rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03), 0 10px 30px -10px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }}

    .hero-glow-halo {{
      position: absolute;
      top: -30px;
      right: -30px;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, rgba(124, 58, 237, 0.04) 50%, transparent 70%);
      pointer-events: none;
    }}

    .docs-hero-chip {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      background: rgba(2, 132, 199, 0.08);
      border: 1px solid rgba(2, 132, 199, 0.2);
      border-radius: 9999px;
      font-family: var(--syght-font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--syght-cyan);
      margin-bottom: 0.85rem;
    }}

    .docs-hero-title {{
      font-family: var(--syght-font-heading);
      font-size: 2.1rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #09090b;
      margin-bottom: 0.5rem;
    }}

    .docs-hero-tagline {{
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      max-width: 820px;
      margin-bottom: 1.5rem;
    }}

    .docs-kpi-strip {{
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
      padding-top: 1.25rem;
      border-top: 1px solid #f1f5f9;
    }}

    .kpi-chip-item {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.76rem;
      color: #334155;
    }}

    .kpi-chip-item strong {{
      font-family: var(--syght-font-mono);
      color: #0f172a;
    }}

    /* ==============================================================================
       Swagger UI Custom Theme Overrides
       ============================================================================== */
    #swagger-ui {{
      max-width: 1340px;
      margin: 0 auto;
      padding: 0 1rem 4rem 1rem;
    }}

    /* Hide default ugly Swagger topbar */
    .swagger-ui .topbar {{
      display: none !important;
    }}

    /* Info section hide (since custom hero covers it) */
    .swagger-ui .info {{
      display: none !important;
    }}

    /* Typography */
    .swagger-ui, 
    .swagger-ui .opblock, 
    .swagger-ui table, 
    .swagger-ui input, 
    .swagger-ui select {{
      font-family: var(--syght-font-sans) !important;
    }}

    .swagger-ui code, 
    .swagger-ui pre, 
    .swagger-ui .opblock .opblock-summary-path, 
    .swagger-ui .response-col_status {{
      font-family: var(--syght-font-mono) !important;
    }}

    /* Filter search bar */
    .swagger-ui .filter-container {{
      padding: 1.25rem 0 !important;
      margin-bottom: 0.5rem !important;
    }}

    .swagger-ui .filter-container input {{
      width: 100% !important;
      max-width: 480px !important;
      padding: 0.65rem 1.15rem !important;
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 9999px !important;
      font-size: 0.85rem !important;
      color: #0f172a !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }}

    .swagger-ui .filter-container input:focus {{
      border-color: var(--syght-cyan) !important;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important;
    }}

    /* Tag headers */
    .swagger-ui .opblock-tag {{
      font-family: var(--syght-font-heading) !important;
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: #09090b !important;
      border-bottom: 2px solid #e2e8f0 !important;
      padding: 1.25rem 0 0.5rem 0 !important;
      margin: 1.5rem 0 0.75rem 0 !important;
    }}

    .swagger-ui .opblock-tag small {{
      font-family: var(--syght-font-sans) !important;
      font-size: 0.82rem !important;
      font-weight: 400 !important;
      color: #64748b !important;
      margin-left: 0.5rem !important;
    }}

    /* Operation Cards */
    .swagger-ui .opblock {{
      margin: 0 0 1rem 0 !important;
      border-radius: 14px !important;
      border: 1px solid #e2e8f0 !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      background: #ffffff !important;
      overflow: hidden !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }}

    .swagger-ui .opblock:hover {{
      border-color: #cbd5e1 !important;
      box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.06) !important;
      transform: translateY(-1px) !important;
    }}

    .swagger-ui .opblock .opblock-summary {{
      padding: 0.85rem 1.25rem !important;
      display: flex !important;
      align-items: center !important;
    }}

    /* HTTP Method Badges */
    .swagger-ui .opblock .opblock-summary-method {{
      border-radius: 8px !important;
      font-family: var(--syght-font-mono) !important;
      font-size: 0.76rem !important;
      font-weight: 700 !important;
      padding: 0.38rem 0.85rem !important;
      min-width: 78px !important;
      text-align: center !important;
      text-shadow: none !important;
    }}

    /* POST Operation */
    .swagger-ui .opblock.opblock-post {{
      border-color: rgba(2, 132, 199, 0.25) !important;
      background: rgba(2, 132, 199, 0.02) !important;
    }}
    .swagger-ui .opblock.opblock-post .opblock-summary-method {{
      background: #0284c7 !important;
      color: #ffffff !important;
    }}

    /* GET Operation */
    .swagger-ui .opblock.opblock-get {{
      border-color: rgba(5, 150, 105, 0.25) !important;
      background: rgba(5, 150, 105, 0.02) !important;
    }}
    .swagger-ui .opblock.opblock-get .opblock-summary-method {{
      background: #059669 !important;
      color: #ffffff !important;
    }}

    /* DELETE Operation */
    .swagger-ui .opblock.opblock-delete {{
      border-color: rgba(225, 29, 72, 0.25) !important;
      background: rgba(225, 29, 72, 0.02) !important;
    }}
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {{
      background: #e11d48 !important;
      color: #ffffff !important;
    }}

    /* Path and description */
    .swagger-ui .opblock .opblock-summary-path a {{
      font-family: var(--syght-font-mono) !important;
      font-size: 0.88rem !important;
      font-weight: 600 !important;
      color: #0f172a !important;
    }}

    .swagger-ui .opblock .opblock-summary-description {{
      font-family: var(--syght-font-sans) !important;
      font-size: 0.8rem !important;
      color: #64748b !important;
    }}

    /* Action Buttons (Execute, Try it out, Clear) */
    .swagger-ui .btn.execute {{
      background: #09090b !important;
      color: #ffffff !important;
      border: 1px solid #09090b !important;
      border-radius: 10px !important;
      font-family: var(--syght-font-sans) !important;
      font-size: 0.85rem !important;
      font-weight: 600 !important;
      padding: 0.55rem 1.5rem !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
      transition: all 0.2s ease !important;
    }}

    .swagger-ui .btn.execute:hover {{
      background: #27272a !important;
      transform: translateY(-1px) !important;
    }}

    .swagger-ui .btn.try-out__btn {{
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 8px !important;
      font-family: var(--syght-font-sans) !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      color: #0f172a !important;
      padding: 0.35rem 0.85rem !important;
    }}

    .swagger-ui .btn.cancel {{
      background: #fee2e2 !important;
      border: 1px solid #fecdd3 !important;
      border-radius: 8px !important;
      color: #b91c1c !important;
    }}

    /* Inputs, Textareas, Selects */
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui textarea,
    .swagger-ui select {{
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 8px !important;
      padding: 0.5rem 0.75rem !important;
      font-family: var(--syght-font-mono) !important;
      font-size: 0.8rem !important;
      color: #0f172a !important;
    }}

    .swagger-ui input[type=text]:focus,
    .swagger-ui textarea:focus {{
      border-color: var(--syght-cyan) !important;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important;
      outline: none !important;
    }}

    /* Response section & code blocks */
    .swagger-ui .responses-inner {{
      padding: 1.25rem !important;
      background: #f8fafc !important;
      border-radius: 10px !important;
    }}

    .swagger-ui .response-col_status {{
      font-size: 0.82rem !important;
      font-weight: 700 !important;
    }}

    .swagger-ui .highlight-code pre {{
      background: #0f172a !important;
      color: #e2e8f0 !important;
      border-radius: 10px !important;
      padding: 1rem !important;
      font-family: var(--syght-font-mono) !important;
      font-size: 0.78rem !important;
      line-height: 1.5 !important;
    }}

    /* Models and schemas */
    .swagger-ui section.models {{
      border: 1px solid #e2e8f0 !important;
      border-radius: 14px !important;
      background: #ffffff !important;
      margin-top: 2rem !important;
    }}

    .swagger-ui section.models h4 {{
      font-family: var(--syght-font-heading) !important;
      font-size: 1.15rem !important;
      font-weight: 700 !important;
      color: #09090b !important;
      padding: 1rem 1.25rem !important;
      border-bottom: 1px solid #f1f5f9 !important;
    }}

    /* Footer */
    .docs-footer {{
      width: 100%;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 2rem 1rem;
      text-align: center;
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 4rem;
    }}

    .docs-footer-inner {{
      max-width: 1340px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }}

    @media (max-width: 768px) {{
      .docs-hero-title {{ font-size: 1.6rem; }}
      .navbar-center-links {{ display: none; }}
      .docs-footer-inner {{ flex-direction: column; text-align: center; }}
    }}
  </style>
</head>
<body>

  <!-- Floating Island Topbar -->
  <div class="docs-navbar-wrapper">
    <nav class="docs-navbar">
      <div class="navbar-left">
        <a href="/" class="brand-logo-link" title="Syght — Enterprise Healthcare Fraud Detection">
          <div class="brand-icon-gem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <span class="brand-title">SYGHT</span>
        </a>
        <div class="team-pulse-pill">
          <span class="beacon-dot"></span>
          <span>Team Pulse</span>
        </div>
      </div>

      <div class="navbar-center-links">
        <a href="/docs" class="nav-tab-link active">Interactive Swagger</a>
        <a href="/redoc" class="nav-tab-link">ReDoc Console</a>
        <a href="/openapi.json" target="_blank" class="nav-tab-link">OpenAPI Spec (JSON)</a>
        <a href="/health" target="_blank" class="nav-tab-link">Health API</a>
      </div>

      <div class="navbar-right">
        <a href="/" class="btn-return-dashboard" title="Open Interactive Fraud Detection Web Application">
          <span>Live Radar Dashboard</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </nav>
  </div>

  <!-- Hero Header -->
  <header class="docs-hero-section">
    <div class="hero-glow-halo"></div>
    <div class="docs-hero-chip">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span>Engineered by Team Pulse • Enterprise SIU API</span>
    </div>
    <h1 class="docs-hero-title">Syght Healthcare Fraud Intelligence API</h1>
    <p class="docs-hero-tagline">
      High-throughput production gateway executing calibrated LightGBM risk scoring, TreeSHAP feature attributions, 
      and sub-5ms real-time pre-authorization interception for PM-JAY and private health insurance claims.
    </p>

    <div class="docs-kpi-strip">
      <div class="kpi-chip-item">
        <span>Engine:</span>
        <strong>LightGBM (1-SE Rule)</strong>
      </div>
      <div class="kpi-chip-item">
        <span>Decision Cutoff:</span>
        <strong>0.5364</strong>
      </div>
      <div class="kpi-chip-item">
        <span>Latency SLA:</span>
        <strong>&lt; 5.0 ms Pre-Auth</strong>
      </div>
      <div class="kpi-chip-item">
        <span>Features Tracked:</span>
        <strong>61 Operational & Graph</strong>
      </div>
      <div class="kpi-chip-item">
        <span>Currency:</span>
        <strong>Indian Rupee (₹)</strong>
      </div>
      <div class="kpi-chip-item">
        <span>Specification:</span>
        <strong>OpenAPI 3.1.0</strong>
      </div>
    </div>
  </header>

  <!-- Swagger UI Mount Target -->
  <main id="swagger-ui"></main>

  <!-- Footer -->
  <footer class="docs-footer">
    <div class="docs-footer-inner">
      <div>
        <strong>Syght Enterprise</strong> — Engineered with pride by <strong>Team Pulse</strong>.
      </div>
      <div>
        Ayushman Bharat PM-JAY & National Health Authority (NHA) Aligned Architecture.
      </div>
    </div>
  </footer>

  <!-- Swagger UI JavaScript Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.18.2/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = () => {{
      window.ui = SwaggerUIBundle({{
        url: '{openapi_url}',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 2,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
        syntaxHighlight: {{
          theme: "monokai"
        }}
      }});
    }};
  </script>
</body>
</html>
"""


def get_custom_redoc_html(
    openapi_url: str = "/openapi.json",
    title: str = "Syght Enterprise API — Team Pulse ReDoc Console",
) -> str:
    """Generates an ultra-premium ReDoc HTML documentation page."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='m9 12 2 2 4-4'/></svg>">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">

  <style>
    body {{
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }}
    .redoc-top-banner {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      background: #09090b;
      color: #ffffff;
      font-size: 0.85rem;
    }}
    .redoc-brand {{
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #ffffff;
      text-decoration: none;
    }}
    .redoc-nav-links {{
      display: flex;
      align-items: center;
      gap: 1rem;
    }}
    .redoc-nav-links a {{
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
      transition: color 0.2s;
    }}
    .redoc-nav-links a:hover, .redoc-nav-links a.active {{
      color: #ffffff;
    }}
  </style>
</head>
<body>
  <div class="redoc-top-banner">
    <a href="/" class="redoc-brand">
      <span>SYGHT</span>
      <span style="font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; background: rgba(5, 150, 105, 0.2); color: #10b981; padding: 2px 7px; border-radius: 9999px;">Team Pulse</span>
    </a>
    <div class="redoc-nav-links">
      <a href="/docs">Interactive Swagger</a>
      <a href="/redoc" class="active">ReDoc Console</a>
      <a href="/openapi.json" target="_blank">OpenAPI JSON</a>
      <a href="/" style="background: #27272a; padding: 4px 10px; border-radius: 6px; color: #ffffff;">← Live Dashboard</a>
    </div>
  </div>

  <redoc spec-url="{openapi_url}"></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.1.5/bundles/redoc.standalone.js"></script>
</body>
</html>
"""
