import React from 'react';
import PropTypes from 'prop-types';
// components
import Drawer from '../Nav/Drawer/Drawer';
// constants
import { BREAKPOINTS } from '../../constants';
import Header from '../Nav/Header/Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout-root">
      <div className="header-container">
        <Header />
      </div>
      <div className="drawer-container">
        <Drawer />
      </div>
      <section className="content-container">{children}</section>
      <style jsx>{`
        .dashboard-layout-root {
          height: 100%;
          width: 100vw;
          display: grid;
          grid-template-columns: 12rem auto;
          grid-template-rows: 3rem auto;
        }

        .drawer-container {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
        }

        .content-container {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
        }

        .header-container {
          grid-column: 1 / 3;
          grid-row: 1 / 2;
          display: none;
        }

        @media only screen and (max-width: ${BREAKPOINTS.MEDIUM}px) {
          .drawer-container {
            display: none;
          }

          .header-container {
            display: block;
          }

          .content-container {
            grid-column: 1 / 3;
            grid-row: 2 / 3;
          }
        }
      `}</style>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
