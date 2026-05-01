import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <GridIcon /> },
  { to: '/trades', label: 'Trade log', icon: <ListIcon /> },
  { to: '/trades/new', label: 'New trade', icon: <PlusIcon /> },
  { to: '/review', label: 'Review', icon: <ClockIcon /> },
  { to: '/stats', label: 'Stats', icon: <ChartIcon /> },
]

export default function Layout({ session }) {
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const username = session?.user?.email?.split('@')[0] || 'Trader'

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <style>{`
        .sidebar{width:210px;flex-shrink:0;background:#0F1F4A;display:flex;flex-direction:column;padding:1.5rem 1rem;}
        .bottom-nav{display:none;}
        .main-content{flex:1;overflow:auto;background:#F8FAFF;}
        .nav-link{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:2px;text-decoration:none;transition:all 0.15s;}
        .nav-link:hover{color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.06);}
        .nav-link.active{background:rgba(59,130,246,0.2);color:#93C5FD;font-weight:500;}
        @media(max-width:768px){
          .sidebar{display:none;}
          .bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#0F1F4A;border-top:0.5px solid rgba(255,255,255,0.08);z-index:100;}
          .main-content{padding-bottom:65px;}
        }
      `}</style>

      <aside className="sidebar">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'2rem' }}>
          <div style={{ width:32, height:32, background:'#3B82F6', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
              <style>{`.wv{fill:none;stroke:white;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:6 4;animation:flow 1.2s linear infinite}.wv2{animation-delay:-.6s;opacity:.5}@keyframes flow{to{stroke-dashoffset:-40}}`}</style>
              <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
              <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
            </svg>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, letterSpacing:1, color:'#fff' }}>FLOW</span>
        </div>

        <nav style={{ flex:1 }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {icon} {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop:'0.5px solid rgba(255,255,255,0.08)', paddingTop:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', marginBottom:4 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#3B82F6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:500, color:'white' }}>
              {username[0].toUpperCase()}
            </div>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{username}</span>
          </div>
          <button onClick={handleSignOut} disabled={signingOut} style={{ width:'100%', padding:'8px 12px', borderRadius:8, background:'transparent', color:'rgba(255,255,255,0.3)', fontSize:13, textAlign:'left' }}>
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </aside>

      <main className="main-content"><Outlet /></main>

      <nav className="bottom-nav">
        {NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''} style={({ isActive }) => ({
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:'10px 4px 12px', color: isActive ? '#93C5FD' : 'rgba(255,255,255,0.35)',
            fontSize:10, fontWeight: isActive ? 500 : 400, textDecoration:'none', gap:4,
            borderTop: isActive ? '2px solid #3B82F6' : '2px solid transparent', transition:'all 0.15s'
          })}>
            {icon}
            {label === 'New trade' ? '+' : label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function GridIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> }
function ListIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg> }
function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12M2 8h12"/></svg> }
function ClockIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v4l2.5 1.5"/></svg> }
function ChartIcon() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12 L5 8 L8 10 L11 5 L14 7"/></svg> }
