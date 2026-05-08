import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActiveHissaAnimal } from '../../api/animalApi';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const HissaBooking = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActiveAnimal();
    }, [category]);

    const fetchActiveAnimal = async () => {
        setLoading(true);
        try {
            const data = await getActiveHissaAnimal(category);
            setAnimal(data);
        } catch (err) {
            console.error('Failed to fetch hissa animal', err);
            setError(err.response?.data?.message || 'Failed to find an available animal for hissa.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHissa = (hissa) => {
        if (hissa.status !== 'available') return;
        navigate('/dashboard/customer/book-confirm', { 
            state: { 
                animal, 
                hissa, 
                type: 'hissa' 
            } 
        });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-ez-emerald transition"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    if (!animal) return null;

    const availableHissasCount = animal.hissas.filter(h => h.status === 'available').length;
    const bookedHissasCount = 7 - availableHissasCount;

    return (
        <div className="space-y-8 pb-12 max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/dashboard/customer/browse')}
                className="flex items-center gap-2 text-gray-600 hover:text-ez-emerald transition"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Browse
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-ez-gold/20 overflow-hidden">
                <div className="bg-ez-emerald text-white p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-serif">{category} Hissa Booking</h1>
                            <p className="text-white/80 mt-2">Tag No: {animal.tag_no}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-ez-gold text-2xl font-bold">Rs. {Number(animal.hissas[0]?.price).toLocaleString()}</div>
                            <div className="text-white/80 text-sm">per hissa</div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">Status</h3>
                            <p className="text-gray-500">Currently filling this animal</p>
                        </div>
                        <div className="flex items-center gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-red-500">{bookedHissasCount}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mt-1">Booked</div>
                            </div>
                            <div className="h-10 w-px bg-gray-200"></div>
                            <div>
                                <div className="text-3xl font-bold text-ez-emerald">{availableHissasCount}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mt-1">Available</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Select Your Hissa</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {animal.hissas.sort((a, b) => a.hissa_no - b.hissa_no).map((hissa) => {
                            const isAvailable = hissa.status === 'available';
                            return (
                                <div 
                                    key={hissa.hissa_id}
                                    onClick={() => handleSelectHissa(hissa)}
                                    className={`
                                        relative p-4 rounded-xl border-2 text-center transition-all cursor-pointer
                                        ${isAvailable 
                                            ? 'border-ez-emerald bg-ez-emerald/5 hover:bg-ez-emerald/10 text-ez-emerald hover:-translate-y-1' 
                                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <div className="text-lg font-bold">Hissa {hissa.hissa_no}</div>
                                    {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-xl">
                                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                                                <CheckCircle2 className="w-4 h-4" /> Booked
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HissaBooking;
