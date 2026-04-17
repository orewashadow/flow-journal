import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMOTIONS = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Excited', 'Uncertain', 'Frustrated', 'Revenge']
const SESSIONS = ['London', 'New York', 'Asian', 'London/NY Overlap']
const SETUPS = ['Break of structure', 'Order block', 'Fair value gap', 'Trend continuation', 'Reversal', 'Range', 'Other']
const RESULTS = ['Open', 'TP hit', 'SL hit', 'Breakeven', 'Manually closed']
const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1H', '2H', '4H', '1D', '1W']

export default function NewTrade({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [chartFile, setChartFile] = useState(null)
  const [chartPreview, setChartPreview] = useState(null)

  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0]
  const localTime = now.toTimeString().slice(0, 5)

  const [form, setForm] = useState({
    pair: '', entry_price: '', stop_loss: '', take_profit: '',
    risk_reward: '', timeframe: '', session: '', setup_type: '',
    result: 'Open', trade_date: localDate, trade_time: localTime,
    is_a_plus: null, confidence_level: 7, entry_type: '',
    is_planned: null, emotion: '', emotion_during: '', emotion_after: '',
    followed_rules: null, reasoning: '', mistakes: '', lessons: '', notes: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleChart = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setChartFile(file)
    setChartPreview(URL.createObjectURL(file))
  }

  const extractFromChart = async () => {
    if (!chartFile) return
    setExtracting(true)
    setError('')
    try {
      const base64 = await fileToBase64(chartFile)
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: chartFile.type, data: base64 } },
              { type: 'text', text: 'This is a trading chart. Extract visible data and return ONLY valid JSON with these keys: pair (string), timeframe (string like 1H/4H/1D), entry_price (number), stop_loss (number), take_profit (number), risk_reward (string like 1:2.5). Return null for anything not visible. No explanation, just JSON.' }
            ]
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const extracted = JSON.parse(clean)
      if (extracted.pair) set('pair', extracted.pair)
      if (extracted.timeframe) set('timeframe', extracted.timeframe)
      if (extracted.entry_price) set('entry_price', String(extracted.entry_price))
      if (extracted.stop_loss) set('stop_loss', String(extracted.stop_loss))
      if (extracted.take_profit) set('take_profit', String(extracted.take_profit))
      if (extracted.risk_reward) set('risk_reward', extracted.risk_reward)
    } catch(e) {
      setError('Could not read chart automatically. Please fill in manually.')
    }
    setExtracting(false)
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.pair.trim()) { setError('Pair is required'); return }
    setLoading(true)
    setError('')

    let chart_url = null
    if (chartFile) {
      const ext = chartFile.name.split('.').pop()
      const path = `${session.user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('charts').upload(path, chartFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('charts').getPublicUrl(path)
        chart_url = data.publicUrl
      }
    }

    const { error } = await supabase.from('trades').insert({
      user_id: session.user.id,
      pair: form.pair.toUpperCase(),
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
      is_a_plus: form.is_a_plus,
      confidence_level: form.confidence_level,
      entry_type: form.entry_type || null,
      is_planned: form.is_planned,
      emotion: form.emotion || null,
      emotion_during: form.emotion_during || null,
      emotion_after: form.emotion_after || null,
      followed_rules: form.followed_rules,
      reasoning: form.reasoning || null,
      mistakes: form.mistakes || null,
      lessons: form.lessons || null,
      notes: form.notes || null,
      chart_url
    })

    if (error) { setError(error.message); setLoading(false); return }
    navigate('/trades')
  }

  return (
    <div style={{ padding:'1.25rem', maxWidth:680, margin:'0 auto', paddingBottom:'5rem' }}>
      <style>{`
        .chip { padding:7px 14px; border-radius:20px; font-size:12px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.15s; border:0.5px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.05); color:rgba(240,238,232,0.5); }
        .chip.active { background:rgba(29,158,117,0.18); color:#1D9E75; border-color:rgba(29,158,117,0.5); }
        .chip.active-red { background:rgba(226,75,74,0.15); color:#E24B4A; border-color:rgba(226,75,74,0.4); }
        .chip.active-blue { background:rgba(55,138,221,0.15); color:#378ADD; border-color:rgba(55,138,221,0.4); }
        .section { background:#111; border:0.5px solid rgba(255,255,255,0.07); border-radius:12px; padding:1.1rem 1.25rem; margin-bottom:10px; }
        .section-title { font-size:11px; font-weight:500; color:rgba(240,238,232,0.3); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:12px; }
        .field-label { font-size:11px; color:rgba(240,238,232,0.4); margin-bottom:5px; display:block; }
        .chips-row { display:flex; flex-wrap:wrap; gap:6px; }
        input, select, textarea { font-family:'DM Sans',sans-serif; background:#1a1a1a; border:0.5px solid rgba(255,255,255,0.08); color:#F0EEE8; border-radius:8px; padding:9px 12px; font-size:13px; outline:none; width:100%; transition:border 0.2s; }
        input:focus, select:focus, textarea:focus { border-color:#1D9E75; }
        select option { background:#1a1a1a; }
        textarea { resize:vertical; }
        .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
        input[type=range] { padding:0; background:transparent; border:none; accent-color:#1D9E75; }
        input[type=range]:focus { border:none; }
        @media(max-width:480px){ .grid3{grid-template-columns:1fr 1fr !important;} }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(240,238,232,0.6)', padding:'7px 12px', borderRadius:8, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:500 }}>Log a trade</h1>
      </div>

      <form onSubmit={handleSubmit}>

        {/* CHART */}
        <div className="section">
          <p className="section-title">Chart screenshot</p>
          <div style={{ border:'0.5px dashed rgba(255,255,255,0.12)', borderRadius:8, padding:'1rem', textAlign:'center', cursor:'pointer', marginBottom: chartPreview ? 10 : 0 }}
            onClick={() => document.getElementById('chart-upload').click()}>
            {chartPreview
              ? <img src={chartPreview} alt="chart" style={{ maxWidth:'100%', maxHeight:220, borderRadius:6, objectFit:'contain' }} />
              : <p style={{ fontSize:13, color:'rgba(240,238,232,0.25)' }}>Tap to upload chart — AI will auto-fill trade data</p>
            }
            <input id="chart-upload" type="file" accept="image/*" onChange={handleChart} style={{ display:'none' }} />
          </div>
          {chartPreview && (
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <button type="button" onClick={extractFromChart} disabled={extracting} style={{ padding:'8px 16px', borderRadius:8, background:'rgba(29,158,117,0.15)', color:'#1D9E75', fontSize:12, fontFamily:"'DM Sans',sans-serif", border:'0.5px solid rgba(29,158,117,0.3)' }}>
                {extracting ? 'Reading chart...' : 'Auto-fill from chart'}
              </button>
              <button type="button" onClick={() => { setChartFile(null); setChartPreview(null) }} style={{ fontSize:12, color:'rgba(240,238,232,0.3)', background:'transparent', fontFamily:"'DM Sans',sans-serif" }}>Remove</button>
            </div>
          )}
        </div>

        {/* TRADE DETAILS */}
        <div className="section">
          <p className="section-title">Trade details</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div className="grid2">
              <div>
                <label className="field-label">Date</label>
                <input type="date" value={form.trade_date} onChange={e => set('trade_date', e.target.value)} />
              </div>
              <div>
                <label className="field-label">Time</label>
                <input type="time" value={form.trade_time} onChange={e => set('trade_time', e.target.value)} />
              </div>
            </div>
            <div className="grid2">
              <div>
                <label className="field-label">Pair / Ticker *</label>
                <input value={form.pair} onChange={e => set('pair', e.target.value.toUpperCase())} placeholder="EUR/USD, BTC/USD..." />
              </div>
              <div>
                <label className="field-label">Timeframe</label>
                <select value={form.timeframe} onChange={e => set('timeframe', e.target.value)}>
                  <option value="">Select</option>
                  {TIMEFRAMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid3">
              <div>
                <label className="field-label">Entry</label>
                <input type="number" step="any" value={form.entry_price} onChange={e => set('entry_price', e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="field-label">Stop loss</label>
                <input type="number" step="any" value={form.stop_loss} onChange={e => set('stop_loss', e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className="field-label">Take profit</label>
                <input type="number" step="any" value={form.take_profit} onChange={e => set('take_profit', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="grid3">
              <div>
                <label className="field-label">Risk : Reward</label>
                <input value={form.risk_reward} onChange={e => set('risk_reward', e.target.value)} placeholder="1:2" />
              </div>
              <div>
                <label className="field-label">Session</label>
                <select value={form.session} onChange={e => set('session', e.target.value)}>
                  <option value="">Select</option>
                  {SESSIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Result</label>
                <select value={form.result} onChange={e => set('result', e.target.value)}>
                  {RESULTS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">Setup type</label>
              <div className="chips-row">
                {SETUPS.map(s => (
                  <button type="button" key={s} className={`chip ${form.setup_type === s ? 'active' : ''}`} onClick={() => set('setup_type', form.setup_type === s ? '' : s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PSYCHOLOGY */}
        <div className="section">
          <p className="section-title">Psychology</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <label className="field-label">A+ setup?</label>
                <div style={{ display:'flex', gap:6 }}>
                  <button type="button" className={`chip ${form.is_a_plus === true ? 'active' : ''}`} style={{ flex:1, textAlign:'center' }} onClick={() => set('is_a_plus', form.is_a_plus === true ? null : true)}>A+ Yes</button>
                  <button type="button" className={`chip ${form.is_a_plus === false ? 'active-red' : ''}`} style={{ flex:1, textAlign:'center' }} onClick={() => set('is_a_plus', form.is_a_plus === false ? null : false)}>B/C No</button>
                </div>
              </div>
              <div style={{ flex:1 }}>
                <label className="field-label">Planned or FOMO?</label>
                <div style={{ display:'flex', gap:6 }}>
                  <button type="button" className={`chip ${form.is_planned === true ? 'active' : ''}`} style={{ flex:1, textAlign:'center' }} onClick={() => set('is_planned', form.is_planned === true ? null : true)}>Planned</button>
                  <button type="button" className={`chip ${form.is_planned === false ? 'active-red' : ''}`} style={{ flex:1, textAlign:'center' }} onClick={() => set('is_planned', form.is_planned === false ? null : false)}>FOMO</button>
                </div>
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <label className="field-label">Entry type</label>
                <div className="chips-row">
                  {['Limit', 'Market', 'Aggressive'].map(t => (
                    <button type="button" key={t} className={`chip ${form.entry_type === t ? 'active' : ''}`} onClick={() => set('entry_type', form.entry_type === t ? '' : t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex:1 }}>
                <label className="field-label">Followed rules?</label>
                <div style={{ display:'flex', gap:6 }}>
                  <button type="button" className={`chip ${form.followed_rules === true ? 'active' : ''}`} style={{ flex:1, textAlign:'center' }} onClick={() => set('followed_rules', form.followed_rules === true ? null : true)}>Yes</button>
                  <button type="button" className={`chip ${form.followed_rules === false ? 'active-red' : ''}`} style={{ flex:1, textAlign:'center' }} onClick={() => set('followed_rules', form.followed_rules === false ? null : false)}>No</button>
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Confidence: {form.confidence_level}/10</label>
              <input type="range" min="1" max="10" value={form.confidence_level} onChange={e => set('confidence_level', parseInt(e.target.value))} />
            </div>

            <div>
              <label className="field-label">Emotion before</label>
              <div className="chips-row">
                {EMOTIONS.map(em => (
                  <button type="button" key={em} className={`chip ${form.emotion === em ? 'active' : ''}`} onClick={() => set('emotion', form.emotion === em ? '' : em)}>{em}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Emotion during</label>
              <div className="chips-row">
                {EMOTIONS.map(em => (
                  <button type="button" key={em} className={`chip ${form.emotion_during === em ? 'active-blue' : ''}`} onClick={() => set('emotion_during', form.emotion_during === em ? '' : em)}>{em}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Emotion after</label>
              <div className="chips-row">
                {EMOTIONS.map(em => (
                  <button type="button" key={em} className={`chip ${form.emotion_after === em ? 'active' : ''}`} onClick={() => set('emotion_after', form.emotion_after === em ? '' : em)}>{em}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NOTES */}
        <div className="section">
          <p className="section-title">Journal</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div>
              <label className="field-label">Why did you take this trade?</label>
              <textarea value={form.reasoning} onChange={e => set('reasoning', e.target.value)} placeholder="What did you see? What was your thesis?" rows={3} />
            </div>
            <div>
              <label className="field-label">Mistakes / lessons</label>
              <textarea value={form.lessons} onChange={e => set('lessons', e.target.value)} placeholder="What did you learn from this trade?" rows={2} />
            </div>
          </div>
        </div>

        {error && <p style={{ fontSize:13, color:'#E24B4A', background:'rgba(226,75,74,0.1)', padding:'10px 12px', borderRadius:8, marginBottom:10 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:10, background:'#1D9E75', color:'white', fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Saving...' : 'Save trade'}
        </button>
      </form>
    </div>
  )
}
