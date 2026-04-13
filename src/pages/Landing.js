import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background:'#0A0A0A', minHeight:'100vh', color:'#F0EEE8', fontFamily:"'DM Sans',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .fade-up { opacity:0; transform:translateY(24px); animation:fadeUp 0.7s ease forwards; }
        @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
        .wv { fill:none; stroke:white; stroke-width:2.2; stroke-linecap:round; stroke-dasharray:6 4; animation:flow 1.2s linear infinite; }
        .wv2 { animation-delay:-.6s; opacity:.5; }
        @keyframes flow { to { stroke-dashoffset:-40; } }
        .cta-btn { background:#1D9E75; color:white; border:none; padding:14px 32px; border-radius:10px; font-size:15px; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; transition:opacity 0.2s, transform 0.15s; }
        .cta-btn:hover { opacity:0.88; transform:translateY(-1px); }
        .outline-btn { background:transparent; color:rgba(240,238,232,0.6); border:0.5px solid rgba(255,255,255,0.15); padding:13px 28px; border-radius:10px; font-size:15px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .outline-btn:hover { border-color:rgba(255,255,255,0.35); color:#F0EEE8; }
        .nav-link { color:rgba(240,238,232,0.5); font-size:14px; cursor:pointer; transition:color 0.15s; background:none; border:none; font-family:'DM Sans',sans-serif; }
        .nav-link:hover { color:#F0EEE8; }
        .feature-card { background:#111; border:0.5px solid rgba(255,255,255,0.07); border-radius:16px; padding:2rem; transition:border-color 0.2s, transform 0.2s; }
        .feature-card:hover { border-color:rgba(29,158,117,0.3); transform:translateY(-2px); }
        .icon-wrap { width:44px; height:44px; background:rgba(29,158,117,0.1); border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; }
        .glow { position:absolute; border-radius:50%; pointer-events:none; }
        .step-num { width:32px; height:32px; border-radius:50%; background:rgba(29,158,117,0.15); border:0.5px solid rgba(29,158,117,0.3); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:500; color:#1D9E75; flex-shrink:0; }
        .divider { width:1px; background:rgba(255,255,255,0.06); }
        @media(max-width:768px){
          .hero-title { font-size:34px !important; line-height:1.15 !important; }
          .features-grid { grid-template-columns:1fr !important; }
          .stats-row { flex-direction:column !important; gap:1.5rem !important; }
          .divider { display:none !important; }
          .nav-links { display:none !important; }
          .hero-btns { flex-direction:column !important; }
          .preview-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem', borderBottom:'0.5px solid rgba(255,255,255,0.06)', position:'sticky', top:0, background:'rgba(10,10,10,0.92)', backdropFilter:'blur(12px)', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'#1D9E75', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            <svg width="20" height="18" viewBox="0 0 24 22" fill="none">
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:600, letterSpacing:1 }}>FLOW</span>
        </div>
        <div className="nav-links" style={{ display:'flex', gap:28 }}>
          <button className="nav-link" onClick={() => document.getElementById('features').scrollIntoView({ behavior:'smooth' })}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById('how').scrollIntoView({ behavior:'smooth' })}>How it works</button>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="outline-btn" style={{ padding:'8px 18px', fontSize:13 }} onClick={() => navigate('/login')}>Log in</button>
          <button className="cta-btn" style={{ padding:'8px 18px', fontSize:13 }} onClick={() => navigate('/login')}>Get started free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', padding:'7rem 2rem 5rem', maxWidth:860, margin:'0 auto', textAlign:'center' }}>
        <div className="glow" style={{ width:700, height:700, background:'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)', top:'-150px', left:'50%', transform:'translateX(-50%)' }} />

        <p className="fade-up" style={{ animationDelay:'0.05s', fontSize:12, color:'#1D9E75', textTransform:'uppercase', letterSpacing:3, marginBottom:'1.5rem' }}>Trading journal</p>

        <h1 className="hero-title fade-up" style={{ fontFamily:"'Syne',sans-serif", fontSize:58, fontWeight:700, lineHeight:1.08, marginBottom:'1.75rem', animationDelay:'0.15s', letterSpacing:'-1px' }}>
          Know why you lose.<br />Know why you win.<br />
          <span style={{ color:'#1D9E75' }}>Evolve.</span>
        </h1>

        <p className="fade-up" style={{ fontSize:17, color:'rgba(240,238,232,0.45)', lineHeight:1.75, maxWidth:520, margin:'0 auto 2.5rem', animationDelay:'0.25s' }}>
          FLOW is the trading journal that connects your mindset to your results. Track every trade, understand your emotions, and discover the patterns that make you a better trader.
        </p>

        <div className="hero-btns fade-up" style={{ display:'flex', gap:12, justifyContent:'center', animationDelay:'0.35s' }}>
          <button className="cta-btn" onClick={() => navigate('/login')}>Start for free</button>
          <button className="outline-btn" onClick={() => document.getElementById('features').scrollIntoView({ behavior:'smooth' })}>See how it works</button>
        </div>

        {/* Dashboard preview */}
        <div className="fade-up" style={{ marginTop:'4rem', animationDelay:'0.45s', background:'#111', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'1.5rem', textAlign:'left', maxWidth:680, margin:'4rem auto 0' }}>
          <div className="preview-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:'1.25rem' }}>
            {[['48','Total trades','#F0EEE8'],['64%','Win rate','#1D9E75'],['31','Wins','#1D9E75'],['17','Losses','#E24B4A']].map(([val,label,color]) => (
              <div key={label} style={{ background:'#0D0D0D', borderRadius:10, padding:'0.75rem 1rem' }}>
                <p style={{ fontSize:11, color:'rgba(240,238,232,0.4)', marginBottom:4 }}>{label}</p>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, color }}>{val}</p>
              </div>
            ))}
          </div>
          {[['EUR/USD','Calm','Order block','TP hit'],['BTC/USD','FOMO','Fair value gap','SL hit'],['XAU/USD','Confident','Break of structure','Open']].map(([pair,emotion,setup,result]) => (
            <div key={pair} style={{ display:'grid', gridTemplateColumns:'90px 70px 1fr 70px', gap:8, padding:'10px 0', borderTop:'0.5px solid rgba(255,255,255,0.04)', fontSize:13, alignItems:'center' }}>
              <span style={{ fontWeight:500 }}>{pair}</span>
              <span style={{ fontSize:11, color:'rgba(240,238,232,0.4)' }}>{emotion}</span>
              <span style={{ color:'rgba(240,238,232,0.4)', fontSize:12 }}>{setup}</span>
              <span style={{ fontSize:11, color:result==='TP hit'?'#1D9E75':result==='SL hit'?'#E24B4A':'#378ADD', background:result==='TP hit'?'rgba(29,158,117,0.12)':result==='SL hit'?'rgba(226,75,74,0.12)':'rgba(55,138,221,0.12)', padding:'3px 8px', borderRadius:20, fontWeight:500 }}>{result}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS ROW */}
      <section style={{ padding:'4rem 2rem', borderTop:'0.5px solid rgba(255,255,255,0.06)', borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="stats-row" style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:0, maxWidth:760, margin:'0 auto', textAlign:'center' }}>
          {[
            ['80%', 'of traders never review their trades — and wonder why they keep losing'],
            ['100%', 'free to start — no credit card, no limits on trades'],
            ['1 place', 'for your chart, numbers, mindset and review — all together'],
          ].map(([num, desc], i) => (
            <React.Fragment key={num}>
              {i > 0 && <div className="divider" style={{ height:60, margin:'0 2.5rem' }} />}
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:34, fontWeight:600, color:'#1D9E75', marginBottom:8 }}>{num}</p>
                <p style={{ fontSize:13, color:'rgba(240,238,232,0.4)', lineHeight:1.6, maxWidth:200, margin:'0 auto' }}>{desc}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:'5rem 2rem', maxWidth:1000, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <p style={{ fontSize:12, color:'#1D9E75', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>What FLOW does</p>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:34, fontWeight:600, lineHeight:1.2 }}>Your edge is already in your data.<br />FLOW helps you find it.</h2>
        </div>

        <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { icon:<BrainIcon />, title:'Emotion tracking', desc:'Log how you felt before every trade — calm, FOMO, anxious, confident. See exactly which emotional states lead to wins and which lead to losses.' },
            { icon:<ChartBarIcon />, title:'Pattern recognition', desc:'Win rate by pair, by setup, by session. FLOW surfaces the patterns hidden in your trade history so you know where your real edge is.' },
            { icon:<JournalIcon />, title:'Full trade journal', desc:'Every trade gets a full record — chart screenshot, entry, SL, TP, your reasoning and your result. Nothing gets forgotten.' },
            { icon:<SearchIcon />, title:'Deep review', desc:'Filter your entire history by pair, result, emotion or setup. Revisit any trade with full context and chart attached.' },
            { icon:<MobileIcon />, title:'Mobile first', desc:'Built to work on your phone. Log trades, check your stats and review your journal from anywhere with a clean native feel.' },
            { icon:<LockIcon />, title:'Fully private', desc:'Your journal belongs to you alone. No one else can see your trades, your stats or your mindset notes.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="icon-wrap">{icon}</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:600, marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:14, color:'rgba(240,238,232,0.5)', lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding:'5rem 2rem', background:'#0D0D0D' }}>
        <div style={{ maxWidth:580, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontSize:12, color:'#1D9E75', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>How it works</p>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:34, fontWeight:600, lineHeight:1.2 }}>Simple enough that you'll actually use it</h2>
          </div>
          {[
            { n:'1', title:'Log the trade', desc:'After placing your trade, open FLOW and fill in the details — pair, entry, SL, TP, your setup and how you felt. Attach a screenshot of your chart. Takes under a minute.' },
            { n:'2', title:'Record the result', desc:'When the trade closes, update the result in one tap. TP hit, SL hit, breakeven or manually closed. Your journal stays accurate without extra effort.' },
            { n:'3', title:'Review and evolve', desc:'Use Stats to see your win rate by pair, setup and emotion. Use Review to revisit past trades. The more you log, the clearer your edge becomes.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display:'flex', gap:18, marginBottom:'2.5rem', alignItems:'flex-start' }}>
              <div className="step-num">{n}</div>
              <div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:600, marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:14, color:'rgba(240,238,232,0.5)', lineHeight:1.75 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:'7rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div className="glow" style={{ width:600, height:600, background:'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)', top:'-150px', left:'50%', transform:'translateX(-50%)' }} />
        <p style={{ fontSize:12, color:'#1D9E75', textTransform:'uppercase', letterSpacing:3, marginBottom:'1.25rem', position:'relative' }}>Start today</p>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:42, fontWeight:700, marginBottom:'1rem', position:'relative', lineHeight:1.1 }}>
          Know why you lose.<br />Know why you win.<br />
          <span style={{ color:'#1D9E75' }}>Evolve.</span>
        </h2>
        <p style={{ fontSize:16, color:'rgba(240,238,232,0.4)', marginBottom:'2.5rem', position:'relative' }}>Free to start. No credit card. No limits.</p>
        <button className="cta-btn" style={{ fontSize:16, padding:'15px 44px', position:'relative' }} onClick={() => navigate('/login')}>
          Create your free account
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'0.5px solid rgba(255,255,255,0.06)', padding:'1.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:22, height:22, background:'#1D9E75', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            <svg width="14" height="12" viewBox="0 0 24 22" fill="none">
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600, letterSpacing:1 }}>FLOW</span>
        </div>
        <p style={{ fontSize:12, color:'rgba(240,238,232,0.25)' }}>2026 FLOW. Built for traders.</p>
      </footer>
    </div>
  )
}

function BrainIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.69A3 3 0 016 9.5a3 3 0 012-2.83V6.5A2.5 2.5 0 019.5 2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.69A3 3 0 0018 9.5a3 3 0 00-2-2.83V6.5A2.5 2.5 0 0014.5 2z"/></svg> }
function ChartBarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function JournalIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> }
function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function MobileIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> }
function LockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> }
