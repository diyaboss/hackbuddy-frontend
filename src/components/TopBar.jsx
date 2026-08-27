import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function TopBar({ user, onLogout }) {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === '/auth'
  const isNormalUser = user?.role === 'user'
  const onboardingComplete = Boolean(user?.profile_complete)

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="HackBuddy home" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/brand/wehack-logo.webp" alt="WE HACK" style={{ height: '36px', width: 'auto' }} />
        <span className="brand-text">
          <strong>HACKBUDDY</strong>
          <small>TEAMMATE MATCH</small>
        </span>
      </Link>

      {!isHome && isNormalUser && onboardingComplete && (
        <nav className="home-nav" aria-label="App sections">
          <Link to="/discover">Discover</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/matches">Matches</Link>
        </nav>
      )}

      {!isHome && user && !isNormalUser && (
        <div className="status-line">ADMIN</div>
      )}

      {user && (
        <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isNormalUser && onboardingComplete && (
            <Link to="/setup" className="profile-chip">
              <span className="profile-avatar-circle">
                {(user.email || 'H').charAt(0).toUpperCase()}
              </span>
              <b>PROFILE</b>
            </Link>
          )}
          <button className="logout-button secondary-action" onClick={onLogout} style={{ border: 'none', background: 'transparent', color: 'var(--paper-dim)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--paper-dim)'}>
            LOGOUT
          </button>
        </div>
      )}
    </header>
  )
}
