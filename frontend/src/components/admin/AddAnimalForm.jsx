import React, { useState } from 'react';

const AddAnimalForm = ({ categories, vendors, onSubmit }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    vendor_id: '',
    tag_no: '',
    weight: '',
    price: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, status: 'available' });
    setFormData({ category_id: '', vendor_id: '', tag_no: '', weight: '', price: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg border max-w-2xl mt-4">
      <h3 className="text-xl font-bold mb-4">Add New Animal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Tag Number</label>
          <input required type="text" value={formData.tag_no} onChange={e => setFormData({...formData, tag_no: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. TAG-C05" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded bg-white">
            <option value="">Select Category</option>
            {categories?.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vendor</label>
          <select required value={formData.vendor_id} onChange={e => setFormData({...formData, vendor_id: e.target.value})} className="w-full p-2 border rounded bg-white">
            <option value="">Select Vendor</option>
            {vendors?.map(v => <option key={v.vendor_id} value={v.vendor_id}>{v.name}</option>)}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input required type="number" step="0.1" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Price (PKR)</label>
            <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded" />
          </div>
        </div>

      </div>
      <button type="submit" className="mt-6 w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700">Add Animal</button>
    </form>
  );
};

export default AddAnimalForm;