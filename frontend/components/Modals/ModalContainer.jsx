import React, { useContext, useRef } from 'react';
// contexts
import AppContext from '../Context/App/AppContext';
// components
import Upload from './Upload/Upload';
import Delete from './Delete/Delete';
// utils
import { useOnClickOutside } from '../../utils/hooks';
// actions
import { closeModal } from '../../actions/creators';
// constants
import { COLORS } from '../../constants/styles';
import { MODALS } from '../../constants';

const ModalContainer = () => {
  const {
    state: {
      modal: { name },
    },
    dispatch,
  } = useContext(AppContext);

  const contentRef = useRef(null);

  useOnClickOutside(contentRef, () => {
    if (name) {
      dispatch(closeModal());
    }
  });

  return name ? (
    <div className="modal-container-root" data-testid="modal-container-root">
      <section ref={contentRef} className="modal-content" data-testid="modal-content">
        {
          {
            [MODALS.UPLOAD_CSV]: <Upload />,
            [MODALS.DELETE]: <Delete />,
          }[name]
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
