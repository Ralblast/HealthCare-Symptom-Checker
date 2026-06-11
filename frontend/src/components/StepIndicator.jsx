import PropTypes from 'prop-types';

const STEPS = ['Describe', 'Clarify', 'Results'];

// current is 1-based (1 = Describe, 2 = Clarify, 3 = Results).
const StepIndicator = ({ current }) => {
  return (
    <ol className="stepper" aria-label="Progress">
      {STEPS.map((label, i) => {
        const step = i + 1;
        let status = 'upcoming';
        if (step < current) status = 'complete';
        else if (step === current) status = 'current';

        return (
          <li key={label} className={`step is-${status}`}>
            <span className="step__num mono" aria-hidden="true">
              {step}
            </span>
            <span className="step__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

StepIndicator.propTypes = {
  current: PropTypes.number.isRequired,
};

export default StepIndicator;
