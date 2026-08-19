import React from 'react';
import { BarChart3, MessageSquare, TrendingUp, Cpu, Award } from 'lucide-react';

export default function AnalyticsSummary({ data }) {
  if (!data || !data.findings) return null;

  const findings = data.findings;
  const totalCount = findings.length;

  // Platform count distribution
  const platformCounts = {};
  findings.forEach(item => {
    const src = item.source || 'web';
    platformCounts[src] = (platformCounts[src] || 0) + 1;
  });

  const platformColors = {
    hackernews: '#ff6600',
    reddit: '#ff4500',
    youtube: '#ff3333',
    x: '#38bdf8',
    github: '#c084fc',
    polymarket: '#60a5fa',
    tiktok: '#22d3ee',
    jobs: '#34d399',
    grounding: '#818cf8'
  };

  // Find top score item
  const topFinding = [...findings].sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))[0];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      
      {/* Total Overview Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            RESEARCH METRICS
          </span>
          <MessageSquare size={18} color="var(--primary)" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff' }}>
            {totalCount}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Discussions Analyzed
          </span>
        </div>
        
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Lookback Window: <strong style={{ color: '#a5b4fc' }}>{data.window_days || 30} Days</strong> • Schema: {data.schema_version || '1.2'}
        </div>

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={14} color="#f59e0b" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Top Match: {topFinding?.title ? `"${topFinding.title.slice(0, 45)}..."` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Platform Distribution Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            PLATFORM BREAKDOWN
          </span>
          <BarChart3 size={18} color="var(--accent-cyan)" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(platformCounts).map(([platform, count]) => {
            const pct = Math.round((count / totalCount) * 100);
            const color = platformColors[platform] || '#9ca3af';
            return (
              <div key={platform}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '2px' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '600', color: color }}>
                    {platform}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {count} ({pct}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sentiment & Executive Digest */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            EXECUTIVE DIGEST & SENTIMENT
          </span>
          <TrendingUp size={18} color="var(--accent-emerald)" />
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
            High Engagement
          </span>
          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
            Developer Consensus
          </span>
          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
            Market Attention
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Discussions across targeted communities highlight key developments around <strong style={{ color: '#fff' }}>{data.query_topic}</strong> with focus on production reliability, benchmark score comparisons, and executive strategy.
        </p>
      </div>

    </div>
  );
}
