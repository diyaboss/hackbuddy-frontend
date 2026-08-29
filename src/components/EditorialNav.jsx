import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function EditorialNav({ user, onLogout }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <nav className="editorial-nav">
      <div className="nav-left">
        <Link to="/" className="brand-mark">HACKBUDDY</Link>
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <a href="#how-it-works" className={getLinkClass('#how-it-works')}>HOW IT WORKS</a>
            <Link to="/auth" className={getLinkClass('/auth')}>SIGN IN</Link>
          </>
        ) : (
          <>
            <Link to="/discover" className={getLinkClass('/discover')}>DISCOVER</Link>
            <Link to="/requests" className={getLinkClass('/requests')}>REQUESTS</Link>
            <Link to="/matches" className={getLinkClass('/matches')}>MATCHES</Link>
            <Link to="/profile" className={getLinkClass('/profile')}>PROFILE</Link>
            <button onClick={onLogout} className="nav-link btn-link" style={{ border: 'none', background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, cursor: 'pointer' }}>LOGOUT</button>
          </>
        )}
      </div>
    </nav>
  );
}
