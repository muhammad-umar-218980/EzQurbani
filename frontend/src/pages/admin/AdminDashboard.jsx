import React, { useContext, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    PawPrint, 
    ClipboardList, 
    CalendarClock, 
    Truck, 
    Users, 
    LogOut, 
    ShieldCheck,
    Menu,
    X,
    TrendingUp
} from 'lucide-react';

// Sub-pages (Placeholders to be built next)
import AdminOverview from './AdminOverview';
import ManageAnimals from './ManageAnimals';
import ManageBookings from './ManageBookings';
import ManageSchedules from './ManageSchedules';
import ManageDeliveries from './ManageDeliveries';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard/admin', name: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/admin/animals', name: 'Manage Animals', icon: PawPrint },
        { path: '/dashboard/admin/bookings', name: 'All Bookings', icon: ClipboardList },
        { path: '/dashboard/admin/schedules', name: 'Schedules', icon: CalendarClock },
        { path: '/dashboard/admin/deliveries', name: 'Deliveries', icon: Truck },
        { path: '/dashboard/admin/users', name: 'User Management', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-ez-dark overflow-hidden font-sans">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-ez-emerald border-r border-ez-gold/20 transition-all duration-300 flex flex-col z-20`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3 border-b border-ez-gold/20">
                    <div className="w-8 h-8 bg-ez-gold rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <ShieldCheck className="text-ez-emerald w-5 h-5" />
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl text-ez-gold tracking-tight font-serif">EzAdmin <span className="text-xs align-top">🛡️</span></span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border border-transparent ${
                                    isActive 
                                    ? 'bg-ez-gold text-ez-emerald font-bold shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                                    : 'text-ez-cream/70 hover:bg-white/5 hover:border-ez-gold/30 hover:text-ez-gold'
                                }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-ez-gold/20 bg-black/20">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-ez-gold/20 rounded-full flex items-center justify-center border border-ez-gold/50 shadow-inner">
                                <ShieldCheck className="w-5 h-5 text-ez-gold" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-ez-gold truncate capitalize font-mono">[{user?.role} Access]</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium text-sm border border-transparent hover:border-red-500/30"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Exit Dashboard</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-[#1a1a18] border-b border-ez-gold/20 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10 relative">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ez-gold/50 to-transparent"></div>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-ez-gold/10 rounded-lg text-ez-gold transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right bg-ez-gold/5 px-4 py-1.5 rounded-lg border border-ez-gold/20">
                            <p className="text-[10px] font-bold text-ez-cream/50 uppercase tracking-[0.2em] font-mono">System Core</p>
                            <p className="text-xs text-green-400 font-bold flex items-center justify-end gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Active
                            </p>
                        </div>
                    </div>
                </header>

                {/* Nested Content */}
                <div className="flex-1 overflow-y-auto bg-ez-dark p-6">
                    <Routes>
                        <Route path="/" element={<AdminOverview />} />
                        <Route path="/animals" element={<ManageAnimals />} />
                        <Route path="/bookings" element={<ManageBookings />} />
                        <Route path="/schedules" element={<ManageSchedules />} />
                        <Route path="/deliveries" element={<ManageDeliveries />} />
                        <Route path="/users" element={<ManageUsers />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
