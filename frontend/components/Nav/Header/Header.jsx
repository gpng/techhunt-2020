import React from 'react';
// components
import Avatar from '../../Profile/Avatar';
import DrawerSlider from '../Drawer/DrawerSlider';
// constants
import { COLORS } from '../../../constants/styles';

const Header = () => {
  return (
    <nav className="header-root">
      <DrawerSlider />
      <div className="right-container">
        <span className="name">Ashley</span>
        <Avatar width="2rem" />
      </div>
      <style jsx>{`
        .header-root {
          background: ${COLORS.BACKGROUND_DARK_PRIMARY};
          height: 3rem;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          position: fixed;
          top: 0;
          left: 0;
        }

        .right-container {
          display: flex;
          align-items: center;
        }

        .name {
          margin-right: 1rem;
          color: ${COLORS.TEXT_DARK_PRIMARY};
        }
      `}</style>
    </nav>
  );
};

export default Header;
