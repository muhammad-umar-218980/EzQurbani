import React, { useState, useEffect } from 'react';
import { getAllSchedules, getAllHouses, getAllButchers, createSchedule } from '../../api/adminApi';
import { getAnimals } from '../../api/animalApi';
import { Calendar, Clock, MapPin, User, Loader2, PlusCircle } from 'lucide-react';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [houses, setHouses] = useState([]);
    const [butchers, setButchers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        animal_id: '',
        house_id: '',
        butcher_id: '',
        slaughter_date: '',
        slaughter_time: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [scheds, anims, hs, btch] = await Promise.all([
                getAllSchedules(), getAnimals(), getAllHouses(), getAllButchers()
            ]);
            setSchedules(scheds);
            setAnimals(anims.filter(a => a.status === 'booked'));
            setHouses(hs);
            setButchers(btch);
        } catch (err) {
            console.error('Fetch error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSchedule(formData);
            fetchData();
            setFormData({ animal_id: '', house_id: '', butcher_id: '', slaughter_date: '', slaughter_time: '', status: 'pending' });
        } catch (err) {
            alert('Scheduling failed');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/20">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 font-serif tracking-wide">
                        <PlusCircle className="text-ez-gold w-5 h-5" /> New Schedule ⏰
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Select Animal</label>
                            <select 
                                className="w-full p-2.5 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold" required
                                value={formData.animal_id} onChange={(e) => setFormData({...formData, animal_id: e.target.value})}
                            >
                                <option value="">Choose booked animal...</option>
                                {animals.map(a => <option key={a.animal_id} value={a.animal_id}>{a.tag_no} - {a.category_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Slaughterhouse</label>
                            <select 
                                className="w-full p-2.5 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold" required
                                value={formData.house_id} onChange={(e) => setFormData({...formData, house_id: e.target.value})}
                            >
                                <option value="">Select location...</option>
                                {houses.map(h => <option key={h.house_id} value={h.house_id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Butcher</label>
                            <select 
                                className="w-full p-2.5 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold" required
                                value={formData.butcher_id} onChange={(e) => setFormData({...formData, butcher_id: e.target.value})}
                            >
                                <option value="">Assign butcher...</option>
                                {butchers.map(b => <option key={b.butcher_id} value={b.butcher_id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                                <input 
                                    type="date" className="w-full p-2.5 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold" required
                                    value={formData.slaughter_date} onChange={(e) => setFormData({...formData, slaughter_date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time</label>
                                <input 
                                    type="time" className="w-full p-2.5 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold" required
                                    value={formData.slaughter_time} onChange={(e) => setFormData({...formData, slaughter_time: e.target.value})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-ez-emerald text-ez-gold font-bold py-3 rounded-xl border border-ez-gold/30 hover:border-ez-gold transition-all active:scale-[0.98]">
                            Assign Schedule
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold text-white font-serif tracking-wide">Active Schedules 📅</h2>
                {loading ? <Loader2 className="animate-spin mx-auto mt-12 text-ez-gold" /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedules.map(item => (
                            <div key={item.schedule_id} className="bg-white/5 p-5 rounded-2xl shadow-lg border border-ez-gold/20 relative overflow-hidden group hover:border-ez-gold/50 transition-all">
                                <div className="absolute top-0 right-0 p-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-ez-gold/20 text-ez-gold'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-4">{item.category_name} ({item.tag_no})</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 text-ez-gold" /> {item.house_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <User className="w-4 h-4 text-ez-gold" /> {item.butcher_name}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-white font-bold border-t border-ez-gold/10 pt-3">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-ez-gold/70" /> {new Date(item.slaughter_date).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-ez-gold/70" /> {item.slaughter_time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSchedules;
