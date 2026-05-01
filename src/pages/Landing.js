import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background:'#0F1F4A', minHeight:'100vh', color:'#fff', fontFamily:"'DM Sans',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .wv{fill:none;stroke:white;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:6 4;animation:flow 1.2s linear infinite}
        .wv2{animation-delay:-.6s;opacity:.5}
        @keyframes flow{to{stroke-dashoffset:-40}}
        .cta-btn{background:#3B82F6;color:white;border:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:opacity 0.2s,transform 0.15s;}
        .cta-btn:hover{opacity:0.88;transform:translateY(-1px);}
        .outline-btn{background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:0.5px solid rgba(255,255,255,0.15);padding:13px 28px;border-radius:10px;font-size:15px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;}
        .outline-btn:hover{background:rgba(255,255,255,0.12);color:#fff;}
        .nav-link{color:rgba(255,255,255,0.5);font-size:14px;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;transition:color 0.15s;}
        .nav-link:hover{color:#fff;}
        .feature-card{background:rgba(255,255,255,0.05);border:0.5px solid rgba(255,255,255,0.1);border-radius:16px;padding:2rem;transition:border-color 0.2s,transform 0.2s;}
        .feature-card:hover{border-color:rgba(59,130,246,0.5);transform:translateY(-2px);}
        .icon-wrap{width:44px;height:44px;background:rgba(59,130,246,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;}
        .step-num{width:32px;height:32px;border-radius:50%;background:rgba(59,130,246,0.2);border:0.5px solid rgba(59,130,246,0.4);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:#93C5FD;flex-shrink:0;}
        .stat-num{font-family:'Syne',sans-serif;font-size:36px;font-weight:600;color:#3B82F6;}
        @media(max-width:768px){
          .hero-title{font-size:34px !important;line-height:1.15 !important;}
          .features-grid{grid-template-columns:1fr !important;}
          .stats-row{flex-direction:column !important;gap:2rem !important;}
          .nav-links{display:none !important;}
          .hero-btns{flex-direction:column !important;}
          .divider{display:none !important;}
          .preview-grid{grid-template-columns:1fr 1fr !important;}
        }
      `}</style>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem', borderBottom:'0.5px solid rgba(255,255,255,0.08)', position:'sticky', top:0, background:'rgba(15,31,74,0.95)', backdropFilter:'blur(12px)', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'#3B82F6', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
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

      <section style={{ position:'relative', padding:'7rem 2rem 5rem', maxWidth:860, margin:'0 auto', textAlign:'center' }}>
        <div style={{ position:'absolute', top:'-150px', left:'50%', transform:'translateX(-50%)', width:700, height:700, background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <p style={{ fontSize:12, color:'#93C5FD', textTransform:'uppercase', letterSpacing:3, marginBottom:'1.5rem' }}>Trading journal</p>
        <h1 className="hero-title" style={{ fontFamily:"'Syne',sans-serif", fontSize:56, fontWeight:700, lineHeight:1.08, marginBottom:'1.75rem', letterSpacing:'-1px' }}>
          Know why you lose.<br />Know why you win.<br />
          <span style={{ color:'#3B82F6' }}>Evolve.</span>
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.5)', lineHeight:1.75, maxWidth:520, margin:'0 auto 2.5rem' }}>
          FLOW is the trading journal that connects your mindset to your results. Track every trade, understand your emotions, and discover the patterns that make you a better trader.
        </p>
        <div className="hero-btns" style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:'4rem' }}>
          <button className="cta-btn" onClick={() => navigate('/login')}>Start for free</button>
          <button className="outline-btn" onClick={() => document.getElementById('features').scrollIntoView({ behavior:'smooth' })}>See how it works</button>
        </div>

        <div style={{ background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'1.5rem', textAlign:'left', maxWidth:680, margin:'0 auto' }}>
          <div className="preview-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:'1.25rem' }}>
            {[['48','Total trades','#fff'],['64%','Win rate','#3B82F6'],['72%','A+ WR','#8B5CF6'],['81%','Rules','#10B981']].map(([val,label,color]) => (
              <div key={label} style={{ background:'rgba(255,255,255,0.05)', borderRadius:10, padding:'0.75rem 1rem' }}>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{label}</p>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, color }}>{val}</p>
              </div>
            ))}
          </div>
          {[['EUR/USD','1H','Order block','Calm','TP hit'],['BTC/USD','4H','Fair value gap','FOMO','SL hit'],['XAU/USD','1D','Break of structure','Confident','Open']].map(([pair,tf,setup,emotion,result]) => (
            <div key={pair} style={{ display:'grid', gridTemplateColumns:'80px 40px 1fr 70px 60px', gap:8, padding:'9px 0', borderTop:'0.5px solid rgba(255,255,255,0.06)', fontSize:12, alignItems:'center' }}>
              <span style={{ fontWeight:500 }}>{pair}</span>
              <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>{tf}</span>
              <span style={{ color:'rgba(255,255,255,0.4)' }}>{setup}</span>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{emotion}</span>
              <span style={{ fontSize:10, color:result==='TP hit'?'#166534':result==='SL hit'?'#991B1B':'#1E40AF', background:result==='TP hit'?'#DCFCE7':result==='SL hit'?'#FEE2E2':'#DBEAFE', padding:'3px 8px', borderRadius:20, fontWeight:500 }}>{result}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:'4rem 2rem', borderTop:'0.5px solid rgba(255,255,255,0.08)', borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
        <div className="stats-row" style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:0, maxWidth:760, margin:'0 auto', textAlign:'center' }}>
          {[['80%','of traders never review their trades and wonder why they keep losing'],['100%','free to start — no credit card, no limits on trades'],['1 place','for chart, numbers, mindset and review all together']].map(([num, desc], i) => (
            <React.Fragment key={num}>
              {i > 0 && <div className="divider" style={{ width:1, height:60, background:'rgba(255,255,255,0.08)', margin:'0 2.5rem' }} />}
              <div style={{ flex:1 }}>
                <p className="stat-num">{num}</p>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.6, maxWidth:200, margin:'8px auto 0' }}>{desc}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      <section id="features" style={{ padding:'5rem 2rem', maxWidth:1000, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <p style={{ fontSize:12, color:'#93C5FD', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>What FLOW does</p>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:34, fontWeight:600, lineHeight:1.2 }}>Your edge is already in your data.<br />FLOW helps you find it.</h2>
        </div>
        <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { icon:<BrainIcon />, title:'Emotion tracking', desc:'Log how you felt before, during and after every trade. See exactly which emotional states lead to wins and which lead to losses.' },
            { icon:<ChartBarIcon />, title:'Pattern recognition', desc:'Win rate by pair, by setup, by session and by emotion. FLOW surfaces the patterns hidden in your trade history.' },
            { icon:<JournalIcon />, title:'Full trade journal', desc:'Every trade gets a full record — chart screenshot, entry, SL, TP, A+ rating, confidence score, and your reasoning.' },
            { icon:<SearchIcon />, title:'Deep review', desc:'Filter your entire history by pair, result, emotion or setup. Revisit any trade with full context and chart attached.' },
            { icon:<MobileIcon />, title:'Mobile first', desc:'Built to work beautifully on your phone. Log trades, check stats and review your journal from anywhere.' },
            { icon:<ShieldIcon />, title:'Fully private', desc:'Your journal belongs to you alone. No one else can see your trades, your stats or your mindset notes.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="icon-wrap">{icon}</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:600, marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" style={{ padding:'5rem 2rem', background:'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth:580, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <p style={{ fontSize:12, color:'#93C5FD', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>How it works</p>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:34, fontWeight:600, lineHeight:1.2 }}>Simple enough that you will actually use it</h2>
          </div>
          {[
            { n:'1', title:'Log the trade', desc:'After placing your trade open FLOW, fill in the details and attach a chart screenshot. Rate it A+ or not, pick your emotion, note your reasoning. Takes under a minute.' },
            { n:'2', title:'Record the result', desc:'When the trade closes update the result in one tap. TP hit, SL hit, breakeven or manually closed. Your journal stays accurate without extra effort.' },
            { n:'3', title:'Review and evolve', desc:'Use Stats to see your win rate by pair, setup and emotion. Use Review to revisit past trades. The more you log the clearer your edge becomes.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display:'flex', gap:18, marginBottom:'2.5rem', alignItems:'flex-start' }}>
              <div className="step-num">{n}</div>
              <div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:600, marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.75 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:'7rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-150px', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <p style={{ fontSize:12, color:'#93C5FD', textTransform:'uppercase', letterSpacing:3, marginBottom:'1.25rem', position:'relative' }}>Start today</p>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:42, fontWeight:700, marginBottom:'1rem', position:'relative', lineHeight:1.1 }}>
          Know why you lose.<br />Know why you win.<br />
          <span style={{ color:'#3B82F6' }}>Evolve.</span>
        </h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', marginBottom:'2.5rem', position:'relative' }}>Free to start. No credit card. No limits.</p>
        <button className="cta-btn" style={{ fontSize:16, padding:'15px 44px', position:'relative' }} onClick={() => navigate('/login')}>
          Create your free account
        </button>
      </section>

      <footer style={{ borderTop:'0.5px solid rgba(255,255,255,0.08)', padding:'1.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:22, height:22, background:'#3B82F6', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            <svg width="14" height="12" viewBox="0 0 24 22" fill="none">
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:600, letterSpacing:1 }}>FLOW</span>
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>2026 FLOW. Built for traders.</p>
      </footer>
    </div>
  )
}

function BrainIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.69A3 3 0 016 9.5a3 3 0 012-2.83V6.5A2.5 2.5 0 019.5 2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.69A3 3 0 0018 9.5a3 3 0 00-2-2.83V6.5A2.5 2.5 0 0014.5 2z"/></svg> }
function ChartBarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function JournalIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> }
function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function MobileIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> }
function ShieldIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
