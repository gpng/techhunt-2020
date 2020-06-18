import React from 'react';
import PropTypes from 'prop-types';
// constants
import { COLORS } from '../../../constants/styles';

const ArrowUp = ({ fill, width }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width={width}>
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path fill={fill} d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    </svg>
  );
};

ArrowUp.defaultProps = {
  fill: COLORS.BACKGROUND_DARK_PRIMARY,
  width: '1rem',
};

ArrowUp.propTypes = {
  fill: PropTypes.string,
  width: PropTypes.string,
};

export default ArrowUp;
