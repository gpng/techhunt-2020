import React, { useContext } from 'react';
import PropTypes from 'prop-types';
// contexts
import AppContext from '../Context/App/AppContext';
// components
import { Close } from '../General/Icons';
// actions
import { closeModal } from '../../actions/creators';

const ModalLayout = ({ children, title }) => {
  const { dispatch } = useContext(AppContext);

  return (
    <div className="modal-layout-root">
      <button
        type="button"
        className="button-close"
        onClick={() => dispatch(closeModal())}
        data-testid="button-close"
      >
        <Close width="1rem" />
      </button>
      <header>
        <h2 data-testid="title">{title}</h2>
      </header>
      <section className="content">{children}</section>
      <style jsx>{`
        .modal-layout-root {
          position: relative;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          max-width: calc(100vw - 2rem);
        }

        header {
          text-align: center;
        }

        h2 {
          font-size: 1.3rem;
        }

        .button-close {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          height: 2rem;
          width: 2rem;
          padding: 0;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .button-close:hover {
          background: #dddddd;
        }

        .content {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

ModalLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default ModalLayout;
