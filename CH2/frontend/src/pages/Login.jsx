import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { PenNibLogo } from '../utils/icons';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function Login() {
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    const res = await login(formData.email, formData.password);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email) => {
    setError('');
    setIsLoading(true);
    const res = await login(email, 'demo123');
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setSocialLoading(provider);
    const res = await socialLogin(provider);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
    setSocialLoading('');
  };

  return (
    <div className="login-page" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease' }}>
      {/* Left Panel - Branding */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          {/* Floating decorative elements */}
          <div className="login-float-shape shape-1" />
          <div className="login-float-shape shape-2" />
          <div className="login-float-shape shape-3" />
          
          <div className="login-logo-wrap">
            <PenNibLogo />
          </div>
          <h1 className="login-brand-title">College Hours</h1>
          <p className="login-brand-tagline">The Mindful Scholar</p>
          
          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </div>
              <span>Real-time Announcements</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span>Deadline Tracking</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span>Faculty Connect</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span>Event Management</span>
            </div>
          </div>

          <div className="login-testimonial">
            <p>"College Hours has transformed how our department communicates. Everything in one place."</p>
            <div className="login-testimonial-author">
              <div className="login-testimonial-avatar">DS</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Dr. Smith</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Computer Science Dept.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div className="login-form-header">
            <div className="login-mobile-logo">
              <PenNibLogo />
            </div>
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">Sign in to your College Hours account</p>
          </div>

          {error && (
            <div className="login-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label">University Email</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon"><MailIcon /></span>
                <input 
                  id="login-email"
                  type="email" 
                  placeholder="student@university.edu" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="login-input"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon"><LockIcon /></span>
                <input 
                  id="login-password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="login-input has-toggle"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="login-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={formData.rememberMe}
                  onChange={e => setFormData({...formData, rememberMe: e.target.checked})}
                  className="login-checkbox"
                  disabled={isLoading}
                />
                <span className="login-checkmark" />
                Remember me
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset coming soon!"); }} className="login-forgot-link">
                Forgot password?
              </a>
            </div>

            <button 
              id="login-submit"
              type="submit" 
              className="login-submit-btn"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button type="button" onClick={() => handleDemoLogin('student@demo.edu')} style={demoBtnStyle} disabled={isLoading}>Demo Student</button>
              <button type="button" onClick={() => handleDemoLogin('faculty@demo.edu')} style={demoBtnStyle} disabled={isLoading}>Demo Faculty</button>
              <button type="button" onClick={() => handleDemoLogin('staff@demo.edu')} style={demoBtnStyle} disabled={isLoading}>Demo Staff</button>
            </div>
          </form>

          <div className="login-divider">
            <span>or continue with</span>
          </div>

          <div className="login-social-row">
            <button className="login-social-btn" onClick={() => handleSocialLogin('google')} disabled={!!socialLoading || isLoading}>
              {socialLoading === 'google' ? (
                <span className="login-spinner" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--text-primary)', width: 16, height: 16 }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Google
            </button>
          </div>

          <p className="login-register-link">
            Don't have an account? {' '}
            <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const demoBtnStyle = {
  flex: 1,
  padding: '8px 4px',
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--primary-color)',
  backgroundColor: 'var(--primary-light)',
  border: '1px solid currentColor',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s'
};
