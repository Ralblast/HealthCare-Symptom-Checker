import { useState } from 'react';
import SymptomInput from './components/SymptomInput';
import ClarificationQuestions from './components/ClarificationQuestions';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import StepIndicator from './components/StepIndicator';
import Insights from './components/Insights';
import { useSymptomChecker } from './hooks/useSymptomChecker';

// Which step the indicator highlights for each state.
const STEP_FOR_STATE = { initial: 1, clarifying: 2, analyzing: 2, results: 3 };

function App() {
  const [tab, setTab] = useState('checker');
  const { state, questions, result, errorMessage, submitSymptom, submitAnswers, reset } =
    useSymptomChecker();

  const showStepper = tab === 'checker' && STEP_FOR_STATE[state];

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <span className="brand">
            <span className="brand__mark" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4v12M4 10h12"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="brand__name">Symptom Checker</span>
          </span>

          <nav className="tabs" aria-label="Sections">
            <button
              className={`tab ${tab === 'checker' ? 'is-active' : ''}`}
              onClick={() => setTab('checker')}
            >
              Checker
            </button>
            <button
              className={`tab ${tab === 'insights' ? 'is-active' : ''}`}
              onClick={() => setTab('insights')}
            >
              Insights
            </button>
          </nav>
        </div>
      </header>

      <main className="page">
        <div className="container">
          {tab === 'insights' ? (
            <Insights />
          ) : (
            <>
              {showStepper && <StepIndicator current={STEP_FOR_STATE[state]} />}

              {state === 'initial' && <SymptomInput onSubmit={submitSymptom} />}

              {state === 'clarifying' && (
                <ClarificationQuestions
                  questions={questions}
                  onSubmit={submitAnswers}
                  onBack={reset}
                />
              )}

              {state === 'analyzing' && (
                <section className="card card--center" aria-live="polite">
                  <LoadingSpinner />
                  <p className="loading-title">Reviewing your symptoms…</p>
                  <p className="loading-sub">This usually takes a few seconds.</p>
                </section>
              )}

              {state === 'results' && <ResultsDisplay result={result} onReset={reset} />}

              {state === 'emergency' && (
                <section className="card emergency" role="alert">
                  <span className="emergency__tag">Possible emergency</span>
                  <p className="emergency__text">{errorMessage}</p>
                  <div className="btn-row">
                    <a href="tel:112" className="btn btn--danger">
                      Call emergency services
                    </a>
                    <button className="btn btn--ghost" onClick={reset}>
                      Start over
                    </button>
                  </div>
                  <p className="hint">
                    If this is life-threatening, call your local emergency number now.
                  </p>
                </section>
              )}

              {state === 'error' && (
                <section className="card state-error" role="alert">
                  <h2 className="card__title">Something went wrong</h2>
                  <p>{errorMessage}</p>
                  <button className="btn btn--primary" onClick={reset}>
                    Try again
                  </button>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            <strong>Medical disclaimer.</strong> This tool gives educational information only and is
            not a substitute for professional diagnosis or treatment. Always consult a qualified
            clinician about your health.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
