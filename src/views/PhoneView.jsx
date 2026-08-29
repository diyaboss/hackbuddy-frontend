import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberWithError
} from 'libphonenumber-js';
import { authApi } from '../api/auth';
import { CableConnector } from '../components/TechObjects';

export default function PhoneView({ setUser, showToast }) {
  const [country, setCountry] = useState('IN');
  const [nationalNumber, setNationalNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const countries = useMemo(() => {
    const names = new Intl.DisplayNames(['en'], { type: 'region' });
    return getCountries()
      .map((iso) => ({
        iso,
        name: names.of(iso) || iso,
        callingCode: `+${getCountryCallingCode(iso)}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleNumberChange = (event) => {
    const digitsAndFormatting = event.target.value;
    const formatter = new AsYouType(country);
    setNationalNumber(formatter.input(digitsAndFormatting));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let parsed;
    try {
      parsed = parsePhoneNumberWithError(nationalNumber, country);
      if (!parsed.isValid()) throw new Error('Invalid phone');
    } catch {
      showToast('Enter a valid phone number for the selected country.');
      return;
    }

    setSaving(true);
    try {
      await authApi.savePhone(nationalNumber, country);
      const fresh = await authApi.me();
      setUser(fresh.user);

      if (fresh.user.profile_complete) {
        navigate('/discover');
      } else {
        navigate('/setup');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="phone-scene scene-light full-bleed" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10vh', left: '-5vw', opacity: 0.1, transform: 'scale(4)' }}>
        <CableConnector />
      </div>
      <div className="editorial-grid">
        <div style={{ gridColumn: '1 / 9', zIndex: 2 }}>
          <h1 className="display-xl" style={{ fontSize: 'clamp(5rem, 10vw, 12rem)' }}>
            YOUR NUMBER.<br/>
            <span style={{ color: 'var(--wine-700)' }}>YOUR CALL.</span>
          </h1>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '10vh' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', borderBottom: '2px solid var(--ink-950)', paddingBottom: '1rem' }}>
              <select 
                style={{ width: '150px', background: 'transparent', border: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--section-text)', outline: 'none' }}
                value={country}
                onChange={(e) => { setCountry(e.target.value); setNationalNumber(''); }}
              >
                {countries.map(c => (
                  <option key={c.iso} value={c.iso}>{c.iso} {c.callingCode}</option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                style={{ flex: 1, background: 'transparent', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 'var(--section-text)', outline: 'none' }}
                value={nationalNumber}
                onChange={handleNumberChange}
                placeholder="98765 43210"
                required
                disabled={saving}
                autoFocus
              />
            </div>
            
            <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="submit" className="btn-editorial" disabled={saving}>
                {saving ? 'SAVING...' : 'SAVE NUMBER →'}
              </button>
              <button type="button" className="btn-outline" style={{ padding: '12px 24px', fontFamily: 'var(--font-mono)', fontSize: 'var(--button)' }} onClick={() => authApi.logout().then(() => { setUser(null); navigate('/'); })}>
                BACK
              </button>
            </div>
          </form>
        </div>
        
        <div style={{ gridColumn: '10 / -1', alignSelf: 'end', paddingBottom: '15vh', zIndex: 2 }}>
          <div style={{ padding: '2rem', border: '1px solid var(--ink-950)', background: 'var(--cream-50)' }}>
            <p className="body-editorial" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              Your number stays private until you explicitly share it with an accepted teammate.
            </p>
            <p className="metadata" style={{ color: 'var(--stone-500)' }}>
              PRIVATE BY DEFAULT / GET IN TOUCH IS EXPLICIT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
