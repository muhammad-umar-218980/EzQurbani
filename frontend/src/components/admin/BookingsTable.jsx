import React from 'react';
import StatusBadge from '../common/StatusBadge';

const BookingsTable = ({ bookings, onStatusUpdate }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Type</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.booking_id} className="border-b">
              <td className="p-4">#{b.booking_id}</td>
              <td className="p-4">{b.customer_name}</td>
              <td className="p-4 capitalize">{b.booking_type}</td>
              <td className="p-4">PKR {b.total_amount}</td>
              <td className="p-4"><StatusBadge status={b.booking_status} /></td>
              <td className="p-4">
                <select 
                  value={b.booking_status} 
                  onChange={(e) => onStatusUpdate(b.booking_id, e.target.value)}
                  className="border rounded p-1 text-sm bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;