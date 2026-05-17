import React, { useState, useEffect, useMemo } from 'react';
import { getAllSchedules, getAllHouses, getAllButchers, createSchedule, getBookedAnimals } from '../../api/adminApi';
import { Calendar, Clock, MapPin, User, Loader2, PlusCircle, AlertCircle } from 'lucide-react';

const ANIMAL_DURATIONS = {
    'Goat/Bakra': 45,
    'Dumba': 45,
    'Cow': 180,
    'Camel': 270
};

const getDuration = (categoryName) => {
    if (!categoryName) return 45;
    for (const key in ANIMAL_DURATIONS) {
        if (categoryName.includes(key) || key.includes(categoryName)) {
            return ANIMAL_DURATIONS[key];
        }
    }
    return 45; // Default fallback
};

const EID_DATES = {
    '1st Day': '2026-05-27',
    '2nd Day': '2026-05-28',
    '3rd Day': '2026-05-29',
    '1st Day of Eid': '2026-05-27',
    '2nd Day of Eid': '2026-05-28',
    '3rd Day of Eid': '2026-05-29'
};

const MAX_CAPACITY_MINS = 9 * 60; // 540 minutes
const BASE_TIME = '07:00';

const addMinutes = (timeString, minsToAdd) => {
    const [hours, mins] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins, 0, 0);
    date.setMinutes(date.getMinutes() + minsToAdd);
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
};

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
            setLoading(true);
            const activeDate = formData.slaughter_date || EID_DATES['1st Day'];
            const [scheds, anims, hs, btch] = await Promise.all([
                getAllSchedules(), getBookedAnimals(), getAllHouses(), getAllButchers(activeDate)
            ]);
            setSchedules(scheds);
            // Filter out animals that already have a schedule
            const scheduledAnimalIds = new Set(scheds.map(s => s.animal_id));
            setAnimals(anims.filter(a => !scheduledAnimalIds.has(a.animal_id)));
            setHouses(hs);
            
            // Format butcher names to ensure they have "Crew" appended if they don't already
            const formattedButchers = btch.map(b => ({
                ...b,
                name: b.name.endsWith('Crew') ? b.name : `${b.name} Crew`
            }));
            setButchers(formattedButchers);
            
            console.log('--- Butcher Availability Loaded ---');
            formattedButchers.forEach(b => {
                console.log(`Crew: ${b.name}, Used Minutes: ${b.used_minutes}, Remaining Minutes: ${b.remaining_minutes}`);
            });
        } catch (err) {
            console.error('Fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-update date when animal is selected
    useEffect(() => {
        if (formData.animal_id) {
            const animal = animals.find(a => a.animal_id.toString() === formData.animal_id);
            if (animal) {
                const date = EID_DATES[animal.qurbani_day] || EID_DATES['1st Day'];
                setFormData(prev => ({ ...prev, slaughter_date: date, butcher_id: '', slaughter_time: '' }));
            }
        }
    }, [formData.animal_id, animals]);

    // Fetch butchers whenever slaughter_date changes to get exact real-time availability for that date!
    useEffect(() => {
        const activeDate = formData.slaughter_date || EID_DATES['1st Day'];
        const loadButcherAvailability = async () => {
            try {
                const btch = await getAllButchers(activeDate);
                const formattedButchers = btch.map(b => ({
                    ...b,
                    name: b.name.endsWith('Crew') ? b.name : `${b.name} Crew`
                }));
                setButchers(formattedButchers);
            } catch (err) {
                console.error('Error fetching butcher capacity', err);
            }
        };
        loadButcherAvailability();
    }, [formData.slaughter_date, schedules]);

    const selectedAnimal = useMemo(() => animals.find(a => a.animal_id.toString() === formData.animal_id), [formData.animal_id, animals]);
    const requiredMins = selectedAnimal ? getDuration(selectedAnimal.category_name) : 0;

    // Phase 1: Calculate capacity for ALL crews
    const allCrewsWithCapacity = useMemo(() => {
        return butchers.map(b => {
            const usedMins = b.used_minutes !== undefined ? b.used_minutes : 0;
            const remaining = b.remaining_minutes !== undefined ? b.remaining_minutes : MAX_CAPACITY_MINS;
            const canTake = remaining >= requiredMins;
            const nextSlot = addMinutes(BASE_TIME, usedMins);
            return { ...b, usedMins, remaining, canTake, nextSlot };
        }).sort((a, b) => b.remaining - a.remaining); // Step 6: sort MOST available first!
    }, [butchers, requiredMins]);

    // Phase 2: Filter crews based on selected house (if any)
    const filteredCrews = useMemo(() => {
        if (!formData.house_id) return allCrewsWithCapacity;
        return allCrewsWithCapacity.filter(b => b.house_id.toString() === formData.house_id);
    }, [allCrewsWithCapacity, formData.house_id]);

    // Auto-update time when crew is selected
    useEffect(() => {
        if (formData.butcher_id) {
            const crew = filteredCrews.find(c => c.butcher_id.toString() === formData.butcher_id);
            if (crew) {
                setFormData(prev => ({ ...prev, slaughter_time: crew.nextSlot }));
            }
        }
    }, [formData.butcher_id, filteredCrews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Step 5: Prevent over-assignment on frontend
        const selectedCrew = filteredCrews.find(c => c.butcher_id.toString() === formData.butcher_id);
        if (selectedCrew && selectedCrew.remaining < requiredMins) {
            alert("This crew does not have enough time remaining today");
            return;
        }

        try {
            console.log('--- Creating Schedule Assignment ---');
            console.log(`Animal: ${formData.animal_id}, Crew: ${formData.butcher_id}, Date: ${formData.slaughter_date}`);
            
            await createSchedule(formData);
            
            // Step 4: REFETCH schedules and butchers, do NOT rely on old state!
            await fetchData();
            
            setFormData({ animal_id: '', house_id: '', butcher_id: '', slaughter_date: '', slaughter_time: '', status: 'pending' });
        } catch (err) {
            console.error('Scheduling error', err);
            const errMsg = err.response?.data?.message || 'Scheduling failed';
            alert(errMsg);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 p-8 rounded-2xl shadow-lg border border-ez-gold/20">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-serif tracking-wide">
                        <PlusCircle className="text-ez-gold w-6 h-6" /> New Schedule
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Animal Selection Block */}
                        <div className="bg-ez-dark/50 p-4 rounded-xl border border-ez-gold/10">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-3">1. Select Animal</label>
                            <select 
                                className="w-full p-3 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold transition-colors" 
                                required
                                value={formData.animal_id} 
                                onChange={(e) => setFormData({...formData, animal_id: e.target.value})}
                            >
                                <option value="">Choose booked animal...</option>
                                {animals.map(a => <option key={a.animal_id} value={a.animal_id}>{a.tag_no} - {a.category_name} ({a.qurbani_day || '1st Day'})</option>)}
                            </select>
                            
                            {formData.animal_id && formData.slaughter_date && (
                                <div className="mt-4 p-4 bg-ez-gold/10 border border-ez-gold/20 rounded-lg flex items-center gap-3">
                                    <Calendar className="text-ez-gold w-5 h-5" />
                                    <span className="text-sm text-gray-300">
                                        Assigned Date:<br/>
                                        <strong className="text-white text-base">{new Date(formData.slaughter_date).toLocaleDateString()}</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Location Selection Block */}
                        <div className="bg-ez-dark/50 p-4 rounded-xl border border-ez-gold/10">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-3">2. Slaughterhouse</label>
                            <select 
                                className="w-full p-3 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold transition-colors" 
                                required
                                value={formData.house_id} 
                                onChange={(e) => setFormData({...formData, house_id: e.target.value, butcher_id: ''})}
                            >
                                <option value="">Select location...</option>
                                {houses.map(h => <option key={h.house_id} value={h.house_id}>{h.name}</option>)}
                            </select>
                        </div>

                        {/* Crew Selection Block */}
                        <div className="bg-ez-dark/50 p-4 rounded-xl border border-ez-gold/10">
                            <label className="block text-sm font-bold text-gray-400 uppercase mb-3">3. Crew Assignment</label>
                            <select 
                                className="w-full p-3 bg-ez-dark border border-ez-gold/30 rounded-lg outline-none text-white focus:border-ez-gold transition-colors" 
                                required
                                value={formData.butcher_id} 
                                onChange={(e) => setFormData({...formData, butcher_id: e.target.value})}
                            >
                                <option value="">Assign crew...</option>
                                {filteredCrews.map(c => {
                                    const remainingHours = Math.floor(c.remaining / 60);
                                    const remainingMins = c.remaining % 60;
                                    const timeStr = `${remainingHours}h ${remainingMins}m remaining`;
                                    return (
                                        <option key={c.butcher_id} value={c.butcher_id} disabled={!c.canTake}>
                                            {c.name} — {timeStr} {!c.canTake ? '(Capacity Full)' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            
                            {filteredCrews.length === 0 && (
                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> No crews available for this house
                                </p>
                            )}

                            {formData.butcher_id && formData.slaughter_time && (
                                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                                    <Clock className="text-green-400 w-5 h-5 mt-1" />
                                    <span className="text-sm text-gray-300 leading-relaxed">
                                        Generated Time Slot:<br/>
                                        <strong className="text-white text-lg">{formData.slaughter_time}</strong><br/>
                                        <span className="text-xs opacity-75">Requires {requiredMins} mins</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={!formData.butcher_id || !formData.slaughter_time} 
                                className="w-full bg-ez-emerald text-ez-gold font-bold py-4 rounded-xl border border-ez-gold/30 hover:border-ez-gold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                Confirm Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold text-white font-serif tracking-wide mb-8">Active Schedules</h2>
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin w-10 h-10 text-ez-gold" />
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="bg-white/5 p-8 rounded-2xl text-center text-gray-400 border border-ez-gold/10">
                        No schedules have been created yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {schedules.map(item => (
                            <div key={item.schedule_id} className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/20 relative overflow-hidden group hover:border-ez-gold/50 transition-all flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-3">
                                    <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-md ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-ez-gold/20 text-ez-gold'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-6 pr-20">{item.category_name} ({item.tag_no})</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <MapPin className="w-5 h-5 text-ez-gold" /> 
                                        <span>{item.house_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <User className="w-5 h-5 text-ez-gold" /> 
                                        <span>{item.butcher_name.endsWith('Crew') ? item.butcher_name : `${item.butcher_name} Crew`}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-white font-bold border-t border-ez-gold/10 pt-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-ez-gold/70" /> 
                                            {new Date(item.slaughter_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-ez-gold/70" /> 
                                            {item.slaughter_time?.substring(0, 5)}
                                        </div>
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
