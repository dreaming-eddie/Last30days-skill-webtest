import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchControl from './components/SearchControl';
import AnalyticsSummary from './components/AnalyticsSummary';
import FindingsFeed from './components/FindingsFeed';
import DoctorModal from './components/DoctorModal';
import ExportModal from './components/ExportModal';
import { Download, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState('OpenAI');
  const [days, setDays] = useState(30);
  const [depth, setDepth] = useState('quick');
  const [selectedSources, setSelectedSources] = useState([]);
  const [competitors, setCompetitors] = useState('');
  
  const [resultsData, setResultsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [doctorStatus, setDoctorStatus] = useState(null);

  // Initial load doctor status & default query
  useEffect(() => {
    fetch('/api/doctor')
      .then(res => res.json())
      .then(data => setDoctorStatus(data))
      .catch(err => console.error('Doctor check failed:', err));

    handleSearch('OpenAI', 30, 'quick');
  }, []);

  const handleSearch = (searchTopic = topic, searchDays = days, searchDepth = depth) => {
    if (!searchTopic || !searchTopic.trim()) return;

    setIsLoading(true);
    setError(null);

    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: searchTopic.trim(),
        days: searchDays,
        depth: searchDepth,
        sources: selectedSources,
        competitors: competitors.trim()
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setResultsData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setError('Failed to fetch research results. Please ensure backend server is running.');
        setIsLoading(false);
      });
  };

  const handlePresetSelect = (presetTopic) => {
    setTopic(presetTopic);
    handleSearch(presetTopic, days, depth);
  };

  return (
    <div className="app-container">
      
      {/* Top Navigation Header */}
      <Header
        onSelectTopic={handlePresetSelect}
        onOpenDoctor={() => setIsDoctorOpen(true)}
        doctorStatus={doctorStatus}
      />

      {/* Main Search Control Panel */}
      <SearchControl
        topic={topic}
        setTopic={setTopic}
        days={days}
        setDays={setDays}
        depth={depth}
        setDepth={setDepth}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
        competitors={competitors}
        setCompetitors={setCompetitors}
        onSearch={() => handleSearch(topic, days, depth)}
        isLoading={isLoading}
      />

      {/* Error Alert */}
      {error && (
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', borderColor: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} color="var(--accent-rose)" />
          <span style={{ fontSize: '0.9rem', color: '#fca5a5' }}>{error}</span>
          <button onClick={() => handleSearch(topic, days, depth)} className="btn-secondary" style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Results Header Bar & Export Action */}
      {resultsData && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Research Findings for</span>
              <span style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 10px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                "{resultsData.query_topic}"
              </span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsExportOpen(true)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              <Download size={16} /> Export Findings
            </button>
          </div>
        </div>
      )}

      {/* Analytics Summary */}
      {resultsData && <AnalyticsSummary data={resultsData} />}

      {/* Main Findings Feed */}
      {resultsData && (
        <FindingsFeed
          findings={resultsData.findings}
          topic={resultsData.query_topic}
        />
      )}

      {/* System Doctor Modal */}
      <DoctorModal
        isOpen={isDoctorOpen}
        onClose={() => setIsDoctorOpen(false)}
      />

      {/* Export & Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={resultsData}
      />

    </div>
  );
}
