import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TradeLog from './pages/TradeLog'
import NewTrade from './pages/NewTrade'
import TradeDetail from './pages/TradeDetail'
import Stats from './pages/Stats'
import Review from './pages/Review'
import Layout from './components/Layout'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) saveSessionForExtension(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) saveSessionForExtension(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const saveSessionForExtension = (session) => {
    try {
      localStorage.setItem('flow_extension_session', JSON.stringify({
        access_token: session.access_token,
        user: { id: session.user.id, email: session.user.email }
      }))
    } catch(e) {}
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0D0D0D' }}>
      <FlowLogo />
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Layout session={session} /> : <Navigate to="/" />}>
          <Route index element={<Dashboard session={session} />} />
        </Route>
        <Route path="/" element={session ? <Layout session={session} /> : <Navigate to="/" />}>
          <Route path="trades" element={<TradeLog session={session} />} />
          <Route path="trades/new" element={<NewTrade session={session} />} />
          <Route path="trades/:id" element={<TradeDetail session={session} />} />
          <Route path="stats" element={<Stats session={session} />} />
          <Route path="review" element={<Review session={session} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function FlowLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 36, height: 36, background: '#1D9E75', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
          <style>{`.wv{fill:none;stroke:white;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:6 4;animation:flow 1.2s linear infinite}.wv2{animation-delay:-.6s;opacity:.5}@keyframes flow{to{stroke-dashoffset:-40}}`}</style>
          <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
          <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
        </svg>
      </div>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 500, color: '#F0EEE8', letterSpacing: 1 }}>FLOW</span>
    </div>
  )
}
