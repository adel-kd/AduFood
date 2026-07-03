import { useState } from 'react';

const FoodForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    price: initialData.price || '',
    description: initialData.description || '',
    image: initialData.image || '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900" />
      <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900" />
      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900" />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900" />
      <button className="w-full py-3 bg-[#dd804f] hover:bg-[#c9723c] text-white font-medium rounded-lg transition-colors">Submit</button>
    </form>
  );
};

export default FoodForm;
