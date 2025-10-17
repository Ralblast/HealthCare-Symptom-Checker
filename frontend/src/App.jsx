import { useState } from 'react';
import SymptomInput from './components/SymptomInput';
import ClarificationQuestions from './components/ClarificationQuestions';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import History from './components/History';
import { apiPost } from './utils/api';

function App() {
  const [activeTab, setActiveTab] = useState('checker');
  const [appState, setAppState] = useState('initial');
  const [initialSymptom, setInitialSymptom] = useState('');
  const [questions, setQuestions] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSymptomSubmit = async (symptom) => {
    setInitialSymptom(symptom);
    setAppState('analyzing');
    setErrorMessage('');
    
    try {
      const data = await apiPost('/api/start-check', { symptom });
      
      if (data.isEmergency) {
        setAppState('emergency');
        setErrorMessage(data.message);
      } else if (data.questions) {
        setQuestions(data.questions);
        setAppState('clarifying');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to connect to server. Please try again.');
      setAppState('error');
    }
  };
  
  const handleAnswersSubmit = async (answers) => {
    setAppState('analyzing');
    const fullContext = `Initial symptom: ${initialSymptom}. Additional details: ${answers.join(' ')}`;
    
    try {
      const data = await apiPost('/api/analyze', { fullContext });
      
      setAnalysisResult(data.data);
      setAppState('results');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to analyze symptoms. Please try again.');
      setAppState('error');
    }
  };
  
  const handleReset = () => {
    setAppState('initial');
    setInitialSymptom('');
    setQuestions([]);
    setAnalysisResult(null);
    setErrorMessage('');
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🏥 Healthcare Symptom Checker</h1>
          <p className="app-subtitle">AI-Powered Medical Analysis Assistant</p>
        </div>
      </header>

      <div className="tab-navigation">
        <button
          onClick={() => {
            setActiveTab('checker');
            handleReset();
          }}
          className={`tab-button ${activeTab === 'checker' ? 'active' : ''}`}
        >
          Symptom Checker
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
        >
          History
        </button>
      </div>
      
      <main className="app-main">
        {activeTab === 'history' ? (
          <History />
        ) : (
          <>
            {appState === 'initial' && (
              <SymptomInput onSubmit={handleSymptomSubmit} />
            )}
            
            {appState === 'clarifying' && (
              <ClarificationQuestions 
                questions={questions} 
                onSubmit={handleAnswersSubmit}
                onBack={handleReset}
              />
            )}
            
            {appState === 'analyzing' && (
              <div className="text-center">
                <LoadingSpinner />
                <p className="loading-text">Analyzing your symptoms...</p>
                <p className="loading-subtext">This may take a few moments</p>
              </div>
            )}
            
            {appState === 'results' && (
              <ResultsDisplay result={analysisResult} onReset={handleReset} />
            )}
            
            {appState === 'emergency' && (
              <div className="emergency-warning">
                <div className="emergency-icon">🚨</div>
                <h2>Emergency Detected</h2>
                <p className="emergency-message">{errorMessage}</p>
                <div className="emergency-actions">
                  <a href="tel:911" className="btn-emergency">Call Emergency</a>
                  <button onClick={handleReset} className="btn-secondary">Go Back</button>
                </div>
              </div>
            )}
            
            {appState === 'error' && (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2>Something Went Wrong</h2>
                <p className="error-message">{errorMessage}</p>
                <button onClick={handleReset} className="btn-primary">Try Again</button>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <p className="disclaimer">
            <strong>⚠️ Medical Disclaimer:</strong> This tool provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p className="footer-info">
            Always seek the advice of your physician or other qualified health provider with any questions about your medical condition.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
