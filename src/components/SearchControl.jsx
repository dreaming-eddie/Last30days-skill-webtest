import React from 'react';
import { Search, Sliders, Zap, ShieldAlert, Sparkles, X, CheckSquare, Square } from 'lucide-react';

export default function SearchControl({
  topic,
  setTopic,
  days,
  setDays,
  depth,
  setDepth,
  selectedSources,
  setSelectedSources,
  competitors,
  setCompetitors,
  onSearch,
  isLoading
}) {
  const ALL_SOURCES = [
    { id: 'hackernews', label: 'HackerNews' },
    { id: 'reddit', label: 'Reddit' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'x', label: 'X / Twitter' },
    { id: 'github', label: 'GitHub' },
    { id: 'polymarket', label: 'Polymarket' },
    { id: 'jobs', label: 'Tech Jobs' },
    { id: 'tiktok', label: 'TikTok' }
  ];

  const toggleSource = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter(s => s !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && topic.trim()) {
      onSearch();
    }
  };

  return (
    <div className="glass-bezel-outer" style={{ marginBottom: '24px' }}>
      <div className="glass-bezel-inner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <span className="eyebrow-pill">
            ✨ 14-Channel Autonomous Research Engine
          </span>
          <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✓</span> 한국어 자동 영문 합성 & 다국어 바이링구얼 수집 가동 중
          </span>
        </div>
        
        {/* Search Input Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={20}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="조사할 주제 또는 키워드를 입력하세요 (예: Claude 3.7, Nvidia 실적, DeepSeek V3, React 19)"
              style={{
                width: '100%',
                padding: '16px 44px 16px 52px',
                background: '#ffffff',
                border: '1.5px solid var(--border-glass)',
                borderRadius: '9999px',
                color: '#0f172a',
                fontSize: '1.05rem',
                fontWeight: '600',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 4px 14px rgba(37,99,235,0.06)'
              }}
            />
            {topic && (
              <button
                onClick={() => setTopic('')}
                style={{
                  position: 'absolute',
                  right: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            onClick={onSearch}
            disabled={isLoading || !topic.trim()}
            className="btn-primary-pill"
            style={{ fontSize: '1rem' }}
          >
            <span>{isLoading ? '수집 조사 중...' : '딥 리서치 가동'}</span>
            <span className="btn-icon-circle">
              {isLoading ? <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} /> : <Sparkles size={18} />}
            </span>
          </button>
        </div>

      {/* Advanced Filter Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)'
      }}>
        
        {/* Lookback Window */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            LOOKBACK WINDOW
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[7, 14, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  borderRadius: '6px',
                  border: days === d ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: days === d ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: days === d ? '#818cf8' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Competitor / Versus Comparison */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            VS MODE (OPTIONAL COMPETITORS)
          </label>
          <input
            type="text"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="e.g. Anthropic, OpenAI, DeepSeek"
            style={{
              width: '100%',
              padding: '6px 10px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          />
        </div>

      </div>

      {/* Target Platforms Checkboxes */}
      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
          ACTIVE SOURCES & PLATFORMS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {ALL_SOURCES.map(source => {
            const isSelected = selectedSources.length === 0 || selectedSources.includes(source.id);
            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.3)',
                  border: isSelected ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                  color: isSelected ? 'var(--text-main)' : 'var(--text-dim)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {isSelected ? <CheckSquare size={14} color="var(--primary)" /> : <Square size={14} />}
                <span>{source.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
