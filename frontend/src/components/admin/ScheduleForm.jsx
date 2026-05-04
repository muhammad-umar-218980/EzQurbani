import React, { useState } from 'react';

const ScheduleForm = ({ animals, houses, butchers, onSubmit }) => {
  const [formData, setFormData] = useState({
    animal_id: '',
    house_id: '',
    butcher_id: '',
    slaughter_date: '',
    slaughter_time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg border max-w-3xl mt-4">
      <h3 className="text-xl font-bold mb-4">Create Slaughter Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Animal</label>
          <select required value={formData.animal_id} onChange={e => setFormData({...formData, animal_id: e.target.value})} className="w-full p-2 border rounded bg-white">
            <option value="">Select Animal</option>
            {animals?.map(a => <option key={a.animal_id} value={a.animal_id}>{a.tag_no} ({a.category_name})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slaughter House</label>
          <select required value={formData.house_id} onChange={e => setFormData({...formData, house_id: e.target.value})} className="w-full p-2 border rounded bg-white">
            <option value="">Select House</option>
            {houses?.map(h => <option key={h.house_id} value={h.house_id}>{h.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assigned Butcher</label>
          <select required value={formData.butcher_id} onChange={e => setFormData({...formData, butcher_id: e.target.value})} className="w-full p-2 border rounded bg-white">
            <option value="">Select Butcher</option>
            {butchers?.map(b => <option key={b.butcher_id} value={b.butcher_id}>{b.name}</option>)}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input required type="date" value={formData.slaughter_date} onChange={e => setFormData({...formData, slaughter_date: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Time</label>
            <input required type="time" value={formData.slaughter_time} onChange={e => setFormData({...formData, slaughter_time: e.target.value})} className="w-full p-2 border rounded" />
          </div>
        </div>

      </div>
      <button type="submit" className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700">Schedule Execution</button>
    </form>
  );
};

export default ScheduleForm;