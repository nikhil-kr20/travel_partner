// src/styles/globalStyles.js
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    /* Core Palette */
    --bg-main: #0A0F1E;
    --bg-surface: #0F1629;
    --bg-card: #141B2D;
    --bg-elevated: #1A2237;
    --bg-glass: rgba(255,255,255,0.04);
    --bg-glass-hover: rgba(255,255,255,0.07);

    /* Accent Colors */
    --teal: #06b6d4;
    --teal-dark: #0891b2;
    --teal-light: rgba(6,182,212,0.12);
    --teal-glow: rgba(6,182,212,0.25);
    --purple: #8b5cf6;
    --purple-dark: #7c3aed;
    --purple-light: rgba(139,92,246,0.12);

    /* Legacy compat */
    --primary: #06b6d4;
    --primary-dark: #0891b2;
    --primary-light: rgba(6,182,212,0.12);
    --secondary: #8b5cf6;
    --accent: #f472b6;
    --accent-light: rgba(244,114,182,0.12);

    /* Text */
    --text-main: #f1f5f9;
    --text-muted: #94a3b8;
    --text-faint: #475569;
    --text-inverted: #0A0F1E;

    /* Borders */
    --border: rgba(255,255,255,0.08);
    --border-active: rgba(6,182,212,0.4);

    /* Status */
    --danger: #f87171;
    --success: #34d399;
    --warning: #fbbf24;

    /* Spacing / Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 30px rgba(0,0,0,0.5);
    --shadow-teal: 0 0 20px rgba(6,182,212,0.2);
    --shadow-purple: 0 0 20px rgba(139,92,246,0.2);

    /* Gradients */
    --grad-teal-purple: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
    --grad-purple-teal: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
    --grad-hero: linear-gradient(135deg, #0A1628 0%, #0F2040 40%, #0A1628 100%);

    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }

  /* ═══════════════════════════════
     TYPOGRAPHY
  ═══════════════════════════════ */
  h1 { font-size: 2.25rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.03em; line-height: 1.2; }
  h2 { font-size: 1.5rem; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; margin-bottom: 12px; }
  h3 { font-size: 1.125rem; font-weight: 600; color: var(--text-main); margin-bottom: 6px; }
  p { line-height: 1.6; color: var(--text-muted); }
  .text-sm { font-size: 0.875rem; }
  .text-xs { font-size: 0.75rem; }
  .text-muted { color: var(--text-muted); }
  .text-teal { color: var(--teal); }
  .text-gradient {
    background: var(--grad-teal-purple);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ═══════════════════════════════
     LAYOUT
  ═══════════════════════════════ */
  .app-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: var(--bg-main);
  }

  /* ═══════════════════════════════
     SIDEBAR
  ═══════════════════════════════ */
  .sidebar {
    width: 260px;
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0 12px 24px;
    z-index: 40;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow: hidden;
    transition: var(--transition);
  }

  .sidebar-top {
    padding: 20px 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
    margin-left: -12px;
    margin-right: -12px;
    padding-left: 24px;
    padding-right: 24px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-decoration: none;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: var(--grad-teal-purple);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: var(--shadow-teal);
  }

  .logo-text {
    background: var(--grad-teal-purple);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    overflow-y: auto;
    padding-top: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.9rem;
    transition: var(--transition);
    position: relative;
    text-decoration: none;
  }

  .nav-item:hover {
    background: var(--bg-glass-hover);
    color: var(--text-main);
  }

  .nav-item.active {
    background: var(--teal-light);
    color: var(--teal);
    box-shadow: inset 0 0 0 1px var(--border-active);
  }

  .nav-item.active svg { filter: drop-shadow(0 0 6px var(--teal)); }

  .nav-divider {
    height: 1px;
    background: var(--border);
    margin: 8px 0;
  }

  .sidebar-pro-card {
    background: linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.15) 100%);
    border: 1px solid rgba(6,182,212,0.2);
    border-radius: var(--radius-lg);
    padding: 16px;
    margin: 4px 0 0;
  }

  .sidebar-pro-card h4 {
    font-size: 0.875rem;
    font-weight: 700;
    background: var(--grad-teal-purple);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 4px;
  }

  .sidebar-pro-card p {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 10px;
  }

  /* ═══════════════════════════════
     TOP HEADER
  ═══════════════════════════════ */
  .top-header {
    height: 68px;
    background: rgba(10,15,30,0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: sticky;
    top: 0;
    z-index: 30;
    border-bottom: 1px solid var(--border);
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: var(--bg-glass);
    padding: 9px 16px;
    border-radius: var(--radius-full);
    width: 280px;
    border: 1px solid var(--border);
    gap: 8px;
    transition: var(--transition);
  }

  .search-bar:focus-within {
    border-color: var(--border-active);
    background: var(--bg-glass-hover);
    box-shadow: 0 0 0 3px var(--teal-glow);
  }

  .search-bar input {
    border: none;
    background: transparent;
    outline: none;
    color: var(--text-main);
    font-family: inherit;
    font-size: 0.875rem;
    width: 100%;
  }

  .search-bar input::placeholder { color: var(--text-faint); }

  .header-actions { display: flex; align-items: center; gap: 12px; }

  .icon-btn {
    background: var(--bg-glass);
    border: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    position: relative;
  }

  .icon-btn:hover {
    background: var(--teal-light);
    color: var(--teal);
    border-color: var(--border-active);
  }

  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--teal);
    color: var(--text-inverted);
    font-size: 0.6rem;
    font-weight: 800;
    min-width: 16px;
    height: 16px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    box-shadow: 0 0 8px var(--teal);
  }

  .user-avatar {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-full);
    background: var(--grad-teal-purple);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    position: relative;
    box-shadow: var(--shadow-teal);
    overflow: hidden;
    border: 2px solid var(--teal);
    transition: var(--transition);
  }

  .user-avatar:hover { transform: scale(1.05); box-shadow: 0 0 16px var(--teal); }

  .user-avatar .online-dot {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--success);
    border: 2px solid var(--bg-surface);
  }

  /* ═══════════════════════════════
     MAIN CONTENT
  ═══════════════════════════════ */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
    margin-left: 260px;
    background: var(--bg-main);
  }

  .page-content {
    padding: 24px 32px 32px;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  }

  /* ═══════════════════════════════
     BUTTONS
  ═══════════════════════════════ */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    font-family: inherit;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .btn-primary {
    background: var(--grad-teal-purple);
    color: white;
    box-shadow: 0 4px 15px var(--teal-glow);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--teal-glow);
    opacity: 0.95;
  }

  .btn-secondary {
    background: var(--bg-glass-hover);
    color: var(--text-main);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--teal-light);
    border-color: var(--border-active);
    color: var(--teal);
  }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--border-active);
    color: var(--teal);
  }

  .btn-outline:hover {
    background: var(--teal-light);
    box-shadow: 0 0 12px var(--teal-glow);
  }

  .btn-ghost {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 8px 12px;
  }

  .btn-ghost:hover { color: var(--teal); background: var(--teal-light); }

  .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

  .btn-icon {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--radius-md);
  }

  /* ═══════════════════════════════
     CARDS
  ═══════════════════════════════ */
  .card {
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    padding: 20px;
    border: 1px solid var(--border);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .card:hover {
    border-color: var(--border-active);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px var(--teal-glow);
    transform: translateY(-3px);
  }

  .card-glass {
    background: rgba(20, 27, 45, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
  }

  /* Trip/Destination cards with image background */
  .trip-card-img {
    position: relative;
    height: 220px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    flex-shrink: 0;
  }

  .trip-card-img:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.6); }

  .trip-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .trip-card-img:hover img { transform: scale(1.05); }

  .trip-card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.3) 60%, transparent 100%);
  }

  .trip-card-status {
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .trip-card-date {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .trip-card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
  }

  .card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: var(--radius-lg);
    margin-bottom: 16px;
    background: var(--bg-elevated);
  }

  /* ═══════════════════════════════
     STATUS BADGES
  ═══════════════════════════════ */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .status-open {
    background: rgba(6,182,212,0.2);
    color: var(--teal);
    border: 1px solid rgba(6,182,212,0.3);
  }

  .status-upcoming {
    background: rgba(139,92,246,0.2);
    color: var(--purple);
    border: 1px solid rgba(139,92,246,0.3);
  }

  .status-active {
    background: rgba(52,211,153,0.2);
    color: var(--success);
    border: 1px solid rgba(52,211,153,0.3);
  }

  .status-completed {
    background: rgba(148,163,184,0.15);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  /* ═══════════════════════════════
     GRID UTILITIES
  ═══════════════════════════════ */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  /* ═══════════════════════════════
     SECTION HEADER
  ═══════════════════════════════ */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  /* ═══════════════════════════════
     META ITEMS
  ═══════════════════════════════ */
  .meta-info {
    display: flex;
    align-items: center;
    gap: 14px;
    color: var(--text-muted);
    font-size: 0.8rem;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .meta-item { display: flex; align-items: center; gap: 5px; }

  /* ═══════════════════════════════
     HERO
  ═══════════════════════════════ */
  .hero {
    background: linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(10,15,30,0.8) 100%);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 48px 40px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -60%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: 30%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero h1 { color: white; margin-bottom: 12px; }
  .hero p { color: var(--text-muted); font-size: 1.05rem; margin-bottom: 28px; max-width: 520px; }

  .hero-circuits { position: absolute; top: -50%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0) 70%); border-radius: 50%; }

  .stat-card {
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: var(--transition);
  }

  .stat-card:hover {
    border-color: var(--border-active);
    background: var(--teal-light);
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-icon-teal { background: var(--teal-light); color: var(--teal); }
  .stat-icon-purple { background: var(--purple-light); color: var(--purple); }
  .stat-icon-pink { background: rgba(244,114,182,0.12); color: #f472b6; }

  /* ═══════════════════════════════
     FORMS
  ═══════════════════════════════ */
  .form-group { margin-bottom: 18px; }

  .form-group label {
    display: block;
    font-size: 0.825rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 7px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .form-control {
    width: 100%;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-glass);
    color: var(--text-main);
    font-family: inherit;
    font-size: 0.9rem;
    outline: none;
    transition: var(--transition);
  }

  .form-control::placeholder { color: var(--text-faint); }

  .form-control:focus {
    border-color: var(--border-active);
    background: var(--bg-glass-hover);
    box-shadow: 0 0 0 3px var(--teal-glow);
  }

  .form-control-icon { position: relative; }

  .form-control-icon .form-control { padding-left: 40px; }

  .form-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-faint);
    pointer-events: none;
  }

  /* ═══════════════════════════════
     AUTH PAGES
  ═══════════════════════════════ */
  .auth-wrapper {
    display: flex;
    min-height: 100vh;
    width: 100vw;
    background: var(--bg-main);
    overflow: hidden;
  }

  .auth-panel-left {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: none;
  }

  @media (min-width: 900px) {
    .auth-panel-left { display: flex; flex-direction: column; justify-content: flex-end; padding: 48px; }
  }

  .auth-panel-left-bg {
    position: absolute;
    inset: 0;
    background: var(--grad-teal-purple);
    opacity: 0.1;
  }

  .auth-panel-right {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 32px;
    min-height: 100vh;
  }

  @media (min-width: 900px) {
    .auth-panel-right {
      width: 480px;
      flex-shrink: 0;
      border-left: 1px solid var(--border);
      margin: 0;
    }
  }

  .auth-card {
    background: var(--bg-card);
    padding: 36px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 420px;
    margin: auto;
  }

  .role-selector { display: flex; gap: 8px; margin-bottom: 20px; }

  .role-btn {
    flex: 1;
    padding: 10px;
    text-align: center;
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
  }

  .role-btn:hover {
    background: var(--teal-light);
    color: var(--teal);
    border-color: var(--border-active);
  }

  .role-btn.active {
    background: var(--grad-teal-purple);
    color: white;
    border-color: transparent;
    box-shadow: var(--shadow-teal);
  }

  /* ═══════════════════════════════
     CHAT
  ═══════════════════════════════ */
  .chat-layout {
    display: flex;
    height: calc(100vh - 68px);
    background: var(--bg-main);
    overflow: hidden;
  }

  .chat-sidebar {
    width: 300px;
    flex-shrink: 0;
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }

  .chat-sidebar-header { padding: 16px 20px; border-bottom: 1px solid var(--border); }

  .contact-list { flex: 1; overflow-y: auto; }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: var(--transition);
  }

  .contact-item:hover { background: var(--bg-glass-hover); }

  .contact-item.active {
    background: var(--teal-light);
    border-left: 3px solid var(--teal);
    padding-left: 17px;
  }

  .chat-main { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); }

  .chat-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-surface);
  }

  .chat-messages {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message {
    max-width: 68%;
    padding: 12px 16px;
    border-radius: 16px;
    line-height: 1.5;
    font-size: 0.9rem;
  }

  .message.received {
    align-self: flex-start;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text-main);
  }

  .message.sent {
    align-self: flex-end;
    background: linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(6,182,212,0.3);
  }

  .message-time { font-size: 0.68rem; margin-top: 4px; opacity: 0.6; }

  .chat-input-area {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
    align-items: center;
    background: var(--bg-surface);
  }

  .chat-input-area input {
    flex: 1;
    padding: 12px 18px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    background: var(--bg-glass);
    color: var(--text-main);
    font-family: inherit;
    font-size: 0.9rem;
    outline: none;
    transition: var(--transition);
  }

  .chat-input-area input::placeholder { color: var(--text-faint); }
  .chat-input-area input:focus { border-color: var(--border-active); background: var(--bg-glass-hover); }

  .send-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--grad-teal-purple);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-teal);
    flex-shrink: 0;
  }

  .send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px var(--teal-glow); }

  .typing-indicator {
    font-size: 0.78rem;
    color: var(--text-muted);
    font-style: italic;
    padding: 4px 24px;
  }

  /* ═══════════════════════════════
     LOADERS
  ═══════════════════════════════ */
  .loader {
    border: 3px solid var(--border);
    border-top: 3px solid var(--teal);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 0.8s linear infinite;
    margin: 24px auto;
  }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* ═══════════════════════════════
     MISC
  ═══════════════════════════════ */
  .error-banner {
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.3);
    color: #fca5a5;
    padding: 11px 14px;
    border-radius: var(--radius-md);
    margin-bottom: 14px;
    font-size: 0.875rem;
  }

  .success-banner {
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.3);
    color: #6ee7b7;
    padding: 11px 14px;
    border-radius: var(--radius-md);
    margin-bottom: 14px;
    font-size: 0.875rem;
  }

  .empty-state {
    text-align: center;
    padding: 56px 24px;
    color: var(--text-muted);
  }

  .empty-state-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-xl);
    background: var(--bg-glass);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: var(--text-faint);
  }

  .filter-tabs {
    display: flex;
    gap: 4px;
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 4px;
  }

  .filter-tab {
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    color: var(--text-muted);
    background: transparent;
    border: none;
    font-family: inherit;
  }

  .filter-tab.active {
    background: var(--grad-teal-purple);
    color: white;
    box-shadow: var(--shadow-teal);
  }

  .filter-tab:not(.active):hover { color: var(--text-main); background: var(--bg-glass-hover); }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 600;
    background: var(--bg-glass);
    border: 1px solid var(--border);
    color: var(--text-muted);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }

  .avatar {
    border-radius: 50%;
    background: var(--grad-teal-purple);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    flex-shrink: 0;
    overflow: hidden;
  }

  .booking-form {
    background: var(--bg-card);
    padding: 24px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    margin-bottom: 28px;
  }

  /* ═══════════════════════════════
     MOBILE RESPONSIVENESS
  ═══════════════════════════════ */
  @media (max-width: 900px) {
    /* Sidebar becomes bottom nav */
    .sidebar {
      order: 2;
      width: 100%;
      height: 62px;
      padding: 0;
      border-right: none;
      border-top: 1px solid var(--border);
      flex-direction: row;
      position: fixed;
      bottom: 0;
      left: 0;
      top: auto;
      z-index: 50;
      background: rgba(10,15,30,0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
    }

    .sidebar-top { display: none; }
    .sidebar > div:last-child { display: none; } /* hide pro card */

    .nav-menu {
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
      align-items: stretch;
      margin: 0;
      gap: 0;
      height: 100%;
      overflow: visible;
    }

    .nav-menu > a {
      flex: 1;
      display: flex; 
    }

    .nav-divider { display: none; }

    .nav-item {
      flex: 1;
      flex-direction: column;
      gap: 3px;
      padding: 8px 0 6px;
      border-radius: 0;
      justify-content: center;
      align-items: center;
      font-size: 0.6rem;
    }

    .nav-item span:not(.badge) { font-size: 0.6rem; text-align: center; }

    .nav-item.active {
      background: transparent;
      color: var(--teal);
      box-shadow: none;
      border-top: 2px solid var(--teal);
    }

    .nav-item.active svg { filter: drop-shadow(0 0 4px var(--teal)); }

    .main-content {
      margin-left: 0;
      height: calc(100vh - 62px);
    }

    .top-header {
      position: sticky;
      top: 0;
      padding: 0 16px;
      height: 60px;
    }

    .search-bar { width: auto; flex: 1; margin-right: 10px; }

    .page-content {
      padding: 16px;
      padding-bottom: 20px;
    }

    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; gap: 14px; }

    .hero {
      padding: 28px 20px;
      margin-bottom: 20px;
      border-radius: var(--radius-lg);
    }

    .hero h1 { font-size: 1.6rem; }
    .hero p { font-size: 0.9rem; margin-bottom: 20px; }

    .chat-layout {
      flex-direction: column;
      height: calc(100vh - 60px - 62px);
    }

    .chat-sidebar {
      width: 100%;
      height: 38%;
      border-right: none;
      border-bottom: 1px solid var(--border);
      flex: none;
    }

    .chat-main { flex: 1; }

    .message { max-width: 85%; }

    .auth-card { padding: 24px; margin: 16px; max-width: none; }

    .card { padding: 14px; }

    .booking-form form { grid-template-columns: 1fr !important; gap: 10px !important; }
  }

  @media (min-width: 901px) and (max-width: 1100px) {
    .grid-3 { grid-template-columns: 1fr 1fr; }
    .grid-4 { grid-template-columns: 1fr 1fr; }
    .page-content { padding: 20px 24px; }
  }
`;
