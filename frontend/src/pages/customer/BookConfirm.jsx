import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookingApi';
import { CheckCircle, AlertCircle, ArrowLeft, Calendar, Truck, MapPin, Info } from 'lucide-react';

const BookConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { animal, hissa, type } = location.state || {};
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // New Form States
    const [qurbaniDay, setQurbaniDay] = useState('');
    const [deliveryPref, setDeliveryPref] = useState('');
    const [address, setAddress] = useState('');

    if (!animal) {
        return <div className="p-8 text-center">Invalid selection. Please go back.</div>;
    }

    const price = type === 'hissa' ? parseFloat(hissa.price) : parseFloat(animal.price);

    const isFullAnimal = type === 'full';
    
    const handleConfirm = async () => {
        setError('');
        
        // Validation
        if (isFullAnimal && !qurbaniDay) {
            setError('Please select a Qurbani day.');
            return;
        }
        if (!deliveryPref) {
            setError('Please select a delivery preference.');
            return;
        }
        if ((deliveryPref === 'perform_and_deliver' || deliveryPref === 'deliver_alive') && !address.trim()) {
            setError('Please provide a delivery address.');
            return;
        }

        setIsLoading(true);
        try {
            await createBooking({
                animal_id: animal.animal_id,
                hissa_id: hissa?.hissa_id || null,
                booking_type: type,
                total_amount: price,
                qurbani_day: isFullAnimal ? qurbaniDay : null,
                delivery_preference: deliveryPref,
                address_line: address
            });
            navigate('/dashboard/customer/bookings', { state: { success: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="bg-white rounded-3xl shadow-xl border border-ez-gold/20 overflow-hidden">
                <div className="bg-ez-emerald p-8 text-ez-cream relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ez-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <h2 className="text-3xl font-bold font-serif text-ez-gold">Booking Confirmation</h2>
                    <p className="opacity-90 mt-1 italic">Please review your sacrificial selection details.</p>
                </div>

                <div className="p-8 space-y-8 bg-ez-cream/30">
                    {/* Summary Section */}
                    <div className="bg-white p-6 rounded-2xl border border-ez-gold/20 shadow-sm space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs font-serif">Sacrifice Type</span>
                            <span className="text-ez-emerald font-bold capitalize text-lg">{animal.category_name}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs font-serif">Booking Option</span>
                            <span className="text-ez-emerald font-bold capitalize text-lg">{type === 'hissa' ? `Hissa Slot #${hissa.hissa_no}` : 'Full Animal'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs font-serif">Tag Number</span>
                            <span className="text-ez-emerald font-bold text-lg">{animal.tag_no}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xl font-bold text-ez-emerald font-serif">Total Price</span>
                            <span className="text-3xl font-black text-ez-emerald">Rs. {price.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Preferences Form */}
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-ez-gold/20 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 font-serif border-b border-gray-100 pb-4">Booking Preferences</h3>
                        
                        {isFullAnimal && (
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 font-semibold text-gray-700">
                                    <Calendar className="w-5 h-5 text-ez-gold" /> Which day would you like the Qurbani to be performed?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['1st Day of Eid', '2nd Day of Eid', '3rd Day of Eid'].map((day) => (
                                        <label key={day} className={`
                                            cursor-pointer p-3 border rounded-xl flex items-center gap-3 transition-all
                                            ${qurbaniDay === day ? 'border-ez-emerald bg-ez-emerald/5 shadow-sm' : 'border-gray-200 hover:border-ez-gold/50'}
                                        `}>
                                            <input 
                                                type="radio" 
                                                name="qurbaniDay" 
                                                value={day}
                                                checked={qurbaniDay === day}
                                                onChange={(e) => setQurbaniDay(e.target.value)}
                                                className="text-ez-emerald focus:ring-ez-emerald"
                                            />
                                            <span className="font-medium text-gray-700">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                            <label className="flex items-center gap-2 font-semibold text-gray-700">
                                <Truck className="w-5 h-5 text-ez-gold" /> What would you like us to do?
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                <label className={`
                                    cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all
                                    ${deliveryPref === 'perform_and_deliver' ? 'border-ez-emerald bg-ez-emerald/5 shadow-sm' : 'border-gray-200 hover:border-ez-gold/50'}
                                `}>
                                    <input 
                                        type="radio" 
                                        name="deliveryPref" 
                                        value="perform_and_deliver"
                                        checked={deliveryPref === 'perform_and_deliver'}
                                        onChange={(e) => setDeliveryPref(e.target.value)}
                                        className="text-ez-emerald focus:ring-ez-emerald mt-1"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900 block">Perform Qurbani and Deliver Meat</span>
                                        <span className="text-sm text-gray-500">We slaughter, process, and deliver the meat to you.</span>
                                    </div>
                                </label>

                                {isFullAnimal && (
                                    <label className={`
                                        cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all
                                        ${deliveryPref === 'deliver_alive' ? 'border-ez-emerald bg-ez-emerald/5 shadow-sm' : 'border-gray-200 hover:border-ez-gold/50'}
                                    `}>
                                        <input 
                                            type="radio" 
                                            name="deliveryPref" 
                                            value="deliver_alive"
                                            checked={deliveryPref === 'deliver_alive'}
                                            onChange={(e) => setDeliveryPref(e.target.value)}
                                            className="text-ez-emerald focus:ring-ez-emerald mt-1"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-900 block">Deliver Whole Animal Alive</span>
                                            <span className="text-sm text-gray-500">We deliver the live animal to your address before Eid.</span>
                                        </div>
                                    </label>
                                )}

                                <label className={`
                                    cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all
                                    ${deliveryPref === 'pickup' ? 'border-ez-emerald bg-ez-emerald/5 shadow-sm' : 'border-gray-200 hover:border-ez-gold/50'}
                                `}>
                                    <input 
                                        type="radio" 
                                        name="deliveryPref" 
                                        value="pickup"
                                        checked={deliveryPref === 'pickup'}
                                        onChange={(e) => setDeliveryPref(e.target.value)}
                                        className="text-ez-emerald focus:ring-ez-emerald mt-1"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900 block">I Will Pick It Up Myself</span>
                                        <span className="text-sm text-gray-500">You will visit our center to pick up the meat/animal.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {(deliveryPref === 'perform_and_deliver' || deliveryPref === 'deliver_alive') && (
                            <div className="space-y-3 pt-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700">
                                    <MapPin className="w-5 h-5 text-ez-gold" /> Delivery Address
                                </label>
                                <textarea 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your complete delivery address..."
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ez-emerald focus:border-transparent outline-none transition resize-none h-24"
                                ></textarea>
                            </div>
                        )}
                    </div>

                    {/* Cancellation Policy */}
                    <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl flex items-start gap-4">
                        <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-yellow-800">Cancellation Policy</h4>
                            <p className="text-yellow-700 mt-1">
                                Bookings can only be cancelled up to <span className="font-bold">7 days before Eid</span>. After this period, no cancellations will be accepted.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="w-full bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-black py-4 text-lg rounded-xl shadow-lg border border-ez-gold transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing...' : (
                                <>
                                    <CheckCircle className="w-5 h-5" /> Confirm Booking
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookConfirm;
