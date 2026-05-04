import React, { useState } from 'react';

const PaymentForm = ({ booking, methods, onSubmit, onCancel }) => {
  const [methodId, setMethodId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!methodId) return alert('Please select a payment method');
    onSubmit({ booking_id: booking.booking_id, method_id: methodId, amount: booking.total_amount });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Make Payment</h3>
      <p className="mb-4 text-gray-600">Booking #{booking.booking_id} - <span className="font-bold text-gray-800">PKR {booking.total_amount}</span></p>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Select Payment Method</label>
        <select 
          value={methodId} 
          onChange={(e) => setMethodId(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
          required
        >
          <option value="">-- Select Method --</option>
          {methods.map(m => (
            <option key={m.method_id} value={m.method_id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 mt-6">
        <button type="button" onClick={onCancel} className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="flex-1 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700">
          Pay Now
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;