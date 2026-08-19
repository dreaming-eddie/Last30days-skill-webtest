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
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '280px'
        }}>
          <Search
            size={20}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter research topic (e.g. Nvidia earnings, Claude 3.7, React 19, AI video tools)..."
            style={{
              width: '100%',
              padding: '14px 44px 14px 48px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          {topic && (
            <button
              onClick={() => setTopic('')}
              style={{
                position: 'absolute',
                right: '14px',
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
          className="btn-primary"
          style={{ padding: '14px 28px', fontSize: '1rem', whiteSpace: 'nowrap' }}
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              <span>Researching...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run Deep Research</span>
            </>
          )}
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

        {/* Research Depth Profile */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            RESEARCH DEPTH
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setDepth('quick')}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: '6px',
                border: depth === 'quick' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: depth === 'quick' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: depth === 'quick' ? '#67e8f9' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Zap size={14} /> Quick (⚡ Fast)
            </button>
            <button
              onClick={() => setDepth('deep')}
              style={{
                flex: 1,
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                borderRadius: '6px',
                border: depth === 'deep' ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                background: depth === 'deep' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: depth === 'deep' ? '#c084fc' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Sliders size={14} /> Deep (🔍 Multi-Angle)
            </button>
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
