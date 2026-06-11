import { useState } from 'react';
import { apiPost } from '../utils/api';

// Holds the whole checker flow in one place so App just renders the current
// state. States: initial -> clarifying -> analyzing -> results
// (or emergency / error at any point).
export function useSymptomChecker() {
  const [state, setState] = useState('initial');
  const [initialSymptom, setInitialSymptom] = useState('');
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const submitSymptom = async (symptom) => {
    setInitialSymptom(symptom);
    setErrorMessage('');
    setState('analyzing');

    try {
      const data = await apiPost('/api/start-check', { symptom });

      if (data.isEmergency) {
        setErrorMessage(data.message);
        setState('emergency');
      } else if (data.questions) {
        setQuestions(data.questions);
        setState('clarifying');
      } else {
        throw new Error('Unexpected response from the server.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not reach the server. Please try again.');
      setState('error');
    }
  };

  const submitAnswers = async (answers) => {
    setState('analyzing');
    const fullContext = `Initial symptom: ${initialSymptom}. Additional details: ${answers.join(' ')}`;

    try {
      const data = await apiPost('/api/analyze', { fullContext });
      setResult(data.data);
      setState('results');
    } catch (err) {
      setErrorMessage(err.message || 'Could not analyze your symptoms. Please try again.');
      setState('error');
    }
  };

  const reset = () => {
    setState('initial');
    setInitialSymptom('');
    setQuestions([]);
    setResult(null);
    setErrorMessage('');
  };

  return { state, questions, result, errorMessage, submitSymptom, submitAnswers, reset };
}
