import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Loader2, Filter, Download } from 'lucide-react';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await axiosInstance.get('/bookings');
            setBookings(data.data);
        } catch (err) {
            console.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axiosInstance.patch(`/bookings/${id}/status`, { status });
            fetchBookings();
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white font-serif tracking-wide">All Bookings 📋</h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-ez-gold/30 rounded-lg text-sm text-ez-gold hover:bg-ez-gold/10 transition-colors shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-ez-gold/30 rounded-lg text-sm text-ez-gold hover:bg-ez-gold/10 transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl shadow-lg border border-ez-gold/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-ez-gold/20 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Animal</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ez-gold/10 text-sm">
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-ez-gold" /></td></tr>
                            ) : bookings.map(booking => (
                                <tr key={booking.booking_id} className="hover:bg-ez-gold/5 transition-colors text-gray-300">
                                    <td className="px-6 py-4 font-mono text-gray-500 font-bold">#{booking.booking_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{booking.user_name}</span>
                                            <span className="text-xs text-gray-500">{booking.user_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize font-medium">{booking.animal_name} ({booking.tag_no})</td>
                                    <td className="px-6 py-4 capitalize">{booking.booking_type}</td>
                                    <td className="px-6 py-4 font-black text-white">Rs. {parseFloat(booking.total_amount).toLocaleString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={booking.booking_status} /></td>
                                    <td className="px-6 py-4">
                                        <select 
                                            className="text-xs bg-ez-dark border border-ez-gold/30 rounded p-1.5 outline-none text-ez-gold font-bold focus:border-ez-gold"
                                            value={booking.booking_status}
                                            onChange={(e) => handleUpdateStatus(booking.booking_id, e.target.value)}
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
            </div>
        </div>
    );
};

export default ManageBookings;
