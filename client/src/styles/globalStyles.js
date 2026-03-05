// src/styles/globalStyles.js
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  :root {
    --primary: #1E3A8A; --primary-light: #eff6ff; --secondary: #10B981;
    --accent: #F97316; --accent-light: #fff7ed; --bg-main: #F8FAFC;
    --bg-surface: #FFFFFF; --text-main: #0F172A; --text-muted: #64748B;
    --border: #E2E8F0; --radius-sm: 8px; --radius-md: 12px;
    --radius-lg: 24px; --radius-full: 9999px;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
    --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background-color: var(--bg-main); color: var(--text-main); overflow-x: hidden; }
  .app-layout { display: flex; height: 100vh; width: 100vw; overflow: hidden; }
  .sidebar { width: 260px; background: var(--bg-surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 90px 16px 24px 16px; z-index: 4; position: fixed; top: 0; left: 0; height: 100vh; overflow: hidden; }
  .main-content { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; position: relative; margin-left: 260px; }
  h1 { font-size: 2.5rem; font-weight: 700; color: var(--primary); letter-spacing: -0.02em; }
  h2 { font-size: 1.75rem; font-weight: 600; margin-bottom: 16px; }
  h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; }
  p { line-height: 1.6; color: var(--text-muted); }
  .text-sm { font-size: 0.875rem; }
  .logo { display: flex; align-items: center; gap: 12px; font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 40px; padding: 0 12px; }
  .logo-icon { background: var(--primary); color: white; padding: 8px; border-radius: var(--radius-md); }
  .nav-menu { display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-md); cursor: pointer; color: var(--text-muted); font-weight: 500; transition: var(--transition); }
  .nav-item:hover { background-color: var(--primary-light); color: var(--primary); }
  .nav-item.active { background-color: var(--primary); color: white; box-shadow: var(--shadow-md); }
  .top-header { height: 80px; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 5; border-bottom: 1px solid var(--border); }
  .search-bar { display: flex; align-items: center; background: var(--bg-main); padding: 10px 16px; border-radius: var(--radius-full); width: 300px; border: 1px solid var(--border); }
  .search-bar input { border: none; background: transparent; outline: none; margin-left: 8px; width: 100%; color: var(--text-main); }
  .header-actions { display: flex; align-items: center; gap: 20px; }
  .icon-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; position: relative; transition: var(--transition); display: flex; align-items: center; justify-content: center; }
  .icon-btn:hover { color: var(--primary); }
  .badge { position: absolute; top: -4px; right: -4px; background: var(--accent); color: white; font-size: 0.65rem; font-weight: bold; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 600; cursor: pointer; border: 2px solid white; box-shadow: var(--shadow-sm); overflow: hidden; }
  .btn { padding: 12px 24px; border-radius: var(--radius-full); font-weight: 600; cursor: pointer; transition: var(--transition); border: none; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; }
  .btn-primary { background: var(--primary); color: white; box-shadow: var(--shadow-md); }
  .btn-primary:hover { background: #152c6b; transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .btn-secondary { background: var(--secondary); color: white; }
  .btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text-main); }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
  .page-content { padding: 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
  .card { background: var(--bg-surface); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border); transition: var(--transition); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; }
  .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
  .card-img { width: 100%; height: 180px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 16px; background: var(--border); }
  .status-badge { padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; display: inline-block; }
  .status-upcoming { background: var(--primary-light); color: var(--primary); }
  .status-active { background: #dcfce7; color: var(--secondary); }
  .meta-info { display: flex; align-items: center; gap: 16px; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--text-muted); }
  .meta-item { display: flex; align-items: center; gap: 6px; }
  .hero { background: linear-gradient(135deg,var(--primary) 0%,#3b82f6 100%); border-radius: var(--radius-lg); padding: 64px 40px; color: white; margin-bottom: 40px; position: relative; overflow: hidden; }
  .hero h1 { color: white; margin-bottom: 16px; }
  .hero p { color: rgba(255,255,255,0.8); font-size: 1.125rem; margin-bottom: 32px; max-width: 600px; }
  .hero-circles { position: absolute; top: -50%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0) 70%); border-radius: 50%; }
  .chat-layout { display: flex; height: calc(100vh - 80px); background: var(--bg-surface); border-radius: var(--radius-lg) var(--radius-lg) 0 0; border: 1px solid var(--border); overflow: hidden; margin: 0 32px; }
  .chat-sidebar { width: 320px; border-right: 1px solid var(--border); display: flex; flex-direction: column; background: #fafafa; }
  .chat-sidebar-header { padding: 20px; border-bottom: 1px solid var(--border); }
  .contact-list { flex: 1; overflow-y: auto; }
  .contact-item { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); cursor: pointer; transition: var(--transition); }
  .contact-item:hover, .contact-item.active { background: white; }
  .contact-item.active { border-left: 4px solid var(--primary); }
  .chat-main { flex: 1; display: flex; flex-direction: column; background: white; }
  .chat-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .chat-messages { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-main); }
  .message { max-width: 70%; padding: 12px 16px; border-radius: 16px; line-height: 1.5; position: relative; }
  .message.received { align-self: flex-start; background: white; border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .message.sent { align-self: flex-end; background: var(--primary); color: white; border-bottom-right-radius: 4px; }
  .message-time { font-size: 0.7rem; margin-top: 4px; opacity: 0.7; text-align: right; }
  .chat-input-area { padding: 20px; border-top: 1px solid var(--border); display: flex; gap: 12px; background: white; }
  .chat-input-area input { flex: 1; padding: 14px 20px; border-radius: var(--radius-full); border: 1px solid var(--border); outline: none; font-size: 1rem; background: var(--bg-main); }
  .chat-input-area input:focus { border-color: var(--primary); background: white; }
  .send-btn { background: var(--primary); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
  .send-btn:hover { transform: scale(1.05); background: #152c6b; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .auth-wrapper { display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: var(--bg-main); }
  .auth-card { background: white; padding: 40px; border-radius: var(--radius-lg); width: 100%; max-width: 400px; box-shadow: var(--shadow-lg); }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9rem; }
  .form-control { width: 100%; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--border); outline: none; font-family: inherit; transition: var(--transition); }
  .form-control:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
  .role-selector { display: flex; gap: 10px; margin-bottom: 20px; }
  .role-btn { flex: 1; padding: 10px; text-align: center; border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
  .role-btn.active { background: var(--primary-light); border-color: var(--primary); color: var(--primary); font-weight: 600; }
  .booking-form { background: white; padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border); margin-bottom: 32px; }
  .loader { border: 4px solid var(--border); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .error-banner { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 0.9rem; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .typing-indicator { font-size: 0.8rem; color: var(--text-muted); font-style: italic; padding: 0 24px 8px; }

  /* =========================================
     MOBILE RESPONSIVENESS
     ========================================= */
  @media (max-width: 768px) {
    /* Layout */
    .app-layout { flex-direction: column; }
    
    /* Turn Sidebar into Bottom Top Navigation */
    .sidebar { 
      order: 2; width: 100%; height: 64px; padding: 0; 
      border-right: none; border-top: 1px solid var(--border); 
      flex-direction: row; position: fixed; bottom: 0; left: 0; z-index: 50; 
      box-shadow: 0 -4px 10px rgba(0,0,0,0.05);
    }
    .sidebar .logo, .sidebar > div:last-child { display: none; }
    
    .nav-menu { flex-direction: row; width: 100%; justify-content: space-around; align-items: center; margin: 0; gap: 0; }
    .nav-menu > a { flex: 1; text-align: center; display: block; }
    .nav-menu > div { display: none; } /* hide divider */
    
    .nav-item { flex-direction: column; gap: 4px; padding: 6px 0; border-radius: 0; }
    .nav-item span:not(.badge) { font-size: 0.65rem; text-align: center; }
    .nav-item.active { background: transparent; color: var(--primary); box-shadow: none; border-top: 2px solid var(--primary); }
    .nav-item .badge { top: 0; right: 25%; }
    
    /* Main Content */
    .main-content { order: 1; height: calc(100vh - 64px); }
    .top-header { padding: 0 16px; height: 60px; }
    .search-bar { width: auto; flex: 1; margin-right: 12px; font-size: 0.9rem; padding: 8px 12px; }
    .header-actions { gap: 12px; }
    
    .page-content { padding: 16px; padding-bottom: 24px; }
    
    /* Grids */
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; gap: 16px; }
    
    /* Hero Section */
    .hero { padding: 32px 16px; text-align: center; margin-bottom: 20px; }
    .hero h1 { font-size: 1.75rem; }
    .hero p { font-size: 1rem; margin-bottom: 24px; }
    .hero > div > div { justify-content: center; flex-direction: column; gap: 12px; width: 100%; }
    .hero > div > div button { width: 100%; }
    .hero-circles { width: 300px; height: 300px; right: -50%; top: -20%; }
    
    /* Chat Layout */
    .chat-layout { margin: 0; border-radius: var(--radius-md); height: calc(100vh - 60px - 64px - 32px); border: 1px solid var(--border); flex-direction: column; }
    .chat-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); height: 35%; flex: none; }
    .chat-main { width: 100%; flex: 1; height: 65%; }
    .message { max-width: 85%; padding: 10px 14px; font-size: 0.95rem; }
    .chat-header { padding: 12px 16px; }
    .chat-input-area { padding: 12px; }
    
    /* Forms & Cards */
    .booking-form form { grid-template-columns: 1fr !important; gap: 12px !important; }
    .booking-form button { width: 100%; }
    
    .auth-card { padding: 24px; margin: 16px; }
    .card { padding: 16px; }
    
    /* Ride Cards Fix */
    div[style*="flex-direction: row"] { flex-wrap: wrap; }
  }
`;
