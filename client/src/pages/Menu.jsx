import React from 'react';
import { listFoods } from '../api/food';
import FoodCard from '../components/FoodCard';
import { Search } from 'lucide-react';

export default function Menu() {
  const [foods, setFoods] = React.useState([]);
  const [keyword, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [loading, setLoading] = React.useState(true);

  const categories = [
    { key: 'all', label: 'All', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=60' },
    { key: 'ethiopian', label: 'Ethiopian', img: 'https://i.pinimg.com/736x/8c/1e/84/8c1e84cc35c2e58d567677224fbaa9ee.jpg' },
    { key: 'drinks', label: 'Drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=60' },
    { key: 'desserts', label: 'Desserts', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=60' },
  ];

  React.useEffect(() => {
    const fetchFoods = async () => {
      try {
        const params = { keyword };
        if (category !== 'all') {
          params.category = category;
        }
        const res = await listFoods(params);
        setFoods(res.data.foods || []);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [keyword, category]);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-gray-600 text-lg">Discover delicious Ethiopian cuisine and more</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={keyword}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === cat.key
                    ? 'bg-[#dd804f] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No dishes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
