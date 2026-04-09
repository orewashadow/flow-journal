import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function TradeLog({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => { fetchTrades() }, [])

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*')
      .eq('user_id', session.user.id).order('created_at', { ascending: false })
    setTrades(data || [])
    setLoading(false)
  }

  const filtered = filter === 'All' ? trades : trades.filter(t => t.result === filter)

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 500 }}>Trade log</h1>
        <button onClick={() => navigate('/trades/new')} style={{ padding: '9px 18px', background: '#1D9E75', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>+ New trade</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        {['All', 'TP hit', 'SL hit', 'Open'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
            background: filter === f ? '#1D9E75' : 'rgba(255,255,255,0.06)',
            color: filter === f ? 'white' : 'rgba(240,238,232,0.5)',
            transition: 'all 0.15s'
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(240,238,232,0.3)', alignSelf: 'center' }}>{filtered.length} trades</span>
      </div>

      <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 120px 100px 100px 100px 1fr 90px 90px', gap: 8, padding: '12px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(240,238,232,0.3)', fontWeight: 500 }}>
          <span>#</span><span>Pair</span><span>Entry</span><span>SL</span><span>TP</span><span>Setup</span><span>Emotion</span><span>Result</span>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(240,238,232,0.3)', fontSize: 13, textAlign: 'center', padding: '3rem' }}>Loading trades...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'rgba(240,238,232,0.3)', fontSize: 13, marginBottom: 12 }}>No trades found.</p>
            <button onClick={() => navigate('/trades/new')} style={{ padding: '9px 18px', background: 'rgba(29,158,117,0.15)', color: '#1D9E75', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Log your first trade</button>
          </div>
        ) : (
          filtered.map((trade, i) => (
            <div key={trade.id} onClick={() => navigate(`/trades/${trade.id}`)} style={{
              display: 'grid', gridTemplateColumns: '50px 120px 100px 100px 100px 1fr 90px 90px',
              gap: 8, padding: '13px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.04)',
              fontSize: 13, cursor: 'pointer', alignItems: 'center',
              transition: 'background 0.1s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 11, color: 'rgba(240,238,232,0.25)' }}>{filtered.length - i}</span>
              <span style={{ fontWeight: 500 }}>{trade.pair || '—'}</span>
              <span style={{ color: 'rgba(240,238,232,0.6)' }}>{trade.entry_price || '—'}</span>
              <span style={{ color: 'rgba(240,238,232,0.6)' }}>{trade.stop_loss || '—'}</span>
              <span style={{ color: 'rgba(240,238,232,0.6)' }}>{trade.take_profit || '—'}</span>
              <span style={{ color: 'rgba(240,238,232,0.4)', fontSize: 12 }}>{trade.setup_type || '—'}</span>
              <span style={{ color: 'rgba(240,238,232,0.4)', fontSize: 12 }}>{trade.emotion || '—'}</span>
              <ResultBadge result={trade.result} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ResultBadge({ result }) {
  const map = { 'TP hit': ['#1D9E75', 'rgba(29,158,117,0.12)'], 'SL hit': ['#E24B4A', 'rgba(226,75,74,0.12)'], 'Open': ['#378ADD', 'rgba(55,138,221,0.12)'] }
  const [color, bg] = map[result] || ['#888880', 'rgba(136,136,128,0.12)']
  return <span style={{ fontSize: 11, color, background: bg, padding: '3px 9px', borderRadius: 20, fontWeight: 500 }}>{result || '—'}</span>
}
