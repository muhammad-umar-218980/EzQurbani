import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimals, getAnimalsSummary, getAnimalHissas } from '../../api/animalApi';
import AnimalCard from '../../components/customer/AnimalCard';
import HissaSelector from '../../components/customer/HissaSelector';
import { Loader2, ArrowLeft } from 'lucide-react';

const BrowseAnimals = () => {
    const [summary, setSummary] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [hissas, setHissas] = useState([]);
    const [loadingHissas, setLoadingHissas] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const data = await getAnimalsSummary();
            setSummary(data);
        } catch (err) {
            console.error('Failed to fetch animals summary');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnimalsByCategory = async (categoryName) => {
        setLoading(true);
        setSelectedCategory(categoryName);
        try {
            const data = await getAnimals(categoryName);
            setAnimals(data);
        } catch (err) {
            console.error('Failed to fetch animals');
        } finally {
            setLoading(false);
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

    const handleViewHissas = async (animal) => {
        setLoadingHissas(true);
        setSelectedAnimal(animal);
        try {
            const data = await getAnimalHissas(animal.animal_id);
            setHissas(data);
        } catch (err) {
            console.error('Failed to fetch hissas');
            setSelectedAnimal(null);
        } finally {
            setLoadingHissas(false);
        }
    };

    const handleSelectHissa = (hissa) => {
        navigate('/dashboard/customer/book-confirm', { 
            state: { 
                animal: selectedAnimal, 
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
                            <p className="text-gray-500 mt-1 italic">Select a {selectedCategory} to book your Qurbani or Hissa.</p>
                        </div>
                    </div>
                )}
            </div>

            {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {summary.map((cat) => (
                        <div 
                            key={cat.category_id} 
                            onClick={() => fetchAnimalsByCategory(cat.category_name)}
                            className="bg-white rounded-xl shadow-sm border border-ez-gold-light/20 p-8 cursor-pointer hover:shadow-md transition hover:-translate-y-1 flex flex-col items-center justify-center text-center"
                        >
                            <div className="text-6xl mb-4">
                                {cat.category_name === 'Bakra' ? '🐐' : 
                                 cat.category_name === 'Cow' ? '🐄' : 
                                 cat.category_name === 'Dumba' ? '🐑' : '🐪'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{cat.category_name}</h2>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold text-ez-emerald">{cat.available_count}</span> available
                            </p>
                            <div className="text-sm px-4 py-2 bg-gray-50 rounded-full text-gray-700">
                                Starting from Rs. {Number(cat.starting_price).toLocaleString()}
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
                            onViewHissas={handleViewHissas}
                        />
                    ))}
                </div>
            )}

            {selectedAnimal && !loadingHissas && (
                <HissaSelector 
                    animal={selectedAnimal}
                    hissas={hissas}
                    onClose={() => setSelectedAnimal(null)}
                    onSelect={handleSelectHissa}
                />
            )}

            {loadingHissas && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                </div>
            )}
        </div>
    );
};

export default BrowseAnimals;
