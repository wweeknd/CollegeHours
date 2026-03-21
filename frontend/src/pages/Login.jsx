import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PenNibLogo } from '../utils/icons';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let res;
    if (isLogin) {
      res = await login(formData.email, formData.password);
    } else {
      res = await register(formData.name, formData.email, formData.password, formData.role);
    }

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--surface-color)', padding: 48, borderRadius: 20, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        <div style={{ width: 64, height: 64, color: 'var(--primary-color)', marginBottom: 24 }}>
           <PenNibLogo />
        </div>

        <h1 style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8, fontWeight: 700 }}>
           {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 32 }}>
           {isLogin ? 'Access your academic hub' : 'Join the College Hours portal'}
        </p>

        {error && <div style={{ backgroundColor: 'var(--alert-light)', color: 'var(--alert-color)', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, width: '100%' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none' }}
            />
          )}

          <input 
            type="email" 
            placeholder="University Email" 
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none' }}
          />

          <input 
            type="password" 
            placeholder="Password" 
            required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none' }}
          />

          {!isLogin && (
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff' }}
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
             {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
             onClick={() => setIsLogin(!isLogin)} 
             style={{ color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
          >
             {isLogin ? 'Register now.' : 'Sign in.'}
          </span>
        </p>
      </div>
    </div>
  );
}
