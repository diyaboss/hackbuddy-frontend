import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profile';

const SKILL_OPTIONS = ['Frontend', 'Backend', 'Design', 'Mobile', 'AI/ML', 'Blockchain', 'Hardware', 'Product'];
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const AVATAR_OPTIONS = ['avatar-1.png', 'avatar-2.png', 'avatar-3.png', 'avatar-4.png', 'avatar-5.png', 'avatar-6.png'];

export default function SetupForm({ user, setUser, showToast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    year: user?.year || '',
    gender: user?.gender || '',
    teamSize: user?.teamSize || 4,
    bio: user?.bio || '',
    workingStyle: user?.workingStyle || '',
    avatar: user?.avatar || AVATAR_OPTIONS[0],
    skills: user?.skills || [],
    lookingFor: user?.lookingFor || []
  });

  const toggleArrayItem = (arrayName, item) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.branch || !formData.year || !formData.gender || !formData.workingStyle) {
      showToast('Please fill all required fields before finishing.');
      return;
    }
    
    try {
      setLoading(true);
      const data = await profileApi.updateMe(formData);
      setUser(data.user);
      navigate('/discover');
    } catch (err) {
      showToast(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="setup-step">
            <h2 className="display-lg">WHO ARE YOU?</h2>
            <input className="editorial-input" style={{ marginTop: '2rem' }} placeholder="NAME / WHAT SHOULD WE CALL YOU?" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <div style={{ marginTop: '4rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem' }}>CHOOSE AN IDENTITY</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {AVATAR_OPTIONS.map(a => (
                  <img key={a} src={`/assets/${a}`} alt={a} onClick={() => setFormData({ ...formData, avatar: a })} style={{ width: '80px', height: '80px', cursor: 'pointer', border: formData.avatar === a ? '2px solid var(--lime-400)' : '2px solid transparent', filter: 'grayscale(1)' }} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: '4rem' }}>
              <select className="editorial-input" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">GENDER</option>
                {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="setup-step">
            <h2 className="display-lg">WHAT DO YOU BUILD?</h2>
            <input className="editorial-input" style={{ marginTop: '2rem' }} placeholder="BRANCH / WHERE DO YOU HACK?" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} />
            <input className="editorial-input" style={{ marginTop: '2rem' }} placeholder="YEAR / HOW LONG HAVE YOU BEEN AT IT?" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            
            <div style={{ marginTop: '4rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem' }}>BRINGS / YOUR USEFUL WEAPONS</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {SKILL_OPTIONS.map(s => (
                  <button key={s} className={`skill-tag ${formData.skills.includes(s) ? 'skill-brings' : ''}`} style={{ borderColor: 'var(--ink-950)', color: formData.skills.includes(s) ? 'var(--cream-50)' : 'inherit', background: formData.skills.includes(s) ? 'var(--ink-950)' : 'transparent' }} onClick={() => toggleArrayItem('skills', s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="setup-step">
            <h2 className="display-lg">WHAT ARE YOU MISSING?</h2>
            <div style={{ marginTop: '4rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem' }}>NEEDS / THE PIECES YOU WANT BESIDE YOU</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {SKILL_OPTIONS.map(s => (
                  <button key={s} className={`skill-tag ${formData.lookingFor.includes(s) ? 'skill-needs' : ''}`} style={{ borderColor: formData.lookingFor.includes(s) ? 'var(--wine-700)' : 'var(--ink-950)', color: formData.lookingFor.includes(s) ? 'var(--wine-700)' : 'inherit' }} onClick={() => toggleArrayItem('lookingFor', s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="setup-step">
            <h2 className="display-lg">HOW DO YOU WORK?</h2>
            <div style={{ marginTop: '4rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem' }}>WORKING STYLE</p>
              <select className="editorial-input" value={formData.workingStyle} onChange={e => setFormData({ ...formData, workingStyle: e.target.value })}>
                <option value="">SELECT A STYLE</option>
                <option value="Fast & Loose">FAST & LOOSE</option>
                <option value="Methodical">METHODICAL</option>
                <option value="Somewhere Between">SOMEWHERE BETWEEN</option>
              </select>
            </div>
            <input className="editorial-input" style={{ marginTop: '2rem' }} placeholder="BIO / SHORT STATEMENT (OPTIONAL)" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
          </div>
        );
      case 5:
        return (
          <div className="setup-step">
            <h2 className="display-lg">WHO DO YOU WANT TO BUILD WITH?</h2>
            <div style={{ marginTop: '4rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem' }}>IDEAL TEAM SIZE</p>
              <input type="number" className="editorial-input" value={formData.teamSize} onChange={e => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 4 })} min="2" max="10" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="scene-light full-bleed" style={{ minHeight: '100svh', paddingTop: '120px' }}>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / 10' }}>
          {renderStepContent()}
          
          <div style={{ marginTop: '10vh', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="metadata">{`0${step} / 05`}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {step > 1 && <button className="btn-outline" style={{ padding: '12px' }} onClick={() => setStep(s => s - 1)}>BACK</button>}
              {step < 5 ? (
                <button className="btn-editorial" onClick={() => setStep(s => s + 1)}>NEXT</button>
              ) : (
                <button className="btn-editorial" onClick={handleSave} disabled={loading}>{loading ? 'SAVING...' : 'FINISH →'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
