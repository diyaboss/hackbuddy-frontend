import React, { useState, useEffect } from 'react';
import { profileApi } from '../api/profile';
import { requestsApi } from '../api/requests';

export default function DiscoverView({ user, showToast }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const data = await profileApi.discover();
      setParticipants(data);
      setCurrentIndex(0);
    } catch (err) {
      showToast('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < participants.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      showToast('End of list. Check back later!');
    }
  };

  const handleTeamUp = async (receiverId) => {
    try {
      await requestsApi.sendRequest(receiverId);
      showToast('Request sent!');
      handleNext();
    } catch (err) {
      showToast(err.message || 'Failed to send request');
    }
  };

  if (loading) {
    return <div className="scene-dark full-bleed" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="metadata">LOADING PARTICIPANTS...</p></div>;
  }

  if (participants.length === 0) {
    return (
      <div className="discover-scene scene-dark full-bleed">
        <div className="editorial-grid">
          <h1 className="display-xl" style={{ gridColumn: '1 / -1' }}>NO ONE LEFT.</h1>
          <p className="body-editorial" style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>You've seen everyone who meets your criteria right now.</p>
        </div>
      </div>
    );
  }

  const p = participants[currentIndex];

  return (
    <div className="discover-scene scene-dark full-bleed">
      <div className="editorial-grid discover-header">
        <h1 className="display-lg" style={{ gridColumn: '1 / -1' }}>
          FIND THE<br/>OTHER SIDE.
        </h1>
        <div className="metadata" style={{ gridColumn: '1 / -1', marginTop: '2rem', display: 'flex', gap: '2rem' }}>
          <span>DISCOVER</span>
          <span>{participants.length - currentIndex} REMAINING</span>
        </div>
        <p className="body-editorial" style={{ gridColumn: '1 / 6', marginTop: '2rem', color: 'var(--stone-500)' }}>
          Sorted by what closes your gap. Not by who looks like you.
        </p>
      </div>

      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="talent-spread">
            <div className="talent-portrait">
              <img src={`/assets/${p.avatar || 'avatar-1.png'}`} alt={p.name} />
            </div>
            <div className="talent-info">
              <div>
                <h2 className="display-xl" style={{ margin: 0 }}>{p.name}</h2>
                <p className="metadata">{p.branch} • {p.year}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '4rem' }}>
                <div>
                  <p className="metadata" style={{ marginBottom: '1rem' }}>BRINGS</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {p.skills.map(s => <span key={s} className="skill-tag skill-brings">{s}</span>)}
                  </div>
                </div>
                <div>
                  <p className="metadata" style={{ marginBottom: '1rem' }}>NEEDS</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {p.looking_for.map(s => <span key={s} className="skill-tag skill-needs">{s}</span>)}
                  </div>
                </div>
              </div>

              <div>
                <div className="score-massive">{p.complement_score}%</div>
                <p className="metadata">COMPLEMENT SCORE</p>
                <p className="body-editorial" style={{ marginTop: '1rem', color: 'var(--lime-400)' }}>
                  {p.complement_reasons?.[0] || 'They have skills you need.'}
                </p>
              </div>

              <div className="talent-actions">
                <button className="btn-outline" style={{ padding: '12px 24px' }} onClick={handleNext}>NEXT</button>
                <button className="btn-editorial" onClick={() => handleTeamUp(p.id)}>TEAM UP →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
