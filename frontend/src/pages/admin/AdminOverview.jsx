import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { 
    ClipboardList, 
    CircleDollarSign, 
    PawPrint, 
    Truck, 
    TrendingUp,
    Loader2
} from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-ez-gold" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Bookings', value: stats.totalBookings, icon: ClipboardList, color: 'text-ez-gold', bg: 'bg-ez-gold/10' },
        { label: 'Total Revenue', value: `Rs. ${parseFloat(stats.totalRevenue).toLocaleString()}`, icon: CircleDollarSign, color: 'text-ez-gold', bg: 'bg-ez-gold/10' },
        { label: 'Animals Available', value: stats.availableAnimals, icon: PawPrint, color: 'text-ez-gold', bg: 'bg-ez-gold/10' },
        { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: Truck, color: 'text-ez-gold', bg: 'bg-ez-gold/10' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white font-serif tracking-wide">System Overview 📈</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-widest">Real-time performance metrics</p>
                </div>
                <div className="bg-ez-gold/10 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(201,168,76,0.1)] border border-ez-gold/30 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-ez-gold animate-pulse" />
                    <span className="text-sm font-bold text-ez-gold">Growth +12%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/20 flex items-center gap-4 hover:border-ez-gold/50 hover:bg-white/10 transition-all cursor-default">
                            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center border border-ez-gold/20 shadow-inner`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                                <p className="text-2xl font-black text-white">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 p-8 rounded-2xl shadow-lg border border-ez-gold/20 h-64 flex items-center justify-center text-ez-gold/50 italic font-serif text-lg">
                    Revenue Chart Placeholder
                </div>
                <div className="bg-white/5 p-8 rounded-2xl shadow-lg border border-ez-gold/20 h-64 flex items-center justify-center text-ez-gold/50 italic font-serif text-lg">
                    Booking Category Distribution Placeholder
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
