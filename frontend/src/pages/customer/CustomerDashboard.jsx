import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Search, 
    BookOpen, 
    CreditCard, 
    Receipt, 
    Truck, 
    LogOut, 
    User as UserIcon,
    Menu,
    X
} from 'lucide-react';

// Sub-pages
import BrowseAnimals from './BrowseAnimals';
import MyBookings from './MyBookings';
import MyPayments from './MyPayments';
import MyReceipts from './MyReceipts';
import TrackDelivery from './TrackDelivery';
import BookConfirm from './BookConfirm';
import HissaBooking from './HissaBooking';

const CustomerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard/customer', name: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/customer/browse', name: 'Browse Animals', icon: Search },
        { path: '/dashboard/customer/bookings', name: 'My Bookings', icon: BookOpen },
        { path: '/dashboard/customer/payment', name: 'Make Payment', icon: CreditCard },
        { path: '/dashboard/customer/receipts', name: 'My Receipts', icon: Receipt },
        { path: '/dashboard/customer/track', name: 'Track Delivery', icon: Truck },
    ];

    return (
        <div className="flex h-screen bg-ez-cream overflow-hidden">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-ez-emerald border-r border-ez-gold/20 transition-all duration-300 flex flex-col`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3 border-b border-ez-gold/20">
                    <div className="w-8 h-8 bg-ez-gold rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-ez-emerald font-bold text-xl font-serif">☽</span>
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl text-white tracking-tight font-serif">EzQurbani</span>}
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-ez-gold/10 text-ez-gold' 
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-ez-gold/20 bg-black/10">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-ez-gold/20 rounded-full flex items-center justify-center border border-ez-gold/30">
                                <UserIcon className="w-5 h-5 text-ez-gold" />
                            </div>
                            <div className="overflow-hidden text-ellipsis">
                                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Customer'}</p>
                                <p className="text-xs text-white/50 truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-ez-gold/20 flex items-center justify-between px-6 flex-shrink-0">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-ez-cream rounded-lg text-ez-emerald transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold bg-ez-gold/20 text-ez-emerald px-3 py-1.5 rounded-full capitalize border border-ez-gold/30 shadow-sm">
                            {user?.role} Portal
                        </span>
                    </div>
                </header>

                {/* Nested Content Scrollable */}
                <div className="flex-1 overflow-y-auto bg-ez-cream p-6">
                    <Routes>
                        <Route path="/" element={<Overview user={user} />} />
                        <Route path="/browse" element={<BrowseAnimals />} />
                        <Route path="/hissa-booking/:category" element={<HissaBooking />} />
                        <Route path="/book-confirm" element={<BookConfirm />} />
                        <Route path="/bookings" element={<MyBookings />} />
                        <Route path="/payment" element={<MyPayments />} />
                        <Route path="/receipts" element={<MyReceipts />} />
                        <Route path="/track" element={<TrackDelivery />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

// Default Overview Component
const Overview = ({ user }) => (
    <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-ez-gold/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-ez-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <h1 className="text-3xl font-bold text-ez-emerald font-serif">Assalam-o-Alaikum, <span className="italic text-ez-gold">{user?.name || 'Customer'}</span>!</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your sacrificial animal bookings from your personal dashboard.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-ez-gold/20 p-6 rounded-2xl text-ez-emerald shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-ez-emerald rounded-xl flex items-center justify-center mb-4 text-ez-gold">
                    <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-500">Browse Inventory</h3>
                <p className="text-3xl font-bold mt-1 font-serif">Animals</p>
                <Link to="/dashboard/customer/browse" className="inline-flex items-center mt-4 text-sm font-bold text-ez-gold group-hover:text-ez-emerald transition-colors">Explore Now →</Link>
            </div>
            
            <div className="bg-white border border-ez-gold/20 p-6 rounded-2xl text-ez-emerald shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-ez-emerald rounded-xl flex items-center justify-center mb-4 text-ez-gold">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-500">My Orders</h3>
                <p className="text-3xl font-bold mt-1 font-serif">Bookings</p>
                <Link to="/dashboard/customer/bookings" className="inline-flex items-center mt-4 text-sm font-bold text-ez-gold group-hover:text-ez-emerald transition-colors">View Status →</Link>
            </div>
            
            <div className="bg-white border border-ez-gold/20 p-6 rounded-2xl text-ez-emerald shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-ez-emerald rounded-xl flex items-center justify-center mb-4 text-ez-gold">
                    <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-500">Tracking</h3>
                <p className="text-3xl font-bold mt-1 font-serif">Delivery</p>
                <Link to="/dashboard/customer/track" className="inline-flex items-center mt-4 text-sm font-bold text-ez-gold group-hover:text-ez-emerald transition-colors">Track Package →</Link>
            </div>
        </div>
    </div>
);

export default CustomerDashboard;
