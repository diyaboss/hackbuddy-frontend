import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { authApi } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function AuthView({ setUser, showToast }) {
  const navigate = useNavigate()

  const handleSuccess = async (credentialResponse) => {
    try {
      await authApi.googleLogin(credentialResponse.credential)
      const sessionData = await authApi.me()
      const nextUser = sessionData.user
      setUser(nextUser)

      if (nextUser.role === 'admin' || nextUser.role === 'superadmin') {
        navigate('/admin')
      } else if (!nextUser.hasPhoneNumber) {
        navigate('/phone')
      } else if (!nextUser.profile_complete) {
        navigate('/setup')
      } else {
        navigate('/discover')
      }
    } catch (err) {
      showToast(err.message || 'Login failed')
    }
  }

  return (
    <div
      className="auth-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 72px)',
      }}
    >
      <h1 className="hero-title">HACKBUDDY</h1>
      <p style={{ margin: '2rem 0' }}>Sign in to find your team.</p>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => showToast('Google login failed')}
        useOneTap
      />
    </div>
  )
}
