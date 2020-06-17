import React from 'react';
import PropTypes from 'prop-types';

const IconButton = ({ onClick, icon, width }) => {
  return (
    <button type="button" className="icon-button-root" onClick={onClick}>
      {icon}
      <style jsx>{`
        .icon-button-root {
          padding: 0.2rem;
          border: none;
          border-radius: 0.2rem;
          background: transparent;
          width: ${width};
          height: ${width};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-button-root:hover {
          background: #cccccc;
        }

        .icon-button-root:focus {
          outline: none;
        }
      `}</style>
    </button>
  );
};

IconButton.defaultProps = {
  width: '2rem',
};

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  width: PropTypes.string,
};

export default IconButton;
