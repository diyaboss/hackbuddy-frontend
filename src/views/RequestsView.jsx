import React, { useState, useEffect } from 'react'
import { requestsApi } from '../api/requests'
import AnimalAvatar from '../components/AnimalAvatar'

export default function RequestsView({ showToast }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requestsApi.getIncoming()
      .then(data => setRequests(data))
      .catch(() => showToast('Failed to load requests'))
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') {
        await requestsApi.acceptRequest(id)
        showToast('Request accepted! They are now in your Matches.')
      } else {
        await requestsApi.declineRequest(id)
        showToast('Request declined.')
      }
      setRequests(prev => prev.filter(r => r.requestId !== id))
    } catch (err) {
      showToast(err.message || `Failed to ${action} request`)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="content-section" style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '32px' }}>Team Requests</h2>
      {requests.length === 0 ? (
        <div className="status-empty">
          <p className="eyebrow">NO REQUESTS YET</p>
          <h2>When someone thinks your skills complete their team, they'll show up here.</h2>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {requests.map(req => (
            <div key={req.requestId} className="request-card" style={{ 
              display: 'grid',
              gridTemplateColumns: 'min-content 1fr min-content',
              gap: '32px',
              border: '1px solid var(--line)', 
              background: 'var(--ink)',
              padding: '32px',
              borderRadius: '2px'
            }}>
              <div style={{ width: '120px' }}>
                <AnimalAvatar animal={req.sender.avatar || 'raccoon'} label={req.sender.name} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', lineHeight: 1 }}>{req.sender.name}</h3>
                  <p style={{ color: 'var(--paper-dim)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                    {req.sender.branch || 'Unknown branch'} • {req.sender.year || 'Unknown year'}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <strong style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>THEIR SKILLS</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {req.sender.skills.map(s => (
                        <span key={s} style={{ padding: '4px 10px', background: 'var(--surface)', color: 'var(--paper)', fontSize: '0.8rem', borderRadius: '4px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>LOOKING FOR</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {req.sender.lookingFor.map(s => (
                        <span key={s} style={{ padding: '4px 10px', border: '1px solid var(--line)', color: 'var(--paper-dim)', fontSize: '0.8rem', borderRadius: '4px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <strong style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>WHY THIS COULD WORK</strong>
                  <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--paper-dim)', fontFamily: 'var(--font-serif)' }}>
                    {req.sender.complementReasons && req.sender.complementReasons.length > 0 ? (
                      req.sender.complementReasons.map((reason, i) => <li key={i} style={{ marginBottom: '4px' }}>{reason}</li>)
                    ) : (
                      <li>Could be an interesting wildcard match.</li>
                    )}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button className="primary-action" onClick={() => handleAction(req.requestId, 'accept')} style={{ padding: '12px 32px' }}>ACCEPT</button>
                  <button className="secondary-action" onClick={() => handleAction(req.requestId, 'decline')} style={{ padding: '12px 32px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--paper)', cursor: 'pointer' }}>DECLINE</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="signal-line" style={{ height: '40px', width: '1px', background: 'var(--accent)', marginBottom: '12px' }} />
                <b style={{ fontSize: '2rem', color: 'var(--accent)' }}>{req.sender.complementScore || 10}%</b>
                <small style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted)', textAlign: 'center', marginTop: '4px' }}>COMPLEMENT<br/>SCORE</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
