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
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="input" />
      <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} className="input" />
      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input" />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="input" />
      <button className="btn">Submit</button>
    </form>
  );
};

export default FoodForm;
