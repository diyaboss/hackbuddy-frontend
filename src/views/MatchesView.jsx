import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchesApi } from '../api/matches';

export default function MatchesView({ user, showToast }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await matchesApi.getMatches();
      setMatches(data);
    } catch (err) {
      showToast('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="scene-dark full-bleed" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="metadata">LOADING MATCHES...</p></div>;

  return (
    <div className="scene-dark full-bleed" style={{ minHeight: '100svh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1', marginBottom: '10vh' }}>
          <h1 className="display-xl">
            YOU FOUND<br/>
            <span style={{ color: 'var(--lime-400)' }}>THE OTHER HALF.</span>
          </h1>
          <p className="metadata" style={{ marginTop: '2rem' }}>OF THE BUILD.</p>
        </div>

        {matches.length === 0 ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <p className="body-editorial">No matches yet. Keep discovering.</p>
          </div>
        ) : (
          matches.map(m => (
            <div key={m.matchId} style={{ gridColumn: '1 / -1' }}>
              <div className="match-split">
                <div style={{ textAlign: 'right' }}>
                  <h2 className="display-lg">{user.name}</h2>
                  <p className="metadata">YOU</p>
                </div>
                <div className="match-connector">+</div>
                <div>
                  <h2 className="display-lg">{m.teammate.name}</h2>
                  <p className="metadata">{m.teammate.branch}</p>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="btn-editorial" onClick={() => navigate(`/matches/${m.matchId}`)}>
                  ENTER MATCH ROOM →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
