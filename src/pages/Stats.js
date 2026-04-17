import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Stats({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('week')

  useEffect(() => {
    supabase.from('trades').select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTrades(data || []); setLoading(false) })
  }, [])

  // Filter by week or all time
  const getWeekStart = () => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0,0,0,0)
    return d
  }

  const filtered = view === 'week'
    ? trades.filter(t => new Date(t.created_at) >= getWeekStart())
    : trades

  const wins = filtered.filter(t => t.result === 'TP hit')
  const losses = filtered.filter(t => t.result === 'SL hit')
  const closed = wins.length + losses.length
  const winRate = closed > 0 ? Math.round((wins.length / closed) * 100) : 0
  const aPlus = filtered.filter(t => t.is_a_plus === true)
  const aPlusWins = aPlus.filter(t => t.result === 'TP hit')
  const aPlusWR = aPlus.length > 0 ? Math.round((aPlusWins.length / aPlus.length) * 100) : 0
  const planned = filtered.filter(t => t.is_planned === true)
  const plannedWins = planned.filter(t => t.result === 'TP hit')
  const plannedWR = planned.length > 0 ? Math.round((plannedWins.length / planned.length) * 100) : 0
  const fomo = filtered.filter(t => t.is_planned === false)
  const fomoWins = fomo.filter(t => t.result === 'TP hit')
  const fomoWR = fomo.length > 0 ? Math.round((fomoWins.length / fomo.length) * 100) : 0

  // Overtrading — trades per day this week
  const tradesByDay = {}
  trades.forEach(t => {
    const d = (t.trade_date || t.created_at?.split('T')[0])
    if (!d) return
    tradesByDay[d] = (tradesByDay[d] || 0) + 1
  })
  const overtradingDays = Object.entries(tradesByDay).filter(([, count]) => count > 3)

  // Weekly report
  const weekTrades = trades.filter(t => new Date(t.created_at) >= getWeekStart())
  const weekWins = weekTrades.filter(t => t.result === 'TP hit')
  const weekLosses = weekTrades.filter(t => t.result === 'SL hit')
  const weekWR = weekTrades.filter(t => t.result !== 'Open').length > 0
    ? Math.round((weekWins.length / weekTrades.filter(t => t.result !== 'Open').length) * 100) : 0
  const weekFomo = weekTrades.filter(t => t.is_planned === false).length
  const weekAPlus = weekTrades.filter(t => t.is_a_plus === true).length
  const weekFollowed = weekTrades.filter(t => t.followed_rules === true).length
  const weekRulesRate = weekTrades.length > 0 ? Math.round((weekFollowed / weekTrades.length) * 100) : 0

  // Best emotion
  const emotionMap = {}
  filtered.forEach(t => {
    if (!t.emotion) return
    if (!emotionMap[t.emotion]) emotionMap[t.emotion] = { w: 0, t: 0 }
    emotionMap[t.emotion].t++
    if (t.result === 'TP hit') emotionMap[t.emotion].w++
  })
  const bestEmotion = Object.entries(emotionMap).sort((a,b) => (b[1].w/b[1].t) - (a[1].w/a[1].t))[0]
  const worstEmotion = Object.entries(emotionMap).sort((a,b) => (a[1].w/a[1].t) - (b[1].w/b[1].t))[0]

  // Pair stats
  const pairMap = {}
  filtered.forEach(t => {
    if (!t.pair) return
    if (!pairMap[t.pair]) pairMap[t.pair] = { w: 0, l: 0 }
    if (t.result === 'TP hit') pairMap[t.pair].w++
    if (t.result === 'SL hit') pairMap[t.pair].l++
  })
  const pairData = Object.entries(pairMap).map(([pair, { w, l }]) => ({ pair, wins: w, losses: l }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background:'#1a1a1a', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', fontSize:12 }}>
        <p style={{ color:'#F0EEE8', marginBottom:4, fontWeight:500 }}>{label}</p>
        {payload.map(p => <p key={p.name} style={{ color:p.fill }}>{p.name}: {p.value}</p>)}
      </div>
    )
  }

  if (loading) return <div style={{ padding:'2rem', color:'rgba(240,238,232,0.3)', fontSize:13 }}>Loading...</div>

  return (
    <div style={{ padding:'1.25rem', maxWidth:1000, margin:'0 auto', paddingBottom:'4rem' }}>
      <style>{`@media(max-width:768px){.stats-grid-4{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}.stats-2col{grid-template-columns:1fr !important;}}`}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500 }}>Stats</h1>
        <div style={{ display:'flex', gap:6 }}>
          {['week','all'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontFamily:"'DM Sans',sans-serif", background: view===v ? '#1D9E75' : 'rgba(255,255,255,0.06)', color: view===v ? 'white' : 'rgba(240,238,232,0.5)' }}>
              {v === 'week' ? 'This week' : 'All time'}
            </button>
          ))}
        </div>
      </div>

      {/* Overtrading warning */}
      {overtradingDays.length > 0 && (
        <div style={{ background:'rgba(239,159,39,0.08)', border:'0.5px solid rgba(239,159,39,0.3)', borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1.25rem', display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF9F27', flexShrink:0 }} />
          <div>
            <p style={{ fontSize:13, fontWeight:500, color:'#EF9F27', marginBottom:3 }}>Overtrading detected</p>
            <p style={{ fontSize:12, color:'rgba(240,238,232,0.5)' }}>You exceeded 3 trades on {overtradingDays.map(([d,c]) => `${d} (${c} trades)`).join(', ')}. Review if these were all A+ setups.</p>
          </div>
        </div>
      )}

      {/* Top stats */}
      <div className="stats-grid-4" style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:10, marginBottom:'1.25rem' }}>
        {[
          { label:'Total trades', value:filtered.length },
          { label:'Win rate', value:`${winRate}%`, color: winRate >= 50 ? '#1D9E75' : '#E24B4A' },
          { label:'A+ win rate', value:`${aPlusWR}%`, color:'#1D9E75' },
          { label:'Rules followed', value:`${weekRulesRate}%`, color: weekRulesRate >= 70 ? '#1D9E75' : '#EF9F27' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1rem 1.1rem' }}>
            <p style={{ fontSize:11, color:'rgba(240,238,232,0.4)', marginBottom:6 }}>{label}</p>
            <p style={{ fontSize:24, fontWeight:500, color: color || '#F0EEE8', fontFamily:"'Syne',sans-serif" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="stats-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
        {/* Planned vs FOMO */}
        <div style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <p style={{ fontSize:13, fontWeight:500, marginBottom:'1rem' }}>Planned vs FOMO</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[['Planned', plannedWR, planned.length, '#1D9E75'], ['FOMO / Impulse', fomoWR, fomo.length, '#E24B4A']].map(([label, wr, count, color]) => (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span style={{ color:'rgba(240,238,232,0.6)' }}>{label} <span style={{ color:'rgba(240,238,232,0.3)' }}>({count})</span></span>
                  <span style={{ color, fontWeight:500 }}>{wr}% WR</span>
                </div>
                <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:4, height:6 }}>
                  <div style={{ width:`${wr}%`, background:color, height:6, borderRadius:4, transition:'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* A+ vs other */}
        <div style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <p style={{ fontSize:13, fontWeight:500, marginBottom:'1rem' }}>A+ setups vs others</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[['A+ setup', aPlusWR, aPlus.length, '#1D9E75'], ['B/C setup', filtered.filter(t=>t.is_a_plus===false).length > 0 ? Math.round((filtered.filter(t=>t.is_a_plus===false&&t.result==='TP hit').length/filtered.filter(t=>t.is_a_plus===false).length)*100) : 0, filtered.filter(t=>t.is_a_plus===false).length, '#888880']].map(([label, wr, count, color]) => (
              <div key={label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span style={{ color:'rgba(240,238,232,0.6)' }}>{label} <span style={{ color:'rgba(240,238,232,0.3)' }}>({count})</span></span>
                  <span style={{ color, fontWeight:500 }}>{wr}% WR</span>
                </div>
                <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:4, height:6 }}>
                  <div style={{ width:`${wr}%`, background:color, height:6, borderRadius:4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
        {/* Pair performance */}
        <div style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <p style={{ fontSize:13, fontWeight:500, marginBottom:'1rem' }}>Performance by pair</p>
          {pairData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={pairData} barGap={4}>
                <XAxis dataKey="pair" tick={{ fill:'rgba(240,238,232,0.4)', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'rgba(240,238,232,0.3)', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="wins" name="Wins" radius={[4,4,0,0]} fill="#1D9E75" />
                <Bar dataKey="losses" name="Losses" radius={[4,4,0,0]} fill="#E24B4A" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Emotion performance */}
        <div style={{ background:'#111', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <p style={{ fontSize:13, fontWeight:500, marginBottom:'1rem' }}>Emotions vs win rate</p>
          {Object.keys(emotionMap).length === 0 ? <Empty /> : (
            Object.entries(emotionMap).map(([emotion, { w, t }]) => {
              const wr = Math.round((w / t) * 100)
              const COLORS = { Calm:'#1D9E75', Confident:'#378ADD', Anxious:'#EF9F27', FOMO:'#E24B4A', Excited:'#9F77DD', Uncertain:'#888880', Frustrated:'#E24B4A', Revenge:'#A32D2D' }
              const color = COLORS[emotion] || '#888880'
              return (
                <div key={emotion} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:12 }}>
                  <span style={{ width:75, color:'rgba(240,238,232,0.6)', fontSize:11, flexShrink:0 }}>{emotion}</span>
                  <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:4, height:5 }}>
                    <div style={{ width:`${wr}%`, background:color, height:5, borderRadius:4 }} />
                  </div>
                  <span style={{ color, fontWeight:500, fontSize:11, minWidth:30, textAlign:'right' }}>{wr}%</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Weekly report */}
      <div style={{ background:'#111', border:'0.5px solid rgba(29,158,117,0.2)', borderRadius:12, padding:'1.25rem' }}>
        <p style={{ fontSize:13, fontWeight:500, color:'#1D9E75', marginBottom:'1rem' }}>Weekly report</p>
        {weekTrades.length === 0 ? (
          <p style={{ fontSize:13, color:'rgba(240,238,232,0.3)', textAlign:'center', padding:'1rem 0' }}>No trades logged this week yet</p>
        ) : (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:'1.25rem' }}>
              {[
                ['Trades', weekTrades.length, ''],
                ['Win rate', `${weekWR}%`, weekWR >= 50 ? '#1D9E75' : '#E24B4A'],
                ['FOMO trades', weekFomo, weekFomo > 0 ? '#EF9F27' : '#1D9E75'],
                ['A+ setups', weekAPlus, '#1D9E75'],
                ['Rules followed', `${weekRulesRate}%`, weekRulesRate >= 70 ? '#1D9E75' : '#EF9F27'],
                ['Overtrading days', overtradingDays.length, overtradingDays.length > 0 ? '#EF9F27' : '#1D9E75'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'0.75rem' }}>
                  <p style={{ fontSize:11, color:'rgba(240,238,232,0.4)', marginBottom:4 }}>{label}</p>
                  <p style={{ fontSize:18, fontWeight:500, color: color || '#F0EEE8', fontFamily:"'Syne',sans-serif" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop:'0.5px solid rgba(255,255,255,0.06)', paddingTop:'1rem' }}>
              <p style={{ fontSize:12, color:'rgba(240,238,232,0.4)', marginBottom:10 }}>This week in review:</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {bestEmotion && <Insight color="#1D9E75" text={`Your best emotional state is ${bestEmotion[0]} — ${Math.round((bestEmotion[1].w/bestEmotion[1].t)*100)}% win rate. Trade more when you feel this way.`} />}
                {worstEmotion && worstEmotion[0] !== bestEmotion?.[0] && <Insight color="#E24B4A" text={`Avoid trading when feeling ${worstEmotion[0]} — only ${Math.round((worstEmotion[1].w/worstEmotion[1].t)*100)}% win rate.`} />}
                {weekFomo > 0 && <Insight color="#EF9F27" text={`You took ${weekFomo} FOMO/impulse trade${weekFomo > 1 ? 's' : ''} this week. Next week, pause before entering unplanned trades.`} />}
                {overtradingDays.length > 0 && <Insight color="#EF9F27" text={`You overtraded on ${overtradingDays.length} day${overtradingDays.length > 1 ? 's' : ''} this week. Quality over quantity.`} />}
                {weekRulesRate < 70 && <Insight color="#E24B4A" text={`You followed your rules only ${weekRulesRate}% of the time. Focus on discipline next week.`} />}
                {weekWR >= 60 && <Insight color="#1D9E75" text={`Strong week — ${weekWR}% win rate. Keep the same process next week.`} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Insight({ color, text }) {
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:'rgba(240,238,232,0.6)', lineHeight:1.6 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:color, flexShrink:0, marginTop:6 }} />
      {text}
    </div>
  )
}

function Empty() {
  return <p style={{ fontSize:13, color:'rgba(240,238,232,0.25)', textAlign:'center', padding:'1.5rem 0' }}>Log more trades to see data here</p>
}
