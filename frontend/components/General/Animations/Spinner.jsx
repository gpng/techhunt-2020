import React from 'react';
import PropTypes from 'prop-types';
// constants
import { COLORS } from '../../../constants/styles';

const Spinner = ({ width, fill }) => {
  return (
    <div className="spinner-root">
      <div />
      <div />
      <div />
      <div />
      <style jsx>{`
        .spinner-root {
          display: inline-block;
          position: relative;
          width: ${width};
          height: ${width};
        }
        .spinner-root div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: calc(${width} - 16px);
          height: calc(${width} - 16px);
          margin: 8px;
          border: 8px solid ${fill};
          border-radius: 50%;
          animation: spinner-root 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: ${fill} transparent transparent transparent;
        }
        .spinner-root div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .spinner-root div:nth-child(2) {
          animation-delay: -0.3s;
        }
        .spinner-root div:nth-child(3) {
          animation-delay: -0.15s;
        }
        @keyframes spinner-root {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

Spinner.defaultProps = {
  width: '5rem',
  fill: COLORS.BACKGROUND_DARK_PRIMARY,
};

Spinner.propTypes = {
  width: PropTypes.string,
  fill: PropTypes.string,
};

export default Spinner;
