import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Cpu, Terminal, Key, ShieldCheck } from 'lucide-react';

export default function DoctorModal({ isOpen, onClose }) {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/doctor')
        .then(res => res.json())
        .then(data => {
          setDoctorInfo(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Doctor fetch error:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '24px', position: 'relative', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>last30days Doctor & Environment Health</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Checking Python CLI engine & active sources...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Script Status */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={14} /> CLI ENGINE STATUS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                {doctorInfo?.script_exists ? (
                  <CheckCircle size={18} color="#10b981" />
                ) : (
                  <AlertTriangle size={18} color="#f59e0b" />
                )}
                <span>
                  {doctorInfo?.script_exists ? 'CLI Script Verified & Runnable' : 'CLI Script missing, using mock data mode'}
                </span>
              </div>
              <code style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block', wordBreak: 'break-all' }}>
                {doctorInfo?.script_path}
              </code>
            </div>

            {/* Active Sources Health */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} /> CONNECTED PLATFORMS & SEARCH ENGINES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                {doctorInfo?.sources?.map((src, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#fff' }}>{src.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{src.type}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '10px' }}>
                      {src.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional API Keys */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} /> OPTIONAL API KEY ENVIRONMENTS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', fontSize: '0.78rem' }}>
                {Object.entries(doctorInfo?.environment || {}).map(([key, isSet]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isSet ? '#34d399' : 'var(--text-dim)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSet ? '#34d399' : '#6b7280' }} />
                    <span>{key}: {isSet ? 'Configured' : 'Not Set (Keyless)'}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
