// src/styles/globalStyles.js
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    /* Modern & Sophisticated Palette */
    --primary: #6366f1; /* Indigo 500 */
    --primary-dark: #4f46e5; /* Indigo 600 */
    --primary-light: #e0e7ff; /* Indigo 100 */
    --secondary: #10b981; /* Emerald 500 */
    --accent: #f59e0b; /* Amber 500 */

    --bg-main: #0f172a; /* Slate 900 */
    --bg-surface: rgba(30, 41, 59, 0.7); /* Slate 800 with transparency */
    --bg-card: rgba(51, 65, 85, 0.5); /* Slate 700 with transparency */

    --text-main: #f8fafc; /* Slate 50 */
    --text-muted: #94a3b8; /* Slate 400 */
    --border: rgba(255, 255, 255, 0.1);

    --radius-sm: 12px;
    --radius-md: 18px;
    --radius-lg: 32px;
    --radius-full: 9999px;

    --glass: backdrop-filter: blur(16px) saturate(180%);
    --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
    overflow-x: hidden;
    background-image:
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
    background-attachment: fixed;
  }

  /* Typography overhaul */
  h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
  h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
  p { line-height: 1.7; color: var(--text-muted); font-size: 1.05rem; }

  /* Glassmorphism Components */
  .glass-card {
    background: var(--bg-surface);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glass);
    transition: var(--transition);
  }

  .glass-card:hover {
    transform: translateY(-8px) scale(1.01);
    background: rgba(30, 41, 59, 0.9);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
  }

  .app-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }

  .sidebar {
    width: 280px;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
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
    margin-bottom: 4px;
  }

  .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-main); transform: translateX(5px); }
  .nav-item.active {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }

  .top-header {
    height: 80px;
    background: rgba(15, 23, 42, 0.6);
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
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--border);
    color: var(--text-main);
  }

  .btn-outline:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--text-main);
  }

  .form-control {
    width: 100%; padding: 16px 20px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: white; outline: none; transition: var(--transition);
    font-family: inherit;
  }

  .form-control:focus {
    background: rgba(255, 255, 255, 0.07);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  }

  .auth-wrapper {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; width: 100vw;
    padding: 20px;
  }

  .auth-card {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(20px);
    padding: 48px; border-radius: var(--radius-lg);
    width: 100%; max-width: 480px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-glass);
  }

  .page-content { padding: 40px; max-width: 1400px; margin: 0 auto; width: 100%; }

  .hero {
    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.2), transparent),
                rgba(30, 41, 59, 0.4);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 80px 60px; color: white; margin-bottom: 50px;
    position: relative; overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }

  .card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 30px; border: 1px solid var(--border);
    transition: var(--transition);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
  }

  .card:hover {
    transform: translateY(-10px);
    background: rgba(51, 65, 85, 0.7);
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .status-badge {
    padding: 8px 16px; border-radius: var(--radius-full);
    font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
  }

  .status-upcoming { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
  .status-active { background: rgba(16, 185, 129, 0.2); color: #34d399; }

  /* Chat Modernization */
  .chat-layout {
    margin: 0 40px 40px; height: calc(100vh - 160px);
    background: rgba(15, 23, 42, 0.4);
    border-radius: var(--radius-lg); border: 1px solid var(--border);
    overflow: hidden; backdrop-filter: blur(20px);
  }

  .message.sent {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-bottom-right-radius: 4px;
  }

  .message.received {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
  }

  .loader {
    width: 50px; height: 50px;
    border: 3px solid transparent;
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
