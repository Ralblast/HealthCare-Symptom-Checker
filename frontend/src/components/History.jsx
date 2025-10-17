import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

export default function History() {
  const [stats, setStats] = useState(null);
  const [recentCount, setRecentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsData, historyData] = await Promise.all([
        apiGet('/api/stats'),
        apiGet('/api/history')
      ]);
      
      setStats(statsData.data);
      setRecentCount(historyData.count || 0);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Statistics</h2>
        <p className="error-message">{error}</p>
        <button onClick={fetchStats} className="btn-primary">Try Again</button>
      </div>
    );
  }

  const emergencyRate = stats?.totalQueries > 0 
    ? ((stats.emergencyQueries / stats.totalQueries) * 100).toFixed(1)
    : 0;

  return (
    <div className="analytics-container">
      
        <div className="analytics-disclaimer">
         <div className="disclaimer-header">
            <span className="lock-icon">🔒</span>
            <span className="disclaimer-title">Privacy Notice</span>
        </div>
           <p className="disclaimer-text">
            Individual patient data is never publicly accessible and remains secure in the database.
            <br/>
            This dashboard displays only aggregated, anonymized statistics for demonstration purposes.
           </p>
        </div>


      <div className="analytics-header">
        <h2 className="analytics-title">System Overview</h2>
        <button 
          onClick={refreshStats} 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          disabled={refreshing}
        >
          {refreshing ? '↻ Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      <div className="stats-grid">
        
        <div className="stat-card blue">
          <div className="stat-label">Total Queries</div>
          <div className="stat-value">{stats?.totalQueries || 0}</div>
          <div className="stat-footer">Since launch</div>
        </div>

        <div className="stat-card red">
          <div className="stat-label">Emergency Cases</div>
          <div className="stat-value">{stats?.emergencyQueries || 0}</div>
          <div className="stat-footer">{emergencyRate}% of total</div>
        </div>

        <div className="stat-card green">
          <div className="stat-label">Conditions Database</div>
          <div className="stat-value">{stats?.conditionsCount || 0}</div>
          <div className="stat-footer">Medical conditions</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-label">Recent Activity</div>
          <div className="stat-value">{recentCount}</div>
          <div className="stat-footer">Last 50 records</div>
        </div>

      </div>

      <div className="info-section">
        <h3 className="info-title">System Details</h3>
        
        <div className="info-list">
          <div className="info-row">
            <span className="info-key">AI Model</span>
            <span className="info-value">Grok (xAI)</span>
          </div>
          
          <div className="info-row">
            <span className="info-key">Database</span>
            <span className="info-value">MongoDB Atlas</span>
          </div>
          
          <div className="info-row">
            <span className="info-key">System Status</span>
            <span className="info-value status-online">
              <span className="status-indicator"></span>
              Online
            </span>
          </div>
          
          <div className="info-row">
            <span className="info-key">Last Updated</span>
            <span className="info-value">
              {new Date(stats?.timestamp).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h3 className="features-title">What This System Does</h3>
        
        <div className="feature-grid">
          
          <div className="feature-box">
            <div className="feature-emoji">🤖</div>
            <h4>AI Analysis</h4>
            <p>Analyzes symptoms using advanced AI to suggest possible conditions</p>
          </div>

          <div className="feature-box">
            <div className="feature-emoji">🚨</div>
            <h4>Emergency Detection</h4>
            <p>Automatically identifies critical symptoms that need immediate care</p>
          </div>

          <div className="feature-box">
            <div className="feature-emoji">🔐</div>
            <h4>Privacy Protected</h4>
            <p>All data is anonymized and stored securely with no personal info</p>
          </div>

          <div className="feature-box">
            <div className="feature-emoji">⚡</div>
            <h4>Fast Response</h4>
            <p>Get instant analysis results powered by cloud infrastructure</p>
          </div>

        </div>
      </div>

    </div>
  );
}
