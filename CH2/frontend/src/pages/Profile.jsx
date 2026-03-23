import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    phoneNumber: '',
    bio: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData({
        name: data.name || '',
        phoneNumber: data.phoneNumber || '',
        bio: data.bio || '',
        photoURL: data.photoURL || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: '', text: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (upload) => {
      setProfileData(prev => ({ ...prev, photoURL: upload.target.result }));
      setMessage({ type: '', text: '' });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local storage and context
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Keep it in sync
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage({ type: 'error', text: 'Failed to save profile changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
        <div className="login-spinner" style={{ width: 32, height: 32, borderColor: 'var(--border-color)', borderTopColor: 'var(--primary-color)' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>My Profile</h2>
        
        {message.text && (
          <div style={{ 
            padding: '12px 16px', 
            borderRadius: 8, 
            marginBottom: 24, 
            backgroundColor: message.type === 'error' ? 'var(--alert-light)' : 'var(--primary-light)',
            color: message.type === 'error' ? 'var(--alert-color)' : 'var(--primary-hover)',
            fontWeight: 600,
            fontSize: 14
          }}>
            {message.text}
          </div>
        )}

        <div style={{ backgroundColor: 'var(--surface-color)', padding: 32, borderRadius: 16, border: '1px solid var(--border-color)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Avatar Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div 
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                  backgroundColor: profileData.photoURL ? 'transparent' : (user?.avatarBg || '#e2e2e2'), 
                  backgroundImage: profileData.photoURL ? `url(${profileData.photoURL})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '2px dashed var(--border-color)'
                }}
              >
                {!profileData.photoURL && <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.4" style={{width: 48, height: 48}}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Profile Photo</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Recommended size: 256x256px. Max 2MB.</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Upload New
                  </button>
                  {profileData.photoURL && (
                    <button 
                      type="button" 
                      onClick={() => setProfileData(prev => ({ ...prev, photoURL: '' }))}
                      style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: 'var(--alert-color)' }}
                    >
                      Remove
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profileData.name} 
                  onChange={handleChange} 
                  required
                  style={inputStyle} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Email <span style={{color: 'var(--text-muted)', fontWeight: 400}}>(non-editable)</span></label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  style={{...inputStyle, backgroundColor: 'var(--surface-alt)', cursor: 'not-allowed'}} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber" 
                  value={profileData.phoneNumber} 
                  onChange={handleChange} 
                  placeholder="+91..."
                  style={inputStyle} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Role</label>
                <input 
                  type="text" 
                  value={user?.role || ''} 
                  disabled
                  style={{...inputStyle, backgroundColor: 'var(--surface-alt)', cursor: 'not-allowed'}} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Short Bio</label>
              <textarea 
                name="bio"
                value={profileData.bio} 
                onChange={handleChange} 
                placeholder="Tell us a little about yourself..."
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '12px 32px', height: 'auto', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { 
  padding: '12px 16px', 
  borderRadius: 8, 
  border: '1px solid var(--border-color)', 
  backgroundColor: 'var(--surface-color)', 
  color: 'var(--text-primary)',
  fontSize: 14, 
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit'
};
