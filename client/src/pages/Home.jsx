import React, { useEffect, useState } from "react";
import { listFoods } from "../api/food";
import FoodCard from "../components/FoodCard";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [keyword, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await listFoods({
        keyword,
        category: category === "all" ? undefined : category,
      });
      setFoods(res.data.foods);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [keyword, category]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-primary-900 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
            Welcome to <span className="adu-text">Adu Food</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Experience authentic Ethiopian cuisine and international favorites delivered fresh to your door
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800 rounded-xl shadow-adu p-6 mb-8 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for your favorite food..."
              value={keyword}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 border-2 border-gray-600 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-lg bg-gray-700 text-white placeholder-gray-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔎</span>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-4 border-2 border-gray-600 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-lg min-w-[200px] bg-gray-700 text-white"
          >
            <option value="all">All Categories</option>
            <option value="burger">🍔 Burger</option>
            <option value="pizza">🍕 Pizza</option>
            <option value="ethiopian">🇪🇹 Ethiopian</option>
            <option value="drinks">🥤 Drinks</option>
            <option value="dessert">🍰 Dessert</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading delicious foods...</p>
        </div>
      ) : !Array.isArray(foods) || foods.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-2xl font-semibold text-gray-100 mb-2">No food found</h3>
          <p className="text-gray-400">Try adjusting your search or browse all categories</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-white">
              {keyword ? `Search results for "${keyword}"` : 'Our Menu'}
            </h2>
            <span className="text-gray-400">{foods.length} items found</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
