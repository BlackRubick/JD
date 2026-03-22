const FONT_LINK_ID = 'psybioneer-font-link';
const STYLE_TAG_ID = 'psybioneer-global-style';

export function injectGlobalStyles() {
  if (!document.getElementById(FONT_LINK_ID)) {
    const fontLink = document.createElement('link');
    fontLink.id = FONT_LINK_ID;
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap';
    document.head.appendChild(fontLink);
  }

  if (!document.getElementById(STYLE_TAG_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_TAG_ID;
    style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0f1f3d; color: #1e293b; }

  :root {
    --navy:    #0f1f3d;
    --navy2:   #162848;
    --blue:    #1a4b8c;
    --blue2:   #2563eb;
    --sky:     #3b82f6;
    --accent:  #f59e0b;
    --gold:    #fbbf24;
    --white:   #ffffff;
    --muted:   #64748b;
    --surface: #f8faff;
  }

  .serif { font-family: 'Playfair Display', serif; }
  .nav-link {
    position: relative;
    color: var(--blue);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    padding-bottom: 2px;
    transition: color 0.2s;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 2px;
    background: var(--blue2);
    transition: width 0.25s ease;
  }
  .nav-link:hover { color: var(--navy); }
  .nav-link:hover::after { width: 100%; }
  .badge-pill {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #e2eaf8;
    letter-spacing: 0.02em;
    backdrop-filter: blur(8px);
    transition: background 0.2s, border-color 0.2s;
  }
  .badge-pill:hover {
    background: rgba(255,255,255,0.13);
    border-color: rgba(255,255,255,0.28);
  }
  .card {
    background: var(--white);
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(15,31,61,0.06);
    overflow: hidden;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .card:hover {
    box-shadow: 0 2px 6px rgba(0,0,0,0.06), 0 16px 40px rgba(15,31,61,0.12);
    transform: translateY(-2px);
  }
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--blue2) 0%, var(--blue) 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.01em;
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
    text-decoration: none;
  }
  .btn-primary:hover {
    opacity: 0.92;
    box-shadow: 0 6px 20px rgba(37,99,235,0.45);
    transform: translateY(-1px);
  }
  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: transparent;
    color: var(--blue);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    border: 1.5px solid #bfdbfe;
    border-radius: 10px;
    padding: 11px 22px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    text-decoration: none;
  }
  .btn-ghost:hover {
    background: #eff6ff;
    border-color: var(--blue2);
    color: var(--navy);
  }
  .input {
    width: 100%;
    background: var(--surface);
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: var(--navy);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .input:focus {
    border-color: var(--blue2);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .input::placeholder { color: #94a3b8; }
  .section-divider {
    width: 48px; height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--accent));
    border-radius: 2px;
    margin: 0 auto 12px;
  }
  .hero-bg {
    background: linear-gradient(160deg, #f0f6ff 0%, #e8f0fe 60%, #dbeafe 100%);
    position: relative;
    overflow: hidden;
  }
  .hero-bg::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle at 80% 20%, rgba(59,130,246,0.12) 0%, transparent 60%),
                      radial-gradient(circle at 10% 80%, rgba(26,75,140,0.08) 0%, transparent 50%);
    pointer-events: none;
  }
  .stat-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 14px;
    backdrop-filter: blur(12px);
    padding: 20px;
    color: #e2eaf8;
    transition: background 0.2s;
  }
  .stat-card:hover { background: rgba(255,255,255,0.14); }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.55s ease both; }
  .fade-up-1 { animation-delay: 0.1s; }
  .fade-up-2 { animation-delay: 0.22s; }
  .fade-up-3 { animation-delay: 0.34s; }
  .privacy-banner {
    background: linear-gradient(90deg, #0f1f3d 0%, #1a4b8c 100%);
    padding: 10px 16px;
    text-align: center;
    font-size: 0.75rem;
    color: #93c5fd;
    letter-spacing: 0.01em;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0f1f3d; }
  ::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 3px; }
`;
    document.head.appendChild(style);
  }
}