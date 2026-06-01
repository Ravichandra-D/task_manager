import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/UI';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const data = await registerApi(form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.08) 0%, var(--bg) 70%)'
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '40px 36px',
        boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.4s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--accent-glow)',
            border: '1px solid rgba(108,99,255,0.3)', borderRadius: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, fontSize: 22
          }}>⚡</div>
          <h1 style={{ fontSize: 24, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Get started with TaskFlow</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {apiError && <Alert type="error">{apiError}</Alert>}
          <Input
            id="name" label="Full Name" type="text" placeholder="Jane Doe"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            error={errors.name} autoComplete="name"
          />
          <Input
            id="email" label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            error={errors.email} autoComplete="email"
          />
          <Input
            id="password" label="Password" type="password" placeholder="Min. 6 characters"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            error={errors.password} autoComplete="new-password"
          />
          <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: 8 }}>
            Create Account
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 14 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
