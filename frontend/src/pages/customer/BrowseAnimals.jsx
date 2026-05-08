import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimals } from '../../api/animalApi';
import AnimalCard from '../../components/customer/AnimalCard';
import { Loader2, ArrowLeft } from 'lucide-react';

const BrowseAnimals = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const categories = [
        { id: 1, name: 'Bakra', type: 'full', emoji: '🐐', price: 65000 },
        { id: 2, name: 'Dumba', type: 'full', emoji: '🐑', price: 55000 },
        { id: 3, name: 'Cow', type: 'full', emoji: '🐄', price: 210000 },
        { id: 4, name: 'Camel', type: 'full', emoji: '🐪', price: 450000 },
        { id: 5, name: 'Cow Hissa', type: 'hissa', emoji: '🐄', price: 30000 },
        { id: 6, name: 'Camel Hissa', type: 'hissa', emoji: '🐪', price: 65000 },
    ];

    const handleCategoryClick = async (cat) => {
        if (cat.type === 'hissa') {
            const baseCategory = cat.name.split(' ')[0]; // 'Cow' or 'Camel'
            navigate(`/dashboard/customer/hissa-booking/${baseCategory}`);
        } else {
            setLoading(true);
            setSelectedCategory(cat.name);
            try {
                const data = await getAnimals(cat.name);
                setAnimals(data);
            } catch (err) {
                console.error('Failed to fetch animals');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBackToSummary = () => {
        setSelectedCategory(null);
        setAnimals([]);
    };

    const handleBookFull = (animal) => {
        navigate('/dashboard/customer/book-confirm', { 
            state: { animal, type: 'full' } 
        });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                {!selectedCategory ? (
                    <>
                        <h1 className="text-4xl font-bold text-ez-emerald font-serif">Choose Your Sacrifice</h1>
                        <p className="text-gray-500 mt-2 italic text-lg">Browse our high-quality inventory for your Qurbani.</p>
                    </>
                ) : (
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleBackToSummary}
                            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-ez-emerald font-serif">Available {selectedCategory}s</h1>
                            <p className="text-gray-500 mt-1 italic">Select a {selectedCategory} to book your Qurbani.</p>
                        </div>
                    </div>
                )}
            </div>

            {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <div 
                            key={cat.id} 
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-white rounded-xl shadow-sm border border-ez-gold-light/20 p-8 cursor-pointer hover:shadow-md transition hover:-translate-y-1 flex flex-col items-center justify-center text-center"
                        >
                            <div className="text-6xl mb-4">
                                {cat.emoji}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{cat.name}</h2>
                            <p className="text-gray-600 mb-4">
                                {cat.type === 'full' ? 'Full Animal Booking' : 'Shared Hissa Booking'}
                            </p>
                            <div className="text-sm px-4 py-2 bg-gray-50 rounded-full text-gray-700">
                                Starting from Rs. {cat.price.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {animals.map((animal) => (
                        <AnimalCard 
                            key={animal.animal_id} 
                            animal={animal} 
                            onBookFull={handleBookFull}
                            // onViewHissas removed since we have separate flow now
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseAnimals;
