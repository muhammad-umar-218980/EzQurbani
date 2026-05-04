import React from 'react';
import StatusBadge from '../common/StatusBadge';

const BookingCard = ({ booking, onPay, onViewReceipt }) => {
  return (
    <div className="p-5 border rounded-lg shadow-sm bg-white mb-4 flex justify-between items-center">
      <div>
        <h4 className="font-bold text-lg mb-1">Booking #{booking.booking_id} - <span className="capitalize">{booking.booking_type}</span></h4>
        <p className="text-gray-600 text-sm">Animal: {booking.tag_no} ({booking.category_name})</p>
        {booking.booking_type === 'hissa' && <p className="text-gray-600 text-sm">Hissa No: {booking.hissa_no}</p>}
        <p className="font-semibold mt-2">Amount: PKR {booking.total_amount}</p>
        <p className="text-sm mt-1 text-gray-500">Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <StatusBadge status={booking.booking_status} />
        {booking.booking_status === 'pending' && (
          <button onClick={() => onPay(booking)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Pay Now
          </button>
        )}
        {booking.booking_status === 'confirmed' && (
          <button onClick={() => onViewReceipt(booking)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            View Receipt
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;