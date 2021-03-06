import React from 'react';
import PropTypes from 'prop-types';
// components
import { COLORS } from '../../constants/styles';

const Avatar = ({ width }) => {
  return (
    <div className="avatar-root">
      <img src="/static/images/avatar_default.svg" alt="" />
      <style jsx>{`
        .avatar-root {
          width: ${width};
          height: ${width};
          border-radius: 50%;
          background: ${COLORS.BACKGROUND_PRIMARY};
          border: 2px solid ${COLORS.BACKGROUND_DARK_SECONDARY};
        }

        .avatar-root > img {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

Avatar.defaultProps = {
  width: '6rem',
};

Avatar.propTypes = {
  width: PropTypes.string,
};

export default Avatar;
