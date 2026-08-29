import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

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
      <div className="auth-scene scene-dark full-bleed">
        <div className="editorial-grid">
          <div className="auth-text">
            <h1 className="display-xl">
              LET'S FIND<br/>THE GAP.
            </h1>
            <p className="metadata" style={{ marginTop: '2rem', color: 'var(--stone-500)' }}>
              ONE SIGN-IN. NO FEED. NO NOISE.<br/>
              We only need enough to help you find a useful teammate.
            </p>
          </div>
          <div className="auth-action">
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
