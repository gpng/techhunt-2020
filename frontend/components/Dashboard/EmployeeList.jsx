import React from 'react';
import PropTypes from 'prop-types';
// components
import { Delete, Edit } from '../General/Icons';
import IconButton from '../General/Buttons/IconButton';
import { Spinner } from '../General/Animations';

const EmployeeList = ({ loading, employees, columns, actionLabel, error }) => {
  return (
    <div className="employee-list-root">
      <table className="table-body">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="col" data-testid="header-columns">
                {col.label}
              </th>
            ))}
            <th className="col">{actionLabel}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr className="row" key={e.id} data-testid="employee-rows">
              {columns.map((col) => (
                <td key={col.key} className="col col-cell" data-testid="employee-cells">
                  {e[col.accessor]}
                </td>
              ))}
              <td className="col col-cell">
                <div className="buttons-wrapper">
                  <IconButton onClick={() => {}} icon={<Edit />} />
                  <IconButton onClick={() => {}} icon={<Delete />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="messages">
        {!loading && error && (
          <div className="error" data-testid="error">
            {error}
          </div>
        )}
        {loading && (
          <div className="loading-wrapper" data-testid="spinner">
            <Spinner width="3rem" />
          </div>
        )}
        {!loading && !error && !employees.length && <div data-testid="no-results">No results!</div>}
      </div>
      <style jsx>{`
        .employee-list-root {
          height: 100%;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100vw;
          overflow: auto;
        }

        table {
          table-layout: fixed;
        }

        .table-body {
          border-spacing: 0 1rem;
        }

        .col {
          width: ${100 / (columns.length + 1)}%;
          text-align: left;
          padding: 1rem 0.5rem;
        }

        .col-cell {
          background: #dddddd;
        }

        .col:first-child {
          padding-left: 1rem;
          border-radius: 0.4rem 0 0 0.4rem;
        }
        .col:last-child {
          padding-right: 1rem;
          border-radius: 0 0.4rem 0.4rem 0;
        }

        .buttons-wrapper {
          display: flex;
          align-items: center;
        }

        .messages {
          padding: 0 1rem;
        }

        .error {
          color: red;
        }
      `}</style>
    </div>
  );
};

EmployeeList.defaultProps = {
  employees: [],
  loading: false,
  error: null,
};

EmployeeList.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    }),
  ).isRequired,
  actionLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default EmployeeList;
