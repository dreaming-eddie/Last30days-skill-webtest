import React from 'react';
import { Zap, Activity, HelpCircle, Flame, ExternalLink } from 'lucide-react';

export default function Header({ onSelectTopic, onOpenDoctor, doctorStatus }) {
  const PRESET_TOPICS = [
    { label: '🔥 Claude 3.7', topic: 'Claude 3.7' },
    { label: '🚀 DeepSeek V3', topic: 'DeepSeek V3' },
    { label: '📈 Nvidia Earnings', topic: 'Nvidia Earnings' },
    { label: '⚛️ React 19', topic: 'React 19' },
    { label: '🎲 Polymarket', topic: 'Polymarket' },
    { label: '💼 AI Agent Startups', topic: 'AI Agent Startups' }
  ];

  return (
    <header className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>last30days</h1>
              <span className="eyebrow-pill">
                <span className="pulse-dot"></span>
                v2.5 Deep Intelligence Engine
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              14대 글로벌 수집 채널 (뉴스, 학술논문, Reddit, GitHub, Bluesky, YouTube, Dev.to, StackOverflow, Wikipedia)
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onOpenDoctor} 
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 14px', color: '#2563eb', borderColor: 'rgba(37, 99, 235, 0.3)', background: '#eff6ff' }}
          >
            <Activity size={16} color="#2563eb" />
            <span>System Health & Patch Notes</span>
          </button>
          
          <a
            href="https://github.com/mvanhorn/last30days-skill"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 14px', textDecoration: 'none' }}
          >
            <Flame size={16} color="#f97316" />
            <span>GitHub Skill</span>
            <ExternalLink size={14} color="var(--text-dim)" />
          </a>
        </div>
      </div>

      {/* Preset Topic Chips */}
      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dim)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Trending Topics:
        </span>
        {PRESET_TOPICS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectTopic(item.topic)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-main)',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              e.currentTarget.style.color = '#a5b4fc';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
