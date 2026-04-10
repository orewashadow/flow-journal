import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/trades', label: 'Trade log' },
  { to: '/trades/new', label: 'New trade' },
  { to: '/review', label: 'Review' },
  { to: '/stats', label: 'Stats' },
]

export default function Layout({ session }) {
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const username = session?.user?.email?.split('@')[0] || 'Trader'

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        .sidebar { width:220px; flex-shrink:0; background:#111111; border-right:0.5px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; padding:1.5rem 1rem; }
        .bottom-nav { display:none; }
        .main-content { flex:1; overflow:auto; background:#0D0D0D; }
        @media (max-width:768px) {
          .sidebar { display:none; }
          .bottom-nav { display:flex; position:fixed; bottom:0; left:0; right:0; background:#111111; border-top:0.5px solid rgba(255,255,255,0.08); z-index:100; }
          .main-content { padding-bottom:65px; }
        }
      `}</style>

      <aside className="sidebar">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'2rem' }}>
          <div style={{ width:32, height:32, background:'#1D9E75', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
              <style>{`.wv{fill:none;stroke:white;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:6 4;animation:flow 1.2s linear infinite}.wv2{animation-delay:-.6s;opacity:.5}@keyframes flow{to{stroke-dashoffset:-40}}`}</style>
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, letterSpacing:1 }}>FLOW</span>
        </div>

        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              display:'flex', alignItems:'center', padding:'9px 12px', borderRadius:8, fontSize:13,
              color: isActive ? '#1D9E75' : 'rgba(240,238,232,0.5)',
              background: isActive ? 'rgba(29,158,117,0.1)' : 'transparent',
              fontWeight: isActive ? 500 : 400, transition:'all 0.15s', textDecoration:'none'
            })}>{label}</NavLink>
          ))}
        </nav>

        <div style={{ flex:1 }} />

        <div style={{ borderTop:'0.5px solid rgba(255,255,255,0.06)', paddingTop:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', marginBottom:4 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#1D9E75', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:500, color:'white' }}>
              {username[0].toUpperCase()}
            </div>
            <span style={{ fontSize:13, color:'rgba(240,238,232,0.7)' }}>{username}</span>
          </div>
          <button onClick={handleSignOut} disabled={signingOut} style={{ width:'100%', padding:'8px 12px', borderRadius:8, background:'transparent', color:'rgba(240,238,232,0.3)', fontSize:13, textAlign:'left' }}>
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </aside>

      <main className="main-content"><Outlet /></main>

      <nav className="bottom-nav">
        {NAV.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:'10px 4px 12px', color: isActive ? '#1D9E75' : 'rgba(240,238,232,0.35)',
            fontSize:10, fontWeight: isActive ? 500 : 400, textDecoration:'none', gap:4,
            borderTop: isActive ? '2px solid #1D9E75' : '2px solid transparent', transition:'all 0.15s'
          })}>
            <NavIcon label={label} />
            {label === 'New trade' ? '+' : label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function NavIcon({ label }) {
  const s = { width:18, height:18 }
  if (label === 'Dashboard') return <svg {...s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
  if (label === 'Trade log') return <svg {...s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>
  if (label === 'New trade') return <svg {...s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12M2 8h12"/></svg>
  if (label === 'Review') return <svg {...s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v4l2.5 1.5"/></svg>
  if (label === 'Stats') return <svg {...s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12 L5 8 L8 10 L11 5 L14 7"/></svg>
  return null
}
