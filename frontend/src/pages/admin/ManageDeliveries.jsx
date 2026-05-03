import React, { useState, useEffect } from 'react';
import { getAllDeliveries, updateDeliveryStatus, createDelivery, getAllAgents } from '../../api/deliveryApi';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Truck, MapPin, Loader2, PackagePlus, ArrowRight } from 'lucide-react';

const ManageDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPackForm, setShowPackForm] = useState(false);
    const [packData, setPackData] = useState({ booking_id: '', weight: '', status: 'prepared' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [delivs, agnts] = await Promise.all([getAllDeliveries(), getAllAgents()]);
            setDeliveries(delivs);
            setAgents(agnts);
        } catch (err) {
            console.error('Fetch error');
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

    const handleCreatePackage = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/delivery/package', packData);
            setShowPackForm(false);
            fetchData();
            alert('Package Created! Now create delivery order.');
        } catch (err) {
            alert('Package creation failed');
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white font-serif tracking-wide">Delivery Operations 🚚</h1>
                <button 
                    onClick={() => setShowPackForm(!showPackForm)}
                    className="bg-ez-gold text-ez-emerald px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-ez-gold-light transition-all font-bold shadow-[0_0_15px_rgba(201,168,76,0.2)]"
                >
                    <PackagePlus className="w-4 h-4" /> Create Meat Package
                </button>
            </div>

            {showPackForm && (
                <form onSubmit={handleCreatePackage} className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/30 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
                    <input 
                        type="number" placeholder="Booking ID" required className="p-2.5 bg-transparent border border-ez-gold/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-ez-gold"
                        value={packData.booking_id} onChange={(e) => setPackData({...packData, booking_id: e.target.value})}
                    />
                    <input 
                        type="number" step="0.1" placeholder="Weight (KG)" required className="p-2.5 bg-transparent border border-ez-gold/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-ez-gold"
                        value={packData.weight} onChange={(e) => setPackData({...packData, weight: e.target.value})}
                    />
                    <button type="submit" className="bg-ez-emerald text-ez-gold border border-ez-gold/30 hover:border-ez-gold rounded-xl font-bold transition-all">Prepare Package</button>
                </form>
            )}

            <div className="bg-white/5 rounded-3xl shadow-lg border border-ez-gold/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-ez-gold/20 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">
                            <tr>
                                <th className="px-6 py-4 text-center">ID</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ez-gold/10 text-sm font-medium">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-12"><Loader2 className="animate-spin mx-auto text-ez-gold" /></td></tr>
                            ) : deliveries.map(item => (
                                <tr key={item.delivery_id} className="hover:bg-ez-gold/5 transition-colors text-gray-300">
                                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-500">#{item.delivery_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-ez-gold/10 border border-ez-gold/20 rounded-full flex items-center justify-center">
                                                <Truck className="w-4 h-4 text-ez-gold" />
                                            </div>
                                            <span className="font-bold text-white">{item.agent_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-400 max-w-xs truncate">
                                            <MapPin className="w-3.5 h-3.5 text-ez-gold" /> {item.address_line}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{item.package_weight} KG</td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select 
                                                className="bg-ez-dark border border-ez-gold/30 rounded px-2 py-1.5 text-xs outline-none text-ez-gold font-bold focus:border-ez-gold"
                                                value={item.status}
                                                onChange={(e) => handleUpdateStatus(item.delivery_id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="out for delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <button className="p-1.5 hover:bg-ez-gold/10 rounded transition-colors border border-transparent hover:border-ez-gold/30"><ArrowRight className="w-4 h-4 text-ez-gold" /></button>
                                        </div>
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

export default ManageDeliveries;
