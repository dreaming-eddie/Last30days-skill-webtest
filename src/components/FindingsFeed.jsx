import React, { useState } from 'react';
import { ExternalLink, ThumbsUp, MessageCircle, Calendar, Star, Eye, Filter, ArrowUpDown, Search, Copy, Check } from 'lucide-react';

export default function FindingsFeed({ findings, topic }) {
  const [activePlatformFilter, setActivePlatformFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  if (!findings || findings.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>No research findings found. Try a different topic or lookback window.</p>
      </div>
    );
  }

  // Get list of unique platforms present
  const availablePlatforms = ['all', ...new Set(findings.map(f => f.source || 'web'))];

  // Filter & Sort
  let processed = findings.filter(item => {
    if (activePlatformFilter !== 'all' && (item.source || 'web') !== activePlatformFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const summaryMatch = (item.summary || '').toLowerCase().includes(q);
      return titleMatch || summaryMatch;
    }
    return true;
  });

  processed.sort((a, b) => {
    if (sortBy === 'relevance') {
      return (b.relevance_score || 0) - (a.relevance_score || 0);
    } else if (sortBy === 'engagement') {
      const aEng = (a.engagement?.score || a.engagement?.points || a.engagement?.comments || 0);
      const bEng = (b.engagement?.score || b.engagement?.points || b.engagement?.comments || 0);
      return bEng - aEng;
    } else if (sortBy === 'date') {
      return (b.published_at || '').localeCompare(a.published_at || '');
    }
    return 0;
  });

  const copyFindingUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformBadgeClass = (source) => {
    switch (source?.toLowerCase()) {
      case 'hackernews': return 'badge-hackernews';
      case 'reddit': return 'badge-reddit';
      case 'youtube': return 'badge-youtube';
      case 'x':
      case 'twitter': return 'badge-x';
      case 'github': return 'badge-github';
      case 'polymarket': return 'badge-polymarket';
      case 'tiktok': return 'badge-tiktok';
      case 'jobs': return 'badge-jobs';
      default: return 'badge-platform';
    }
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      
      {/* Feed Controls Header */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Platform Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          <Filter size={16} color="var(--text-muted)" style={{ marginRight: '4px' }} />
          {availablePlatforms.map(platform => (
            <button
              key={platform}
              onClick={() => setActivePlatformFilter(platform)}
              style={{
                background: activePlatformFilter === platform ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: activePlatformFilter === platform ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Sort & Quick Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter findings..."
              style={{
                padding: '4px 10px 4px 28px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                outline: 'none',
                width: '150px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ArrowUpDown size={14} />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="relevance">Relevance Score</option>
              <option value="engagement">Engagement</option>
              <option value="date">Published Date</option>
            </select>
          </div>
        </div>

      </div>

      {/* Findings Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {processed.map((item, idx) => {
          const scorePct = Math.round((item.relevance_score || 0.8) * 100);
          const engagement = item.engagement || {};
          const upvotes = engagement.score || engagement.points || engagement.likes || 0;
          const comments = engagement.num_comments || engagement.comments || 0;

          return (
            <div
              key={item.candidate_id || idx}
              className="glass-panel glass-panel-interactive"
              style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={getPlatformBadgeClass(item.source)}>
                    {item.source || 'web'}
                  </span>

                  {item.published_at && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {item.published_at}
                    </span>
                  )}
                </div>

                {/* Relevance score pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Match: {scorePct}%
                  </span>
                  <div style={{ width: '40px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${scorePct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4' }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#f3f4f6', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseOver={(e) => e.target.style.color = '#818cf8'}
                  onMouseOut={(e) => e.target.style.color = '#f3f4f6'}
                >
                  {item.title}
                </a>
              </h3>

              {/* Summary */}
              {item.summary && (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.6' }}>
                  {item.summary}
                </p>
              )}

              {/* Footer Metrics & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '10px' }}>
                
                {/* Engagement stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {upvotes > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                      <ThumbsUp size={14} />
                      <strong>{upvotes.toLocaleString()}</strong>
                    </span>
                  )}
                  {comments > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={14} />
                      <strong>{comments.toLocaleString()}</strong> comments
                    </span>
                  )}
                  {engagement.views && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      {engagement.views.toLocaleString()} views
                    </span>
                  )}
                  {engagement.stars && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c084fc' }}>
                      <Star size={14} />
                      {engagement.stars.toLocaleString()} stars
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => copyFindingUrl(item.url, item.candidate_id || idx)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === (item.candidate_id || idx) ? (
                      <>
                        <Check size={12} color="#10b981" />
                        <span style={{ color: '#10b981' }}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Open Thread</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
