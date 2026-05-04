import React from 'react';
import StatusBadge from '../common/StatusBadge';

const DeliveryTable = ({ deliveries, onStatusUpdate }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg mt-6">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">Delivery ID</th>
            <th className="p-4">Agent</th>
            <th className="p-4">Customer Address</th>
            <th className="p-4">Package ID</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {deliveries?.map(d => (
            <tr key={d.delivery_id} className="border-b">
              <td className="p-4">#{d.delivery_id}</td>
              <td className="p-4">{d.agent_name || 'Unassigned'}</td>
              <td className="p-4 max-w-xs truncate">{d.address_line}</td>
              <td className="p-4">PKG-{d.package_id}</td>
              <td className="p-4"><StatusBadge status={d.status} /></td>
              <td className="p-4">
                <select 
                  value={d.status} 
                  onChange={(e) => onStatusUpdate(d.delivery_id, e.target.value)}
                  className="border rounded p-1 text-sm bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
            </tr>
          ))}
          {(!deliveries || deliveries.length === 0) && (
             <tr><td colSpan="6" className="p-4 text-center text-gray-500">No delivery orders found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;