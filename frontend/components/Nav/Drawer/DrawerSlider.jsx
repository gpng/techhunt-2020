import React, { useState, useRef } from 'react';
import classNames from 'classnames';
// components
import Drawer from './Drawer';
import { Menu } from '../../General/Icons';
// utils
import { useOnClickOutside } from '../../../utils/hooks';
// constants
import { COLORS } from '../../../constants/styles';

const DrawerSlider = () => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  useOnClickOutside(containerRef, () => {
    if (open) {
      setOpen(false);
    }
  });

  return (
    <div className="drawer-slider-root">
      <button
        type="button"
        className="button-menu"
        onClick={() => setOpen(!open)}
        data-testid="button-menu"
      >
        <Menu width="1rem" fill={COLORS.BACKGROUND_PRIMARY} />
      </button>
      <div
        ref={containerRef}
        className={classNames('drawer-slider-container', {
          'drawer-slider-container--open': open,
        })}
      >
        <Drawer />
      </div>
      <style jsx>{`
        .button-drawer-slider {
        }

        .button-menu {
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
        }

        .drawer-slider-container {
          position: fixed;
          height: 100%;
          width: 12rem;
          top: 0;
          left: 0;
          transform: translateX(-12rem);
          transition: all 0.2s;
        }

        .drawer-slider-container--open {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

export default DrawerSlider;
