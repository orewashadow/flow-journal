import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Review({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ pair: '', emotion: '', result: '', setup: '' })
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('trades').select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false }).then(({ data }) => {
        setTrades(data || [])
        setLoading(false)
      })
  }, [])

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const filtered = trades.filter(t => {
    if (filters.pair && !t.pair?.toLowerCase().includes(filters.pair.toLowerCase())) return false
    if (filters.emotion && t.emotion !== filters.emotion) return false
    if (filters.result && t.result !== filters.result) return false
    if (filters.setup && t.setup_type !== filters.setup) return false
    return true
  })

  const emotions = [...new Set(trades.map(t => t.emotion).filter(Boolean))]
  const setups = [...new Set(trades.map(t => t.setup_type).filter(Boolean))]
  const pairs = [...new Set(trades.map(t => t.pair).filter(Boolean))]

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>Review</h1>

      <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Filter trades</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Pair</label>
            <select value={filters.pair} onChange={e => setFilter('pair', e.target.value)}>
              <option value="">All pairs</option>
              {pairs.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Result</label>
            <select value={filters.result} onChange={e => setFilter('result', e.target.value)}>
              <option value="">All results</option>
              {['TP hit', 'SL hit', 'Open', 'Breakeven', 'Manually closed'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Emotion</label>
            <select value={filters.emotion} onChange={e => setFilter('emotion', e.target.value)}>
              <option value="">All emotions</option>
              {emotions.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Setup</label>
            <select value={filters.setup} onChange={e => setFilter('setup', e.target.value)}>
              <option value="">All setups</option>
              {setups.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {(filters.pair || filters.emotion || filters.result || filters.setup) && (
          <button onClick={() => setFilters({ pair: '', emotion: '', result: '', setup: '' })} style={{ marginTop: 12, fontSize: 12, color: '#E24B4A', background: 'transparent', fontFamily: "'DM Sans',sans-serif" }}>
            Clear filters
          </button>
        )}
      </div>

      <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', marginBottom: '1rem' }}>{filtered.length} trades found</p>

      {loading ? (
        <p style={{ color: 'rgba(240,238,232,0.3)', fontSize: 13 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'rgba(240,238,232,0.3)', fontSize: 13, textAlign: 'center', padding: '3rem' }}>No trades match your filters.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(trade => (
            <div key={trade.id} onClick={() => navigate(`/trades/${trade.id}`)} style={{
              background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12,
              padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.15s',
              display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px', gap: 12, alignItems: 'center'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              <div>
                <p style={{ fontWeight: 500, fontSize: 15, fontFamily: "'Syne',sans-serif" }}>{trade.pair}</p>
                <p style={{ fontSize: 11, color: 'rgba(240,238,232,0.3)', marginTop: 2 }}>{new Date(trade.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.4)' }}>{trade.setup_type || '—'}</p>
                {trade.emotion && <span style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)' }}>Felt: {trade.emotion}</span>}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.45)', lineHeight: 1.5 }}>
                {trade.reasoning ? trade.reasoning.slice(0, 80) + (trade.reasoning.length > 80 ? '...' : '') : '—'}
              </p>
              <ResultBadge result={trade.result} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ResultBadge({ result }) {
  const map = { 'TP hit': ['#1D9E75', 'rgba(29,158,117,0.12)'], 'SL hit': ['#E24B4A', 'rgba(226,75,74,0.12)'], 'Open': ['#378ADD', 'rgba(55,138,221,0.12)'] }
  const [color, bg] = map[result] || ['#888880', 'rgba(136,136,128,0.12)']
  return <span style={{ fontSize: 11, color, background: bg, padding: '4px 10px', borderRadius: 20, fontWeight: 500, whiteSpace: 'nowrap' }}>{result || '—'}</span>
}
