import PropTypes from 'prop-types';

const URGENCY_LEVELS = ['low', 'medium', 'high'];

// Triage gauge — the active level lights up in its own colour, the rest stay
// muted, so urgency reads at a glance.
const TriageMeter = ({ level }) => {
  const active = (level || 'medium').toLowerCase();

  return (
    <div className="triage">
      <span className="triage__label">Urgency</span>
      <div className="meter" role="img" aria-label={`Urgency level: ${active}`}>
        {URGENCY_LEVELS.map((value) => (
          <span
            key={value}
            className={`meter__seg ${value === active ? 'is-on' : ''}`}
            data-level={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};

TriageMeter.propTypes = {
  level: PropTypes.string,
};

const ResultsDisplay = ({ result, onReset }) => {
  if (!result) return null;

  const conditions = result.potentialConditions || [];

  return (
    <section className="results">
      <div className="card">
        <h2 className="card__title">Analysis</h2>
        {result.urgencyLevel && <TriageMeter level={result.urgencyLevel} />}
        {result.disclaimer && <p className="disclaimer-inline">{result.disclaimer}</p>}
      </div>

      {conditions.length > 0 ? (
        <div className="card">
          <h3 className="card__subtitle">Possible conditions</h3>
          <div className="conditions">
            {conditions.map((cond, idx) => (
              <article className="condition" key={idx}>
                <header className="condition__head">
                  <h4 className="condition__name">{cond.conditionName}</h4>
                  {typeof cond.matchPercentage === 'number' && (
                    <span className="match mono">{cond.matchPercentage}%</span>
                  )}
                </header>

                {cond.reasoning && <p className="condition__reason">{cond.reasoning}</p>}

                {cond.recommendations?.length > 0 && (
                  <ul className="reco">
                    {cond.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                )}

                {cond.source && <p className="source">Source: {cond.source}</p>}
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="card empty">
          <p>No specific conditions matched your description.</p>
          <p className="card__hint">
            Please consult a healthcare professional for a proper evaluation.
          </p>
        </div>
      )}

      {result.summary && (
        <div className="card">
          <h3 className="card__subtitle">Summary</h3>
          <p>{result.summary}</p>
        </div>
      )}

      <button className="btn btn--primary" onClick={onReset}>
        Check new symptoms
      </button>
    </section>
  );
};

ResultsDisplay.propTypes = {
  result: PropTypes.shape({
    potentialConditions: PropTypes.arrayOf(PropTypes.object),
    summary: PropTypes.string,
    urgencyLevel: PropTypes.string,
    disclaimer: PropTypes.string,
  }),
  onReset: PropTypes.func.isRequired,
};

export default ResultsDisplay;
