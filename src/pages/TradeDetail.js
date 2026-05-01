import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMOTIONS = ['', 'Calm', 'Confident', 'Anxious', 'FOMO', 'Excited', 'Uncertain', 'Frustrated', 'Revenge']
const SESSIONS = ['', 'London', 'New York', 'Asian', 'London/NY Overlap']
const SETUPS = ['', 'Break of structure', 'Order block', 'Fair value gap', 'Trend continuation', 'Reversal', 'Range', 'Other']
const RESULTS = ['Open', 'TP hit', 'SL hit', 'Breakeven', 'Manually closed']
const TIMEFRAMES = ['', '1m', '5m', '15m', '30m', '1H', '2H', '4H', '1D', '1W']
const ENTRY_TYPES = ['', 'Limit', 'Market', 'Aggressive']

export default function TradeDetail({ session }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trade, setTrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({})
  const [chartFile, setChartFile] = useState(null)
  const [chartPreview, setChartPreview] = useState(null)

  useEffect(() => {
    supabase.from('trades').select('*').eq('id', id).single().then(({ data }) => {
      setTrade(data)
      setForm(toForm(data))
      setLoading(false)
    })
  }, [id])

  const toForm = (d) => ({
    ...d,
    is_a_plus: d?.is_a_plus === true ? 'yes' : d?.is_a_plus === false ? 'no' : '',
    is_planned: d?.is_planned === true ? 'yes' : d?.is_planned === false ? 'no' : '',
    followed_rules: d?.followed_rules === true ? 'yes' : d?.followed_rules === false ? 'no' : '',
    confidence_level: d?.confidence_level || 7,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const parseBool = (v) => v === 'yes' ? true : v === 'no' ? false : null

  const handleChart = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setChartFile(file)
    setChartPreview(URL.createObjectURL(file))
  }

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
      risk_reward: form.risk_reward || null,
      timeframe: form.timeframe || null,
      session: form.session || null,
      setup_type: form.setup_type || null,
      result: form.result,
      trade_date: form.trade_date || null,
      trade_time: form.trade_time || null,
      is_a_plus: parseBool(form.is_a_plus),
      confidence_level: form.confidence_level,
      entry_type: form.entry_type || null,
      is_planned: parseBool(form.is_planned),
      emotion: form.emotion || null,
      emotion_during: form.emotion_during || null,
      emotion_after: form.emotion_after || null,
      followed_rules: parseBool(form.followed_rules),
      reasoning: form.reasoning || null,
      lessons: form.lessons || null,
      notes: form.notes || null,
      chart_url
    }).eq('id', id).select().single()

    setTrade(data)
    setForm(toForm(data))
    setEditing(false)
    setSaving(false)
    setChartFile(null)
    setChartPreview(null)
  }

  if (loading) return <div style={{ padding:'2rem', color:'rgba(240,238,232,0.3)', fontSize:13 }}>Loading...</div>
  if (!trade) return <div style={{ padding:'2rem', color:'rgba(240,238,232,0.3)', fontSize:13 }}>Trade not found.</div>

  const date = new Date(trade.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })

  return (
    <div style={{ padding:'1.25rem', maxWidth:720, margin:'0 auto', paddingBottom:'5rem' }}>
      <style>{`
        .section { background:#111; border:0.5px solid rgba(255,255,255,0.07); border-radius:12px; padding:1.1rem 1.25rem; margin-bottom:10px; }
        .section-title { font-size:11px; font-weight:500; color:rgba(240,238,232,0.3); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
        .info-row { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:0.5px solid rgba(255,255,255,0.04); font-size:13px; }
        .info-row:last-child { border-bottom:none; }
        .info-label { color:rgba(240,238,232,0.35); font-size:12px; }
        .info-val { color:#F0EEE8; font-weight:500; }
        .field-label { font-size:11px; color:rgba(240,238,232,0.4); margin-bottom:5px; display:block; }
        input, select, textarea { font-family:'DM Sans',sans-serif; background:#1a1a1a; border:0.5px solid rgba(255,255,255,0.08); color:#F0EEE8; border-radius:8px; padding:9px 12px; font-size:13px; outline:none; width:100%; transition:border 0.2s; }
        input:focus, select:focus, textarea:focus { border-color:#1D9E75; }
        select option { background:#1a1a1a; }
        textarea { resize:vertical; }
        input[type=range] { padding:4px 0; background:transparent; border:none; accent-color:#1D9E75; }
        input[type=range]:focus { border:none; box-shadow:none; }
        .badge { font-size:11px; padding:3px 10px; border-radius:20px; font-weight:500; }
        .badge-green { color:#1D9E75; background:rgba(29,158,117,0.12); }
        .badge-red { color:#E24B4A; background:rgba(226,75,74,0.12); }
        .badge-blue { color:#378ADD; background:rgba(55,138,221,0.12); }
        .badge-gray { color:#888880; background:rgba(136,136,128,0.12); }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(240,238,232,0.6)', padding:'7px 12px', borderRadius:8, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500 }}>{trade.pair || 'Trade'}</h1>
          <p style={{ fontSize:12, color:'rgba(240,238,232,0.3)', marginTop:2 }}>{date}{trade.trade_time ? ` · ${trade.trade_time}` : ''}</p>
        </div>
        <ResultBadge result={trade.result} />
        <button onClick={() => setEditing(!editing)} style={{ padding:'7px 14px', borderRadius:8, fontSize:13, background: editing ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.06)', color: editing ? '#1D9E75' : 'rgba(240,238,232,0.6)', fontFamily:"'DM Sans',sans-serif" }}>
          {editing ? 'Cancel' : 'Edit'}
        </button>
        <button onClick={handleDelete} disabled={deleting} style={{ padding:'7px 14px', borderRadius:8, fontSize:13, background:'rgba(226,75,74,0.1)', color:'#E24B4A', fontFamily:"'DM Sans',sans-serif" }}>
          {deleting ? '...' : 'Delete'}
        </button>
      </div>

      {/* Chart */}
      {(chartPreview || trade.chart_url) && (
        <div className="section">
          <p className="section-title">Chart</p>
          <img src={chartPreview || trade.chart_url} alt="chart" style={{ width:'100%', borderRadius:8, objectFit:'contain', maxHeight:360 }} />
        </div>
      )}

      {editing ? (
        <>
          {/* Edit chart */}
          <div className="section">
            <p className="section-title">Chart screenshot</p>
            <div style={{ border:'0.5px dashed rgba(255,255,255,0.12)', borderRadius:8, padding:'1rem', textAlign:'center', cursor:'pointer' }}
              onClick={() => document.getElementById('chart-edit').click()}>
              <p style={{ fontSize:13, color:'rgba(240,238,232,0.3)' }}>{chartFile ? chartFile.name : 'Tap to upload new chart'}</p>
              <input id="chart-edit" type="file" accept="image/*" onChange={handleChart} style={{ display:'none' }} />
            </div>
          </div>

          {/* Edit trade details */}
          <div className="section">
            <p className="section-title">Trade details</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div className="row2">
                <div><label className="field-label">Pair</label><input value={form.pair || ''} onChange={e => set('pair', e.target.value.toUpperCase())} /></div>
                <div><label className="field-label">Timeframe</label>
                  <select value={form.timeframe || ''} onChange={e => set('timeframe', e.target.value)}>
                    {TIMEFRAMES.map(t => <option key={t} value={t}>{t || 'Select'}</option>)}
                  </select>
                </div>
              </div>
              <div className="row3">
                <div><label className="field-label">Entry</label><input type="number" step="any" value={form.entry_price || ''} onChange={e => set('entry_price', e.target.value)} /></div>
                <div><label className="field-label">Stop loss</label><input type="number" step="any" value={form.stop_loss || ''} onChange={e => set('stop_loss', e.target.value)} /></div>
                <div><label className="field-label">Take profit</label><input type="number" step="any" value={form.take_profit || ''} onChange={e => set('take_profit', e.target.value)} /></div>
              </div>
              <div className="row3">
                <div><label className="field-label">R:R</label><input value={form.risk_reward || ''} onChange={e => set('risk_reward', e.target.value)} /></div>
                <div><label className="field-label">Session</label>
                  <select value={form.session || ''} onChange={e => set('session', e.target.value)}>
                    {SESSIONS.map(s => <option key={s} value={s}>{s || 'Select'}</option>)}
                  </select>
                </div>
                <div><label className="field-label">Result</label>
                  <select value={form.result || 'Open'} onChange={e => set('result', e.target.value)}>
                    {RESULTS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="field-label">Setup type</label>
                <select value={form.setup_type || ''} onChange={e => set('setup_type', e.target.value)}>
                  {SETUPS.map(s => <option key={s} value={s}>{s || 'Select'}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Edit psychology */}
          <div className="section">
            <p className="section-title">Psychology</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div className="row2">
                <div><label className="field-label">A+ setup?</label>
                  <select value={form.is_a_plus || ''} onChange={e => set('is_a_plus', e.target.value)}>
                    <option value="">Select</option>
                    <option value="yes">Yes — A+</option>
                    <option value="no">No — B/C</option>
                  </select>
                </div>
                <div><label className="field-label">Planned or FOMO?</label>
                  <select value={form.is_planned || ''} onChange={e => set('is_planned', e.target.value)}>
                    <option value="">Select</option>
                    <option value="yes">Planned</option>
                    <option value="no">FOMO / Impulse</option>
                  </select>
                </div>
              </div>
              <div className="row2">
                <div><label className="field-label">Entry type</label>
                  <select value={form.entry_type || ''} onChange={e => set('entry_type', e.target.value)}>
                    {ENTRY_TYPES.map(t => <option key={t} value={t}>{t || 'Select'}</option>)}
                  </select>
                </div>
                <div><label className="field-label">Followed rules?</label>
                  <select value={form.followed_rules || ''} onChange={e => set('followed_rules', e.target.value)}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Confidence: {form.confidence_level}/10</label>
                <input type="range" min="1" max="10" value={form.confidence_level} onChange={e => set('confidence_level', parseInt(e.target.value))} />
              </div>
              <div className="row3">
                <div><label className="field-label">Emotion before</label>
                  <select value={form.emotion || ''} onChange={e => set('emotion', e.target.value)}>
                    {EMOTIONS.map(em => <option key={em} value={em}>{em || 'Select'}</option>)}
                  </select>
                </div>
                <div><label className="field-label">Emotion during</label>
                  <select value={form.emotion_during || ''} onChange={e => set('emotion_during', e.target.value)}>
                    {EMOTIONS.map(em => <option key={em} value={em}>{em || 'Select'}</option>)}
                  </select>
                </div>
                <div><label className="field-label">Emotion after</label>
                  <select value={form.emotion_after || ''} onChange={e => set('emotion_after', e.target.value)}>
                    {EMOTIONS.map(em => <option key={em} value={em}>{em || 'Select'}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Edit journal */}
          <div className="section">
            <p className="section-title">Journal</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div><label className="field-label">Why I took this trade</label>
                <textarea value={form.reasoning || ''} onChange={e => set('reasoning', e.target.value)} rows={3} />
              </div>
              <div><label className="field-label">Mistakes / lessons</label>
                <textarea value={form.lessons || ''} onChange={e => set('lessons', e.target.value)} rows={2} />
              </div>
              <div><label className="field-label">Notes</label>
                <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} style={{ width:'100%', padding:'13px', borderRadius:10, background:'#1D9E75', color:'white', fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", opacity: saving ? 0.6 : 1, marginBottom:10 }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </>
      ) : (
        <>
          {/* View mode */}
          <div className="section">
            <p className="section-title">Trade details</p>
            <div className="row2" style={{ gap:10 }}>
              <div>
                {[['Pair', trade.pair],['Timeframe', trade.timeframe],['Entry', trade.entry_price],['Stop loss', trade.stop_loss, '#E24B4A'],['Take profit', trade.take_profit, '#1D9E75'],['R:R', trade.risk_reward]].map(([l,v,c]) => (
                  <div key={l} className="info-row">
                    <span className="info-label">{l}</span>
                    <span className="info-val" style={{ color: c || '#F0EEE8' }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
              <div>
                {[['Session', trade.session],['Setup', trade.setup_type],['Date', trade.trade_date],['Time', trade.trade_time]].map(([l,v]) => (
                  <div key={l} className="info-row">
                    <span className="info-label">{l}</span>
                    <span className="info-val">{v || '—'}</span>
                  </div>
                ))}
                <div className="info-row">
                  <span className="info-label">Result</span>
                  <ResultBadge result={trade.result} />
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <p className="section-title">Psychology</p>
            <div className="row2" style={{ gap:10 }}>
              <div>
                {[
                  ['A+ setup', trade.is_a_plus === true ? 'Yes' : trade.is_a_plus === false ? 'No' : '—', trade.is_a_plus === true ? '#1D9E75' : trade.is_a_plus === false ? '#E24B4A' : null],
                  ['Planned', trade.is_planned === true ? 'Planned' : trade.is_planned === false ? 'FOMO' : '—', trade.is_planned === true ? '#1D9E75' : trade.is_planned === false ? '#E24B4A' : null],
                  ['Entry type', trade.entry_type],
                  ['Followed rules', trade.followed_rules === true ? 'Yes' : trade.followed_rules === false ? 'No' : '—', trade.followed_rules === true ? '#1D9E75' : trade.followed_rules === false ? '#E24B4A' : null],
                ].map(([l,v,c]) => (
                  <div key={l} className="info-row">
                    <span className="info-label">{l}</span>
                    <span className="info-val" style={{ color: c || '#F0EEE8' }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="info-row">
                  <span className="info-label">Confidence</span>
                  <span className="info-val">{trade.confidence_level ? `${trade.confidence_level}/10` : '—'}</span>
                </div>
                {[['Before', trade.emotion],['During', trade.emotion_during],['After', trade.emotion_after]].map(([l,v]) => (
                  <div key={l} className="info-row">
                    <span className="info-label">Emotion {l.toLowerCase()}</span>
                    <span className="info-val">{v || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(trade.reasoning || trade.lessons || trade.notes) && (
            <div className="section">
              <p className="section-title">Journal</p>
              {trade.reasoning && (
                <div style={{ marginBottom:12 }}>
                  <p style={{ fontSize:11, color:'rgba(240,238,232,0.35)', marginBottom:6 }}>WHY I TOOK THIS TRADE</p>
                  <p style={{ fontSize:14, color:'rgba(240,238,232,0.75)', lineHeight:1.7 }}>{trade.reasoning}</p>
                </div>
              )}
              {trade.lessons && (
                <div style={{ marginBottom:12 }}>
                  <p style={{ fontSize:11, color:'rgba(240,238,232,0.35)', marginBottom:6 }}>MISTAKES / LESSONS</p>
                  <p style={{ fontSize:14, color:'rgba(240,238,232,0.75)', lineHeight:1.7 }}>{trade.lessons}</p>
                </div>
              )}
              {trade.notes && (
                <div>
                  <p style={{ fontSize:11, color:'rgba(240,238,232,0.35)', marginBottom:6 }}>NOTES</p>
                  <p style={{ fontSize:14, color:'rgba(240,238,232,0.75)', lineHeight:1.7 }}>{trade.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick result update */}
          <div className="section">
            <p className="section-title">Update result</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {RESULTS.map(r => (
                <button key={r} onClick={async () => {
                  const { data } = await supabase.from('trades').update({ result: r }).eq('id', id).select().single()
                  setTrade(data)
                }} style={{
                  padding:'8px 14px', borderRadius:20, fontSize:12, fontFamily:"'DM Sans',sans-serif",
                  background: trade.result === r ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.05)',
                  color: trade.result === r ? '#1D9E75' : 'rgba(240,238,232,0.5)',
                  border: trade.result === r ? '0.5px solid rgba(29,158,117,0.4)' : '0.5px solid rgba(255,255,255,0.08)',
                }}>{r}</button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ResultBadge({ result }) {
  const map = { 'TP hit':['#1D9E75','rgba(29,158,117,0.12)'], 'SL hit':['#E24B4A','rgba(226,75,74,0.12)'], 'Open':['#378ADD','rgba(55,138,221,0.12)'] }
  const [color, bg] = map[result] || ['#888880','rgba(136,136,128,0.12)']
  return <span style={{ fontSize:11, color, background:bg, padding:'4px 10px', borderRadius:20, fontWeight:500 }}>{result || '—'}</span>
}
