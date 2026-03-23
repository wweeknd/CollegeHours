import React, { useState } from 'react';
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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const res = await login(formData.email, formData.password);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
      <div style={{ backgroundColor: 'var(--surface-color)', padding: 48, borderRadius: 20, width: '100%', maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        <div style={{ width: 64, height: 64, color: 'var(--primary-color)', marginBottom: 24 }}>
           <PenNibLogo />
        </div>

        <h1 style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8, fontWeight: 700 }}>
           Welcome Back
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 32 }}>
           Login as Student, Faculty, or Staff
        </p>

        {error && <div style={{ backgroundColor: 'var(--alert-light)', color: 'var(--alert-color)', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, width: '100%', textAlign: 'left' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>University Email</label>
            <input 
              type="email" 
              placeholder="e.g. student@university.edu" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff', fontSize: 14 }}
              disabled={isLoading}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                style={{ padding: 14, paddingRight: 44, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff', width: '100%', fontSize: 14 }}
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.rememberMe}
                onChange={e => setFormData({...formData, rememberMe: e.target.checked})}
                style={{ accentColor: 'var(--primary-color)', width: 16, height: 16, cursor: 'pointer' }}
                disabled={isLoading}
              />
              Remember me
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock: Forgot password link clicked"); }} style={{ fontSize: 13, color: 'var(--primary-color)', fontWeight: 600 }}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: 16, justifyContent: 'center', height: 48, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 15 }}
            disabled={isLoading || !formData.email || !formData.password}
          >
             {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account? {' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
             Register now.
          </Link>
        </p>
      </div>
    </div>
  );
}
