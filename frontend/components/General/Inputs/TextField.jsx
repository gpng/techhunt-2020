import React from 'react';
import PropTypes from 'prop-types';
// constants
import { COLORS } from '../../../constants/styles';

const TextField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="text-field-root">
      <div className="label">{label}</div>
      <input
        type={type}
        className="input-text"
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        placeholder={placeholder}
      />
      <style jsx>{`
        .text-field-root {
          background: transparent;
        }

        .label {
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }

        .input-text {
          border-radius: 0.2rem;
          border: 1px solid ${COLORS.BACKGROUND_DARK_PRIMARY};
          overflow: hidden;
          padding: 0.2rem 0.5rem;
        }

        .input-text:focus {
          outline-offset: -2px;
          outline: ${COLORS.BACKGROUND_DARK_PRIMARY} auto 1px;
        }
      `}</style>
    </div>
  );
};

TextField.defaultProps = {
  value: '',
  placeholder: '',
  type: 'text',
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['number', 'text']),
};

export default TextField;
