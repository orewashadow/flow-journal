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

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0,0,0,0)
  const filtered = view === 'week' ? trades.filter(t => new Date(t.created_at) >= weekStart) : trades

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

  const tradesByDay = {}
  trades.forEach(t => { const d = t.trade_date || t.created_at?.split('T')[0]; if (d) tradesByDay[d] = (tradesByDay[d] || 0) + 1 })
  const overtradingDays = Object.entries(tradesByDay).filter(([,c]) => c > 3)

  const weekTrades = trades.filter(t => new Date(t.created_at) >= weekStart)
  const weekWins = weekTrades.filter(t => t.result === 'TP hit')
  const weekClosed = weekTrades.filter(t => t.result !== 'Open')
  const weekWR = weekClosed.length > 0 ? Math.round((weekWins.length / weekClosed.length) * 100) : 0
  const weekFomo = weekTrades.filter(t => t.is_planned === false).length
  const weekFollowed = weekTrades.filter(t => t.followed_rules === true).length
  const weekRulesRate = weekTrades.length > 0 ? Math.round((weekFollowed / weekTrades.length) * 100) : 0

  const emotionMap = {}
  filtered.forEach(t => {
    if (!t.emotion) return
    if (!emotionMap[t.emotion]) emotionMap[t.emotion] = { w:0, t:0 }
    emotionMap[t.emotion].t++
    if (t.result === 'TP hit') emotionMap[t.emotion].w++
  })
  const bestEmotion = Object.entries(emotionMap).sort((a,b) => (b[1].w/b[1].t) - (a[1].w/a[1].t))[0]
  const worstEmotion = Object.entries(emotionMap).sort((a,b) => (a[1].w/a[1].t) - (b[1].w/b[1].t))[0]

  const pairMap = {}
  filtered.forEach(t => {
    if (!t.pair) return
    if (!pairMap[t.pair]) pairMap[t.pair] = { w:0, l:0 }
    if (t.result === 'TP hit') pairMap[t.pair].w++
    if (t.result === 'SL hit') pairMap[t.pair].l++
  })
  const pairData = Object.entries(pairMap).map(([pair, { w, l }]) => ({ pair, wins:w, losses:l }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background:'#0F1F4A', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#fff' }}>
        <p style={{ marginBottom:4, fontWeight:500 }}>{label}</p>
        {payload.map(p => <p key={p.name} style={{ color:p.fill }}>{p.name}: {p.value}</p>)}
      </div>
    )
  }

  if (loading) return <div style={{ padding:'2rem', color:'#9CA3AF', fontSize:13 }}>Loading...</div>

  return (
    <div style={{ padding:'1.5rem', maxWidth:1000, margin:'0 auto', paddingBottom:'4rem' }}>
      <style>{`
        .scard{background:#fff;border:0.5px solid #E8EDFB;border-radius:12px;padding:1.1rem 1.25rem;}
        .scard-accent{position:relative;overflow:hidden;}
        .scard-accent::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
        .scard-blue::before{background:#3B82F6;}
        .scard-green::before{background:#10B981;}
        .scard-purple::before{background:#8B5CF6;}
        .scard-amber::before{background:#F59E0B;}
        @media(max-width:768px){.sg4{grid-template-columns:1fr 1fr !important;}.sg2{grid-template-columns:1fr !important;}}
      `}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, color:'#0F1F4A' }}>Stats</h1>
        <div style={{ display:'flex', gap:6 }}>
          {['week','all'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding:'6px 14px', borderRadius:20, fontSize:12, background: view===v ? '#3B82F6' : '#fff', color: view===v ? 'white' : '#6B7280', border: view===v ? 'none' : '0.5px solid #E8EDFB' }}>
              {v === 'week' ? 'This week' : 'All time'}
            </button>
          ))}
        </div>
      </div>

      {overtradingDays.length > 0 && (
        <div style={{ background:'#FFFBEB', border:'0.5px solid #FCD34D', borderRadius:10, padding:'10px 14px', marginBottom:'1rem', display:'flex', gap:10, alignItems:'flex-start' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#D97706" strokeWidth="1.5" style={{ flexShrink:0, marginTop:1 }}><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 11v.5"/></svg>
          <p style={{ fontSize:12, color:'#92400E', lineHeight:1.6 }}>Overtrading on {overtradingDays.map(([d,c]) => `${d} (${c} trades)`).join(', ')}. Review if these were A+ setups.</p>
        </div>
      )}

      <div className="sg4" style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:10, marginBottom:'1rem' }}>
        {[
          { label:'Trades', value:filtered.length, cls:'blue', color:'#0F1F4A' },
          { label:'Win rate', value:`${winRate}%`, cls:'green', color: winRate>=50?'#059669':'#DC2626' },
          { label:'A+ win rate', value:`${aPlusWR}%`, cls:'purple', color:'#7C3AED' },
          { label:'Rules followed', value:`${weekRulesRate}%`, cls:'amber', color: weekRulesRate>=70?'#059669':'#D97706' },
        ].map(({ label, value, cls, color }) => (
          <div key={label} className={`scard scard-accent scard-${cls}`}>
            <p style={{ fontSize:11, color:'#9CA3AF', marginBottom:5 }}>{label}</p>
            <p style={{ fontSize:24, fontWeight:500, color, fontFamily:"'Syne',sans-serif" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="sg2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
        <div className="scard">
          <p style={{ fontSize:13, fontWeight:500, color:'#0F1F4A', marginBottom:'1rem' }}>Planned vs FOMO</p>
          {[['Planned', plannedWR, planned.length, '#3B82F6'], ['FOMO / Impulse', fomoWR, fomo.length, '#EF4444']].map(([label, wr, count, color]) => (
            <div key={label} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                <span style={{ color:'#6B7280' }}>{label} <span style={{ color:'#9CA3AF' }}>({count})</span></span>
                <span style={{ color, fontWeight:500 }}>{wr}% WR</span>
              </div>
              <div style={{ background:'#F3F4F6', borderRadius:4, height:6 }}>
                <div style={{ width:`${wr}%`, background:color, height:6, borderRadius:4 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="scard">
          <p style={{ fontSize:13, fontWeight:500, color:'#0F1F4A', marginBottom:'1rem' }}>A+ vs B/C setups</p>
          {(() => {
            const bc = filtered.filter(t => t.is_a_plus === false)
            const bcWins = bc.filter(t => t.result === 'TP hit')
            const bcWR = bc.length > 0 ? Math.round((bcWins.length / bc.length) * 100) : 0
            return [['A+ setup', aPlusWR, aPlus.length, '#8B5CF6'], ['B/C setup', bcWR, bc.length, '#9CA3AF']].map(([label, wr, count, color]) => (
              <div key={label} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span style={{ color:'#6B7280' }}>{label} <span style={{ color:'#9CA3AF' }}>({count})</span></span>
                  <span style={{ color, fontWeight:500 }}>{wr}% WR</span>
                </div>
                <div style={{ background:'#F3F4F6', borderRadius:4, height:6 }}>
                  <div style={{ width:`${wr}%`, background:color, height:6, borderRadius:4 }} />
                </div>
              </div>
            ))
          })()}
        </div>
      </div>

      <div className="sg2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
        <div className="scard">
          <p style={{ fontSize:13, fontWeight:500, color:'#0F1F4A', marginBottom:'1rem' }}>Performance by pair</p>
          {pairData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={pairData} barGap={4}>
                <XAxis dataKey="pair" tick={{ fill:'#9CA3AF', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#9CA3AF', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(59,130,246,0.05)' }} />
                <Bar dataKey="wins" name="Wins" radius={[4,4,0,0]} fill="#10B981" />
                <Bar dataKey="losses" name="Losses" radius={[4,4,0,0]} fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="scard">
          <p style={{ fontSize:13, fontWeight:500, color:'#0F1F4A', marginBottom:'1rem' }}>Emotions vs win rate</p>
          {Object.keys(emotionMap).length === 0 ? <Empty /> : (
            Object.entries(emotionMap).map(([emotion, { w, t }]) => {
              const wr = Math.round((w/t)*100)
              const COLORS = { Calm:'#3B82F6', Confident:'#8B5CF6', Anxious:'#F59E0B', FOMO:'#EF4444', Excited:'#10B981', Uncertain:'#9CA3AF', Frustrated:'#EF4444', Revenge:'#DC2626' }
              const color = COLORS[emotion] || '#9CA3AF'
              return (
                <div key={emotion} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9, fontSize:12 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
                  <span style={{ width:75, color:'#6B7280', fontSize:11, flexShrink:0 }}>{emotion}</span>
                  <div style={{ flex:1, background:'#F3F4F6', borderRadius:4, height:5 }}>
                    <div style={{ width:`${wr}%`, background:color, height:5, borderRadius:4 }} />
                  </div>
                  <span style={{ color, fontWeight:500, fontSize:11, minWidth:30, textAlign:'right' }}>{wr}%</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="scard" style={{ background:'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border:'0.5px solid #BFDBFE' }}>
        <p style={{ fontSize:11, fontWeight:500, color:'#1D4ED8', marginBottom:'1rem', textTransform:'uppercase', letterSpacing:1 }}>Weekly report</p>
        {weekTrades.length === 0 ? (
          <p style={{ fontSize:13, color:'#9CA3AF', textAlign:'center', padding:'1rem 0' }}>No trades logged this week yet</p>
        ) : (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:'1.25rem' }}>
              {[
                ['Trades', weekTrades.length, '#0F1F4A'],
                ['Win rate', `${weekWR}%`, weekWR>=50?'#059669':'#DC2626'],
                ['FOMO trades', weekFomo, weekFomo>0?'#D97706':'#059669'],
                ['Rules followed', `${weekRulesRate}%`, weekRulesRate>=70?'#059669':'#D97706'],
                ['Overtrading days', overtradingDays.length, overtradingDays.length>0?'#D97706':'#059669'],
                ['A+ setups', weekTrades.filter(t=>t.is_a_plus===true).length, '#7C3AED'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.6)', borderRadius:8, padding:'0.75rem' }}>
                  <p style={{ fontSize:11, color:'#6B7280', marginBottom:4 }}>{label}</p>
                  <p style={{ fontSize:18, fontWeight:500, color, fontFamily:"'Syne',sans-serif" }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'0.5px solid #BFDBFE', paddingTop:'1rem' }}>
              <p style={{ fontSize:12, color:'#6B7280', marginBottom:10 }}>This week in review:</p>
              {bestEmotion && <Insight color="#10B981" text={`Best state: ${bestEmotion[0]} — ${Math.round((bestEmotion[1].w/bestEmotion[1].t)*100)}% win rate. Trade more when you feel this way.`} />}
              {worstEmotion && worstEmotion[0] !== bestEmotion?.[0] && <Insight color="#EF4444" text={`Avoid trading when feeling ${worstEmotion[0]} — only ${Math.round((worstEmotion[1].w/worstEmotion[1].t)*100)}% win rate.`} />}
              {weekFomo > 0 && <Insight color="#F59E0B" text={`${weekFomo} FOMO trade${weekFomo>1?'s':''} taken this week. Pause before entering unplanned trades.`} />}
              {overtradingDays.length > 0 && <Insight color="#F59E0B" text={`Overtraded on ${overtradingDays.length} day${overtradingDays.length>1?'s':''}. Quality over quantity.`} />}
              {weekRulesRate >= 70 && <Insight color="#3B82F6" text={`Strong discipline — rules followed ${weekRulesRate}% of the time. Keep it up.`} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Insight({ color, text }) {
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:12, color:'#475569', lineHeight:1.6, marginBottom:8 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:color, flexShrink:0, marginTop:5 }} />
      {text}
    </div>
  )
}

function Empty() {
  return <p style={{ fontSize:13, color:'#9CA3AF', textAlign:'center', padding:'1.5rem 0' }}>Log more trades to see data here</p>
}
