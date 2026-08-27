import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberWithError,
} from 'libphonenumber-js'
import ThemedSelect from '../components/ThemedSelect'
import { authApi } from '../api/auth'

export default function PhoneView({ user, setUser, showToast }) {
  const navigate = useNavigate()
  const [country, setCountry] = useState('IN')
  const [nationalNumber, setNationalNumber] = useState('')
  const [saving, setSaving] = useState(false)

  const countries = useMemo(() => {
    const names = new Intl.DisplayNames(['en'], { type: 'region' })
    return getCountries()
      .map((iso) => ({
        iso,
        name: names.of(iso) || iso,
        callingCode: `+${getCountryCallingCode(iso)}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const handleNumberChange = (event) => {
    const digitsAndFormatting = event.target.value
    const formatter = new AsYouType(country)
    setNationalNumber(formatter.input(digitsAndFormatting))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    let parsed
    try {
      parsed = parsePhoneNumberWithError(nationalNumber, country)
      if (!parsed.isValid()) throw new Error('Invalid phone')
    } catch {
      showToast('Enter a valid phone number for the selected country.')
      return
    }

    setSaving(true)
    try {
      await authApi.savePhone(nationalNumber, country)

      // Refresh the canonical server-side onboarding state rather than guessing locally.
      const fresh = await authApi.me()
      setUser(fresh.user)

      if (fresh.user.profile_complete) {
        navigate('/discover')
      } else {
        navigate('/setup')
      }
    } catch (err) {
      showToast(err.message || 'Failed to save phone number')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="setup-screen phone-screen">
      <div className="setup-heading">
        <p className="eyebrow">00 / CONTACT</p>
        <h1>
          Your number.
          <br />
          Your call.
        </h1>
        <p className="phone-privacy-copy">
          We keep it private until you choose to share it with a confirmed teammate.
        </p>
      </div>

      <form className="setup-form phone-form" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">CONTACT DETAILS</p>
          <h2 className="phone-form-title">Where should a teammate reach you?</h2>
          <p className="phone-form-copy">
            This is only collected for the Get In Touch flow after you accept a teammate.
          </p>
        </div>

        <div className="field-row phone-field-row">
          <label>
            <span>Country code</span>
            <ThemedSelect
              value={country}
              onChange={(event) => {
                setCountry(event.target.value)
                setNationalNumber('')
              }}
              options={countries.map(item => ({
                value: item.iso,
                label: `${item.name} ${item.callingCode}`
              }))}
            />
          </label>

          <label>
            <span>Phone number</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={nationalNumber}
              onChange={handleNumberChange}
              placeholder="98765 43210"
              required
              disabled={saving}
            />
          </label>
        </div>

        <div className="phone-preview">
          <small>DEFAULT COUNTRY</small>
          <strong>+{getCountryCallingCode(country)}</strong>
          <span>Your number is never shown on Discover or Team Requests.</span>
        </div>

        <div className="form-footer">
          <p>
            <b>Privacy:</b> Contact details only unlock when you explicitly choose
            <b> Get In Touch</b> inside an accepted Match Room.
          </p>
          <button className="primary-action" type="submit" disabled={saving}>
            {saving ? 'SAVING...' : 'CONTINUE →'}
          </button>
        </div>
      </form>
    </section>
  )
}
