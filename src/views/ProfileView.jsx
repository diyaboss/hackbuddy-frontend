import React, { useState, useEffect } from 'react';
import { profileApi } from '../api/profile';
import SetupForm from './SetupForm';
import AnimalAvatar from '../components/AnimalAvatar';

export default function ProfileView({ user, setUser, showToast }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getMe();
      setProfile(data);
    } catch (err) {
      showToast('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = profile.matching_status === 'active' ? 'paused' : 'active';
      await profileApi.updateStatus(newStatus);
      setProfile({ ...profile, matching_status: newStatus });
      if (setUser) {
        setUser(current => ({ ...current, matching_status: newStatus }));
      }
      showToast(`Matching status is now ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  if (loading || !profile) return <div className="scene-light full-bleed" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="metadata">LOADING PROFILE...</p></div>;

  if (isEditing) {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          className="btn-outline" 
          style={{ position: 'absolute', top: '120px', right: '40px', zIndex: 100 }}
          onClick={() => setIsEditing(false)}
        >
          CANCEL EDIT
        </button>
        <SetupForm 
          user={profile} 
          setUser={setUser} 
          showToast={showToast} 
          onComplete={() => {
            setIsEditing(false);
            fetchProfile();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="scene-light full-bleed" style={{ minHeight: '100svh', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / -1', marginBottom: '8vh', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="display-xl">YOUR PROFILE</h1>
            <p className="body-editorial" style={{ marginTop: '2rem' }}>
              {profile.name} • {profile.branch} • {profile.year}
            </p>
          </div>
          <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => setIsEditing(true)}>EDIT PROFILE</button>
        </div>

        <div style={{ gridColumn: '1 / 6' }}>
          <div style={{ marginBottom: '4rem', width: '120px' }}>
            <AnimalAvatar animal={profile.avatar || 'raccoon'} label={profile.name} />
          </div>
          <h2 className="display-lg">CAPABILITIES</h2>
          <div style={{ marginTop: '2rem' }}>
            <p className="metadata" style={{ marginBottom: '1rem' }}>BRINGS</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {profile.skills?.map(s => <span key={s} className="skill-tag skill-brings">{s}</span>)}
            </div>
            
            <p className="metadata" style={{ marginBottom: '1rem' }}>NEEDS</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {profile.lookingFor?.map(s => <span key={s} className="skill-tag skill-needs">{s}</span>)}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: '8 / -1' }}>
          <h2 className="display-lg">SETTINGS</h2>
          <div style={{ marginTop: '2rem', padding: '2rem', border: '1px solid var(--ink-950)' }}>
            <p className="metadata" style={{ marginBottom: '1rem' }}>MATCHING STATUS</p>
            <p className="body-editorial" style={{ marginBottom: '2rem' }}>
              Currently: <strong>{profile.matching_status}</strong>
            </p>
            <button className="btn-outline" style={{ padding: '12px 24px' }} onClick={handleToggleStatus}>
              {profile.matching_status === 'active' ? 'PAUSE MATCHING' : 'RESUME MATCHING'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}