import React, { useState, useEffect } from 'react';
import { getAllDeliveries, updateDeliveryStatus, createDelivery, getAllAgents, getPendingDeliveries, getDeliveryStats } from '../../api/deliveryApi';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Truck, MapPin, Loader2, PackagePlus, ArrowRight, ClipboardList, Clock, BarChart2 } from 'lucide-react';

const ManageDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [agents, setAgents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPackForm, setShowPackForm] = useState(false);
    
    // Track selections for assigning
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedDeliveryDay, setSelectedDeliveryDay] = useState('1st Day of Eid');

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            if (!showPackForm) fetchData();
        }, 60000); // refresh every minute to update stats
        return () => clearInterval(interval);
    }, [showPackForm]);

    // Live clock ticker
    useEffect(() => {
        const clockInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    const fetchData = async () => {
        try {
            const [delivs, agnts, pending, statsData] = await Promise.all([
                getAllDeliveries(), 
                getAllAgents(),
                getPendingDeliveries(),
                getDeliveryStats()
            ]);
            setDeliveries(delivs);
            setAgents(agnts);
            setPendingBookings(pending);
            setStats(statsData);
        } catch (err) {
            console.error('Fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateDeliveryStatus(id, status);
            fetchData();
        } catch (err) {
            alert('Update failed');
        }
    };

    const handleAssignDelivery = async (e) => {
        e.preventDefault();
        if (!selectedBooking || !selectedAgent) {
            return alert('Please fill all required fields');
        }

        const computedWeight = selectedBooking.booking_type === 'hissa' 
            ? (parseFloat(selectedBooking.animal_weight) / 7).toFixed(1) 
            : parseFloat(selectedBooking.animal_weight);

        const EID_DATE_MAPPING = {
            '1st Day of Eid': '2026-05-27',
            '2nd Day of Eid': '2026-05-28',
            '3rd Day of Eid': '2026-05-29'
        };
        const deliveryDate = EID_DATE_MAPPING[selectedDeliveryDay] || '2026-05-27';

        try {
            // 1. Create the Meat Package
            const pkgRes = await axiosInstance.post('/delivery/package', {
                booking_id: selectedBooking.booking_id,
                weight: computedWeight,
                status: 'prepared'
            });
            const newPkg = pkgRes.data;

            // 2. Create the Delivery Order
            await createDelivery({
                package_id: newPkg.package_id,
                agent_id: selectedAgent,
                address_id: selectedBooking.address_id || null,
                delivery_date: deliveryDate,
                status: 'pending'
            });

            // Reset form and reload
            alert(`Delivery Assigned for Booking #${selectedBooking.booking_id}!`);
            setSelectedBooking(null);
            setSelectedAgent('');
            setShowPackForm(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to assign delivery. Make sure all fields are valid.');
        }
    };

    // Calculate dynamic active shift based on live clock
    const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const timeCompare = `${hours}:${minutes}`;

    let activeShiftText = "Delivery Closed";
    let isClosed = true;

    if (timeCompare >= '08:00' && timeCompare < '12:30') {
        activeShiftText = "Shift 1 (8:00 AM – 12:30 PM)";
        isClosed = false;
    } else if (timeCompare >= '12:30' && timeCompare < '17:00') {
        activeShiftText = "Shift 2 (12:30 PM – 5:00 PM)";
        isClosed = false;
    } else if (timeCompare >= '17:00' && timeCompare < '21:30') {
        activeShiftText = "Shift 3 (5:00 PM – 9:30 PM)";
        isClosed = false;
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black/20 p-6 rounded-2xl border border-ez-gold/20 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-serif tracking-wide">ColdStar Logistics Center 🚚</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">Automated Shift & Truck Assignment</p>
                </div>
                <div className="bg-ez-dark/80 px-5 py-3 rounded-xl border border-ez-gold/20 flex flex-col md:items-end gap-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Shift Controller</div>
                    <div className="text-lg font-black text-white font-mono">{timeStr}</div>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded ${isClosed ? 'text-red-400 bg-red-500/10' : 'text-ez-gold bg-ez-gold/10'}`}>
                        {isClosed ? 'Status: Delivery Closed' : `Active Shift: ${activeShiftText}`}
                    </div>
                </div>
            </div>

            {/* Smart Stats Dashboard */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-ez-dark border border-ez-gold/30 p-6 rounded-2xl shadow-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
                            <Clock className="w-4 h-4 text-ez-gold" /> Current Active Shift
                        </div>
                        <div className="text-xl font-black text-white font-serif">
                            {isClosed ? 'Delivery Closed' : activeShiftText.split(' ')[0] + ' ' + activeShiftText.split(' ')[1]}
                        </div>
                        <div className={`text-xs w-fit px-2 py-1 rounded font-bold ${isClosed ? 'text-red-400 bg-red-500/10' : 'text-ez-emerald bg-ez-emerald/10'}`}>
                            {isClosed ? 'Closed' : 'Operating Normally'}
                        </div>
                    </div>

                    <div className="bg-ez-dark border border-ez-gold/30 p-6 rounded-2xl shadow-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
                            <Truck className="w-4 h-4 text-ez-gold" /> Truck Availability
                        </div>
                        <div className="text-2xl font-black text-white font-serif">4 Trucks Active</div>
                        <div className="text-xs text-gray-500">Max 20 deliveries per truck</div>
                    </div>

                    <div className="bg-ez-dark border border-ez-gold/30 p-6 rounded-2xl shadow-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
                            <BarChart2 className="w-4 h-4 text-ez-gold" /> Remaining Capacity
                        </div>
                        <div className="text-2xl font-black text-white font-serif">
                            {stats.availableCapacity} <span className="text-sm font-medium text-gray-400">Slots Left</span>
                        </div>
                        <div className="text-xs text-gray-500">For current shift</div>
                    </div>

                    <div className="bg-ez-dark border border-ez-gold/30 p-6 rounded-2xl shadow-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
                            <ClipboardList className="w-4 h-4 text-ez-gold" /> Deliveries Today
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white font-serif">{stats.totalAssigned}</span>
                            <span className="text-sm text-gray-400">total assigned</span>
                        </div>
                        <div className="text-xs font-bold flex gap-3 mt-1">
                            <span className="text-ez-gold bg-ez-gold/10 px-2 py-0.5 rounded">
                                {stats.statusCounts?.filter(s => s.status !== 'delivered').reduce((sum, s) => sum + Number(s.count), 0) || 0} Active
                            </span>
                            <span className="text-ez-emerald bg-ez-emerald/10 px-2 py-0.5 rounded">
                                {stats.statusCounts?.filter(s => s.status === 'delivered').reduce((sum, s) => sum + Number(s.count), 0) || 0} Completed
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Bookings Section */}
            {!loading && pendingBookings.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-ez-gold font-serif flex items-center gap-2 border-b border-ez-gold/20 pb-2">
                        <ClipboardList className="w-6 h-6" /> Pending Bookings Awaiting Delivery
                    </h2>
                    {isClosed && (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm font-bold flex items-center gap-2">
                            ⚠️ Dispatch Closed: Assignments are locked outside working hours (8:00 AM - 9:30 PM).
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {pendingBookings.map(b => (
                            <div key={b.booking_id} className="bg-ez-dark/50 p-6 rounded-2xl border border-ez-gold/20 hover:border-ez-gold transition-colors shadow-lg flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                    <span className="font-bold text-white text-lg">Order #{b.booking_id}</span>
                                    <StatusBadge status="confirmed" />
                                </div>
                                <div className="text-sm space-y-2">
                                    <p className="text-gray-400"><strong className="text-gray-200">Customer:</strong> {b.customer_name}</p>
                                    <p className="text-gray-400"><strong className="text-gray-200">Animal:</strong> {b.animal_category} ({b.tag_no})</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (isClosed) {
                                            alert('Delivery is Closed. No assignments can be created outside working hours (8:00 AM - 9:30 PM).');
                                            return;
                                        }
                                        setSelectedBooking(b);
                                        setSelectedDeliveryDay(b.qurbani_day || '1st Day of Eid');
                                        setShowPackForm(true);
                                    }}
                                    disabled={isClosed}
                                    className={`mt-auto text-sm font-bold py-3 rounded-xl border transition-all shadow-sm ${
                                        isClosed 
                                        ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' 
                                        : 'bg-ez-gold/10 hover:bg-ez-gold hover:text-ez-dark border-ez-gold/30 text-ez-gold'
                                    }`}
                                >
                                    {isClosed ? 'Delivery Closed' : 'Package & Dispatch'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Assignment Form Modal (Floating) */}
            {showPackForm && selectedBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-ez-dark border border-ez-gold/40 rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl text-white font-bold font-serif mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                            <PackagePlus className="w-6 h-6 text-ez-gold" /> Process Delivery #{selectedBooking.booking_id}
                        </h3>
                        <form onSubmit={handleAssignDelivery} className="flex flex-col gap-6">
                             <div>
                                 <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Meat Package Weight</label>
                                 <div className="w-full p-4 bg-black/40 border border-ez-gold/30 rounded-xl text-white font-semibold font-mono">
                                     {selectedBooking.booking_type === 'hissa' 
                                         ? (parseFloat(selectedBooking.animal_weight) / 7).toFixed(1) 
                                         : parseFloat(selectedBooking.animal_weight)} KG
                                 </div>
                             </div>

                             <div>
                                 <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Delivery Day (Based on User Preference)</label>
                                 <select 
                                     className="w-full p-4 bg-black/40 border border-ez-gold/30 rounded-xl text-white focus:outline-none focus:border-ez-gold focus:ring-1 focus:ring-ez-gold transition-all font-semibold"
                                     required
                                     value={selectedDeliveryDay} 
                                     onChange={(e) => setSelectedDeliveryDay(e.target.value)}
                                 >
                                     <option value="1st Day of Eid">1st Day of Eid (27 May 2026)</option>
                                     <option value="2nd Day of Eid">2nd Day of Eid (28 May 2026)</option>
                                     <option value="3rd Day of Eid">3rd Day of Eid (29 May 2026)</option>
                                 </select>
                             </div>

                             <div>
                                 <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">ColdStar Regional Agent</label>
                                 <select 
                                     className="w-full p-4 bg-black/40 border border-ez-gold/30 rounded-xl text-white focus:outline-none focus:border-ez-gold focus:ring-1 focus:ring-ez-gold transition-all"
                                     required
                                     value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
                                 >
                                     <option value="" disabled>-- Select Regional Logistics --</option>
                                     {agents.map(a => (
                                         <option key={a.agent_id} value={a.agent_id}>{a.name}</option>
                                     ))}
                                 </select>
                             </div>
                            
                            <div className="bg-ez-gold/5 p-4 rounded-xl border border-ez-gold/20 mt-2">
                                <p className="text-xs text-ez-gold font-mono italic">
                                    System will automatically assign optimal Shift and Refrigerated Truck based on capacity and slaughter schedule.
                                </p>
                            </div>

                            <div className="flex gap-4 mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowPackForm(false); setSelectedBooking(null); }}
                                    className="flex-1 py-4 text-gray-400 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-4 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-bold rounded-xl shadow-lg transition-all">
                                    Dispatch Agent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Master Delivery Table */}
            <div className="bg-ez-dark rounded-3xl shadow-xl border border-ez-gold/20 overflow-hidden mt-12">
                <div className="p-6 border-b border-ez-gold/20 bg-black/40 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white font-serif tracking-wide">Active Dispatch Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/60 border-b border-ez-gold/20 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">
                            <tr>
                                <th className="px-6 py-4 text-center">ID</th>
                                <th className="px-6 py-4">Agent / Truck</th>
                                <th className="px-6 py-4">Shift</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ez-gold/10 text-sm font-medium">
                            {loading && deliveries.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-12"><Loader2 className="animate-spin mx-auto text-ez-gold w-8 h-8" /></td></tr>
                            ) : deliveries.map(item => (
                                <tr key={item.delivery_id} className="hover:bg-ez-gold/5 transition-colors text-gray-300">
                                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-500">#{item.delivery_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-ez-gold/10 border border-ez-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Truck className="w-5 h-5 text-ez-gold" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white">{item.agent_name}</span>
                                                <span className="text-xs text-gray-500 font-mono">{item.truck_name || 'Pending'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs text-gray-400 font-mono">
                                            <span>{item.shift_start ? item.shift_start.substring(0,5) : ''} - {item.shift_end ? item.shift_end.substring(0,5) : ''}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white text-lg">{item.package_weight} <span className="text-sm text-gray-500">KG</span></td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                </tr>
                            ))}
                            {!loading && deliveries.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-16 text-gray-500 font-serif italic text-lg">No delivery orders currently placed.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDeliveries;
