import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { PuzzleSlot } from '../components/TechObjects';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AuthView({ setUser, showToast }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const data = await authApi.googleLogin(credentialResponse.credential);
      setUser(data.user);
      
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        navigate('/admin');
      } else if (!data.user.hasPhoneNumber) {
        navigate('/phone');
      } else if (!data.user.profile_complete) {
        navigate('/setup');
      } else {
        navigate('/discover');
      }
    } catch (error) {
      showToast(error.message || 'Login failed');
    }
  };

  const handleError = () => {
    showToast('Google Sign-In failed');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="auth-scene scene-dark full-bleed" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5vw', top: '20vh', opacity: 0.3, transform: 'scale(3) rotate(-15deg)', pointerEvents: 'none' }}>
           <PuzzleSlot />
        </div>
        <div className="editorial-grid" style={{ height: '100svh', alignItems: 'center' }}>
          <div style={{ gridColumn: '1 / 9' }}>
            <h1 className="display-xl" style={{ fontSize: 'clamp(5rem, 12vw, 15rem)', lineHeight: 0.85, color: 'var(--cream-50)' }}>
              LET'S FIND<br/>THE GAP.
            </h1>
          </div>
          <div style={{ gridColumn: '10 / -1', alignSelf: 'end', paddingBottom: '15vh' }}>
            <p className="metadata" style={{ marginBottom: '2rem', color: 'var(--stone-500)', maxWidth: '280px' }}>
              ONE SIGN-IN. NO FEED. NO NOISE. WE ONLY NEED ENOUGH TO HELP YOU FIND A USEFUL TEAMMATE.
            </p>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap={false}
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
