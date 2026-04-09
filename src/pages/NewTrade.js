import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMOTIONS = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Excited', 'Uncertain']
const SESSIONS = ['London', 'New York', 'Asian', 'London/NY Overlap']
const SETUPS = ['Break of structure', 'Order block', 'Fair value gap', 'Trend continuation', 'Reversal', 'Range', 'Other']
const RESULTS = ['TP hit', 'SL hit', 'Open', 'Breakeven', 'Manually closed']

export default function NewTrade({ session }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chartFile, setChartFile] = useState(null)
  const [chartPreview, setChartPreview] = useState(null)

  const [form, setForm] = useState({
    pair: '', entry_price: '', stop_loss: '', take_profit: '',
    result: 'Open', emotion: '', setup_type: '', session: '', reasoning: '', notes: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleChart = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setChartFile(file)
    setChartPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let chart_url = null

    if (chartFile) {
      const ext = chartFile.name.split('.').pop()
      const path = `${session.user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('charts').upload(path, chartFile)
      if (uploadError) {
        setError('Chart upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      const { data } = supabase.storage.from('charts').getPublicUrl(path)
      chart_url = data.publicUrl
    }

    const { error } = await supabase.from('trades').insert({
      user_id: session.user.id,
      ...form,
      entry_price: form.entry_price ? parseFloat(form.entry_price) : null,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
      take_profit: form.take_profit ? parseFloat(form.take_profit) : null,
      chart_url
    })

    if (error) { setError(error.message); setLoading(false); return }
    navigate('/trades')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,238,232,0.6)', padding: '7px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 500 }}>Log a trade</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Section title="Trade details">
          <Row>
            <Field label="Pair / Ticker" required>
              <input value={form.pair} onChange={e => set('pair', e.target.value.toUpperCase())} placeholder="EUR/USD, BTC/USD..." required />
            </Field>
            <Field label="Result">
              <select value={form.result} onChange={e => set('result', e.target.value)}>
                {RESULTS.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </Row>
          <Row>
            <Field label="Entry price">
              <input type="number" step="any" value={form.entry_price} onChange={e => set('entry_price', e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Stop loss">
              <input type="number" step="any" value={form.stop_loss} onChange={e => set('stop_loss', e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Take profit">
              <input type="number" step="any" value={form.take_profit} onChange={e => set('take_profit', e.target.value)} placeholder="0.00" />
            </Field>
          </Row>
        </Section>

        <Section title="Context">
          <Row>
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
          </Row>
        </Section>

        <Section title="Mindset">
          <Field label="How were you feeling before this trade?">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {EMOTIONS.map(em => (
                <button type="button" key={em} onClick={() => set('emotion', em)} style={{
                  padding: '7px 14px', borderRadius: 20, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
                  background: form.emotion === em ? 'rgba(29,158,117,0.2)' : 'rgba(255,255,255,0.06)',
                  color: form.emotion === em ? '#1D9E75' : 'rgba(240,238,232,0.5)',
                  border: form.emotion === em ? '0.5px solid #1D9E75' : '0.5px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.15s'
                }}>{em}</button>
              ))}
            </div>
          </Field>
          <Field label="Why did you take this trade?">
            <textarea value={form.reasoning} onChange={e => set('reasoning', e.target.value)} placeholder="Describe your reasoning, what you saw on the chart..." rows={4} style={{ resize: 'vertical' }} />
          </Field>
          <Field label="Additional notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything else worth remembering..." rows={3} style={{ resize: 'vertical' }} />
          </Field>
        </Section>

        <Section title="Chart screenshot">
          <div style={{ border: '0.5px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative' }}
            onClick={() => document.getElementById('chart-upload').click()}>
            {chartPreview ? (
              <img src={chartPreview} alt="chart" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'rgba(240,238,232,0.3)', marginBottom: 6 }}>Click to upload chart screenshot</p>
                <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.2)' }}>PNG, JPG supported</p>
              </>
            )}
            <input id="chart-upload" type="file" accept="image/*" onChange={handleChart} style={{ display: 'none' }} />
          </div>
          {chartPreview && (
            <button type="button" onClick={() => { setChartFile(null); setChartPreview(null) }}
              style={{ fontSize: 12, color: '#E24B4A', background: 'transparent', marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>
              Remove chart
            </button>
          )}
        </Section>

        {error && <p style={{ fontSize: 13, color: '#E24B4A', background: 'rgba(226,75,74,0.1)', padding: '10px 12px', borderRadius: 8 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, paddingBottom: '2rem' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'rgba(240,238,232,0.6)', fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 10, background: '#1D9E75', color: 'white', fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans',sans-serif", opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving...' : 'Save trade'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 style={{ fontSize: 13, fontWeight: 500, color: 'rgba(240,238,232,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h3>
      {children}
    </div>
  )
}

function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${React.Children.count(children)}, minmax(0,1fr))`, gap: 12 }}>{children}</div>
}

function Field({ label, children, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'rgba(240,238,232,0.4)' }}>{label}{required && ' *'}</label>
      {children}
    </div>
  )
}
