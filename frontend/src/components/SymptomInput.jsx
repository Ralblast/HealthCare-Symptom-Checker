import { useState } from 'react';
import PropTypes from 'prop-types';

const MAX_LENGTH = 500;

const SymptomInput = ({ onSubmit }) => {
  const [symptom, setSymptom] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = symptom.trim();

    if (trimmed.length < 3) {
      setError('Please describe your symptom in a little more detail.');
      return;
    }
    if (!agreed) {
      setError('Please confirm you understand this is educational only.');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <section className="card">
      <h1 className="card__title">Describe your symptoms</h1>
      <p className="card__hint">In your own words — what are you feeling, and for how long?</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="symptom">
            Symptoms
          </label>
          <textarea
            id="symptom"
            className="textarea"
            value={symptom}
            onChange={(e) => {
              setSymptom(e.target.value);
              setError('');
            }}
            placeholder="e.g. I've had a throbbing headache and felt tired since yesterday"
            rows="5"
            maxLength={MAX_LENGTH}
          />
          <div className="field__meta">
            <span className="counter mono">
              {symptom.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <label className="check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>I understand this is for educational purposes and is not medical advice.</span>
        </label>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={!symptom.trim() || !agreed}
        >
          Analyze symptoms
        </button>
      </form>
    </section>
  );
};

SymptomInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SymptomInput;
