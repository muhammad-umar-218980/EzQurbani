import React from 'react';

const StatsCard = ({ title, value, color }) => {
  return (
    <div className={`p-6 rounded-lg shadow-md bg-white border-l-4 ${color}`}>
      <h3 className="text-gray-500 text-sm font-semibold uppercase">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
    </div>
  );
};

export default StatsCard;