import React from 'react';
import StatusBadge from '../common/StatusBadge';

const AnimalsTable = ({ animals }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Tag No</th>
            <th className="p-4">Category</th>
            <th className="p-4">Vendor</th>
            <th className="p-4">Weight (kg)</th>
            <th className="p-4">Price (PKR)</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {animals.map(a => (
            <tr key={a.animal_id} className="border-b">
              <td className="p-4 font-semibold">{a.tag_no}</td>
              <td className="p-4">{a.category_name}</td>
              <td className="p-4">{a.vendor_name}</td>
              <td className="p-4">{a.weight}</td>
              <td className="p-4">{a.price}</td>
              <td className="p-4"><StatusBadge status={a.status} /></td>
            </tr>
          ))}
          {animals.length === 0 && (
             <tr><td colSpan="6" className="p-4 text-center text-gray-500">No animals found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnimalsTable;