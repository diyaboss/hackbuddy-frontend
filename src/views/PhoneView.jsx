import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { authApi } from '../api/auth';

export default function PhoneView({ user, setUser, showToast }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }
    
    const phoneNumber = parsePhoneNumberFromString(formattedPhone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      showToast('Please enter a valid phone number with country code (e.g. +91...)');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.updatePhone(phoneNumber.number);
      setUser(data.user);
      navigate('/setup');
    } catch (err) {
      showToast(err.message || 'Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-scene scene-light full-bleed">
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / 10' }}>
          <h1 className="display-xl">
            YOUR NUMBER.<br/>
            <span style={{ color: 'var(--wine-700)' }}>YOUR CALL.</span>
          </h1>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '4rem' }}>
            <input
              type="tel"
              className="editorial-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              disabled={loading}
              autoFocus
            />
            
            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <button type="submit" className="btn-editorial" disabled={loading}>
                {loading ? 'SAVING...' : 'SAVE NUMBER →'}
              </button>
              <button type="button" className="btn-outline" style={{ padding: '12px', fontFamily: 'var(--font-mono)' }} onClick={() => authApi.logout().then(() => { setUser(null); navigate('/'); })}>
                BACK
              </button>
            </div>
          </form>

          <div style={{ marginTop: '4rem' }}>
            <p className="body-editorial">
              Your number stays private until you explicitly share it with an accepted teammate.
            </p>
            <p className="metadata" style={{ marginTop: '1rem', color: 'var(--stone-500)' }}>
              PRIVATE BY DEFAULT / GET IN TOUCH IS EXPLICIT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
