import React from 'react';
import PropTypes from 'prop-types';
// constants
import { COLORS } from '../../constants/styles';

const Menu = ({ fill, width }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width={width}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill={fill} />
    </svg>
  );
};

Menu.defaultProps = {
  fill: COLORS.BACKGROUND_DARK_PRIMARY,
  width: '1rem',
};

Menu.propTypes = {
  fill: PropTypes.string,
  width: PropTypes.string,
};

export default Menu;
