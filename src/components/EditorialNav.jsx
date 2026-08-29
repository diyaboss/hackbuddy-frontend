import { Link, useLocation } from 'react-router-dom';

export default function EditorialNav({ user, onLogout }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="editorial-nav">
      <div className="nav-left">
        <Link to="/" className="brand-mark">HACKBUDDY</Link>
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <a href="#how-it-works" className="nav-link">HOW IT WORKS</a>
            <Link to="/auth" className="nav-link">SIGN IN</Link>
          </>
        ) : (
          <>
            <Link to="/discover" className="nav-link">DISCOVER</Link>
            <Link to="/requests" className="nav-link">REQUESTS</Link>
            <Link to="/matches" className="nav-link">MATCHES</Link>
            <Link to="/setup" className="nav-link">PROFILE</Link>
            <button onClick={onLogout} className="nav-link btn-link">LOGOUT</button>
          </>
        )}
      </div>
    </nav>
  );
}
