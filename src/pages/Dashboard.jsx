import React from 'react';
import Tabs from '../components/Tabs';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h2 className="text-center text-3xl font-semibold text-indigo-600 mb-6">Study Materials</h2>
      <Tabs />
    </div>
  );
};

export default Dashboard;