import React from 'react';

const EmployeeList = () => {
  return (
    <div className="employee-list-root">
      <div className="header-wrapper">
        <table>
          <thead>
            <tr>
              <th className="col">ID</th>
              <th className="col">Name</th>
              <th className="col">Login</th>
              <th className="col">Salary</th>
              <th className="col">Actions</th>
            </tr>
          </thead>
        </table>
      </div>
      <table className="table-body">
        <tbody>
          <tr className="row">
            <td className="col col-cell">e00001</td>
            <td className="col col-cell">Harry Potter</td>
            <td className="col col-cell">hp001</td>
            <td className="col col-cell">3000</td>
            <td className="col col-cell">delete</td>
          </tr>
          <tr className="row">
            <td className="col col-cell">e00001</td>
            <td className="col col-cell">Harry Potter</td>
            <td className="col col-cell">hp001</td>
            <td className="col col-cell">3000</td>
            <td className="col col-cell">delete</td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
        .employee-list-root {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        table {
          width: 100%;
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
      `}</style>
    </div>
  );
};

EmployeeList.propTypes = {};

export default EmployeeList;
