import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMOTIONS = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Excited', 'Uncertain']
const SESSIONS = ['London', 'New York', 'Asian', 'London/NY Overlap']
const SETUPS = ['Break of structure', 'Order block', 'Fair value gap', 'Trend continuation', 'Reversal', 'Range', 'Other']
const RESULTS = ['Open', 'TP hit', 'SL hit', 'Breakeven', 'Manually closed']

export default function TradeDetail({ session }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trade, setTrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [chartFile, setChartFile] = useState(null)
  const [chartPreview, setChartPreview] = useState(null)

  useEffect(() => {
    supabase.from('trades').select('*').eq('id', id).single().then(({ data }) => {
      setTrade(data)
      setForm(data || {})
      setLoading(false)
    })
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleDelete = async () => {
    if (!window.confirm('Delete this trade?')) return
    setDeleting(true)
    await supabase.from('trades').delete().eq('id', id)
    navigate('/trades')
  }

  const handleSave = async () => {
    setSaving(true)
    let chart_url = form.chart_url

    if (chartFile) {
      const ext = chartFile.name.split('.').pop()
      const path = `${session.user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('charts').upload(path, chartFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('charts').getPublicUrl(path)
        chart_url = data.publicUrl
      }
    }

    const { data } = await supabase.from('trades').update({
      pair: form.pair,
      entry_price: form.entry_price ? parseFloat(form.entry_price) : null,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
      take_profit: form.take_profit ? parseFloat(form.take_profit) : null,
      result: form.result,
      emotion: form.emotion,
      setup_type: form.setup_type,
      session: form.session,
      reasoning: form.reasoning,
      notes: form.notes,
      chart_url
    }).eq('id', id).select().single()

    setTrade(data)
    setForm(data)
    setEditing(false)
    setSaving(false)
    setChartFile(null)
    setChartPreview(null)
  }

  const handleChart = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setChartFile(file)
    setChartPreview(URL.createObjectURL(file))
  }

  if (loading) return <div style={{ padding: '2rem', color: 'rgba(240,238,232,0.3)', fontSize: 13 }}>Loading...</div>
  if (!trade) return <div style={{ padding: '2rem', color: 'rgba(240,238,232,0.3)', fontSize: 13 }}>Trade not found.</div>

  const date = new Date(trade.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ padding: '1.25rem', maxWidth: 800, margin: '0 auto' }}>
      <style>{`@media(max-width:768px){.detail-grid{grid-template-columns:1fr !important;}}`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,238,232,0.6)', padding: '7px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 500 }}>{trade.pair || 'Trade'}</h1>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', marginTop: 2 }}>{date}</p>
        </div>
        <ResultBadge result={trade.result} large />
        <button onClick={() => setEditing(!editing)} style={{ padding: '7px 12px', borderRadius: 8, fontSize: 13, background: editing ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.06)', color: editing ? '#1D9E75' : 'rgba(240,238,232,0.6)', fontFamily: "'DM Sans',sans-serif" }}>
          {editing ? 'Cancel' : 'Edit'}
        </button>
        <button onClick={handleDelete} disabled={deleting} style={{ padding: '7px 12px', borderRadius: 8, fontSize: 13, background: 'rgba(226,75,74,0.1)', color: '#E24B4A', fontFamily: "'DM Sans',sans-serif" }}>
          {deleting ? '...' : 'Delete'}
        </button>
      </div>

      {(chartPreview || trade.chart_url) && (
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>Chart</p>
          <img src={chartPreview || trade.chart_url} alt="Trade chart" style={{ width: '100%', borderRadius: 8, objectFit: 'contain', maxHeight: 400 }} />
        </div>
      )}

      {editing && (
        <div style={{ background: '#111111', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Upload new chart</p>
          <div style={{ border: '0.5px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '1rem', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => document.getElementById('chart-edit-upload').click()}>
            <p style={{ fontSize: 13, color: 'rgba(240,238,232,0.3)' }}>{chartFile ? chartFile.name : 'Click to upload new chart'}</p>
            <input id="chart-edit-upload" type="file" accept="image/*" onChange={handleChart} style={{ display: 'none' }} />
          </div>
        </div>
      )}

      <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Trade details</p>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Pair', 'pair', 'text'], ['Entry price', 'entry_price', 'number'], ['Stop loss', 'stop_loss', 'number'], ['Take profit', 'take_profit', 'number']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input type={type} step="any" value={form[key] || ''} onChange={e => set(key, type === 'text' ? e.target.value.toUpperCase() : e.target.value)} style={{ fontSize: 13, padding: '8px 12px' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 4 }}>Session</label>
                <select value={form.session || ''} onChange={e => set('session', e.target.value)} style={{ fontSize: 13, padding: '8px 12px' }}>
                  <option value="">Select session</option>
                  {SESSIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 4 }}>Setup</label>
                <select value={form.setup_type || ''} onChange={e => set('setup_type', e.target.value)} style={{ fontSize: 13, padding: '8px 12px' }}>
                  <option value="">Select setup</option>
                  {SETUPS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Pair', trade.pair], ['Entry', trade.entry_price], ['Stop loss', trade.stop_loss, '#E24B4A'], ['Take profit', trade.take_profit, '#1D9E75'], ['Session', trade.session], ['Setup', trade.setup_type]].map(([label, value, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <span style={{ color: 'rgba(240,238,232,0.35)' }}>{label}</span>
                  <span style={{ color: color || 'rgba(240,238,232,0.8)', fontWeight: 500 }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Result & mindset</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {editing ? (
              <>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 4 }}>Result</label>
                  <select value={form.result || ''} onChange={e => set('result', e.target.value)} style={{ fontSize: 13, padding: '8px 12px' }}>
                    {RESULTS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Emotion</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {EMOTIONS.map(em => (
                      <button type="button" key={em} onClick={() => set('emotion', em)} style={{
                        padding: '5px 10px', borderRadius: 20, fontSize: 12, fontFamily: "'DM Sans',sans-serif",
                        background: form.emotion === em ? 'rgba(29,158,117,0.2)' : 'rgba(255,255,255,0.06)',
                        color: form.emotion === em ? '#1D9E75' : 'rgba(240,238,232,0.5)',
                        border: form.emotion === em ? '0.5px solid #1D9E75' : '0.5px solid rgba(255,255,255,0.08)',
                      }}>{em}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              RESULTS.map(r => (
                <button key={r} onClick={() => supabase.from('trades').update({ result: r }).eq('id', id).select().single().then(({ data }) => setTrade(data))} style={{
                  padding: '9px 14px', borderRadius: 8, fontSize: 13, textAlign: 'left',
                  fontFamily: "'DM Sans',sans-serif",
                  background: trade.result === r ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.04)',
                  color: trade.result === r ? '#1D9E75' : 'rgba(240,238,232,0.5)',
                  border: trade.result === r ? '0.5px solid rgba(29,158,117,0.4)' : '0.5px solid rgba(255,255,255,0.06)',
                }}>{r}</button>
              ))
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>Journal</p>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Why I took this trade</label>
            <textarea value={form.reasoning || ''} onChange={e => set('reasoning', e.target.value)} rows={4} style={{ resize: 'vertical', fontSize: 13 }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'rgba(240,238,232,0.35)', display: 'block', marginBottom: 6 }}>Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={3} style={{ resize: 'vertical', fontSize: 13 }} />
          </div>
        </div>
      ) : (
        <>
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
            <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Notes</p>
              <p style={{ fontSize: 14, color: 'rgba(240,238,232,0.7)', lineHeight: 1.7 }}>{trade.notes}</p>
            </div>
          )}
        </>
      )}

      {editing && (
        <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '13px', borderRadius: 10, background: '#1D9E75', color: 'white', fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", marginBottom: '2rem', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      )}
    </div>
  )
}

function ResultBadge({ result, large }) {
  const map = { 'TP hit': ['#1D9E75', 'rgba(29,158,117,0.12)'], 'SL hit': ['#E24B4A', 'rgba(226,75,74,0.12)'], 'Open': ['#378ADD', 'rgba(55,138,221,0.12)'] }
  const [color, bg] = map[result] || ['#888880', 'rgba(136,136,128,0.12)']
  return <span style={{ fontSize: large ? 13 : 11, color, background: bg, padding: large ? '6px 14px' : '3px 9px', borderRadius: 20, fontWeight: 500 }}>{result || '—'}</span>
}
