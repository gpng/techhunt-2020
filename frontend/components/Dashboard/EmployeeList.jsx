import React from 'react';
import PropTypes from 'prop-types';
// components
import { Delete, Edit } from '../General/Icons';
import IconButton from '../General/Buttons/IconButton';

const EmployeeList = ({ employees }) => {
  return (
    <div className="employee-list-root">
      <table className="table-body">
        <thead>
          <tr>
            <th className="col">ID</th>
            <th className="col">Name</th>
            <th className="col">Login</th>
            <th className="col">Salary</th>
            <th className="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr className="row" key={e.id}>
              <td className="col col-cell">{e.id}</td>
              <td className="col col-cell">{e.name}</td>
              <td className="col col-cell">{e.login}</td>
              <td className="col col-cell">{e.salary}</td>
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
          width: 20%;
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
      `}</style>
    </div>
  );
};

EmployeeList.defaultProps = {
  employees: [],
};

EmployeeList.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.object),
};

export default EmployeeList;
