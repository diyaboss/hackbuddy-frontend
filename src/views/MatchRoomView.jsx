import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchesApi } from '../api/matches';

export default function MatchRoomView({ user, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const [roomData, statementsData] = await Promise.all([
        matchesApi.getRoom(id),
        matchesApi.getProblemStatements()
      ]);
      setRoom(roomData);
      setStatements(statementsData);
    } catch (err) {
      showToast('Failed to load match room');
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };

  const handleShareContact = async () => {
    try {
      await matchesApi.shareContact(id);
      showToast('Contact shared!');
      fetchRoom();
    } catch (err) {
      showToast(err.message || 'Failed to share contact');
    }
  };

  const handleSelectStatement = async (statementId) => {
    const current = [...room.selections.yours];
    let updated;
    if (current.includes(statementId)) {
      updated = current.filter(sid => sid !== statementId);
    } else {
      updated = [...current, statementId];
    }

    try {
      await matchesApi.updateProblemStatements(id, updated);
      showToast('Statement selected!');
      fetchRoom();
    } catch (err) {
      showToast(err.message || 'Failed to select statement');
    }
  };

  if (loading || !room) return <div className="scene-light full-bleed" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="metadata">LOADING MATCH ROOM...</p></div>;

  const { teammate, selections, contact } = room;

  return (
    <div className="scene-light full-bleed" style={{ minHeight: '100svh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1', marginBottom: '8vh' }}>
          <h1 className="display-xl">YOU + THEM</h1>
          <p className="body-editorial" style={{ marginTop: '2rem' }}>
            A complementary build team.
          </p>
        </div>

        <div style={{ gridColumn: '1 / 8' }}>
          <h2 className="display-lg">GET IN TOUCH</h2>
          <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid var(--ink-950)' }}>
            {!contact.youShared ? (
              <>
                <p className="body-editorial" style={{ marginBottom: '2rem' }}>You have not shared your phone number yet.</p>
                <button className="btn-editorial" onClick={handleShareContact}>SHARE CONTACT</button>
              </>
            ) : (
              <p className="metadata">YOU SHARED YOUR CONTACT.</p>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--hairline-dark)' }}>
              {contact.theyShared ? (
                <>
                  <p className="metadata">THEY SHARED THEIR CONTACT:</p>
                  <p className="display-lg" style={{ fontSize: '2rem', marginTop: '1rem' }}>{contact.theirContact}</p>
                </>
              ) : (
                <p className="metadata" style={{ color: 'var(--stone-500)' }}>WAITING FOR THEM TO SHARE CONTACT.</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: '9 / -1' }}>
          <h2 className="display-lg">WHAT ARE WE BUILDING?</h2>
          <div style={{ marginTop: '2rem' }}>
            {statements.map(s => {
              const iSelected = selections.yours.includes(s.id);
              const theySelected = selections.theirs.includes(s.id);
              
              return (
                <div key={s.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--hairline-dark)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="metadata">{s.code}</p>
                      <h3 className="body-editorial" style={{ marginTop: '0.5rem', fontWeight: 600 }}>{s.title}</h3>
                    </div>
                    <div>
                      {!iSelected && <button className="btn-outline" style={{ fontSize: '10px', padding: '4px 8px' }} onClick={() => handleSelectStatement(s.id)}>CHOOSE</button>}
                      {iSelected && <button className="btn-outline" style={{ fontSize: '10px', padding: '4px 8px', color: 'var(--wine-700)', borderColor: 'var(--wine-700)' }} onClick={() => handleSelectStatement(s.id)}>REMOVE</button>}
                      {theySelected && <span className="skill-tag skill-needs" style={{ marginLeft: '0.5rem' }}>THEY CHOSE</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
