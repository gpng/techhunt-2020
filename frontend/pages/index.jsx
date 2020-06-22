import React from 'react';
import Head from 'next/head';
// components
import DashboardLayout from '../components/Layouts/DashboardLayout';
import Dashboard from '../components/Dashboard/Dashboard';

const Index = () => {
  return (
    <>
      <Head>
        <title>HR Employee Management</title>
      </Head>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </>
  );
};

export default Index;
