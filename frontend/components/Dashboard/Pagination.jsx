import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ prevLabel, nextLabel, onPrevClick, onNextClick, min, max }) => {
  return (
    <div className="pagination-root">
      <button type="button" onClick={onPrevClick} disabled={!onPrevClick} data-testid="button-prev">
        {prevLabel}
      </button>
      <div className="label" data-testid="label">{`${min} - ${max}`}</div>
      <button type="button" onClick={onNextClick} disabled={!onNextClick} data-testid="button-next">
        {nextLabel}
      </button>
      <style jsx>{`
        .pagination-root {
          display: flex;
          align-items: center;
        }

        .label {
          margin: 0 1rem;
        }
      `}</style>
    </div>
  );
};

Pagination.defaultProps = {
  onPrevClick: null,
  onNextClick: null,
  min: 0,
  max: 0,
};

Pagination.propTypes = {
  prevLabel: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default Pagination;
