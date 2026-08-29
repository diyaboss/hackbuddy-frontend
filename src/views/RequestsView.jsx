import React, { useState, useEffect } from 'react';
import { requestsApi } from '../api/requests';

export default function RequestsView({ user, showToast }) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [inc, out] = await Promise.all([
        requestsApi.getIncoming(),
        requestsApi.getOutgoing()
      ]);
      setIncoming(inc);
      setOutgoing(out);
    } catch (err) {
      showToast('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await requestsApi.acceptRequest(id);
      showToast('Accepted! Check your Matches.');
      fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to accept');
    }
  };

  const handleDecline = async (id) => {
    try {
      await requestsApi.declineRequest(id);
      showToast('Declined request.');
      fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to decline');
    }
  };

  if (loading) return <div className="scene-light full-bleed" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="metadata">LOADING REQUESTS...</p></div>;

  return (
    <div className="scene-light full-bleed" style={{ minHeight: '100svh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1', marginBottom: '10vh' }}>
          <h1 className="display-xl">
            THEY WANT<br/>TO BUILD<br/>WITH YOU.
          </h1>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          {incoming.length === 0 && outgoing.length === 0 && (
            <p className="body-editorial">No pending requests right now.</p>
          )}

          {incoming.length > 0 && (
            <div style={{ marginBottom: '6rem' }}>
              <p className="metadata" style={{ marginBottom: '2rem' }}>INCOMING</p>
              {incoming.map((r, i) => (
                <div key={r.requestId} className="request-row" style={{ opacity: r.status !== 'pending' ? 0.5 : 1 }}>
                  <p className="metadata">0{i + 1}</p>
                  <img className="request-avatar" src={`/assets/${r.sender?.avatar || 'avatar-1.png'}`} alt={r.sender?.name} />
                  <div>
                    <h3 className="display-lg" style={{ fontSize: '2rem' }}>{r.sender?.name}</h3>
                    <p className="metadata">{r.sender?.branch} • {r.sender?.year}</p>
                  </div>
                  <div>
                    <p className="body-editorial" style={{ marginBottom: '1rem' }}>{r.sender?.complementReasons?.[0] || 'They bring skills you need.'}</p>
                    <p className="metadata">SCORE: {r.sender?.complementScore}%</p>
                  </div>
                  <div className="request-actions">
                    {r.status === 'pending' ? (
                      <>
                        <button className="btn-editorial" onClick={() => handleAccept(r.requestId)}>ACCEPT</button>
                        <button className="btn-outline" style={{ padding: '8px' }} onClick={() => handleDecline(r.requestId)}>DECLINE</button>
                      </>
                    ) : (
                      <p className="metadata">{r.status}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {outgoing.length > 0 && (
            <div>
              <p className="metadata" style={{ marginBottom: '2rem' }}>OUTGOING (WAITING)</p>
              {outgoing.map((r, i) => (
                <div key={r.requestId} className="request-row" style={{ opacity: r.status !== 'pending' ? 0.5 : 1 }}>
                  <p className="metadata">0{i + 1}</p>
                  <img className="request-avatar" src={`/assets/${r.receiver?.avatar || 'avatar-2.png'}`} alt={r.receiver?.name} />
                  <div>
                    <h3 className="display-lg" style={{ fontSize: '2rem' }}>{r.receiver?.name}</h3>
                  </div>
                  <div>
                    <p className="metadata" style={{ color: 'var(--wine-700)' }}>{r.status}</p>
                  </div>
                  <div />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
