import { useState } from 'react';
import PropTypes from 'prop-types';

const ClarificationQuestions = ({ questions, onSubmit, onBack }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [error, setError] = useState('');
  
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setError('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (answers.some(a => !a.trim())) {
      setError('Please answer all questions');
      return;
    }
    
    const formatted = answers.map((ans, i) => `${questions[i]}: ${ans}`);
    onSubmit(formatted);
  };
  
  return (
    <div className="clarification-container">
      <h2>Additional Information</h2>
      <p>Please answer these questions for better analysis:</p>
      
      <form onSubmit={handleSubmit} className="clarification-form">
        {questions.map((question, index) => (
          <div key={index} className="form-group">
            <label>{index + 1}. {question}</label>
            <textarea
              className="form-textarea"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Your answer..."
              rows="3"
            />
          </div>
        ))}
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-actions">
          {onBack && (
            <button type="button" onClick={onBack} className="btn-secondary">
              Back
            </button>
          )}
          <button type="submit" className="btn-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

ClarificationQuestions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func
};

export default ClarificationQuestions;
