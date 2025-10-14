import PropTypes from 'prop-types';

const ResultsDisplay = ({ result, onReset }) => {
  if (!result) return null;
  
  const getUrgencyClass = (level) => {
    const classes = {
      low: 'urgency-low',
      medium: 'urgency-medium',
      high: 'urgency-high'
    };
    return classes[level?.toLowerCase()] || 'urgency-medium';
  };
  
  return (
    <div className="results-container">
      <div className="results-header">
        <h2>📋 Analysis Results</h2>
      </div>
      
      {result.disclaimer && (
        <div className="disclaimer-box">
          <div className="disclaimer-icon">⚠️</div>
          <p>{result.disclaimer}</p>
        </div>
      )}
      
      {result.urgencyLevel && (
        <div className={`urgency-badge ${getUrgencyClass(result.urgencyLevel)}`}>
          <strong>Urgency Level:</strong> {result.urgencyLevel.toUpperCase()}
        </div>
      )}
      
      {result.potentialConditions && result.potentialConditions.length > 0 ? (
        <div className="conditions-section">
          <h3>🔍 Potential Conditions</h3>
          {result.potentialConditions.map((cond, idx) => (
            <div key={idx} className="condition-card">
              <div className="condition-header">
                <h4>{cond.conditionName}</h4>
                {cond.matchPercentage && (
                  <span className="match-badge">{cond.matchPercentage}% Match</span>
                )}
              </div>
              
              {cond.reasoning && (
                <div className="condition-section">
                  <strong>Analysis:</strong>
                  <p>{cond.reasoning}</p>
                </div>
              )}
              
              {cond.recommendations && cond.recommendations.length > 0 && (
                <div className="condition-section">
                  <strong>💡 Recommendations:</strong>
                  <ul className="recommendations-list">
                    {cond.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {cond.source && (
                <div className="source-tag">
                  <strong>Source:</strong> {cond.source}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-conditions">
          <div className="no-conditions-icon">🔍</div>
          <p>No specific conditions identified based on available data.</p>
          <p>Please consult a healthcare professional for proper evaluation.</p>
        </div>
      )}
      
      {result.summary && (
        <div className="summary-section">
          <h3>📝 Summary</h3>
          <p className="summary-text">{result.summary}</p>
        </div>
      )}
      
      <div className="results-actions">
        <button onClick={onReset} className="btn-primary">
          ← Check New Symptoms
        </button>
      </div>
    </div>
  );
};

ResultsDisplay.propTypes = {
  result: PropTypes.shape({
    potentialConditions: PropTypes.arrayOf(PropTypes.object),
    summary: PropTypes.string,
    urgencyLevel: PropTypes.string,
    disclaimer: PropTypes.string
  }),
  onReset: PropTypes.func.isRequired
};

export default ResultsDisplay;
