"""
Custom Branded Documentation Portal for Syght Enterprise.
Ultra-high-tech Swagger UI, ReDoc, and dedicated Architecture, Archetypes, and Benchmark pages.
Styled with Team Pulse signature aesthetics.
"""

SYGHT_FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <radialGradient id="syghtGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#6366f1" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#syghtGlow)"/>
  <rect x="4" y="4" width="56" height="56" rx="14" fill="#09090b" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <path d="M32 9 L49 16 C49 32 42 45 32 54 C22 45 15 32 15 16 Z" fill="#0f172a" stroke="url(#shieldGrad)" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="32" cy="30" r="13" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1" stroke-dasharray="2 3"/>
  <circle cx="32" cy="30" r="8" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1"/>
  <line x1="32" y1="18" x2="32" y2="23" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="32" y1="37" x2="32" y2="42" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="20" y1="30" x2="25" y2="30" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="39" y1="30" x2="44" y2="30" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>
  <polygon points="32,24 37,30 32,36 27,30" fill="url(#coreGrad)"/>
  <circle cx="32" cy="30" r="2.2" fill="#ffffff"/>
  <circle cx="46" cy="18" r="2.5" fill="#10b981"/>
</svg>"""

FAVICON_DATA_URI = "data:image/svg+xml," + SYGHT_FAVICON_SVG.replace("<", "%3C").replace(">", "%3E").replace("#", "%23").replace('"', "'")


def _get_shared_styles() -> str:
    return f"""
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

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

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

    /* Floating Island Navbar */
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
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 1rem;
      width: 100%;
      max-width: 1340px;
      height: 60px;
      padding: 0 1.25rem;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border: 1px solid rgba(226, 232, 240, 0.85);
      border-radius: 20px;
      box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.7), 0 4px 20px -4px rgba(0, 0, 0, 0.06);
    }}

    .navbar-left {{
      justify-self: start;
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
      background: #09090b;
      border: 1px solid rgba(2, 132, 199, 0.4);
      border-radius: 10px;
      overflow: hidden;
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
    }}

    /* Nav center links */
    .navbar-center-links {{
      justify-self: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      gap: 4px;
      padding: 3px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 9999px;
      overflow-x: auto;
      white-space: nowrap;
    }}

    .nav-tab-link {{
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.8rem;
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
      justify-self: end;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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

    /* Docs Content Containers */
    .docs-content-container {{
      max-width: 1240px;
      margin: 2rem auto 5rem auto;
      padding: 0 1.5rem;
    }}

    .docs-article-card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 2.75rem 2.5rem;
      box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.05);
      margin-bottom: 2rem;
    }}

    .docs-page-tag {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0284c7;
      border-radius: 9999px;
      font-family: var(--syght-font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }}

    .docs-page-title {{
      font-family: var(--syght-font-heading);
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1.25;
      margin-bottom: 0.75rem;
    }}

    .docs-page-subtitle {{
      font-size: 1.08rem;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 2rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 1.5rem;
    }}

    .docs-grid-2 {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }}

    .docs-feature-box {{
      padding: 1.5rem;
      border-radius: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }}

    .docs-feature-box.danger {{
      background: #fff1f2;
      border-color: #fecdd3;
    }}

    .docs-feature-box.clean {{
      background: #f0fdf4;
      border-color: #bbf7d0;
    }}

    .docs-feature-box.sky {{
      background: #f0f9ff;
      border-color: #bae6fd;
    }}

    .docs-box-title {{
      font-family: var(--syght-font-heading);
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    .docs-box-text {{
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.6;
    }}

    .docs-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.88rem;
    }}

    .docs-table th {{
      background: #f1f5f9;
      color: #0f172a;
      text-align: left;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      font-family: var(--syght-font-heading);
      font-weight: 700;
    }}

    .docs-table td {{
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      color: #334155;
    }}

    .docs-table tr:nth-child(even) {{
      background: #f8fafc;
    }}

    .docs-code-box {{
      background: #09090b;
      color: #f8fafc;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      font-family: var(--syght-font-mono);
      font-size: 0.82rem;
      line-height: 1.6;
      overflow-x: auto;
      margin: 1.5rem 0;
    }}

    .docs-footer {{
      width: 100%;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 2rem 1rem;
      text-align: center;
      font-size: 0.82rem;
      color: #64748b;
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

    @media (max-width: 900px) {{
      .navbar-center-links {{ display: none; }}
      .docs-navbar {{ display: flex; justify-content: space-between; }}
    }}
    """


def _get_navbar_html(active_tab: str = "api") -> str:
    return f"""
  <div class="docs-navbar-wrapper">
    <nav class="docs-navbar">
      <div class="navbar-left">
        <a href="/" class="brand-logo-link" title="Syght — Healthcare Fraud Detection Platform">
          <div class="brand-icon-gem">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <path d="M32 9 L49 16 C49 32 42 45 32 54 C22 45 15 32 15 16 Z" fill="#0f172a" stroke="#0284c7" stroke-width="3"/>
              <polygon points="32,24 37,30 32,36 27,30" fill="#10b981"/>
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
        <a href="/docs" class="nav-tab-link {'active' if active_tab == 'api' else ''}">API Explorer</a>
        <a href="/docs/architecture" class="nav-tab-link {'active' if active_tab == 'architecture' else ''}">Architecture & 1-SE</a>
        <a href="/docs/archetypes" class="nav-tab-link {'active' if active_tab == 'archetypes' else ''}">Clinical Archetypes</a>
        <a href="/docs/benchmark" class="nav-tab-link {'active' if active_tab == 'benchmark' else ''}">Benchmark & Models</a>
        <a href="/redoc" class="nav-tab-link {'active' if active_tab == 'redoc' else ''}">ReDoc Reference</a>
      </div>

      <div class="navbar-right">
        <a href="/" class="btn-return-dashboard" title="Open Interactive Fraud Detection Web Application">
          <span>Live Radar App</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </nav>
  </div>
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
  <link rel="icon" type="image/svg+xml" href="{FAVICON_DATA_URI}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.18.2/swagger-ui.css">

  <style>
    {_get_shared_styles()}

    /* Hero Header Container */
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

    #swagger-ui {{
      max-width: 1340px;
      margin: 0 auto;
      padding: 0 1rem 4rem 1rem;
    }}

    .swagger-ui .topbar {{ display: none !important; }}
    .swagger-ui .info {{ display: none !important; }}
    .swagger-ui, .swagger-ui .opblock {{ font-family: var(--syght-font-sans) !important; }}
    .swagger-ui code, .swagger-ui pre {{ font-family: var(--syght-font-mono) !important; }}
  </style>
