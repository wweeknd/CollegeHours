import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenNibLogo } from '../utils/icons';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

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

const FileUploadPlaceholder = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--surface-color)', cursor: 'pointer', transition: 'all 0.2s', marginTop: 8 }}>
     <div style={{ width: 48, height: 48, borderRadius: '24px', backgroundColor: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        <UserIcon />
     </div>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Upload Profile Photo</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG up to 2MB (Optional)</span>
     </div>
  </div>
);

const MultiSelectAutocomplete = ({ options, selected, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableOptions = options.filter(
    (opt) => !selected.includes(opt) && opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleAdd = (option) => {
    if (!selected.includes(option)) {
      onChange([...selected, option]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemove = (option) => {
    onChange(selected.filter((s) => s !== option));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
        const matched = options.find(o => o.toLowerCase() === val.toLowerCase());
        handleAdd(matched || val);
      }
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selected.map((option) => (
            <div
              key={option}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: 'var(--primary-color)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {option}
              <button
                type="button"
                onClick={() => handleRemove(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: 0,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  opacity: 0.8,
                  background: 'none',
                  border: 'none'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Start typing to add a subject... (Press Enter)"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff', fontSize: 14, width: '100%', boxSizing: 'border-box' }}
          disabled={false}
        />
        
        {showSuggestions && availableOptions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 10
          }}>
            {availableOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleAdd(option)}
                style={{
                  padding: '10px 14px',
                  fontSize: 14,
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--surface-alt)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-alt)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Register() {
  const [role, setRole] = useState('Student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    termsAccepted: false,
    
    // Student specifics
    studentId: '',
    department: '',
    year: '',
    section: '',

    // Faculty specifics
    employeeId: '',
    facDepartment: '',
    subjects: [],

    // Staff specifics
    staffId: '',
    staffOffice: '',
    staffDesignation: '',
    staffCustomDesignation: ''
  });

  const departmentOptions = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sectionOptions = ['A', 'B', 'C'];
  const subjectOptions = [
    'Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks', 
    'Software Engineering', 'AI', 'Machine Learning', 'Mathematics', 'Physics'
  ];

  const staffDesignations = [
    'Placement Officer', 'Placement Head', 'Transport Incharge', 'Librarian', 
    'Examination Cell', 'Accounts Office', 'Administrative Staff', 'Lab Staff', 'Other'
  ];

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    // Clear role specific data when switching roles
    setFormData(prev => ({
      ...prev,
      studentId: '', department: '', year: '', section: '',
      employeeId: '', facDepartment: '', subjects: [],
      staffId: '', staffOffice: '', staffDesignation: '', staffCustomDesignation: ''
    }));
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.confirmPassword && formData.phoneNumber && formData.termsAccepted && (
    role === 'Student' ? (formData.studentId && formData.department && formData.year && formData.section) :
    role === 'Faculty' ? (formData.employeeId && formData.facDepartment && formData.subjects.length > 0) :
    (formData.staffId && formData.staffOffice && formData.staffDesignation && (formData.staffDesignation !== 'Other' || formData.staffCustomDesignation))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Custom Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (role === 'Faculty' && formData.subjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }

    setIsLoading(true);

    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const res = await register(formData.name, formData.email, formData.password, role);
    
    if (res.success) {
      setSuccess(`${role} account successfully created! Redirecting...`);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(res.message || "Registration failed. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ backgroundColor: 'var(--surface-color)', padding: '48px 40px', borderRadius: 24, width: '100%', maxWidth: 640, boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, color: 'var(--primary-color)', marginBottom: 20 }}>
             <PenNibLogo />
          </div>
          <h1 style={{ fontSize: 28, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 700 }}>
             Create an Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
             Join the College Hours portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--surface-alt)', padding: 6, borderRadius: 14, marginBottom: 32 }}>
          {['Student', 'Faculty', 'Staff'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: role === r ? 'var(--surface-color)' : 'transparent',
                color: role === r ? 'var(--primary-color)' : 'var(--text-secondary)',
                boxShadow: role === r ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {error && <div style={{ backgroundColor: 'var(--alert-light)', color: 'var(--alert-color)', padding: '14px 16px', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 500 }}>{error}</div>}
        {success && <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-hover)', padding: '14px 16px', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Section: Basic Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Personal Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Full Name *</label>
                <input type="text" placeholder="e.g. John Doe" required value={formData.name} onChange={e => updateForm('name', e.target.value)} style={inputStyle} disabled={isLoading} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Phone Number *</label>
                <input type="tel" placeholder="+1 (555) 000-0000" required value={formData.phoneNumber} onChange={e => updateForm('phoneNumber', e.target.value)} style={inputStyle} disabled={isLoading} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>University Email *</label>
              <input type="email" placeholder="email@university.edu" required value={formData.email} onChange={e => updateForm('email', e.target.value)} style={inputStyle} disabled={isLoading} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>We'll send important academic updates here.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Password *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" required value={formData.password} onChange={e => updateForm('password', e.target.value)} style={{...inputStyle, paddingRight: 40, width: '100%'}} disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, color: 'var(--text-muted)' }}><EyeIcon /></button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Confirm Password *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" required value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} style={{...inputStyle, paddingRight: 40, width: '100%'}} disabled={isLoading} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: 12, color: 'var(--text-muted)' }}><EyeIcon /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Role Specific Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Academic Details</h3>
            
            {role === 'Student' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Roll Number / ID *</label>
                    <input type="text" placeholder="e.g. 23XXBXX001" required value={formData.studentId} onChange={e => updateForm('studentId', e.target.value)} style={inputStyle} disabled={isLoading} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Department *</label>
                    <div style={{ position: 'relative' }}>
                      <select required value={formData.department} onChange={e => updateForm('department', e.target.value)} style={{...selectStyle, width: '100%', color: formData.department ? 'inherit' : 'var(--text-muted)'}} disabled={isLoading}>
                        <option value="" disabled>Select Department</option>
                        {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Year *</label>
                    <select required value={formData.year} onChange={e => updateForm('year', e.target.value)} style={{...selectStyle, color: formData.year ? 'inherit' : 'var(--text-muted)'}} disabled={isLoading}>
                      <option value="" disabled>Select Year</option>
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Section *</label>
                    <select required value={formData.section} onChange={e => updateForm('section', e.target.value)} style={{...selectStyle, color: formData.section ? 'inherit' : 'var(--text-muted)'}} disabled={isLoading}>
                      <option value="" disabled>Select Section</option>
                      {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {role === 'Faculty' && (
              <>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', backgroundColor: 'var(--surface-alt)', padding: '12px 16px', borderRadius: 8, margin: 0 }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Note:</span> Additional designations (Placement Officer, HOD, etc.) will be assigned by administration post-registration.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Employee ID *</label>
                    <input type="text" placeholder="e.g. FAC2024" required value={formData.employeeId} onChange={e => updateForm('employeeId', e.target.value)} style={inputStyle} disabled={isLoading} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Department *</label>
                    <select required value={formData.facDepartment} onChange={e => updateForm('facDepartment', e.target.value)} style={{...selectStyle, color: formData.facDepartment ? 'inherit' : 'var(--text-muted)'}} disabled={isLoading}>
                      <option value="" disabled>Select Department</option>
                      {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Teaching Subjects (Select or enter multiple) *</label>
                  <MultiSelectAutocomplete 
                    options={subjectOptions} 
                    selected={formData.subjects} 
                    onChange={(newSelection) => updateForm('subjects', newSelection)}
                  />
                </div>
              </>
            )}

            {role === 'Staff' && (
              <>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', backgroundColor: 'var(--surface-alt)', padding: '12px 16px', borderRadius: 8, margin: 0 }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Note:</span> Administrative and non-teaching institutional roles can register here. Access privileges are assigned later.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Employee ID / Staff ID *</label>
                    <input type="text" placeholder="e.g. STF2024" required value={formData.staffId} onChange={e => updateForm('staffId', e.target.value)} style={inputStyle} disabled={isLoading} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Office / Unit / Division *</label>
                    <input type="text" placeholder="e.g. Main Transport Office" required value={formData.staffOffice} onChange={e => updateForm('staffOffice', e.target.value)} style={inputStyle} disabled={isLoading} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: formData.staffDesignation === 'Other' ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Designation *</label>
                    <select required value={formData.staffDesignation} onChange={e => updateForm('staffDesignation', e.target.value)} style={{...selectStyle, color: formData.staffDesignation ? 'inherit' : 'var(--text-muted)'}} disabled={isLoading}>
                      <option value="" disabled>Select Designation</option>
                      {staffDesignations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  
                  {formData.staffDesignation === 'Other' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Custom Designation *</label>
                      <input type="text" placeholder="e.g. Network Administrator" required value={formData.staffCustomDesignation} onChange={e => updateForm('staffCustomDesignation', e.target.value)} style={inputStyle} disabled={isLoading} />
                    </div>
                  )}
                </div>
              </>
            )}
            
            <FileUploadPlaceholder />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16 }}>
            <input 
              type="checkbox" 
              checked={formData.termsAccepted}
              onChange={e => updateForm('termsAccepted', e.target.checked)}
              style={{ accentColor: 'var(--primary-color)', width: 18, height: 18, marginTop: 2, cursor: 'pointer' }}
              id="terms"
              disabled={isLoading}
            />
            <label htmlFor="terms" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, cursor: 'pointer' }}>
              I agree to the <a href="#" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Privacy Policy</a>.
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: 8, justifyContent: 'center', height: 52, opacity: (isLoading || !isFormValid) ? 0.6 : 1, cursor: (isLoading || !isFormValid) ? 'not-allowed' : 'pointer', fontSize: 15 }}
            disabled={isLoading || !isFormValid}
          >
             {isLoading ? 'Creating Account...' : `Register as ${role}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account? {' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
             Sign in.
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = { padding: 14, borderRadius: 10, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff', fontSize: 14, transition: 'border-color 0.2s' };
const selectStyle = { padding: 14, borderRadius: 10, border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#fff', fontSize: 14, cursor: 'pointer', appearance: 'none', backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%239c9893" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '40px' };
