import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Stats({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('trades').select('*').eq('user_id', session.user.id).then(({ data }) => {
      setTrades(data || [])
      setLoading(false)
    })
  }, [])

  const closed = trades.filter(t => t.result === 'TP hit' || t.result === 'SL hit')
  const wins = trades.filter(t => t.result === 'TP hit')
  const losses = trades.filter(t => t.result === 'SL hit')
  const winRate = closed.length > 0 ? Math.round((wins.length / closed.length) * 100) : 0

  const pairStats = {}
  trades.forEach(t => {
    if (!t.pair) return
    if (!pairStats[t.pair]) pairStats[t.pair] = { wins: 0, losses: 0 }
    if (t.result === 'TP hit') pairStats[t.pair].wins++
    if (t.result === 'SL hit') pairStats[t.pair].losses++
  })
  const pairData = Object.entries(pairStats).map(([pair, { wins: w, losses: l }]) => ({ pair, wins: w, losses: l, wr: Math.round((w / (w + l || 1)) * 100) })).sort((a, b) => b.wr - a.wr)

  const emotionStats = {}
  trades.forEach(t => {
    if (!t.emotion) return
    if (!emotionStats[t.emotion]) emotionStats[t.emotion] = { wins: 0, total: 0 }
    emotionStats[t.emotion].total++
    if (t.result === 'TP hit') emotionStats[t.emotion].wins++
  })

  const setupStats = {}
  trades.forEach(t => {
    if (!t.setup_type) return
    if (!setupStats[t.setup_type]) setupStats[t.setup_type] = { wins: 0, total: 0 }
    setupStats[t.setup_type].total++
    if (t.result === 'TP hit') setupStats[t.setup_type].wins++
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: '#1a1a1a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: '#F0EEE8', marginBottom: 4, fontWeight: 500 }}>{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.fill }}>{p.name}: {p.value}</p>)}
      </div>
    )
  }

  if (loading) return <div style={{ padding: '2rem', color: 'rgba(240,238,232,0.3)', fontSize: 13 }}>Loading stats...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 500, marginBottom: '2rem' }}>Stats</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12, marginBottom: '1.5rem' }}>
        {[
          { label: 'Total trades', value: trades.length },
          { label: 'Win rate', value: `${winRate}%`, color: winRate >= 50 ? '#1D9E75' : '#E24B4A' },
          { label: 'Total wins', value: wins.length, color: '#1D9E75' },
          { label: 'Total losses', value: losses.length, color: '#E24B4A' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.1rem 1.25rem' }}>
            <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.4)', marginBottom: 8 }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 500, color: color || '#F0EEE8', fontFamily: "'Syne',sans-serif" }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Performance by pair</h2>
          {pairData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pairData} barGap={4}>
                <XAxis dataKey="pair" tick={{ fill: 'rgba(240,238,232,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(240,238,232,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="wins" name="Wins" radius={[4,4,0,0]} fill="#1D9E75" />
                <Bar dataKey="losses" name="Losses" radius={[4,4,0,0]} fill="#E24B4A" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Emotions vs win rate</h2>
          {Object.keys(emotionStats).length === 0 ? <Empty /> : (
            Object.entries(emotionStats).map(([emotion, { wins: w, total }]) => {
              const wr = Math.round((w / total) * 100)
              const COLORS = { Calm: '#1D9E75', Confident: '#378ADD', Anxious: '#EF9F27', FOMO: '#E24B4A', Excited: '#9F77DD', Uncertain: '#888880' }
              const color = COLORS[emotion] || '#888880'
              return (
                <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 13 }}>
                  <span style={{ width: 80, color: 'rgba(240,238,232,0.6)', fontSize: 12 }}>{emotion}</span>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6 }}>
                    <div style={{ width: `${wr}%`, background: color, height: 6, borderRadius: 4 }} />
                  </div>
                  <span style={{ color, fontWeight: 500, fontSize: 12, minWidth: 34, textAlign: 'right' }}>{wr}%</span>
                  <span style={{ color: 'rgba(240,238,232,0.25)', fontSize: 11, minWidth: 30 }}>{total}t</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.25rem' }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Setup performance</h2>
        {Object.keys(setupStats).length === 0 ? <Empty /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 10 }}>
            {Object.entries(setupStats).map(([setup, { wins: w, total }]) => {
              const wr = Math.round((w / total) * 100)
              return (
                <div key={setup} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.5)', marginBottom: 6 }}>{setup}</p>
                  <p style={{ fontSize: 22, fontWeight: 500, color: wr >= 50 ? '#1D9E75' : '#E24B4A', fontFamily: "'Syne',sans-serif" }}>{wr}%</p>
                  <p style={{ fontSize: 11, color: 'rgba(240,238,232,0.25)', marginTop: 4 }}>{w}W / {total - w}L</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Empty() {
  return <p style={{ fontSize: 13, color: 'rgba(240,238,232,0.25)', textAlign: 'center', padding: '1.5rem 0' }}>Log more trades to see data here</p>
}