</head>
<body>

  {_get_navbar_html(active_tab="api")}

  <!-- Hero Header -->
  <header class="docs-hero-section">
    <div class="hero-glow-halo"></div>
    <div class="docs-hero-chip">
      <span>Team Pulse • Enterprise Fraud Intelligence Portal</span>
    </div>
    <h1 class="docs-hero-title">Syght Healthcare Fraud Intelligence API</h1>
    <p class="docs-hero-tagline">
      High-throughput production gateway executing calibrated LightGBM risk scoring, TreeSHAP feature attributions, 
      and sub-5ms real-time pre-authorization interception for PM-JAY and private health insurance claims.
    </p>

    <div class="docs-kpi-strip">
      <div class="kpi-chip-item">
        <span>Champion Engine:</span>
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
        <strong>61 Clinical & Graph</strong>
      </div>
      <div class="kpi-chip-item">
        <span>Currency:</span>
        <strong>Indian Rupee (₹)</strong>
      </div>
    </div>
  </header>

  <!-- Swagger UI Mount Target -->
  <main id="swagger-ui"></main>

  <footer class="docs-footer">
    <div class="docs-footer-inner">
      <div><strong>Syght Enterprise</strong> — Engineered with pride by <strong>Team Pulse</strong>.</div>
      <div>Ayushman Bharat PM-JAY & National Health Authority (NHA) Aligned Architecture.</div>
    </div>
  </footer>

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
        tryItOutEnabled: true
      }});
    }};
  </script>
</body>
</html>
"""


def get_docs_architecture_html() -> str:
    """Dedicated separate documentation page: Architecture & 1-SE Decision Rule."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architecture & 1-SE Rule — Syght Documentation</title>
  <link rel="icon" type="image/svg+xml" href="{FAVICON_DATA_URI}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    {_get_shared_styles()}
  </style>
