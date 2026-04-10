import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard({ session }) {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchTrades() }, [])

  const fetchTrades = async () => {
    const { data } = await supabase.from('trades').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    setTrades(data || [])
    setLoading(false)
  }

  const wins = trades.filter(t => t.result === 'TP hit')
  const losses = trades.filter(t => t.result === 'SL hit')
  const closed = trades.filter(t => t.result !== 'Open')
  const winRate = closed.length > 0 ? Math.round((wins.length / closed.length) * 100) : 0
  const username = session?.user?.email?.split('@')[0] || 'Trader'

  const emotionStats = {}
  trades.forEach(t => {
    if (!t.emotion) return
    if (!emotionStats[t.emotion]) emotionStats[t.emotion] = { wins: 0, total: 0 }
    emotionStats[t.emotion].total++
    if (t.result === 'TP hit') emotionStats[t.emotion].wins++
  })

  const EMOTION_COLORS = { Calm: '#1D9E75', Confident: '#378ADD', Anxious: '#EF9F27', FOMO: '#E24B4A', Excited: '#9F77DD', Uncertain: '#888880' }

  return (
    <div style={{ padding: '1.25rem', maxWidth: 1100, margin: '0 auto' }}>
      <style>{`
        @media(max-width:768px){
          .dash-stats{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}
          .dash-bottom{grid-template-columns:1fr !important;}
          .trade-cols{grid-template-columns:1fr 1fr 80px !important;}
          .trade-cols .hide-mob{display:none !important;}
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 500 }}>Dashboard</h1>
          <p style={{ color: 'rgba(240,238,232,0.4)', fontSize: 13, marginTop: 3 }}>Welcome back, {username} 🌊</p>
        </div>
        <button onClick={() => navigate('/trades/new')} style={{ padding: '9px 16px', background: '#1D9E75', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>+ New</button>
      </div>

      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginBottom: '1.25rem' }}>
        {[
          { label: 'Total trades', value: trades.length, sub: 'All time' },
          { label: 'Win rate', value: `${winRate}%`, sub: `${wins.length}W / ${losses.length}L`, color: winRate >= 50 ? '#1D9E75' : '#E24B4A' },
          { label: 'Wins', value: wins.length, sub: 'TP hit', color: '#1D9E75' },
          { label: 'Losses', value: losses.length, sub: 'SL hit', color: '#E24B4A' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem 1.1rem' }}>
            <p style={{ fontSize: 11, color: 'rgba(240,238,232,0.4)', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 24, fontWeight: 500, color: color || '#F0EEE8', fontFamily: "'Syne',sans-serif" }}>{value}</p>
            <p style={{ fontSize: 11, color: 'rgba(240,238,232,0.25)', marginTop: 3 }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="dash-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 10 }}>
        <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500 }}>Recent trades</h2>
            <span onClick={() => navigate('/trades')} style={{ fontSize: 12, color: '#1D9E75', cursor: 'pointer' }}>View all</span>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(240,238,232,0.3)', fontSize: 13, textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : trades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
              <p style={{ color: 'rgba(240,238,232,0.3)', fontSize: 13, marginBottom: 12 }}>No trades yet. Start your journal.</p>
              <button onClick={() => navigate('/trades/new')} style={{ padding: '9px 18px', background: 'rgba(29,158,117,0.15)', color: '#1D9E75', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Log first trade</button>
            </div>
          ) : (
            <div>
              <div className="trade-cols" style={{ display: 'grid', gridTemplateColumns: '100px 80px 80px 80px 1fr 80px', gap: 8, padding: '0 0 8px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(240,238,232,0.3)', fontWeight: 500 }}>
                <span>Pair</span><span className="hide-mob">Entry</span><span className="hide-mob">SL</span><span className="hide-mob">TP</span><span>Setup</span><span>Result</span>
              </div>
              {trades.slice(0, 8).map(trade => (
                <div key={trade.id} onClick={() => navigate(`/trades/${trade.id}`)} className="trade-cols" style={{ display: 'grid', gridTemplateColumns: '100px 80px 80px 80px 1fr 80px', gap: 8, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)', fontSize: 13, cursor: 'pointer', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{trade.pair || '—'}</span>
                  <span className="hide-mob" style={{ color: 'rgba(240,238,232,0.6)' }}>{trade.entry_price || '—'}</span>
                  <span className="hide-mob" style={{ color: 'rgba(240,238,232,0.6)' }}>{trade.stop_loss || '—'}</span>
                  <span className="hide-mob" style={{ color: 'rgba(240,238,232,0.6)' }}>{trade.take_profit || '—'}</span>
                  <span style={{ color: 'rgba(240,238,232,0.4)', fontSize: 12 }}>{trade.setup_type || '—'}</span>
                  <ResultBadge result={trade.result} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.1rem' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '0.75rem' }}>Win rate</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem 0' }}>
              <svg width="100" height="100" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"/>
                <circle cx="55" cy="55" r="44" fill="none" stroke="#1D9E75" strokeWidth="12"
                  strokeDasharray={`${(winRate / 100) * 276} 276`}
                  strokeDashoffset="69" strokeLinecap="round"/>
                <text x="55" y="51" textAnchor="middle" fontSize="20" fontWeight="500" fill="#F0EEE8" fontFamily="Syne,sans-serif">{winRate}%</text>
                <text x="55" y="66" textAnchor="middle" fontSize="10" fill="rgba(240,238,232,0.35)" fontFamily="DM Sans,sans-serif">Win rate</text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: 'rgba(240,238,232,0.4)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Dot color="#1D9E75"/>{wins.length}W</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Dot color="#E24B4A"/>{losses.length}L</span>
            </div>
          </div>

          <div style={{ background: '#111111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '1.1rem' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: '0.75rem' }}>Emotions vs result</h2>
            {Object.keys(emotionStats).length === 0 ? (
              <p style={{ fontSize: 12, color: 'rgba(240,238,232,0.3)', textAlign: 'center', padding: '0.75rem 0' }}>Log trades with emotions to see patterns</p>
            ) : (
              Object.entries(emotionStats).map(([emotion, { wins: w, total }]) => {
                const wr = Math.round((w / total) * 100)
                const color = EMOTION_COLORS[emotion] || '#888880'
                return (
                  <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12 }}>
                    <Dot color={color} />
                    <span style={{ width: 65, color: 'rgba(240,238,232,0.6)', fontSize: 11 }}>{emotion}</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 5 }}>
                      <div style={{ width: `${wr}%`, background: color, height: 5, borderRadius: 4 }} />
                    </div>
                    <span style={{ color, fontWeight: 500, minWidth: 30, textAlign: 'right', fontSize: 11 }}>{wr}%</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultBadge({ result }) {
  const map = { 'TP hit': ['#1D9E75', 'rgba(29,158,117,0.12)'], 'SL hit': ['#E24B4A', 'rgba(226,75,74,0.12)'], 'Open': ['#378ADD', 'rgba(55,138,221,0.12)'] }
  const [color, bg] = map[result] || ['#888880', 'rgba(136,136,128,0.12)']
  return <span style={{ fontSize: 11, color, background: bg, padding: '3px 8px', borderRadius: 20, fontWeight: 500 }}>{result || '—'}</span>
}

function Dot({ color }) {
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}
