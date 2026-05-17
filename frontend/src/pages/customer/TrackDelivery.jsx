import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { trackDelivery } from '../../api/deliveryApi';
import { getMyBookings } from '../../api/bookingApi';
import { Truck, MapPin, Calendar, CheckCircle2, Circle, Clock, Loader2, PackageSearch } from 'lucide-react';

const TrackDelivery = () => {
    const location = useLocation();
    const [bookingId, setBookingId] = useState(location.state?.booking_id || '');
    const [bookings, setBookings] = useState([]);
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyBookings();
        if (bookingId) {
            handleTrack(bookingId);
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

    const handleTrack = async (id) => {
        setLoading(true);
        setError('');
        try {
            const data = await trackDelivery(id);
            
            // Dynamic Time-Aware Status Logic
            const now = new Date();
            let computedStatus = 'pending';

            if (data.slaughter_date && data.slaughter_end_time) {
                const sDate = new Date(data.slaughter_date);
                const sDateStr = `${sDate.getFullYear()}-${String(sDate.getMonth()+1).padStart(2,'0')}-${String(sDate.getDate()).padStart(2,'0')}`;
                const slaughterEnd = new Date(`${sDateStr}T${data.slaughter_end_time}`);
                
                if (now >= slaughterEnd) {
                    computedStatus = 'slaughtered';
                    
                    if (data.delivery_date && data.shift_start && data.shift_end) {
                        const dDate = new Date(data.delivery_date);
                        const dDateStr = `${dDate.getFullYear()}-${String(dDate.getMonth()+1).padStart(2,'0')}-${String(dDate.getDate()).padStart(2,'0')}`;
                        const shiftStartD = new Date(`${dDateStr}T${data.shift_start}`);
                        const shiftEndD = new Date(`${dDateStr}T${data.shift_end}`);
                        
                        if (now >= shiftEndD) {
                            computedStatus = 'delivered';
                        } else if (now >= shiftStartD) {
                            computedStatus = 'out_for_delivery';
                        }
                    }
                }
            }

            data.computed_status = computedStatus;
            setTrackingInfo(data);
        } catch (err) {
            setError('No tracking information found for this booking yet.');
            setTrackingInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { key: 'pending', label: 'Order Placed', icon: Clock },
        { key: 'slaughtered', label: 'Packaged', icon: PackageSearch },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    const getStatusIndex = (status) => {
        const index = steps.findIndex(s => s.key === status.toLowerCase());
        return index === -1 ? 0 : index;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-bold text-ez-emerald font-serif text-center">Track Your Sacrifice</h1>
                <p className="text-gray-500 mt-2 text-center italic text-lg">Enter your booking ID or select from your active orders.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-ez-gold/20 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-ez-emerald uppercase tracking-wider mb-2">Select Booking</label>
                    <select 
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full p-3 bg-ez-cream/50 border border-ez-gold/30 rounded-xl outline-none focus:ring-2 focus:ring-ez-gold font-semibold text-ez-emerald"
                    >
                        <option value="">Select an order...</option>
                        {bookings.map(b => (
                            <option key={b.booking_id} value={b.booking_id}>
                                Order #{b.booking_id} - {b.animal_name} ({b.tag_no})
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => handleTrack(bookingId)}
                    disabled={!bookingId || loading}
                    className="w-full md:w-auto px-8 py-3 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-bold rounded-xl shadow-lg border border-ez-gold disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track Now'}
                </button>
            </div>

            {error && (
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-ez-gold/20 text-center animate-in fade-in slide-in-from-bottom-4">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center relative z-10 shadow-lg border-4 border-white">
                            <Clock className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute -inset-4 border-2 border-amber-100 rounded-full animate-[spin_4s_linear_infinite] border-t-amber-400"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-ez-emerald font-serif mb-2">Awaiting Progress</h3>
                    <p className="text-gray-500 max-w-sm">Your order is confirmed. Tracking information will appear here once the fulfillment process begins.</p>
                    
                    <div className="flex gap-2 mt-6">
                        <span className="w-2.5 h-2.5 bg-ez-gold rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-ez-gold rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2.5 h-2.5 bg-ez-gold rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}

            {trackingInfo && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Status Tracker */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-ez-gold/30">
                        <div className="flex justify-between items-center mb-12">
                            {steps.map((step, index) => {
                                const currentStatusIdx = getStatusIndex(trackingInfo.computed_status);
                                const isCompleted = index <= currentStatusIdx;
                                const isCurrent = index === currentStatusIdx;
                                const Icon = step.icon;

                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                                        {index < steps.length - 1 && (
                                            <div className={`absolute left-1/2 top-5 w-full h-1 z-0 ${
                                                index < currentStatusIdx ? 'bg-ez-gold' : 'bg-ez-cream border-t border-dashed border-ez-gold/30'
                                            }`} />
                                        )}
                                        
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 ${
                                            isCompleted ? 'bg-ez-emerald border-ez-gold/50 text-ez-gold shadow-md' : 'bg-white border-ez-cream text-gray-300'
                                        } ${isCurrent ? 'ring-4 ring-ez-gold/20 animate-pulse bg-white border-ez-gold text-ez-gold' : ''}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-bold mt-3 text-center ${isCompleted || isCurrent ? 'text-ez-emerald' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-ez-gold/20">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-ez-emerald">
                                    <div className="p-2 bg-ez-cream rounded-lg border border-ez-gold/20"><Truck className="w-5 h-5 text-ez-gold" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Logistics Partner</p>
                                        <p className="font-bold text-ez-emerald text-lg">{trackingInfo.agent_name || 'Assigning soon...'}</p>
                                    </div>
                                </div>
                                {trackingInfo.truck_name && (
                                <div className="flex items-center gap-3 text-ez-emerald ml-10">
                                    <div className="w-2 h-2 rounded-full bg-ez-gold"></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Refrigerated Truck</p>
                                        <p className="font-bold text-ez-emerald">{trackingInfo.truck_name}</p>
                                    </div>
                                </div>
                                )}
                                <div className="flex items-center gap-3 text-ez-emerald">
                                    <div className="p-2 bg-ez-cream rounded-lg border border-ez-gold/20"><MapPin className="w-5 h-5 text-ez-gold" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Delivery Address</p>
                                        <p className="font-bold text-ez-emerald">{trackingInfo.address_line}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-ez-emerald">
                                    <div className="p-2 bg-ez-cream rounded-lg border border-ez-gold/20"><Calendar className="w-5 h-5 text-ez-gold" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Expected Delivery</p>
                                        <p className="font-bold text-ez-emerald text-lg">
                                            {(() => {
                                                // If scheduled, show premium date & time
                                                if (trackingInfo.delivery_date) {
                                                    const d = new Date(trackingInfo.delivery_date);
                                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                    const formattedDate = `${d.getDate()} ${months[d.getMonth()]}`;
                                                    
                                                    if (trackingInfo.shift_start) {
                                                        const formatTime = (tStr) => {
                                                            const [h, m] = tStr.split(':').map(Number);
                                                            const ampm = h >= 12 ? 'PM' : 'AM';
                                                            const hrs = h % 12 || 12;
                                                            return `${hrs}:${String(m).padStart(2,'0')} ${ampm}`;
                                                        };
                                                        return `Expected Delivery: ${formattedDate}, ${formatTime(trackingInfo.shift_start)} – ${formatTime(trackingInfo.shift_end)}`;
                                                    }
                                                    return `Expected Delivery: ${formattedDate}`;
                                                }
                                                
                                                // Fallback estimate based on selected Eid Day preference before scheduling
                                                if (trackingInfo.qurbani_day) {
                                                    const day = trackingInfo.qurbani_day;
                                                    let estimatedDate = '27 May';
                                                    if (day.includes('2nd')) estimatedDate = '28 May';
                                                    if (day.includes('3rd')) estimatedDate = '29 May';
                                                    return `Expected Delivery: ${estimatedDate} (Pending Schedule)`;
                                                }
                                                
                                                return 'Scheduling...';
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackDelivery;