</head>
<body>
  {_get_navbar_html(active_tab="architecture")}

  <main class="docs-content-container">
    <article class="docs-article-card">
      <div class="docs-page-tag">Core ML System Architecture</div>
      <h1 class="docs-page-title">The 1-SE Rule & Calibrated Decision Cutoff</h1>
      <p class="docs-page-subtitle">
        How Syght achieves 94.1% ROC-AUC while eliminating false negatives that lead to crores of rupees in fraudulent disbursements.
      </p>

      <div class="docs-grid-2">
        <div class="docs-feature-box sky">
          <div class="docs-box-title">Why the 1-SE Rule?</div>
          <p class="docs-box-text">
            Standard cross-validation picks the absolute maximum score, often selecting an overfitted, fragile model.
            The One Standard Error (1-SE) rule selects the most parsimonious model whose performance is within one standard error of the empirical optimum.
          </p>
        </div>

        <div class="docs-feature-box clean">
          <div class="docs-box-title">Cost-Optimal Cutoff: 0.5364</div>
          <p class="docs-box-text">
            Default 0.50 thresholds treat False Positives and False Negatives equally. In healthcare insurance, a False Negative costs ₹25,00,000+ in illegal payouts, 
            whereas a False Positive costs only ₹3,500 in auditor desk review. Our cost matrix calibrates the decision cutoff at <strong>0.5364</strong>.
          </p>
        </div>
      </div>

      <h2 style="font-family: var(--syght-font-heading); margin: 2rem 0 1rem 0; font-size: 1.5rem;">Pipeline Execution Stages</h2>

      <table class="docs-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Component</th>
            <th>Latency SLA</th>
            <th>Output Artifact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Ingestion & Normalization</strong></td>
            <td>Pandas 2.0 Ingestion Vectorizer</td>
            <td>0.12 ms</td>
            <td>61 Clean Clinical Indicators</td>
          </tr>
          <tr>
            <td><strong>2. Collusion Graph Synthesis</strong></td>
            <td>NetworkX Bipartite Centrality Engine</td>
            <td>4.10 ms</td>
            <td>Eigenvector & Degree Centrality Vector</td>
          </tr>
          <tr>
            <td><strong>3. Parallel Model Inference</strong></td>
            <td>LightGBM + XGBoost + Random Forest</td>
            <td>1.84 ms</td>
            <td>Consensus Probability Score</td>
          </tr>
          <tr>
            <td><strong>4. 1-SE Cutoff Calibration</strong></td>
            <td>Cost Matrix Optimizer (0.5364 Cutoff)</td>
            <td>0.05 ms</td>
            <td>Binary Decision (FLAG / CLEAR)</td>
          </tr>
          <tr>
            <td><strong>5. TreeSHAP Attribution</strong></td>
            <td>Fast TreeExplainer Engine</td>
            <td>1.20 ms</td>
            <td>Rupee Contribution Dossier</td>
          </tr>
        </tbody>
      </table>

      <h2 style="font-family: var(--syght-font-heading); margin: 2rem 0 1rem 0; font-size: 1.5rem;">Sample Python Inference Code</h2>
      <div class="docs-code-box">
<span style="color:#64748b"># Python SDK Usage</span>
<span style="color:#38bdf8">from</span> ml_pipeline.predict <span style="color:#38bdf8">import</span> SyghtPredictor

predictor = SyghtPredictor.load_from_bundle(<span style="color:#10b981">"models/syght_model_bundle.joblib"</span>)

claim_features = {{
    <span style="color:#10b981">"total_inpatient_surgeries"</span>: 245,
    <span style="color:#10b981">"unique_attending_physicians"</span>: 1,
    <span style="color:#10b981">"mean_inpatient_duration"</span>: 16.8,
    <span style="color:#10b981">"bipartite_collusion_eigenvector"</span>: 0.942
}}

result = predictor.predict_provider(claim_features, provider_id=<span style="color:#10b981">"PRV_02"</span>)
<span style="color:#38bdf8">print</span>(f<span style="color:#10b981">"Verdict: {{result['decision']}} (Score: {{result['fraud_risk_score']}})"</span>)
      </div>
    </article>
  </main>

  <footer class="docs-footer">
    <div class="docs-footer-inner">
      <div><strong>Syght Architecture Documentation</strong> • Team Pulse Engineering</div>
      <div><a href="/docs" style="color: #0284c7; text-decoration: none;">← Return to Interactive Swagger</a></div>
    </div>
  </footer>
