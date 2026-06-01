import { useState } from 'react';

/* ── Spinner ── */
export const Spinner = ({ size = 20, color = 'var(--accent)' }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid rgba(255,255,255,0.1)`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block'
  }} />
);

/* ── Button ── */
export const Button = ({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  onClick,
  type = 'button',
  style = {}
}) => {
  const styles = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'var(--surface2)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'var(--danger-bg)',
      color: 'var(--danger)',
      border: '1px solid rgba(239,68,68,0.3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid transparent',
    }
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)' },
    md: { padding: '10px 20px', fontSize: '14px', borderRadius: 'var(--radius-sm)' },
    lg: { padding: '13px 28px', fontSize: '15px', borderRadius: 'var(--radius)' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...styles[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        ...style
      }}
    >
      {loading && <Spinner size={14} color="currentColor" />}
      {children}
    </button>
  );
};

/* ── Input ── */
export const Input = ({ label, error, id, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>
        {label}
      </label>
    )}
    <input
      id={id}
      style={{
        background: 'var(--surface2)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        color: 'var(--text)',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
      }}
      onFocus={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--accent)'; }}
      onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; }}
      {...props}
    />
    {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
  </div>
);

/* ── Textarea ── */
export const Textarea = ({ label, error, id, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>
        {label}
      </label>
    )}
    <textarea
      id={id}
      rows={3}
      style={{
        background: 'var(--surface2)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        color: 'var(--text)',
        fontSize: 14,
        outline: 'none',
        resize: 'vertical',
        transition: 'border-color 0.2s',
        width: '100%',
      }}
      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
      onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; }}
      {...props}
    />
    {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
  </div>
);

/* ── Select ── */
export const Select = ({ label, error, id, children, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>
        {label}
      </label>
    )}
    <select
      id={id}
      style={{
        background: 'var(--surface2)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        color: 'var(--text)',
        fontSize: 14,
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
      }}
      {...props}
    >
      {children}
    </select>
    {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
  </div>
);

/* ── Alert ── */
export const Alert = ({ type = 'error', children }) => {
  const colors = {
    error: { bg: 'var(--danger-bg)', border: 'rgba(239,68,68,0.3)', color: '#fca5a5' },
    success: { bg: 'var(--done-bg)', border: 'var(--done-border)', color: '#6ee7b7' },
    info: { bg: 'var(--accent-glow)', border: 'rgba(108,99,255,0.3)', color: 'var(--accent-light)' },
  };
  const c = colors[type];
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      fontSize: 14,
      color: c.color,
    }}>
      {children}
    </div>
  );
};

/* ── Modal ── */
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          width: '100%', maxWidth: 480,
          animation: 'fadeIn 0.2s ease',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {title && (
          <h3 style={{ fontFamily: "'Syne', sans-serif", marginBottom: 20, fontSize: 18 }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

/* ── Stage Badge ── */
export const StageBadge = ({ stage }) => {
  const map = {
    todo: { label: 'Todo', color: 'var(--todo)', bg: 'var(--todo-bg)', border: 'var(--todo-border)' },
    in_progress: { label: 'In Progress', color: 'var(--progress)', bg: 'var(--progress-bg)', border: 'var(--progress-border)' },
    done: { label: 'Done', color: 'var(--done)', bg: 'var(--done-bg)', border: 'var(--done-border)' },
  };
  const s = map[stage] || map.todo;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, borderRadius: 100,
      padding: '3px 10px', fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  );
};
