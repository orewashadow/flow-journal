import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#F0EEE8', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .fade-up { opacity: 0; transform: translateY(24px); animation: fadeUp 0.7s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .wv { fill:none; stroke:white; stroke-width:2.2; stroke-linecap:round; stroke-dasharray:6 4; animation:flow 1.2s linear infinite; }
        .wv2 { animation-delay:-.6s; opacity:.5; }
        @keyframes flow { to { stroke-dashoffset:-40; } }
        .feature-card { background: #111; border: 0.5px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 2rem; transition: border-color 0.2s, transform 0.2s; }
        .feature-card:hover { border-color: rgba(29,158,117,0.3); transform: translateY(-2px); }
        .cta-btn { background: #1D9E75; color: white; border: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; font-family: "'DM Sans', sans-serif"; cursor: pointer; transition: opacity 0.2s, transform 0.15s; }
        .cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .outline-btn { background: transparent; color: rgba(240,238,232,0.6); border: 0.5px solid rgba(255,255,255,0.15); padding: 13px 28px; border-radius: 10px; font-size: 15px; font-family: "'DM Sans', sans-serif"; cursor: pointer; transition: all 0.2s; }
        .outline-btn:hover { border-color: rgba(255,255,255,0.35); color: #F0EEE8; }
        .nav-link { color: rgba(240,238,232,0.5); font-size: 14px; cursor: pointer; transition: color 0.15s; background: none; border: none; font-family: "'DM Sans', sans-serif"; }
        .nav-link:hover { color: #F0EEE8; }
        .stat-num { font-family: "'Syne', sans-serif"; font-size: 36px; font-weight: 600; color: #1D9E75; }
        .glow { position: absolute; border-radius: 50%; pointer-events: none; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; background: rgba(29,158,117,0.15); border: 0.5px solid rgba(29,158,117,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; color: #1D9E75; flex-shrink: 0; }
        @media(max-width:768px) {
          .hero-title { font-size: 36px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .nav-links { display: none !important; }
          .hero-btns { flex-direction: column !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderBottom: '0.5px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: '#1D9E75', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <svg width="20" height="18" viewBox="0 0 24 22" fill="none">
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: 1 }}>FLOW</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
          <button className="nav-link" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>How it works</button>
          <button className="nav-link" onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })}>Why FLOW</button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="outline-btn" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => navigate('/login')}>Log in</button>
          <button className="cta-btn" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => navigate('/login')}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '6rem 2rem 5rem', maxWidth: 900, margin: '0 auto', textAlign: 'center', overflow: 'hidden' }}>
        <div className="glow" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%)', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />

        <div className="fade-up" style={{ animationDelay: '0.1s', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.25)', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#1D9E75', marginBottom: '1.5rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
          Now live â start journaling for free
        </div>

        <h1 className="hero-title fade-up" style={{ fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', animationDelay: '0.2s', letterSpacing: '-0.5px' }}>
          The trading journal<br />
          <span style={{ color: '#1D9E75' }}>built for serious traders</span>
        </h1>

        <p className="fade-up" style={{ fontSize: 18, color: 'rgba(240,238,232,0.5)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2.5rem', animationDelay: '0.3s' }}>
          Stop copy-pasting into spreadsheets. FLOW automatically captures your trades, tracks your emotions, and reveals the patterns holding you back.
        </p>

        <div className="hero-btns fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', animationDelay: '0.4s' }}>
          <button className="cta-btn" onClick={() => navigate('/login')}>Start journaling free â</button>
          <button className="outline-btn" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>See features</button>
        </div>

        {/* Mini dashboard preview */}
        <div className="fade-up" style={{ marginTop: '4rem', animationDelay: '0.5s', background: '#111', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', textAlign: 'left', maxWidth: 700, margin: '4rem auto 0' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem' }}>
            {[['48', 'Total trades'], ['64%', 'Win rate'], ['31', 'Wins'], ['17', 'Losses']].map(([val, label]) => (
              <div key={label} style={{ flex: 1, background: '#0D0D0D', borderRadius: 10, padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: 11, color: 'rgba(240,238,232,0.4)', marginBottom: 4 }}>{label}</p>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 500, color: label === 'Wins' ? '#1D9E75' : label === 'Losses' ? '#E24B4A' : '#F0EEE8' }}>{val}</p>
              </div>
            ))}
          </div>
          {[['EUR/USD', '1.0842', 'Order block', 'TP hit'], ['BTC/USD', '83,200', 'Fair value gap', 'SL hit'], ['XAU/USD', '3,012', 'Break of structure', 'Open']].map(([pair, entry, setup, result]) => (
            <div key={pair} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 80px', gap: 8, padding: '10px 0', borderTop: '0.5px solid rgba(255,255,255,0.04)', fontSize: 13, alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>{pair}</span>
              <span style={{ color: 'rgba(240,238,232,0.5)', fontSize: 12 }}>{entry}</span>
              <span style={{ color: 'rgba(240,238,232,0.4)', fontSize: 12 }}>{setup}</span>
              <span style={{ fontSize: 11, color: result === 'TP hit' ? '#1D9E75' : result === 'SL hit' ? '#E24B4A' : '#378ADD', background: result === 'TP hit' ? 'rgba(29,158,117,0.12)' : result === 'SL hit' ? 'rgba(226,75,74,0.12)' : 'rgba(55,138,221,0.12)', padding: '3px 8px', borderRadius: 20, fontWeight: 500 }}>{result}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" style={{ padding: '4rem 2rem', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {[['80%', 'of traders lose because they never review their trades'],['100%', 'free to start â no credit card needed'],['1-click', 'chart capture with the Chrome extension'],['â', 'trades you can log â no limits ever']].map(([num, desc]) => (
            <div key={num}>
              <div className="stat-num">{num}</div>
              <p style={{ fontSize: 13, color: 'rgba(240,238,232,0.4)', marginTop: 8, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '5rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: 12, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Features</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 600, lineHeight: 1.2 }}>Everything a trader needs.<br />Nothing they don't.</h2>
        </div>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: 'ð¸', title: 'Auto chart capture', desc: 'Chrome extension captures your TradingView chart and trade data in one click. No more screenshots and copy-pasting.' },
            { icon: 'ð§ ', title: 'Emotion tracking', desc: 'Log how you felt before every trade. FLOW reveals which emotional states lead to your best and worst results.' },
            { icon: 'ð', title: 'Performance stats', desc: 'Win rate, performance by pair, setup analysis and more. Know exactly what works and what doesn\'t.' },
            { icon: 'ð', title: 'Trade review', desc: 'Filter trades by pair, setup, emotion or result. Review your history with full context, chart and reasoning.' },
            { icon: 'ð±', title: 'Mobile friendly', desc: 'Full access on your phone with a native-feel bottom navigation. Log trades and review your journal anywhere.' },
            { icon: 'ð', title: 'Your data, private', desc: 'Every trade is private to your account. No one else can see your journal or your performance.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div style={{ fontSize: 24, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(240,238,232,0.5)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '5rem 2rem', background: '#0D0D0D' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: 12, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>How it works</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 600 }}>Three steps to a better trading mindset</h2>
          </div>

          {[
            { n: '1', title: 'Log your trade', desc: 'After setting up your trade on TradingView, click the FLOW extension. It captures the chart, pair, entry, SL and TP automatically. Add your emotion and reasoning in seconds.' },
            { n: '2', title: 'Let FLOW track results', desc: 'When your trade closes, update the result in one tap â TP hit, SL hit, or manually closed. Your journal stays accurate with zero effort.' },
            { n: '3', title: 'Review and improve', desc: 'Use the Stats and Review pages to find patterns. See which setups win most, which emotions hurt your trades, and which pairs to focus on.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display: 'flex', gap: 16, marginBottom: '2rem', alignItems: 'flex-start' }}>
              <div className="step-num">{n}</div>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(240,238,232,0.5)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 700, marginBottom: '1rem', position: 'relative' }}>Ready to trade smarter?</h2>
        <p style={{ fontSize: 16, color: 'rgba(240,238,232,0.45)', marginBottom: '2.5rem', position: 'relative' }}>Join traders already using FLOW to understand their edge.</p>
        <button className="cta-btn" style={{ fontSize: 16, padding: '15px 40px', position: 'relative' }} onClick={() => navigate('/login')}>
          Create your free account â
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, background: '#1D9E75', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <svg width="14" height="12" viewBox="0 0 24 22" fill="none">
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>FLOW</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.25)' }}>Â© 2026 FLOW. Built for traders.</p>
      </footer>
    </div>
  )
}
