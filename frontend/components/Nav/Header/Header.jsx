import React from 'react';
// components
import Avatar from '../../Profile/Avatar';
// constants
import { COLORS } from '../../../constants/styles';
import DrawerSlider from '../Drawer/DrawerSlider';

const Header = () => {
  return (
    <nav className="header-root">
      <DrawerSlider />
      <Avatar width="2rem" />
      <style jsx>{`
        .header-root {
          background: ${COLORS.BACKGROUND_DARK_PRIMARY};
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
        }
      `}</style>
    </nav>
  );
};

export default Header;
