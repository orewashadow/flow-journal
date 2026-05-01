import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('trades').select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTrades(data || []); setLoading(false) })
  }, [])

  const wins = trades.filter(t => t.result === 'TP hit')
  const losses = trades.filter(t => t.result === 'SL hit')
  const closed = trades.filter(t => t.result !== 'Open')
  const winRate = closed.length > 0 ? Math.round((wins.length / closed.length) * 100) : 0
  const username = session?.user?.email?.split('@')[0] || 'Trader'

  const aPlus = trades.filter(t => t.is_a_plus === true)
  const aPlusWins = aPlus.filter(t => t.result === 'TP hit')
  const aPlusWR = aPlus.length > 0 ? Math.round((aPlusWins.length / aPlus.length) * 100) : 0

  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0,0,0,0)
  const weekTrades = trades.filter(t => new Date(t.created_at) >= weekStart)
  const weekFomo = weekTrades.filter(t => t.is_planned === false).length
  const weekFollowed = weekTrades.filter(t => t.followed_rules === true).length
  const weekRulesRate = weekTrades.length > 0 ? Math.round((weekFollowed / weekTrades.length) * 100) : 0

  const tradesByDay = {}
  trades.forEach(t => {
    const d = t.trade_date || t.created_at?.split('T')[0]
    if (d) tradesByDay[d] = (tradesByDay[d] || 0) + 1
  })
  const overtradingDays = Object.entries(tradesByDay).filter(([, c]) => c > 3)

  const emotionStats = {}
  trades.forEach(t => {
    if (!t.emotion) return
    if (!emotionStats[t.emotion]) emotionStats[t.emotion] = { wins: 0, total: 0 }
    emotionStats[t.emotion].total++
    if (t.result === 'TP hit') emotionStats[t.emotion].wins++
  })

  const bestEmotion = Object.entries(emotionStats).sort((a,b) => (b[1].wins/b[1].total) - (a[1].wins/a[1].total))[0]
  const worstEmotion = Object.entries(emotionStats).sort((a,b) => (a[1].wins/a[1].total) - (b[1].wins/b[1].total))[0]

  return (
    <div style={{ padding:'1.5rem', maxWidth:1100, margin:'0 auto' }}>
      <style>{`
        .stat-card{background:#fff;border:0.5px solid #E8EDFB;border-radius:12px;padding:1rem 1.1rem;position:relative;overflow:hidden;}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
        .stat-card.blue::before{background:#3B82F6;}
        .stat-card.green::before{background:#10B981;}
        .stat-card.purple::before{background:#8B5CF6;}
        .stat-card.amber::before{background:#F59E0B;}
        .card{background:#fff;border:0.5px solid #E8EDFB;border-radius:12px;padding:1.1rem 1.25rem;}
        .trade-row{display:grid;grid-template-columns:90px 1fr 70px;gap:8px;padding:9px 0;border-bottom:0.5px solid #F3F4F6;font-size:13px;align-items:center;cursor:pointer;}
        .trade-row:last-child{border-bottom:none;}
        .trade-row:hover{background:#F9FBFF;margin:0 -1.25rem;padding-left:1.25rem;padding-right:1.25rem;}
        .mood-row{display:flex;align-items:center;gap:8px;margin-bottom:9px;font-size:12px;}
        .insight-row{display:flex;gap:8px;font-size:12px;color:#475569;margin-bottom:7px;line-height:1.5;align-items:flex-start;}
        @media(max-width:768px){
          .stats-grid{grid-template-columns:1fr 1fr !important;}
          .bottom-grid{grid-template-columns:1fr !important;}
        }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:500, color:'#0F1F4A' }}>Dashboard</h1>
          <p style={{ fontSize:12, color:'#9CA3AF', marginTop:3 }}>Welcome back, {username}</p>
        </div>
        <button onClick={() => navigate('/trades/new')} style={{ padding:'9px 18px', background:'#3B82F6', color:'white', borderRadius:10, fontSize:13, fontWeight:500 }}>
          + New trade
        </button>
      </div>

      {overtradingDays.length > 0 && (
        <div style={{ background:'#FFFBEB', border:'0.5px solid #FCD34D', borderRadius:10, padding:'10px 14px', marginBottom:'1rem', display:'flex', gap:10, alignItems:'flex-start' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#D97706" strokeWidth="1.5" style={{ flexShrink:0, marginTop:1 }}><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 11v.5"/></svg>
          <p style={{ fontSize:12, color:'#92400E', lineHeight:1.6 }}>Overtrading detected on {overtradingDays.map(([d,c]) => `${d} (${c} trades)`).join(', ')}. Review if these were A+ setups.</p>
        </div>
      )}

      <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:10, marginBottom:'1rem' }}>
        <div className="stat-card blue">
          <p style={{ fontSize:11, color:'#9CA3AF', marginBottom:5 }}>Total trades</p>
          <p style={{ fontSize:24, fontWeight:500, color:'#0F1F4A', fontFamily:"'Syne',sans-serif" }}>{trades.length}</p>
          <p style={{ fontSize:10, color:'#9CA3AF', marginTop:3 }}>All time</p>
        </div>
        <div className="stat-card green">
          <p style={{ fontSize:11, color:'#9CA3AF', marginBottom:5 }}>Win rate</p>
          <p style={{ fontSize:24, fontWeight:500, color: winRate >= 50 ? '#059669' : '#DC2626', fontFamily:"'Syne',sans-serif" }}>{winRate}%</p>
          <p style={{ fontSize:10, color:'#059669', marginTop:3 }}>{wins.length}W / {losses.length}L</p>
        </div>
        <div className="stat-card purple">
          <p style={{ fontSize:11, color:'#9CA3AF', marginBottom:5 }}>A+ win rate</p>
          <p style={{ fontSize:24, fontWeight:500, color:'#7C3AED', fontFamily:"'Syne',sans-serif" }}>{aPlusWR}%</p>
          <p style={{ fontSize:10, color:'#9CA3AF', marginTop:3 }}>{aPlus.length} A+ trades</p>
        </div>
        <div className="stat-card amber">
          <p style={{ fontSize:11, color:'#9CA3AF', marginBottom:5 }}>Rules followed</p>
          <p style={{ fontSize:24, fontWeight:500, color: weekRulesRate >= 70 ? '#059669' : '#D97706', fontFamily:"'Syne',sans-serif" }}>{weekRulesRate}%</p>
          <p style={{ fontSize:10, color:'#9CA3AF', marginTop:3 }}>This week</p>
        </div>
      </div>

      <div className="bottom-grid" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:10 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
              <h2 style={{ fontSize:14, fontWeight:500, color:'#0F1F4A' }}>Recent trades</h2>
              <span onClick={() => navigate('/trades')} style={{ fontSize:12, color:'#3B82F6', cursor:'pointer' }}>View all</span>
            </div>
            {loading ? (
              <p style={{ fontSize:13, color:'#9CA3AF', textAlign:'center', padding:'2rem' }}>Loading...</p>
            ) : trades.length === 0 ? (
              <div style={{ textAlign:'center', padding:'2.5rem 0' }}>
                <p style={{ fontSize:13, color:'#9CA3AF', marginBottom:12 }}>No trades yet. Start your journal.</p>
                <button onClick={() => navigate('/trades/new')} style={{ padding:'9px 18px', background:'#EFF6FF', color:'#3B82F6', borderRadius:8, fontSize:13 }}>Log first trade</button>
              </div>
            ) : (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 70px', gap:8, paddingBottom:8, borderBottom:'0.5px solid #F3F4F6', fontSize:11, color:'#9CA3AF', fontWeight:500 }}>
                  <span>Pair</span><span>Setup · Emotion</span><span>Result</span>
                </div>
                {trades.slice(0, 8).map(t => (
                  <div key={t.id} className="trade-row" onClick={() => navigate(`/trades/${t.id}`)}>
                    <div>
                      <p style={{ fontWeight:500, fontSize:13, color:'#0F1F4A' }}>{t.pair || '—'}</p>
                      {t.timeframe && <p style={{ fontSize:10, color:'#9CA3AF' }}>{t.timeframe}</p>}
                    </div>
                    <div>
                      <p style={{ fontSize:12, color:'#6B7280' }}>{t.setup_type || '—'}</p>
                      {t.emotion && <p style={{ fontSize:11, color:'#9CA3AF' }}>{t.emotion}{t.is_planned === false ? ' · FOMO' : ''}</p>}
                    </div>
                    <ResultBadge result={t.result} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {weekTrades.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border:'0.5px solid #BFDBFE', borderRadius:12, padding:'1.1rem 1.25rem' }}>
              <p style={{ fontSize:11, fontWeight:500, color:'#1D4ED8', marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>This week</p>
              {bestEmotion && (
                <div className="insight-row">
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', flexShrink:0, marginTop:5 }} />
                  Best state: <strong>{bestEmotion[0]}</strong> — {Math.round((bestEmotion[1].wins/bestEmotion[1].total)*100)}% win rate
                </div>
              )}
              {worstEmotion && worstEmotion[0] !== bestEmotion?.[0] && (
                <div className="insight-row">
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#EF4444', flexShrink:0, marginTop:5 }} />
                  Avoid trading when feeling <strong>{worstEmotion[0]}</strong>
                </div>
              )}
              {weekFomo > 0 && (
                <div className="insight-row">
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#F59E0B', flexShrink:0, marginTop:5 }} />
                  {weekFomo} FOMO trade{weekFomo > 1 ? 's' : ''} taken this week
                </div>
              )}
              {weekRulesRate >= 70 && (
                <div className="insight-row">
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#3B82F6', flexShrink:0, marginTop:5 }} />
                  Rules followed {weekRulesRate}% — strong discipline
                </div>
              )}
            </div>
          )}

          <div className="card">
            <h2 style={{ fontSize:14, fontWeight:500, color:'#0F1F4A', marginBottom:'1rem' }}>Emotions vs win rate</h2>
            {Object.keys(emotionStats).length === 0 ? (
              <p style={{ fontSize:12, color:'#9CA3AF', textAlign:'center', padding:'1rem 0' }}>Log trades with emotions to see patterns</p>
            ) : (
              Object.entries(emotionStats).slice(0,5).map(([emotion, { wins:w, total }]) => {
                const wr = Math.round((w / total) * 100)
                const COLORS = { Calm:'#3B82F6', Confident:'#8B5CF6', Anxious:'#F59E0B', FOMO:'#EF4444', Excited:'#10B981', Uncertain:'#9CA3AF', Frustrated:'#EF4444', Revenge:'#DC2626' }
                const color = COLORS[emotion] || '#9CA3AF'
                return (
                  <div key={emotion} className="mood-row">
                    <span style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0, display:'inline-block' }} />
                    <span style={{ width:70, color:'#6B7280', fontSize:12 }}>{emotion}</span>
                    <div style={{ flex:1, background:'#F3F4F6', borderRadius:4, height:5 }}>
                      <div style={{ width:`${wr}%`, background:color, height:5, borderRadius:4, transition:'width 0.5s' }} />
                    </div>
                    <span style={{ color, fontWeight:500, fontSize:11, minWidth:30, textAlign:'right' }}>{wr}%</span>
                  </div>
                )
              })
            )}
          </div>

          <div className="card" style={{ textAlign:'center' }}>
            <h2 style={{ fontSize:14, fontWeight:500, color:'#0F1F4A', marginBottom:'0.75rem' }}>Win rate</h2>
            <svg width="100" height="100" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="44" fill="none" stroke="#E8EDFB" strokeWidth="12"/>
              <circle cx="55" cy="55" r="44" fill="none" stroke="#3B82F6" strokeWidth="12"
                strokeDasharray={`${(winRate/100)*276} 276`} strokeDashoffset="69" strokeLinecap="round"/>
              <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="500" fill="#0F1F4A" fontFamily="Syne,sans-serif">{winRate}%</text>
              <text x="55" y="66" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="DM Sans,sans-serif">Win rate</text>
            </svg>
            <div style={{ display:'flex', justifyContent:'center', gap:16, fontSize:12, color:'#6B7280', marginTop:8 }}>
              <span style={{ display:'flex', alignItems:'center', gap:5 }}><Dot color="#10B981"/>{wins.length} wins</span>
              <span style={{ display:'flex', alignItems:'center', gap:5 }}><Dot color="#EF4444"/>{losses.length} losses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultBadge({ result }) {
  const map = { 'TP hit':['#166534','#DCFCE7'], 'SL hit':['#991B1B','#FEE2E2'], 'Open':['#1E40AF','#DBEAFE'], 'Breakeven':['#854D0E','#FEF9C3'], 'Manually closed':['#4B5563','#F3F4F6'] }
  const [color, bg] = map[result] || ['#4B5563','#F3F4F6']
  return <span style={{ fontSize:10, color, background:bg, padding:'3px 8px', borderRadius:20, fontWeight:500, whiteSpace:'nowrap' }}>{result || '—'}</span>
}

function Dot({ color }) {
  return <span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />
}
