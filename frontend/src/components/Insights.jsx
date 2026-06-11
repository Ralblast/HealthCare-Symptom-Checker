import { useEffect, useState } from 'react';
import { apiGet } from '../utils/api';

const Insights = () => {
  const [stats, setStats] = useState(null);
  const [recentCount, setRecentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [statsRes, historyRes] = await Promise.all([
        apiGet('/api/stats'),
        apiGet('/api/history'),
      ]);
      setStats(statsRes.data);
      setRecentCount(historyRes.count || 0);
    } catch {
      setError('Could not load statistics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load stats once on mount; refreshing afterwards is manual.
  useEffect(() => {
    load();
  }, []);

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <div className="card card--center">
        <div className="spinner" role="status" aria-label="Loading">
          <span className="spinner__ring" />
        </div>
        <p className="loading-sub">Loading statistics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card state-error" role="alert">
        <h2 className="card__title">Couldn’t load statistics</h2>
        <p>{error}</p>
        <button
          className="btn btn--primary"
          onClick={() => {
            setLoading(true);
            load();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const total = stats?.totalQueries || 0;
  const emergencies = stats?.emergencyQueries || 0;
  const emergencyRate = total > 0 ? ((emergencies / total) * 100).toFixed(1) : '0';
  const updated = stats?.timestamp
    ? new Date(stats.timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className="insights">
      <p className="notice">
        <strong>Privacy.</strong> Individual entries are never shown here — this page displays only
        anonymised, aggregate numbers.
      </p>

      <div className="insights__head">
        <h2 className="card__title">System overview</h2>
        <button className="btn btn--ghost btn--sm" onClick={refresh} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat__label">Total queries</span>
          <span className="stat__value mono">{total}</span>
          <span className="stat__foot">since launch</span>
        </div>
        <div className="stat stat--alert">
          <span className="stat__label">Emergency cases</span>
          <span className="stat__value mono">{emergencies}</span>
          <span className="stat__foot">{emergencyRate}% of total</span>
        </div>
        <div className="stat">
          <span className="stat__label">Conditions in DB</span>
          <span className="stat__value mono">{stats?.conditionsCount || 0}</span>
          <span className="stat__foot">knowledge base</span>
        </div>
        <div className="stat">
          <span className="stat__label">Recent activity</span>
          <span className="stat__value mono">{recentCount}</span>
          <span className="stat__foot">last 50 records</span>
        </div>
      </div>

      <div className="card">
        <h3 className="card__subtitle">Details</h3>
        <dl className="kv">
          <div className="kv__row">
            <dt>AI model</dt>
            <dd>Llama 3.3 70B (via Groq)</dd>
          </div>
          <div className="kv__row">
            <dt>Database</dt>
            <dd>MongoDB</dd>
          </div>
          <div className="kv__row">
            <dt>Status</dt>
            <dd>
              <span className="status">
                <span className="status__dot" /> Online
              </span>
            </dd>
          </div>
          <div className="kv__row">
            <dt>Last updated</dt>
            <dd>{updated}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Insights;
