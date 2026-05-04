import React from 'react';

const ReceiptCard = ({ receipt }) => {
  if (!receipt) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-t-8 border-indigo-600 max-w-md w-full mx-auto font-sans">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Receipt</h2>
        <p className="text-gray-500 text-sm mt-1">EzQurbani Management System</p>
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Receipt No:</span>
          <span className="font-semibold text-gray-800">{receipt.receipt_no}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span className="text-gray-800">{new Date(receipt.payment_date).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded text-lg">
        <span className="font-semibold text-gray-700">Amount Paid:</span>
        <span className="font-bold text-green-600">PKR {receipt.amount}</span>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Thank you for choosing EzQurbani!</p>
        <p>JazakAllah Khair.</p>
      </div>
    </div>
  );
};

export default ReceiptCard;