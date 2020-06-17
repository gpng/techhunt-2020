import React, { useState, useContext, useEffect } from 'react';
// contexts
import AppContext, { APP_ACTIONS } from '../Context/App/AppContext';
// components
import TextField from '../General/Inputs/TextField';
import EmployeeList from './EmployeeList';
// tanslations
import useTranslations from '../../translations/useTranslations';
// constants
import { SEARCH } from '../../constants';

const Dashboard = () => {
  const { t } = useTranslations();

  const [minSalary, setMinSalary] = useState(SEARCH.DEFAULTS.MIN_SALARY);
  const [maxSalary, setMaxSalary] = useState(SEARCH.DEFAULTS.MAX_SALARY);
  const [page] = useState(SEARCH.DEFAULTS.PAGE);

  const {
    dispatchAsync,
    state: {
      search: { employees, loading, error },
    },
  } = useContext(AppContext);

  const handleSearch = async () => {
    dispatchAsync({
      type: APP_ACTIONS.SEARCH.SUBMIT,
      payload: {
        minSalary,
        maxSalary,
        sortBy: 'salary',
        sortAsc: false,
        offset: page * SEARCH.PAGE_SIZE,
        limit: SEARCH.PAGE_SIZE,
      },
    });
  };

  // immediately retrieve first set of results on mount
  useEffect(() => {
    handleSearch();
    // we can ignore this dependancy array as we want to only trigger this once with the default
    // values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <EmployeeList employees={employees} loading={loading} error={error} />
      </section>
      <style jsx>{`
        .dashboard-root {
          width: 100%;
          height: 100%;
          padding: 2rem 2rem 0 2rem;
          display: flex;
          flex-direction: column;
          max-width: 100vw;
        }

        .section-inputs {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
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
