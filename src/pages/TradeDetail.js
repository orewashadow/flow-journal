import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function TradeDetail({ session }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trade, setTrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    supabase.from('trades').select('*').eq('id', id).single().then(({ data }) => {
      setTrade(data)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this trade?')) return
    setDeleting(true)
    await supabase.from('trades').delete().eq('id', id)
    navigate('/trades')
  }

  const handleUpdateResult = async (result) => {
    const { data } = await supabase.from('trades').update({ result }).eq('id', id).select().single()
    setTrade(data)
  }

  if (loading) return <div style={{ padding: '2rem', color: 'rgba(240,238,232,0.3)', fontSize: 13 }}>Loading...</div>
  if (!trade) return <div style={{ padding: '2rem', color: 'rgba(240,238,232,0.3)', fontSize: 13 }}>Trade not found.</div>

  const date = new Date(trade.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,238,232,0.6)', padding: '7px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 500 }}>{trade.pair || 'Trade'}</h1>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', marginTop: 2 }}>{date}</p>
        </div>
        <ResultBadge result={trade.result} large />
        <button onClick={handleDelete} disabled={deleting} style={{ padding: '7px 12px', borderRadius: 8, fontSize: 13, background: 'rgba(226,75,74,0.1)', color: '#E24B4A', fontFamily: "'DM Sans',sans-serif" }}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {trade.chart_url && (
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>Chart</p>
          <img src={trade.chart_url} alt="Trade chart" style={{ width: '100%', borderRadius: 8, objectFit: 'contain', maxHeight: 400 }} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Card title="Trade details">
          <Row2 label="Pair" value={trade.pair} />
          <Row2 label="Entry" value={trade.entry_price} />
          <Row2 label="Stop loss" value={trade.stop_loss} color="#E24B4A" />
          <Row2 label="Take profit" value={trade.take_profit} color="#1D9E75" />
          <Row2 label="Session" value={trade.session} />
          <Row2 label="Setup" value={trade.setup_type} />
        </Card>

        <Card title="Update result">
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.35)', marginBottom: 10 }}>Current: <strong style={{ color: '#F0EEE8' }}>{trade.result}</strong></p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['TP hit', 'SL hit', 'Open', 'Breakeven', 'Manually closed'].map(r => (
              <button key={r} onClick={() => handleUpdateResult(r)} style={{
                padding: '9px 14px', borderRadius: 8, fontSize: 13, textAlign: 'left',
                fontFamily: "'DM Sans',sans-serif",
                background: trade.result === r ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.04)',
                color: trade.result === r ? '#1D9E75' : 'rgba(240,238,232,0.5)',
                border: trade.result === r ? '0.5px solid rgba(29,158,117,0.4)' : '0.5px solid rgba(255,255,255,0.06)',
                transition: 'all 0.15s'
              }}>{r}</button>
            ))}
          </div>
        </Card>
      </div>

      {trade.emotion && (
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Mindset</p>
          <span style={{ fontSize: 13, background: 'rgba(29,158,117,0.1)', color: '#1D9E75', padding: '5px 12px', borderRadius: 20 }}>{trade.emotion}</span>
        </div>
      )}

      {trade.reasoning && (
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Why I took this trade</p>
          <p style={{ fontSize: 14, color: 'rgba(240,238,232,0.7)', lineHeight: 1.7 }}>{trade.reasoning}</p>
        </div>
      )}

      {trade.notes && (
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Notes</p>
          <p style={{ fontSize: 14, color: 'rgba(240,238,232,0.7)', lineHeight: 1.7 }}>{trade.notes}</p>
        </div>
      )}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
      <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  )
}

function Row2({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
      <span style={{ color: 'rgba(240,238,232,0.35)' }}>{label}</span>
      <span style={{ color: color || 'rgba(240,238,232,0.8)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}

function ResultBadge({ result, large }) {
  const map = { 'TP hit': ['#1D9E75', 'rgba(29,158,117,0.12)'], 'SL hit': ['#E24B4A', 'rgba(226,75,74,0.12)'], 'Open': ['#378ADD', 'rgba(55,138,221,0.12)'] }
  const [color, bg] = map[result] || ['#888880', 'rgba(136,136,128,0.12)']
  return <span style={{ fontSize: large ? 13 : 11, color, background: bg, padding: large ? '6px 14px' : '3px 9px', borderRadius: 20, fontWeight: 500 }}>{result || '—'}</span>
}
