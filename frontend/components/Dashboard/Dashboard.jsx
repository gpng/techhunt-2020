import React, { useState, useRef } from 'react';
// components
import TextField from '../General/Inputs/TextField';
// tanslations
import useTranslations from '../../translations/useTranslations';
// actions
import { SearchEmployees } from '../../actions/employees';
import EmployeeList from './EmployeeList';

const Dashboard = () => {
  const { t } = useTranslations();

  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(5000);

  const searchRequest = useRef(new SearchEmployees());

  const handleSearch = async () => {
    searchRequest.current.refresh();
    const [err, res] = await searchRequest.current.call(
      minSalary,
      maxSalary,
      'salary',
      false,
      0,
      30,
    );
    console.log('err, res: ', err, res);
  };

  return (
    <div className="dashboard-root">
      <h1>{t('dashboard.title')}</h1>
      <section className="section-inputs">
        <div className="input-wrapper">
          <TextField
            label="Minimum Salary"
            type="number"
            value={minSalary}
            onChange={setMinSalary}
          />
        </div>
        <div>
          <TextField
            label="Maximum Salary"
            type="number"
            value={maxSalary}
            onChange={setMaxSalary}
          />
        </div>
      </section>
      <div className="button-wrapper">
        <button type="button" className="button-search" onClick={handleSearch}>
          {t('dashboard.buttonSearch')}
        </button>
      </div>
      <section className="section-employees">
        <EmployeeList />
      </section>
      <style jsx>{`
        .dashboard-root {
          width: 100%;
          height: 100%;
          padding: 2rem 2rem 0 2rem;
          display: flex;
          flex-direction: column;
        }

        .section-inputs {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
        }

        .input-wrapper {
          margin-right: 1rem;
        }

        .button-wrapper {
          flex: 0 0 auto;
        }

        .button-search {
          margin-top: 1rem;
        }

        .section-employees {
          flex: 1 1 auto;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
