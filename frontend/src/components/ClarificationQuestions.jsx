import { useState } from 'react';
import PropTypes from 'prop-types';

const ClarificationQuestions = ({ questions, onSubmit, onBack }) => {
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(''));
  const [error, setError] = useState('');

  const updateAnswer = (index, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answers.some((a) => !a.trim())) {
      setError('Please answer all the questions so the analysis is accurate.');
      return;
    }

    onSubmit(answers.map((answer, i) => `${questions[i]}: ${answer}`));
  };

  return (
    <section className="card">
      <h2 className="card__title">A few quick questions</h2>
      <p className="card__hint">These help narrow down what might be going on.</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {questions.map((question, i) => (
          <div className="field" key={i}>
            <label className="field__label" htmlFor={`q${i}`}>
              <span className="q-num mono">{i + 1}</span> {question}
            </label>
            <textarea
              id={`q${i}`}
              className="textarea"
              value={answers[i]}
              onChange={(e) => updateAnswer(i, e.target.value)}
              placeholder="Your answer"
              rows="2"
            />
          </div>
        ))}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="btn-row">
          {onBack && (
            <button type="button" className="btn btn--ghost" onClick={onBack}>
              Back
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            Continue
          </button>
        </div>
      </form>
    </section>
  );
};

ClarificationQuestions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

export default ClarificationQuestions;