</body>
</html>
"""


def get_docs_archetypes_html() -> str:
    """Dedicated separate documentation page: Clinical Fraud Archetypes."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clinical Fraud Archetypes — Syght Documentation</title>
  <link rel="icon" type="image/svg+xml" href="{FAVICON_DATA_URI}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    {_get_shared_styles()}
  </style>
</head>
<body>
  {_get_navbar_html(active_tab="archetypes")}

  <main class="docs-content-container">
    <article class="docs-article-card">
      <div class="docs-page-tag">SIU Forensic Guide</div>
      <h1 class="docs-page-title">4 Clinical Healthcare Fraud Archetypes</h1>
      <p class="docs-page-subtitle">
        How Syght classifies systemic billing scams into clear forensic archetypes with immediate actionable directives.
      </p>

      <div class="docs-grid-2">
        <div class="docs-feature-box danger">
          <div class="docs-box-title">1. Ghost Surgeries (Phantom Theatre Logs)</div>
          <p class="docs-box-text">
            <strong>Pattern:</strong> Single surgeon claiming >200 complex surgeries each month.<br>
            <strong>Forensic Signature:</strong> Surgeries-to-physicians ratio &gt; 35.0 (Standard norm: 2.1 to 6.4).<br>
            <strong>Action Directive:</strong> Immediate disbursement freeze. Subpoena operation theatre biometric access logs and anesthesia duty rosters.
          </p>
        </div>

        <div class="docs-feature-box danger">
          <div class="docs-box-title">2. Artificial ICU Stays (Upcoding Prolongation)</div>
          <p class="docs-box-text">
            <strong>Pattern:</strong> Retaining patients in ICU beds for 16.8 days (vs 3.2 days standard).<br>
            <strong>Forensic Signature:</strong> Inpatient mean LOS &gt; 14 days + ventilator billing &gt; 96 hrs without matching ABG lab records.<br>
            <strong>Action Directive:</strong> Depaneling audit. Commission third-party clinical chart re-review by state medical board.
          </p>
        </div>

        <div class="docs-feature-box danger">
          <div class="docs-box-title">3. Doctor Recycling Syndicates (Kickback Rings)</div>
          <p class="docs-box-text">
            <strong>Pattern:</strong> Doctors rotating across 3+ competing private hospitals within 24 hours.<br>
            <strong>Forensic Signature:</strong> NetworkX bipartite cross-admit density &gt; 0.85 with circular referral loops.<br>
            <strong>Action Directive:</strong> Flag all affiliated sister institutions in the collusion ring for coordinated treasury hold.
          </p>
        </div>

        <div class="docs-feature-box danger">
          <div class="docs-box-title">4. Post-Mortem Claim Submissions</div>
          <p class="docs-box-text">
            <strong>Pattern:</strong> Billing medical procedures dated after the patient's recorded date of death.<br>
            <strong>Forensic Signature:</strong> Claim admission date &gt; Beneficiary DOD in government civil registry database.<br>
            <strong>Action Directive:</strong> Immediate police FIR referral for criminal forgery and license revocation.
          </p>
        </div>
      </div>

      <div class="docs-feature-box clean" style="margin-top: 1.5rem;">
        <div class="docs-box-title" style="color: #047857;">Clean Facility Baseline: Accredited Community Clinic</div>
        <p class="docs-box-text" style="color: #065f46;">
          <strong>Pattern:</strong> Balanced outpatient checkups (85%), low surgical ratio (1.8), standard hospital stay (2.4 days), zero shared roving physicians.<br>
          <strong>Action Directive:</strong> Auto-cleared for expedited 24-hour treasury disbursement without administrative delays.
        </p>
      </div>
    </article>
  </main>

  <footer class="docs-footer">
    <div class="docs-footer-inner">
      <div><strong>Syght Forensic Archetypes</strong> • Team Pulse Engineering</div>
      <div><a href="/docs" style="color: #0284c7; text-decoration: none;">← Return to Interactive Swagger</a></div>
    </div>
  </footer>
</body>
</html>
"""


def get_docs_benchmark_html() -> str:
    """Dedicated separate documentation page: Benchmark Metrics & Models."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Benchmark & Models — Syght Documentation</title>
  <link rel="icon" type="image/svg+xml" href="{FAVICON_DATA_URI}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    {_get_shared_styles()}
  </style>
