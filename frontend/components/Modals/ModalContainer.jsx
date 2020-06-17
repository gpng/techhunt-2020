import React, { useContext, useRef } from 'react';
// contexts
import AppContext, { APP_ACTIONS } from '../Context/App/AppContext';
// components
import Upload from './Upload/Upload';
// utils
import { useOnClickOutside } from '../../utils/hooks';
// constants
import { COLORS } from '../../constants/styles';
import { MODALS } from '../../constants';

const ModalContainer = () => {
  const {
    state: { openModal },
    dispatch,
  } = useContext(AppContext);

  const contentRef = useRef(null);

  useOnClickOutside(contentRef, () => {
    if (openModal) {
      dispatch({ type: APP_ACTIONS.MODAL_OPEN });
    }
  });

  return openModal ? (
    <div className="modal-container-root">
      <section ref={contentRef} className="modal-content">
        {
          {
            [MODALS.UPLOAD_CSV]: <Upload />,
          }[openModal]
        }
      </section>
      <style jsx>{`
        .modal-container-root {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100vw;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: ${COLORS.BACKGROUND_PRIMARY};
          border-radius: 0.4rem;
        }
      `}</style>
    </div>
  ) : null;
};

export default ModalContainer;
