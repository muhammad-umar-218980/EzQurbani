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
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#3b82f6'];

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/20 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-4 font-serif text-xl tracking-wide">Revenue Trend (Last 7 Days)</h3>
                    <div className="flex-1 w-full">
                        {stats.revenueTrend && stats.revenueTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(201,168,76,0.3)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#c9a84c', fontWeight: 'bold' }}
                                        formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#c9a84c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-ez-gold/50 italic font-serif">No revenue data available</div>
                        )}
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/20 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-4 font-serif text-xl tracking-wide">Booking Distribution</h3>
                    <div className="flex-1 w-full">
                        {stats.categoryDistribution && stats.categoryDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(201,168,76,0.3)', borderRadius: '8px', color: '#fff' }}
                                        formatter={(value) => [value, 'Bookings']}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-ez-gold/50 italic font-serif">No distribution data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
