import React, { useState, useEffect } from 'react';
import { discoverApi } from '../api/discover';
import { profileApi } from '../api/profile';
import { requestsApi } from '../api/requests';
import ConfirmModal from '../components/ConfirmModal';
import AnimalAvatar from '../components/AnimalAvatar';

export default function DiscoverView({ user, setUser, showToast }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchingStatus, setMatchingStatus] = useState(user?.matching_status || 'active');
  const [genderFilter, setGenderFilter] = useState('Everyone');
  const [requestSending, setRequestSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    if (matchingStatus === 'active') {
      fetchParticipants(genderFilter);
    }
  }, [genderFilter, matchingStatus]);

  const fetchParticipants = async (filter) => {
    try {
      setLoading(true);
      const data = await discoverApi.getEligibleUsers(filter);
      setParticipants(data);
      setCurrentIndex(0);
    } catch (err) {
      showToast('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (participants.length > 0) {
      setCurrentIndex(prev => (prev + 1) % participants.length);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await profileApi.updateStatus(newStatus);
      setMatchingStatus(newStatus);
      if (setUser) {
        setUser(current => ({ ...current, matching_status: newStatus }));
      }
      showToast(`Status updated`);
      setShowConfirm(false);
      setPendingStatus(null);
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleTeamUp = async (receiverId) => {
    try {
      setRequestSending(true);
      await requestsApi.sendRequest(receiverId);
      showToast('Request sent!');
      setParticipants(prev => prev.filter(p => p.id !== receiverId));
    } catch (err) {
      showToast(err.message || 'Failed to send request');
    } finally {
      setRequestSending(false);
    }
  };

  const renderConfirm = () => {
    if (!showConfirm) return null;
    return (
      <ConfirmModal
        title="TEAM COMPLETE?"
        confirmText="I'VE FOUND MY TEAM"
        cancelText="KEEP MATCHING"
        onConfirm={() => updateStatus(pendingStatus)}
        onCancel={() => { setShowConfirm(false); setPendingStatus(null); }}
      >
        You'll stop appearing in Discover and won't receive new Team Up requests. Your existing matches and shared contacts stay available.
      </ConfirmModal>
    );
  };

  if (matchingStatus === 'team_found' || matchingStatus === 'paused') {
    return (
      <div className="discover-scene scene-dark full-bleed">
        {renderConfirm()}
        <div className="editorial-grid">
          <h1 className="display-xl" style={{ gridColumn: '1 / -1' }}>
            {matchingStatus === 'team_found' ? 'TEAM COMPLETE' : 'PAUSED'}
          </h1>
          <p className="body-editorial" style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
            {matchingStatus === 'team_found' 
              ? "You're out of the matching pool. Your accepted matches and Match Rooms are still here." 
              : "Your profile is temporarily hidden."}
          </p>
          <div style={{ gridColumn: '1 / -1', marginTop: '4rem' }}>
            <button className="btn-editorial" onClick={() => updateStatus('active')}>
              RESUME MATCHING →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-scene scene-dark full-bleed">
      {renderConfirm()}
      <div className="editorial-grid discover-header">
        <h1 className="display-lg" style={{ gridColumn: '1 / 6' }}>
          FIND THE<br/>OTHER SIDE.
        </h1>
        <div style={{ gridColumn: '8 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          <select 
            className="editorial-input" 
            style={{ width: '200px', borderColor: 'var(--lime-400)', color: 'var(--lime-400)' }}
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="Everyone">ALL GENDERS</option>
            <option value="Women">WOMEN ONLY</option>
            <option value="Men">MEN ONLY</option>
            <option value="Non-binary">NON-BINARY</option>
            <option value="Prefer not to say">PREFER NOT TO SAY</option>
          </select>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => updateStatus('paused')}>PAUSE MATCHING</button>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => { setPendingStatus('team_found'); setShowConfirm(true); }}>TEAM FOUND</button>
          </div>
        </div>
        <p className="body-editorial" style={{ gridColumn: '1 / 6', marginTop: '2rem', color: 'var(--stone-500)' }}>
          Sorted by what closes your gap.
        </p>
      </div>

      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1' }}>
          {loading ? (
            <div style={{ display: 'flex', minHeight: '40vh', alignItems: 'center' }}><p className="metadata">LOADING PARTICIPANTS...</p></div>
          ) : participants.length === 0 ? (
            <div style={{ display: 'flex', minHeight: '40vh', alignItems: 'center' }}>
              <p className="body-editorial">No one else here yet matching your criteria.</p>
            </div>
          ) : (
            <div className="talent-spread">
              <div className="talent-portrait" style={{ width: '120px' }}>
                <AnimalAvatar animal={participants[currentIndex].avatar || 'raccoon'} label={participants[currentIndex].name} />
              </div>
              <div className="talent-info">
                <div>
                  <h2 className="display-xl" style={{ margin: 0 }}>{participants[currentIndex].name}</h2>
                  <p className="metadata">{participants[currentIndex].branch} • {participants[currentIndex].year}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                  <div>
                    <p className="metadata" style={{ marginBottom: '1rem' }}>BRINGS</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {participants[currentIndex].skills?.map(s => <span key={s} className="skill-tag skill-brings">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="metadata" style={{ marginBottom: '1rem' }}>NEEDS</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {participants[currentIndex].lookingFor?.map(s => <span key={s} className="skill-tag skill-needs">{s}</span>)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="score-massive">{participants[currentIndex].complementScore}%</div>
                  <p className="metadata">COMPLEMENT SCORE</p>
                  {participants[currentIndex].complementReasons?.map((reason, idx) => (
                    <p key={idx} className="body-editorial" style={{ marginTop: '1rem', color: 'var(--lime-400)' }}>
                      ↳ {reason}
                    </p>
                  ))}
                </div>

                <div className="talent-actions">
                  <button className="btn-outline" style={{ padding: '12px 24px' }} onClick={handleNext} disabled={requestSending}>NEXT</button>
                  <button className="btn-editorial" onClick={() => handleTeamUp(participants[currentIndex].id)} disabled={requestSending}>
                    {requestSending ? 'SENDING...' : 'TEAM UP →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
