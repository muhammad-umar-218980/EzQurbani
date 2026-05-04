import React, { useState } from 'react';

const BookingForm = ({ animal, hissaId, onConfirm, onCancel }) => {
  const isHissa = !!hissaId;
  const amount = isHissa ? animal.hissa_price : animal.price; // Adjust based on your API response

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
      <div className="mb-4">
        <p className="text-gray-600"><span className="font-semibold">Animal Tag:</span> {animal.tag_no}</p>
        <p className="text-gray-600"><span className="font-semibold">Category:</span> {animal.category_name}</p>
        <p className="text-gray-600"><span className="font-semibold">Type:</span> {isHissa ? `Hissa #${hissaId}` : 'Full Animal'}</p>
        <p className="text-lg font-bold text-indigo-700 mt-2">Total Amount: PKR {amount}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={onCancel} className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button 
          onClick={() => onConfirm({ animal_id: animal.animal_id, hissa_id: hissaId, total_amount: amount, booking_type: isHissa ? 'hissa' : 'full' })} 
          className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingForm;