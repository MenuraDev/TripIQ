import React, { useEffect, useRef, useState } from 'react';

const avatarButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '4px 6px 4px 4px',
  borderRadius: '999px',
  border: '1px solid rgba(26, 107, 46, 0.12)',
  background: 'rgba(255, 255, 255, 0.92)',
  boxShadow: '0 10px 28px rgba(15, 35, 24, 0.08)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 12px)',
  right: 0,
  width: '250px',
  background: '#ffffff',
  borderRadius: '20px',
  border: '1px solid rgba(26, 107, 46, 0.12)',
  boxShadow: '0 20px 44px rgba(15, 35, 24, 0.14)',
  padding: '12px',
  zIndex: 200
};

const itemBaseStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  border: 'none',
  borderRadius: '14px',
  background: 'transparent',
  color: '#1a2e1a',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left'
};

function MenuItem({ icon, label, onClick, danger = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...itemBaseStyle,
        color: danger ? '#dc2626' : hovered ? '#1a6b2e' : itemBaseStyle.color,
        background: hovered ? (danger ? '#fef2f2' : '#f0f7f0') : 'transparent'
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{icon}</span>
      {label}
    </button>
  );
}

export default function DashboardProfileMenu({
  displayName,
  roleLabel,
  imageSrc,
  onHome,
  onDashboard,
  onProfile,
  onLogout
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleAction = (callback) => {
    setOpen(false);
    callback?.();
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        style={avatarButtonStyle}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={imageSrc}
          alt="Profile"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid white',
            boxShadow: '0 4px 12px rgba(26,107,46,0.15)'
          }}
        />
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#64748b' }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div style={dropdownStyle}>
          <div style={{ padding: '10px 12px 14px', borderBottom: '1px solid #edf4ed', marginBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f2318' }}>{displayName}</div>
            <div style={{ fontSize: '12px', color: '#6b8f6b', marginTop: '4px' }}>{roleLabel}</div>
          </div>

          <MenuItem icon="home" label="Home" onClick={() => handleAction(onHome)} />
          <MenuItem icon="dashboard" label="Dashboard" onClick={() => handleAction(onDashboard)} />
          <MenuItem icon="person" label="Profile" onClick={() => handleAction(onProfile)} />
          <MenuItem icon="logout" label="Logout" onClick={() => handleAction(onLogout)} danger />
        </div>
      )}
    </div>
  );
}
