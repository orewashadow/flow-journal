import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Review({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ pair:'', emotion:'', result:'', setup:'', planned:'' })
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('trades').select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTrades(data || []); setLoading(false) })
  }, [])

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const filtered = trades.filter(t => {
    if (filters.pair && t.pair !== filters.pair) return false
    if (filters.emotion && t.emotion !== filters.emotion) return false
    if (filters.result && t.result !== filters.result) return false
    if (filters.setup && t.setup_type !== filters.setup) return false
    if (filters.planned === 'planned' && t.is_planned !== true) return false
    if (filters.planned === 'fomo' && t.is_planned !== false) return false
    return true
  })

  const pairs = [...new Set(trades.map(t => t.pair).filter(Boolean))]
  const emotions = [...new Set(trades.map(t => t.emotion).filter(Boolean))]
  const setups = [...new Set(trades.map(t => t.setup_type).filter(Boolean))]
  const hasFilters = Object.values(filters).some(v => v)

  return (
    <div style={{ padding:'1.5rem', maxWidth:1000, margin:'0 auto' }}>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, color:'#0F1F4A', marginBottom:'1.5rem' }}>Review</h1>

      <div style={{ background:'#fff', border:'0.5px solid #E8EDFB', borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'1.25rem' }}>
        <p style={{ fontSize:11, fontWeight:500, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:1.5, marginBottom:14 }}>Filter trades</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, minmax(0,1fr))', gap:10 }}>
          {[
            ['Pair', 'pair', pairs.map(p => ({ value:p, label:p }))],
            ['Result', 'result', ['TP hit','SL hit','Open','Breakeven','Manually closed'].map(r => ({ value:r, label:r }))],
            ['Emotion', 'emotion', emotions.map(e => ({ value:e, label:e }))],
            ['Setup', 'setup', setups.map(s => ({ value:s, label:s }))],
            ['Entry type', 'planned', [{ value:'planned', label:'Planned' }, { value:'fomo', label:'FOMO' }]],
          ].map(([label, key, options]) => (
            <div key={key}>
              <label style={{ fontSize:11, color:'#9CA3AF', display:'block', marginBottom:5 }}>{label}</label>
              <select value={filters[key]} onChange={e => setFilter(key, e.target.value)} style={{ fontSize:12, padding:'8px 10px' }}>
                <option value="">All</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
        {hasFilters && (
          <button onClick={() => setFilters({ pair:'', emotion:'', result:'', setup:'', planned:'' })} style={{ marginTop:12, fontSize:12, color:'#EF4444', background:'transparent', padding:0 }}>
            Clear filters
          </button>
        )}
      </div>

      <p style={{ fontSize:12, color:'#9CA3AF', marginBottom:'1rem' }}>{filtered.length} trades found</p>

      {loading ? (
        <p style={{ color:'#9CA3AF', fontSize:13 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color:'#9CA3AF', fontSize:13, textAlign:'center', padding:'3rem' }}>No trades match your filters.</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(trade => (
            <div key={trade.id} onClick={() => navigate(`/trades/${trade.id}`)} style={{ background:'#fff', border:'0.5px solid #E8EDFB', borderRadius:12, padding:'1rem 1.25rem', cursor:'pointer', display:'grid', gridTemplateColumns:'130px 1fr 1fr 80px', gap:12, alignItems:'center', transition:'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#BFDBFE'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#E8EDFB'}>
              <div>
                <p style={{ fontWeight:500, fontSize:15, fontFamily:"'Syne',sans-serif", color:'#0F1F4A' }}>{trade.pair}</p>
                <p style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{new Date(trade.created_at).toLocaleDateString()}</p>
                {trade.is_a_plus === true && <span style={{ fontSize:9, color:'#7C3AED', background:'#EDE9FE', padding:'1px 6px', borderRadius:20, marginTop:3, display:'inline-block' }}>A+</span>}
              </div>
              <div>
                <p style={{ fontSize:12, color:'#6B7280' }}>{trade.setup_type || '—'}</p>
                {trade.emotion && <p style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>Before: {trade.emotion}{trade.is_planned === false ? ' · FOMO' : ''}</p>}
                {trade.confidence_level && <p style={{ fontSize:11, color:'#9CA3AF' }}>Confidence: {trade.confidence_level}/10</p>}
              </div>
              <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.5 }}>
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
  const map = { 'TP hit':['#166534','#DCFCE7'], 'SL hit':['#991B1B','#FEE2E2'], 'Open':['#1E40AF','#DBEAFE'], 'Breakeven':['#854D0E','#FEF9C3'] }
  const [color, bg] = map[result] || ['#4B5563','#F3F4F6']
  return <span style={{ fontSize:10, color, background:bg, padding:'4px 10px', borderRadius:20, fontWeight:500, whiteSpace:'nowrap' }}>{result || '—'}</span>
}
