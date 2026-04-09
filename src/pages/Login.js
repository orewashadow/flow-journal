import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setSuccess('Account created! Check your email to confirm, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0D0D0D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 400, padding: '0 1.5rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, background: '#1D9E75', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <svg width="26" height="22" viewBox="0 0 24 22" fill="none">
                <style>{`.wv{fill:none;stroke:white;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:6 4;animation:flow 1.2s linear infinite}.wv2{animation-delay:-.6s;opacity:.5}@keyframes flow{to{stroke-dashoffset:-40}}`}</style>
                <path className="wv" d="M1 7 C4 3,7 3,9 6 C11 9,14 9,17 5 C19 2,22 2,24 5"/>
                <path className="wv wv2" d="M1 14 C4 10,7 10,9 13 C11 16,14 16,17 12 C19 9,22 9,24 12"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 500, letterSpacing: 2 }}>FLOW</span>
          </div>
          <p style={{ color: 'rgba(240,238,232,0.4)', fontSize: 14 }}>Your trading journal. Always evolving.</p>
        </div>

        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2rem' }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 500, marginBottom: '1.5rem' }}>
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'rgba(240,238,232,0.4)', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'rgba(240,238,232,0.4)', display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && <p style={{ fontSize: 13, color: '#E24B4A', background: 'rgba(226,75,74,0.1)', padding: '10px 12px', borderRadius: 8 }}>{error}</p>}
            {success && <p style={{ fontSize: 13, color: '#1D9E75', background: 'rgba(29,158,117,0.1)', padding: '10px 12px', borderRadius: 8 }}>{success}</p>}

            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: '12px', borderRadius: 10,
              background: '#1D9E75', color: 'white',
              fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans',sans-serif",
              opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s'
            }}>
              {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 13, color: 'rgba(240,238,232,0.35)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}
              style={{ color: '#1D9E75', cursor: 'pointer' }}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