</head>
<body>
  {_get_navbar_html(active_tab="benchmark")}

  <main class="docs-content-container">
    <article class="docs-article-card">
      <div class="docs-page-tag">Dataset & Model Tournament</div>
      <h1 class="docs-page-title">5.5 Lakh Claims Multi-Model Benchmark</h1>
      <p class="docs-page-subtitle">
        Rigorous 5-fold cross-validated evaluation comparing gradient boosted trees, bagged ensembles, and linear models across 5,410 healthcare providers.
      </p>

      <table class="docs-table">
        <thead>
          <tr>
            <th>Model Architecture</th>
            <th>Status</th>
            <th>ROC-AUC</th>
            <th>PR-AUC</th>
            <th>Inference Latency</th>
            <th>Key Advantage</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #f0f9ff;">
            <td><strong>LightGBM (1-SE Rule)</strong></td>
            <td><span style="background: #0284c7; color: #fff; padding: 2px 7px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">CHAMPION</span></td>
            <td><strong>0.941</strong></td>
            <td><strong>0.884</strong></td>
            <td><strong>1.84 ms</strong></td>
            <td>Optimal balance of high recall and sub-2ms latency</td>
          </tr>
          <tr>
            <td><strong>XGBoost (HistGradient)</strong></td>
            <td>Candidate</td>
            <td>0.938</td>
            <td>0.879</td>
            <td>2.12 ms</td>
            <td>High-throughput histogram feature binning</td>
          </tr>
          <tr>
            <td><strong>Random Forest Ensemble</strong></td>
            <td>Candidate</td>
            <td>0.915</td>
            <td>0.852</td>
            <td>3.85 ms</td>
            <td>100 bootstrapped bagging trees</td>
          </tr>
          <tr>
            <td><strong>Graph Collusion Engine</strong></td>
            <td>Ensemble Link</td>
            <td>0.887</td>
            <td>0.831</td>
            <td>4.10 ms</td>
            <td>Bipartite adjacency & eigenvector centrality</td>
          </tr>
          <tr>
            <td><strong>Logistic Regression</strong></td>
            <td>Baseline</td>
            <td>0.852</td>
            <td>0.764</td>
            <td>0.95 ms</td>
            <td>L1/L2 ElasticNet penalization</td>
          </tr>
        </tbody>
      </table>

      <h2 style="font-family: var(--syght-font-heading); margin: 2rem 0 1rem 0; font-size: 1.5rem;">Top TreeSHAP Anomaly Drivers</h2>
      <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
        TreeSHAP explains each facility's risk score by calculating the exact mathematical marginal contribution of each clinical feature:
      </p>

      <div class="docs-grid-2">
        <div class="docs-feature-box">
          <div class="docs-box-title">1. Surgeries Per Physician Ratio (+0.412 SHAP)</div>
          <p class="docs-box-text">Facilities exceeding 25 surgeries per attending doctor trigger the highest positive fraud attribution in the model.</p>
        </div>
        <div class="docs-feature-box">
          <div class="docs-box-title">2. Inpatient Length of Stay Prolongation (+0.385 SHAP)</div>
          <p class="docs-box-text">Mean duration exceeding 12.0 days triggers intense upcoding penalties based on clinical package benchmarks.</p>
        </div>
        <div class="docs-feature-box">
          <div class="docs-box-title">3. Bipartite Collusion Centrality (+0.320 SHAP)</div>
          <p class="docs-box-text">Graph eigenvector score reflecting high shared doctor circulation across independent hospital licenses.</p>
        </div>
        <div class="docs-feature-box">
          <div class="docs-box-title">4. Outpatient Volume Concordance (-0.180 SHAP)</div>
          <p class="docs-box-text">High proportion of verified outpatient visits acts as a protective factor, confirming a genuine community healthcare baseline.</p>
        </div>
      </div>
    </article>
  </main>

  <footer class="docs-footer">
    <div class="docs-footer-inner">
      <div><strong>Syght Benchmark Suite</strong> • Team Pulse Engineering</div>
      <div><a href="/docs" style="color: #0284c7; text-decoration: none;">← Return to Interactive Swagger</a></div>
    </div>
  </footer>
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
  <link rel="icon" type="image/svg+xml" href="{FAVICON_DATA_URI}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">

  <style>
    {_get_shared_styles()}
    body {{
      background: #ffffff;
    }}
  </style>
</head>
<body>
  {_get_navbar_html(active_tab="redoc")}

  <redoc spec-url="{openapi_url}"></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.1.5/bundles/redoc.standalone.js"></script>
</body>
</html>
"""
