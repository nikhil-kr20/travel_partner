// src/styles/globalStyles.js
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    /* "Ethereal Nature" - Light & Aesthetic Palette */
    --primary: #4A6D6A; /* Deep Sage */
    --primary-dark: #36524F;
    --primary-light: #D9EAE8; /* Soft Sage Mist */
    --secondary: #D48C6A; /* Sandstone */
    --accent: #C45A55; /* Soft Terracotta */

    --bg-main: #F8FAF8; /* Creamy Off-white */
    --bg-surface: rgba(255, 255, 255, 0.75);
    --bg-card: rgba(255, 255, 255, 0.6);

    --text-main: #1D2B29; /* Deep Moss Black */
    --text-muted: #5C706E; /* Muted Sage Slate */
    --border: rgba(74, 109, 106, 0.12);

    --radius-sm: 12px;
    --radius-md: 18px;
    --radius-lg: 32px;
    --radius-full: 9999px;

    --glass: backdrop-filter: blur(20px) saturate(160%);
    --shadow-glass: 0 10px 40px -10px rgba(74, 109, 106, 0.15);
    --transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
    overflow-x: hidden;
    background-image:
      radial-gradient(at 0% 0%, rgba(217, 234, 232, 0.4) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(212, 140, 106, 0.08) 0px, transparent 50%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
  }

  /* Typography overhaul */
  h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 1.2rem; color: var(--text-main); }
  h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 1.5rem; color: var(--primary); }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-main); }
  p { line-height: 1.8; color: var(--text-muted); font-size: 1.05rem; }

  /* Glassmorphism Components */
  .glass-card {
    background: var(--bg-surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glass);
    transition: var(--transition);
  }

  .glass-card:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(74, 109, 106, 0.2);
    box-shadow: 0 20px 50px -15px rgba(74, 109, 106, 0.2);
  }

  .app-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

  .sidebar {
    width: 280px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(25px);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 100px 20px 30px 20px;
    z-index: 4; position: fixed; top: 0; left: 0; height: 100vh;
  }

  .main-content {
    flex: 1; display: flex; flex-direction: column; height: 100vh;
    overflow-y: auto; position: relative; margin-left: 280px;
    scroll-behavior: smooth;
  }

  .nav-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 20px; border-radius: var(--radius-md);
    cursor: pointer; color: var(--text-muted); font-weight: 600;
    transition: var(--transition);
    margin-bottom: 6px;
  }

  .nav-item:hover { background: var(--primary-light); color: var(--primary); transform: translateX(4px); }
  .nav-item.active {
    background: white;
    color: var(--primary);
    box-shadow: 0 4px 12px rgba(74, 109, 106, 0.1);
    border: 1px solid var(--border);
  }

  .top-header {
    height: 80px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; position: sticky; top: 0; z-index: 10;
    border-bottom: 1px solid var(--border);
  }

  .btn {
    padding: 14px 28px; border-radius: var(--radius-full);
    font-weight: 700; cursor: pointer; transition: var(--transition);
    border: none; display: inline-flex; align-items: center;
    gap: 10px; font-size: 1rem; position: relative; overflow: hidden;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(74, 109, 106, 0.25);
  }

  .btn-outline {
    background: white;
    border: 1px solid var(--border);
    color: var(--primary);
  }

  .btn-outline:hover {
    background: var(--primary-light);
    border-color: var(--primary);
  }

  .form-control {
    width: 100%; padding: 16px 20px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: white;
    color: var(--text-main); outline: none; transition: var(--transition);
    font-family: inherit;
  }

  .form-control:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-light);
  }

  .auth-wrapper {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; width: 100vw;
    padding: 20px;
  }

  .auth-card {
    background: white;
    padding: 48px; border-radius: var(--radius-lg);
    width: 100%; max-width: 480px;
    border: 1px solid var(--border);
    box-shadow: 0 30px 60px -20px rgba(74, 109, 106, 0.1);
  }

  .page-content { padding: 40px; max-width: 1400px; margin: 0 auto; width: 100%; }

  .hero {
    background: radial-gradient(circle at top right, rgba(217, 234, 232, 0.8), transparent),
                white;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 80px 60px; color: var(--text-main); margin-bottom: 50px;
    position: relative; overflow: hidden;
    box-shadow: var(--shadow-glass);
  }

  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }

  .card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 30px; border: 1px solid var(--border);
    transition: var(--transition);
    display: flex; flex-direction: column;
    box-shadow: 0 4px 20px rgba(74, 109, 106, 0.05);
  }

  .card:hover {
    transform: translateY(-8px);
    border-color: var(--primary-light);
    box-shadow: 0 20px 40px rgba(74, 109, 106, 0.1);
  }

  .status-badge {
    padding: 8px 16px; border-radius: var(--radius-full);
    font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  }

  .status-upcoming { background: var(--primary-light); color: var(--primary); }
  .status-active { background: #FCE6D8; color: #D48C6A; }

  /* Chat Modernization */
  .chat-layout {
    margin: 0 40px 40px; height: calc(100vh - 160px);
    background: white;
    border-radius: var(--radius-lg); border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: var(--shadow-glass);
  }

  .message.sent {
    background: var(--primary);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message.received {
    background: #F1F4F3;
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text-main);
  }

  .loader {
    width: 50px; height: 50px;
    border: 3px solid #EAEFEF;
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  /* Mobile */
  @media (max-width: 1024px) {
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .sidebar { width: 100%; height: 70px; flex-direction: row; bottom: 0; top: auto; padding: 0; border-right: none; border-top: 1px solid var(--border); }
    .main-content { margin-left: 0; height: calc(100vh - 70px); }
    .grid-3 { grid-template-columns: 1fr; }
    .hero { padding: 40px 20px; }
  }
`;
