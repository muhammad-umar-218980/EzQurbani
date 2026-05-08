import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings } from '../../api/bookingApi';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar, CreditCard, Receipt, Loader2, Package } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-bold text-ez-emerald font-serif">My Bookings</h1>
                <p className="text-gray-500 mt-2 italic text-lg">Track your active sacrificial animals and their status.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't made any bookings yet.</p>
                    <button 
                        onClick={() => navigate('/dashboard/customer/browse')}
                        className="mt-4 text-green-600 font-semibold hover:underline"
                    >
                        Browse animals now →
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-ez-gold/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-ez-cream border-b border-ez-gold/20">
                                    <th className="px-6 py-4 text-sm font-bold text-ez-emerald uppercase tracking-wider font-serif">Animal</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-sm font-bold text-ez-emerald uppercase tracking-wider font-serif">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ez-gold/10">
                                {bookings.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-ez-cream/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-ez-emerald capitalize font-serif text-lg">{booking.animal_name || booking.category_name}</span>
                                                <span className="text-xs text-ez-gold font-mono font-bold">TAG: {booking.tag_no}</span>
                                                {booking.qurbani_day && (
                                                    <span className="text-xs text-gray-500 mt-1">Day: {booking.qurbani_day}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {booking.booking_type === 'hissa' ? `Hissa Slot #${booking.hissa_no}` : 'Full Animal'}
                                                </span>
                                                {booking.delivery_preference && (
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {booking.delivery_preference === 'perform_and_deliver' ? 'Deliver Meat' : 
                                                         booking.delivery_preference === 'deliver_alive' ? 'Deliver Alive' : 'Pickup'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">Rs. {parseFloat(booking.total_amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.booking_status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {booking.booking_status === 'pending' ? (
                                                    <button
                                                        onClick={() => navigate('/dashboard/customer/payment', { state: { booking } })}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald text-sm font-bold rounded-lg transition-colors shadow-sm"
                                                    >
                                                        <CreditCard className="w-4 h-4" /> Pay Now
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate('/dashboard/customer/receipts', { state: { bookingId: booking.booking_id } })}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-ez-emerald hover:bg-ez-emerald-light text-ez-gold text-sm font-bold rounded-lg transition-colors shadow-sm"
                                                    >
                                                        <Receipt className="w-4 h-4" /> Receipt
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
