import React from 'react';
import PropTypes from 'prop-types';
// constants
import { COLORS } from '../../../constants/styles';

const ArrowDown = ({ fill, width }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width={width}>
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path fill={fill} d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
    </svg>
  );
};

ArrowDown.defaultProps = {
  fill: COLORS.BACKGROUND_DARK_PRIMARY,
  width: '1rem',
};

ArrowDown.propTypes = {
  fill: PropTypes.string,
  width: PropTypes.string,
};

export default ArrowDown;
