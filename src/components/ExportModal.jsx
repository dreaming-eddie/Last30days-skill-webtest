import React, { useState } from 'react';
import { X, Copy, Download, FileText, Code, Check } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, data }) {
  const [activeTab, setActiveTab] = useState('md');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  // Generate Markdown report string
  const generateMarkdown = () => {
    let md = `# Research Brief: ${data.query_topic}\n`;
    md += `**Lookback Window:** ${data.window_days || 30} Days | **Date:** ${data.as_of_date || new Date().toISOString().split('T')[0]}\n\n`;
    md += `## Key Findings (${data.findings?.length || 0} items)\n\n`;

    data.findings?.forEach((item, i) => {
      md += `### ${i + 1}. [${item.source?.toUpperCase()}] ${item.title}\n`;
      md += `- **URL:** ${item.url}\n`;
      if (item.published_at) md += `- **Published:** ${item.published_at}\n`;
      if (item.relevance_score) md += `- **Relevance Match:** ${Math.round(item.relevance_score * 100)}%\n`;
      if (item.summary) md += `- **Summary:** ${item.summary}\n`;
      md += `\n`;
    });

    return md;
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const mdStr = generateMarkdown();
  const currentContent = activeTab === 'md' ? mdStr : jsonStr;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'md' ? 'md' : 'json';
    const filename = `${data.query_topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_last30days.${ext}`;
    const blob = new Blob([currentContent], { type: activeTab === 'md' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', padding: '24px', position: 'relative', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Export & Share Findings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <button
            onClick={() => setActiveTab('md')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: activeTab === 'md' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              background: activeTab === 'md' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'md' ? '#a5b4fc' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={16} /> Markdown Brief
          </button>

          <button
            onClick={() => setActiveTab('json')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: activeTab === 'json' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              background: activeTab === 'json' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'json' ? '#a5b4fc' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Code size={16} /> Raw JSON
          </button>
        </div>

        {/* Content Preview */}
        <pre style={{
          maxHeight: '360px',
          overflowY: 'auto',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#e5e7eb',
          whiteSpace: 'pre-wrap',
          marginBottom: '16px'
        }}>
          {currentContent}
        </pre>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <button onClick={handleDownload} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <Download size={16} />
            <span>Download .{activeTab}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
