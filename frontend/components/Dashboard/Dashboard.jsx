import React, { useState, useContext, useEffect } from 'react';
// contexts
import AppContext from '../Context/App/AppContext';
// components
import TextField from '../General/Inputs/TextField';
import EmployeeList from './EmployeeList';
import Pagination from './Pagination';
// tanslations
import useTranslations from '../../translations/useTranslations';
// constants
import { SEARCH, MODALS } from '../../constants';
import { submitSearch, openModal } from '../../actions/creators';

const Dashboard = () => {
  const { t } = useTranslations();

  // controls state of text field
  const [minSalaryEdit, setMinSalaryEdit] = useState(SEARCH.DEFAULTS.MIN_SALARY);
  const [maxSalaryEdit, setMaxSalaryEdit] = useState(SEARCH.DEFAULTS.MAX_SALARY);

  const searchOptions = [
    { value: '+id', label: t('dashboard.columns.id'), asc: true },
    { value: '-id', label: t('dashboard.columns.id'), asc: false },
    { value: '+name', label: t('dashboard.columns.name'), asc: true },
    { value: '-name', label: t('dashboard.columns.name'), asc: false },
    { value: '+login', label: t('dashboard.columns.login'), asc: true },
    { value: '-login', label: t('dashboard.columns.login'), asc: false },
    { value: '+salary', label: t('dashboard.columns.salary'), asc: true },
    { value: '-salary', label: t('dashboard.columns.salary'), asc: false },
  ];

  // search params
  const [salaryRange, setSalaryRange] = useState([
    SEARCH.DEFAULTS.MIN_SALARY,
    SEARCH.DEFAULTS.MAX_SALARY,
  ]);
  const [page, setPage] = useState(SEARCH.DEFAULTS.PAGE);
  const [sort, setSort] = useState(SEARCH.DEFAULTS.SORT);

  const {
    dispatchAsync,
    dispatch,
    state: {
      search: { employees, loading, error },
    },
  } = useContext(AppContext);

  const handleSearchClick = () => {
    setSalaryRange([minSalaryEdit, maxSalaryEdit]);
    setPage(0);
  };

  const handleDeleteClick = (id) => {
    dispatch(openModal(MODALS.DELETE, id));
  };

  const handleEditClick = (employee) => {
    dispatch(openModal(MODALS.EDIT, employee));
  };

  // immediately retrieve first set of results on mount
  useEffect(() => {
    const handleSearch = async () => {
      dispatchAsync(
        submitSearch(
          salaryRange[0],
          salaryRange[1],
          sort,
          page * SEARCH.PAGE_SIZE,
          SEARCH.PAGE_SIZE,
        ),
      );
    };
    handleSearch();
  }, [sort, page, salaryRange, dispatchAsync]);

  return (
    <div className="dashboard-root">
      <h1>{t('dashboard.title')}</h1>
      <section className="section-inputs">
        <div className="input-wrapper">
          <TextField
            label={t('dashboard.minimumSalary')}
            type="number"
            value={minSalaryEdit}
            onChange={setMinSalaryEdit}
          />
        </div>
        <div>
          <TextField
            label={t('dashboard.maximumSalary')}
            type="number"
            value={maxSalaryEdit}
            onChange={setMaxSalaryEdit}
          />
        </div>
      </section>
      <div className="buttons-wrapper">
        <button
          type="button"
          className="button-search"
          onClick={handleSearchClick}
          data-testid="button-search"
        >
          {t('dashboard.buttonSearch')}
        </button>
      </div>
      <div className="sort-wrapper">
        <span>{t('dashboard.sortBy')}</span>
        <select value={sort} onChange={(ev) => setSort(ev.target.value)} data-testid="select-sort">
          {searchOptions.map((x) => (
            <option key={x.value} value={x.value}>
              {`${x.asc ? '⬆️' : '⬇️'} ${x.label}`}
            </option>
          ))}
        </select>
      </div>
      <div className="pagination-wrapper">
        <Pagination
          prevLabel={t('dashboard.pagination.prevPage')}
          nextLabel={t('dashboard.pagination.nextPage')}
          min={page * SEARCH.PAGE_SIZE}
          max={page * SEARCH.PAGE_SIZE + employees.length}
          onPrevClick={page > 0 ? () => setPage(page - 1) : undefined}
          onNextClick={employees.length === SEARCH.PAGE_SIZE ? () => setPage(page + 1) : undefined}
        />
      </div>
      <section className="section-employees">
        <EmployeeList
          employees={employees}
          loading={loading}
          error={error}
          columns={[
            { key: 'id', label: t('dashboard.columns.id'), accessor: 'id' },
            { key: 'name', label: t('dashboard.columns.name'), accessor: 'name' },
            { key: 'login', label: t('dashboard.columns.login'), accessor: 'login' },
            { key: 'salary', label: t('dashboard.columns.salary'), accessor: 'salary' },
          ]}
          actionLabel={t('dashboard.columns.actions')}
          onClickDelete={handleDeleteClick}
          onClickEdit={handleEditClick}
        />
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

        .buttons-wrapper {
          margin-top: 1rem;
        }

        .sort-wrapper {
          margin-top: 1.5rem;
        }

        .sort-wrapper > span {
          margin-right: 0.5rem;
        }

        .sort-options {
          display: flex;
        }

        .button-search {
        }

        .section-employees {
          flex: 1 1 auto;
          margin-top: 1rem;
        }

        .pagination-wrapper {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
