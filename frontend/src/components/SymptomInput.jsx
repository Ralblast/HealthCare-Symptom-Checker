import { useState } from 'react';
import PropTypes from 'prop-types';

const SymptomInput = ({ onSubmit }) => {
  const [symptom, setSymptom] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!symptom.trim()) {
      setError('Please describe your symptom');
      return;
    }
    
    if (symptom.trim().length < 3) {
      setError('Please provide more detail (at least 3 characters)');
      return;
    }
    
    if (!agreed) {
      setError('Please agree to the disclaimer');
      return;
    }
    
    onSubmit(symptom.trim());
  };
  
  return (
    <div className="symptom-input-container">
      <h2>Describe Your Symptoms</h2>
      
      <form onSubmit={handleSubmit} className="symptom-form">
        <div className="form-group">
          <label htmlFor="symptom">What symptoms are you experiencing?</label>
          <textarea
            id="symptom"
            className="form-textarea"
            value={symptom}
            onChange={(e) => {
              setSymptom(e.target.value);
              setError('');
            }}
            placeholder="Example: I have a headache and feel tired..."
            rows="5"
            maxLength="500"
          />
          <small>{symptom.length}/500 characters</small>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I understand this is for educational purposes only</span>
          </label>
        </div>
        
        <button type="submit" className="btn-primary" disabled={!symptom.trim() || !agreed}>
          Analyze Symptoms
        </button>
      </form>
    </div>
  );
};

SymptomInput.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default SymptomInput;
