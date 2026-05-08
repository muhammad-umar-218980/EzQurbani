import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getReceipt } from '../../api/paymentApi';
import { getMyBookings } from '../../api/bookingApi';
import { Receipt, Download, Loader2, Printer } from 'lucide-react';

const MyReceipts = () => {
    const location = useLocation();
    const [bookingId, setBookingId] = useState(location.state?.bookingId || '');
    const [bookings, setBookings] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyBookings();
        if (bookingId) {
            handleFetchReceipt(bookingId);
        }
    }, []);

    const fetchMyBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data.filter(b => b.booking_status === 'confirmed'));
        } catch (err) {
            console.error('Failed to fetch bookings');
        }
    };

    const handleFetchReceipt = async (id) => {
        setLoading(true);
        try {
            const data = await getReceipt(id);
            setReceipt(data);
        } catch (err) {
            console.error('No receipt found');
            setReceipt(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-bold text-ez-emerald font-serif">Payment Receipts</h1>
                <p className="text-gray-500 mt-2 italic text-lg">View and download your official sacrificial booking receipts.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-ez-gold/20 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-ez-emerald uppercase tracking-wider mb-2">Select Booking</label>
                    <select 
                        value={bookingId}
                        onChange={(e) => {
                            setBookingId(e.target.value);
                            handleFetchReceipt(e.target.value);
                        }}
                        className="w-full p-3 bg-ez-cream/50 border border-ez-gold/30 rounded-xl outline-none focus:ring-2 focus:ring-ez-gold transition-shadow text-ez-emerald font-semibold"
                    >
                        <option value="">Choose an order...</option>
                        {bookings.map(b => (
                            <option key={b.booking_id} value={b.booking_id}>
                                Order #{b.booking_id} - {b.animal_name} ({b.tag_no})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : receipt ? (
                <div className="bg-white p-12 rounded-3xl shadow-xl border border-ez-gold/30 max-w-2xl mx-auto relative overflow-hidden">
                    {/* Watermark/Stamp */}
                    <div className="absolute top-10 right-10 opacity-[0.03] -rotate-12 pointer-events-none">
                        <Receipt className="w-48 h-48 text-ez-emerald" />
                    </div>

                    <div className="border-b-2 border-dashed border-ez-gold/30 pb-8 mb-8 text-center relative z-10">
                        <div className="w-16 h-16 bg-ez-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 border border-ez-gold/30 shadow-inner">
                            <span className="text-ez-gold font-serif font-bold text-2xl">☽</span>
                        </div>
                        <h2 className="text-3xl font-black text-ez-emerald tracking-tight uppercase font-serif">EzQurbani Official Receipt</h2>
                        <p className="text-gray-400 text-sm mt-1">Receipt ID: {receipt.receipt_no}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Date</span>
                            <span className="text-gray-900 font-bold">{new Date(receipt.payment_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="text-gray-900 font-bold">{receipt.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Booking ID</span>
                            <span className="text-gray-900 font-bold">#{receipt.booking_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Animal Tag</span>
                            <span className="text-gray-900 font-bold">{receipt.tag_no}</span>
                        </div>
                        
                        {bookings.find(b => b.booking_id === receipt.booking_id)?.qurbani_day && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Qurbani Day</span>
                                <span className="text-gray-900 font-bold">
                                    {bookings.find(b => b.booking_id === receipt.booking_id)?.qurbani_day}
                                </span>
                            </div>
                        )}
                        
                        {bookings.find(b => b.booking_id === receipt.booking_id)?.delivery_preference && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery Pref.</span>
                                <span className="text-gray-900 font-bold capitalize">
                                    {bookings.find(b => b.booking_id === receipt.booking_id)?.delivery_preference.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}

                        <div className="bg-ez-cream p-6 rounded-2xl mt-8 border border-ez-gold/20">
                            <div className="flex justify-between items-center text-xl font-black text-ez-emerald">
                                <span className="font-serif">Total Paid</span>
                                <span>Rs. {parseFloat(receipt.amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4 print:hidden relative z-10">
                        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-4 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-black rounded-xl transition-colors shadow-lg border border-ez-gold">
                            <Download className="w-5 h-5" /> Download PDF
                        </button>
                        <button onClick={() => window.print()} className="px-6 py-4 border-2 border-ez-gold/30 text-ez-emerald font-bold rounded-xl hover:bg-ez-cream transition-colors">
                            <Printer className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : bookingId && (
                <div className="text-center py-12 text-gray-400">
                    No receipt found for this order. Ensure payment is completed.
                </div>
            )}
        </div>
    );
};

export default MyReceipts;
