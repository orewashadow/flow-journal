import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function TradeLog({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('trades').select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTrades(data || []); setLoading(false) })
  }, [])

  const filtered = filter === 'All' ? trades : trades.filter(t => t.result === filter)

  return (
    <div style={{ padding:'1.5rem', maxWidth:1100, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, color:'#0F1F4A' }}>Trade log</h1>
        <button onClick={() => navigate('/trades/new')} style={{ padding:'9px 18px', background:'#3B82F6', color:'white', borderRadius:10, fontSize:13, fontWeight:500 }}>+ New trade</button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {['All','TP hit','SL hit','Open','Breakeven'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 16px', borderRadius:20, fontSize:13, background: filter===f ? '#3B82F6' : '#fff', color: filter===f ? 'white' : '#6B7280', border: filter===f ? 'none' : '0.5px solid #E8EDFB', transition:'all 0.15s' }}>{f}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:12, color:'#9CA3AF', alignSelf:'center' }}>{filtered.length} trades</span>
      </div>

      <div style={{ background:'#fff', border:'0.5px solid #E8EDFB', borderRadius:12, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'40px 100px 60px 90px 90px 90px 1fr 80px 75px', gap:8, padding:'11px 16px', borderBottom:'0.5px solid #F3F4F6', fontSize:11, color:'#9CA3AF', fontWeight:500 }}>
          <span>#</span><span>Pair</span><span>TF</span><span>Entry</span><span>SL</span><span>TP</span><span>Setup</span><span>Emotion</span><span>Result</span>
        </div>

        {loading ? (
          <p style={{ color:'#9CA3AF', fontSize:13, textAlign:'center', padding:'3rem' }}>Loading trades...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem 0' }}>
            <p style={{ color:'#9CA3AF', fontSize:13, marginBottom:12 }}>No trades found.</p>
            <button onClick={() => navigate('/trades/new')} style={{ padding:'9px 18px', background:'#EFF6FF', color:'#3B82F6', borderRadius:8, fontSize:13 }}>Log your first trade</button>
          </div>
        ) : (
          filtered.map((trade, i) => (
            <div key={trade.id} onClick={() => navigate(`/trades/${trade.id}`)} style={{ display:'grid', gridTemplateColumns:'40px 100px 60px 90px 90px 90px 1fr 80px 75px', gap:8, padding:'11px 16px', borderBottom:'0.5px solid #F9FAFB', fontSize:13, cursor:'pointer', alignItems:'center', transition:'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background='#F8FAFF'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:11, color:'#D1D5DB' }}>{filtered.length - i}</span>
              <div>
                <p style={{ fontWeight:500, color:'#0F1F4A' }}>{trade.pair || '—'}</p>
                {trade.is_a_plus === true && <span style={{ fontSize:9, color:'#7C3AED', background:'#EDE9FE', padding:'1px 6px', borderRadius:20 }}>A+</span>}
              </div>
              <span style={{ color:'#9CA3AF', fontSize:12 }}>{trade.timeframe || '—'}</span>
              <span style={{ color:'#6B7280' }}>{trade.entry_price || '—'}</span>
              <span style={{ color:'#DC2626' }}>{trade.stop_loss || '—'}</span>
              <span style={{ color:'#059669' }}>{trade.take_profit || '—'}</span>
              <span style={{ color:'#6B7280', fontSize:12 }}>{trade.setup_type || '—'}</span>
              <span style={{ color:'#6B7280', fontSize:12 }}>{trade.emotion || '—'}</span>
              <ResultBadge result={trade.result} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ResultBadge({ result }) {
  const map = { 'TP hit':['#166534','#DCFCE7'], 'SL hit':['#991B1B','#FEE2E2'], 'Open':['#1E40AF','#DBEAFE'], 'Breakeven':['#854D0E','#FEF9C3'], 'Manually closed':['#4B5563','#F3F4F6'] }
  const [color, bg] = map[result] || ['#4B5563','#F3F4F6']
  return <span style={{ fontSize:10, color, background:bg, padding:'3px 8px', borderRadius:20, fontWeight:500, whiteSpace:'nowrap' }}>{result || '—'}</span>
}
