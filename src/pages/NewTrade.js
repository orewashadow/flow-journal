import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMOTIONS = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Excited', 'Uncertain', 'Frustrated', 'Revenge']
const SESSIONS = ['London', 'New York', 'Asian', 'London/NY Overlap']
const SETUPS = ['Break of structure', 'Order block', 'Fair value gap', 'Trend continuation', 'Reversal', 'Range', 'Other']
const RESULTS = ['Open', 'TP hit', 'SL hit', 'Breakeven', 'Manually closed']
const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1H', '2H', '4H', '1D', '1W']

const STEPS = ['Trade details', 'Psychology', 'Review', 'Chart']

export default function NewTrade({ session }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chartFile, setChartFile] = useState(null)
  const [chartPreview, setChartPreview] = useState(null)
  const [extracting, setExtracting] = useState(false)

  const now = new Date()
  const [form, setForm] = useState({
    pair: '', entry_price: '', stop_loss: '', take_profit: '',
    risk_reward: '', timeframe: '', session: '', setup_type: '',
    result: 'Open', trade_date: now.toISOString().split('T')[0],
    trade_time: now.toTimeString().slice(0,5),
    // Psychology
    is_a_plus: null, confidence_level: 7, entry_type: '',
    is_planned: null, emotion: '', emotion_during: '', emotion_after: '',
    followed_rules: null,
    // Review
    reasoning: '', mistakes: '', lessons: '', notes: ''
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
              { type: 'text', text: 'This is a trading chart screenshot. Extract the following if visible and return ONLY a JSON object with these exact keys: pair (string, the trading pair or ticker), timeframe (string, e.g. 1H, 4H, 1D), entry_price (number), stop_loss (number), take_profit (number), risk_reward (string, e.g. 1:2.5). If a value is not visible return null for that key.' }
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
      if (extracted.entry_price) set('entry_price', extracted.entry_price)
      if (extracted.stop_loss) set('stop_loss', extracted.stop_loss)
      if (extracted.take_profit) set('take_profit', extracted.take_profit)
      if (extracted.risk_reward) set('risk_reward', extracted.risk_reward)
    } catch(e) {
      setError('Could not extract from chart. Please fill in manually.')
    }
    setExtracting(false)
  }

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })

  const handleSubmit = async () => {
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

  const canNext = () => {
    if (step === 0) return form.pair.trim().length > 0
    return true
  }

  return (
    <div style={{ padding:'1.25rem', maxWidth:640, margin:'0 auto', paddingBottom:'4rem' }}>
      <style>{`
        .pill-btn { padding:8px 16px; border-radius:20px; font-size:13px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.15s; border:0.5px solid rgba(255,255,255,0.08); }
        .pill-btn.active { background:rgba(29,158,117,0.2); color:#1D9E75; border-color:#1D9E75; }
        .pill-btn.inactive { background:rgba(255,255,255,0.05); color:rgba(240,238,232,0.5); }
        .yn-btn { flex:1; padding:10px; border-radius:8px; font-size:13px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.15s; border:0.5px solid rgba(255,255,255,0.08); }
        .yn-btn.yes { background:rgba(29,158,117,0.2); color:#1D9E75; border-color:#1D9E75; }
        .yn-btn.no { background:rgba(226,75,74,0.15); color:#E24B4A; border-color:#E24B4A; }
        .yn-btn.unset { background:rgba(255,255,255,0.05); color:rgba(240,238,232,0.4); }
        input[type=range] { width:100%; accent-color:#1D9E75; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.5rem' }}>
        <button onClick={() => step === 0 ? navigate(-1) : setStep(s => s-1)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(240,238,232,0.6)', padding:'7px 12px', borderRadius:8, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
          {step === 0 ? '← Back' : '← Prev'}
        </button>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:500, flex:1 }}>Log a trade</h1>
        <span style={{ fontSize:12, color:'rgba(240,238,232,0.35)' }}>{step + 1} / {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:4, height:3, marginBottom:'1.75rem' }}>
        <div style={{ width:`${((step+1)/STEPS.length)*100}%`, background:'#1D9E75', height:3, borderRadius:4, transition:'width 0.3s' }} />
      </div>

      {/* Step label */}
      <p style={{ fontSize:12, color:'#1D9E75', textTransform:'uppercase', letterSpacing:1.5, marginBottom:'1.25rem', fontWeight:500 }}>{STEPS[step]}</p>

      {/* STEP 0 — Trade details */}
      {step === 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card title="When">
            <Row2>
              <Field label="Date">
                <input type="date" value={form.trade_date} onChange={e => set('trade_date', e.target.value)} />
              </Field>
              <Field label="Time">
                <input type="time" value={form.trade_time} onChange={e => set('trade_time', e.target.value)} />
              </Field>
            </Row2>
          </Card>

          <Card title="What">
            <Row2>
              <Field label="Pair / Ticker *">
                <input value={form.pair} onChange={e => set('pair', e.target.value.toUpperCase())} placeholder="EUR/USD, BTC..." />
              </Field>
              <Field label="Timeframe">
                <select value={form.timeframe} onChange={e => set('timeframe', e.target.value)}>
                  <option value="">Select</option>
                  {TIMEFRAMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </Row2>
            <Row3>
              <Field label="Entry">
                <input type="number" step="any" value={form.entry_price} onChange={e => set('entry_price', e.target.value)} placeholder="0.00" />
              </Field>
              <Field label="Stop loss">
                <input type="number" step="any" value={form.stop_loss} onChange={e => set('stop_loss', e.target.value)} placeholder="0.00" />
              </Field>
              <Field label="Take profit">
                <input type="number" step="any" value={form.take_profit} onChange={e => set('take_profit', e.target.value)} placeholder="0.00" />
              </Field>
            </Row3>
            <Row2>
              <Field label="Risk : Reward">
                <input value={form.risk_reward} onChange={e => set('risk_reward', e.target.value)} placeholder="e.g. 1:2.5" />
              </Field>
              <Field label="Result">
                <select value={form.result} onChange={e => set('result', e.target.value)}>
                  {RESULTS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
            </Row2>
          </Card>

          <Card title="Context">
            <Row2>
              <Field label="Session">
                <select value={form.session} onChange={e => set('session', e.target.value)}>
                  <option value="">Select session</option>
                  {SESSIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Setup type">
                <select value={form.setup_type} onChange={e => set('setup_type', e.target.value)}>
                  <option value="">Select setup</option>
                  {SETUPS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </Row2>
          </Card>
        </div>
      )}

      {/* STEP 1 — Psychology */}
      {step === 1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card title="Trade quality">
            <Field label="Is this an A+ setup?">
              <div style={{ display:'flex', gap:8 }}>
                <button className={`yn-btn ${form.is_a_plus === true ? 'yes' : 'unset'}`} onClick={() => set('is_a_plus', true)}>Yes, A+</button>
                <button className={`yn-btn ${form.is_a_plus === false ? 'no' : 'unset'}`} onClick={() => set('is_a_plus', false)}>No, B/C setup</button>
              </div>
            </Field>
            <Field label={`Confidence level: ${form.confidence_level}/10`}>
              <input type="range" min="1" max="10" value={form.confidence_level} onChange={e => set('confidence_level', parseInt(e.target.value))} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(240,238,232,0.3)', marginTop:4 }}>
                <span>Not confident</span><span>Very confident</span>
              </div>
            </Field>
          </Card>

          <Card title="Entry behaviour">
            <Field label="Entry type">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['Limit order', 'Market order', 'Aggressive', 'Scaled in'].map(t => (
                  <button key={t} className={`pill-btn ${form.entry_type === t ? 'active' : 'inactive'}`} onClick={() => set('entry_type', t)}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label="Was this trade planned?">
              <div style={{ display:'flex', gap:8 }}>
                <button className={`yn-btn ${form.is_planned === true ? 'yes' : 'unset'}`} onClick={() => set('is_planned', true)}>Planned</button>
                <button className={`yn-btn ${form.is_planned === false ? 'no' : 'unset'}`} onClick={() => set('is_planned', false)}>FOMO / Impulse</button>
              </div>
            </Field>
            <Field label="Did you follow your trading rules?">
              <div style={{ display:'flex', gap:8 }}>
                <button className={`yn-btn ${form.followed_rules === true ? 'yes' : 'unset'}`} onClick={() => set('followed_rules', true)}>Yes</button>
                <button className={`yn-btn ${form.followed_rules === false ? 'no' : 'unset'}`} onClick={() => set('followed_rules', false)}>No</button>
              </div>
            </Field>
          </Card>

          <Card title="Emotions">
            <Field label="Before the trade">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {EMOTIONS.map(em => (
                  <button key={em} className={`pill-btn ${form.emotion === em ? 'active' : 'inactive'}`} onClick={() => set('emotion', em)}>{em}</button>
                ))}
              </div>
            </Field>
            <Field label="During the trade">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {EMOTIONS.map(em => (
                  <button key={em} className={`pill-btn ${form.emotion_during === em ? 'active' : 'inactive'}`} onClick={() => set('emotion_during', em)}>{em}</button>
                ))}
              </div>
            </Field>
            <Field label="After the trade">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {EMOTIONS.map(em => (
                  <button key={em} className={`pill-btn ${form.emotion_after === em ? 'active' : 'inactive'}`} onClick={() => set('emotion_after', em)}>{em}</button>
                ))}
              </div>
            </Field>
          </Card>
        </div>
      )}

      {/* STEP 2 — Review */}
      {step === 2 && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card title="Your analysis">
            <Field label="Why did you take this trade?">
              <textarea value={form.reasoning} onChange={e => set('reasoning', e.target.value)} placeholder="What did you see on the chart? What was your thesis?" rows={4} style={{ resize:'vertical' }} />
            </Field>
          </Card>
          <Card title="Self assessment">
            <Field label="What mistakes did you make? (if any)">
              <textarea value={form.mistakes} onChange={e => set('mistakes', e.target.value)} placeholder="Entered too early, moved SL, ignored the plan..." rows={3} style={{ resize:'vertical' }} />
            </Field>
            <Field label="What did you learn from this trade?">
              <textarea value={form.lessons} onChange={e => set('lessons', e.target.value)} placeholder="Key takeaway from this trade..." rows={3} style={{ resize:'vertical' }} />
            </Field>
            <Field label="Additional notes">
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything else worth noting..." rows={2} style={{ resize:'vertical' }} />
            </Field>
          </Card>
        </div>
      )}

      {/* STEP 3 — Chart */}
      {step === 3 && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card title="Chart screenshot">
            <div style={{ border:'0.5px dashed rgba(255,255,255,0.15)', borderRadius:10, padding:'1.5rem', textAlign:'center', cursor:'pointer' }}
              onClick={() => document.getElementById('chart-upload').click()}>
              {chartPreview ? (
                <img src={chartPreview} alt="chart" style={{ maxWidth:'100%', maxHeight:300, borderRadius:8, objectFit:'contain' }} />
              ) : (
                <>
                  <p style={{ fontSize:13, color:'rgba(240,238,232,0.3)', marginBottom:6 }}>Tap to upload chart screenshot</p>
                  <p style={{ fontSize:12, color:'rgba(240,238,232,0.2)' }}>PNG, JPG supported</p>
                </>
              )}
              <input id="chart-upload" type="file" accept="image/*" onChange={handleChart} style={{ display:'none' }} />
            </div>
            {chartPreview && (
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <button onClick={() => { setChartFile(null); setChartPreview(null) }} style={{ fontSize:12, color:'#E24B4A', background:'transparent', fontFamily:"'DM Sans',sans-serif" }}>Remove</button>
                <button onClick={extractFromChart} disabled={extracting} style={{ fontSize:12, color:'#1D9E75', background:'transparent', fontFamily:"'DM Sans',sans-serif" }}>
                  {extracting ? 'Reading chart...' : 'Auto-fill trade data from chart'}
                </button>
              </div>
            )}
          </Card>

          <div style={{ background:'rgba(29,158,117,0.06)', border:'0.5px solid rgba(29,158,117,0.2)', borderRadius:12, padding:'1rem 1.25rem' }}>
            <p style={{ fontSize:13, color:'#1D9E75', fontWeight:500, marginBottom:4 }}>Trade summary</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:12, color:'rgba(240,238,232,0.5)' }}>
              <span>Pair: <strong style={{ color:'#F0EEE8' }}>{form.pair || '—'}</strong></span>
              <span>Result: <strong style={{ color:'#F0EEE8' }}>{form.result}</strong></span>
              <span>Entry: <strong style={{ color:'#F0EEE8' }}>{form.entry_price || '—'}</strong></span>
              <span>R:R: <strong style={{ color:'#F0EEE8' }}>{form.risk_reward || '—'}</strong></span>
              <span>A+ setup: <strong style={{ color: form.is_a_plus ? '#1D9E75' : '#E24B4A' }}>{form.is_a_plus === null ? '—' : form.is_a_plus ? 'Yes' : 'No'}</strong></span>
              <span>Planned: <strong style={{ color: form.is_planned ? '#1D9E75' : '#E24B4A' }}>{form.is_planned === null ? '—' : form.is_planned ? 'Yes' : 'FOMO'}</strong></span>
              <span>Confidence: <strong style={{ color:'#F0EEE8' }}>{form.confidence_level}/10</strong></span>
              <span>Emotion: <strong style={{ color:'#F0EEE8' }}>{form.emotion || '—'}</strong></span>
            </div>
          </div>

          {error && <p style={{ fontSize:13, color:'#E24B4A', background:'rgba(226,75,74,0.1)', padding:'10px 12px', borderRadius:8 }}>{error}</p>}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display:'flex', gap:10, marginTop:'2rem' }}>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s+1)} disabled={!canNext()} style={{ flex:1, padding:'13px', borderRadius:10, background: canNext() ? '#1D9E75' : 'rgba(255,255,255,0.06)', color: canNext() ? 'white' : 'rgba(240,238,232,0.3)', fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", transition:'all 0.15s' }}>
            Next: {STEPS[step+1]} →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} style={{ flex:1, padding:'13px', borderRadius:10, background:'#1D9E75', color:'white', fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving...' : 'Save trade'}
          </button>
        )}
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background:'#111111', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem', display:'flex', flexDirection:'column', gap:14 }}>
      <p style={{ fontSize:11, fontWeight:500, color:'rgba(240,238,232,0.35)', textTransform:'uppercase', letterSpacing:1.5 }}>{title}</p>
      {children}
    </div>
  )
}

function Row2({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:10 }}>{children}</div>
}

function Row3({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:10 }}>{children}</div>
}

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:12, color:'rgba(240,238,232,0.4)' }}>{label}</label>
      {children}
    </div>
  )
}
