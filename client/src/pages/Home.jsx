import React, { useEffect, useState, useRef } from "react";
import { listFoods } from "../api/food";
import FoodCard from "../components/FoodCard";
import { Search } from "lucide-react";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [keyword, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const menuRef = useRef(null);

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

  const scrollToMenu = () => {
    if (menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ShinyText component
  const ShinyText = ({ text, disabled = false, speed = 6, className = '' }) => {
    const animationDuration = `${speed}s`;
    return (
      <span
        className={`text-transparent bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgba(236, 148, 32, 0.85) 30%, #dd804f 80%, rgb(243, 187, 114) 70%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          animationDuration: animationDuration,
          fontWeight: 'bold',
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden mb-8 md:mb-12 mt-4">
          {/* Hero background */}
          <div
            className="absolute inset-0 h-64 md:h-96 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://plus.unsplash.com/premium_photo-1695297516698-fd7a320a55e5?w=800&auto=format&fit=crop&q=60')",
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 h-64 md:h-96 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
          
          {/* Hero content */}
          <div className="relative flex flex-col justify-center items-center h-64 md:h-96 text-center px-4 py-8 md:py-16">
            {/* Mobile view */}
            <div className="flex flex-col items-center w-full md:hidden">
              {/* Logo */}
              <div className="flex items-center justify-center mb-3">
                <span className="relative inline-block">
                  <span className="absolute animate-pulse -top-2 -left-2 w-14 h-14 rounded-full bg-[#dd804f]/30 blur-lg"></span>
                  <span className="inline-block text-5xl animate-bounce" style={{ filter: "drop-shadow(0 0 8px #dd804f88)" }}>
                    <img src="../../dist/images/logoicon.png" alt="logo" className="w-16 h-16 pt-2" />
                  </span>
                </span>
              </div>
              <h1 className="text-3xl font-display font-extrabold mb-5 drop-shadow-lg">
                <span className="text-white">Welcome to</span>&nbsp;
                <ShinyText text="Adu Food" className="whitespace-nowrap" />
              </h1>
             
              <div className="flex flex-col gap-2 w-full px-">
                <button
                  onClick={scrollToMenu}
                  className="bg-[#dd804f] hover:bg-[#c9723c] text-white font-semibold px-5 py-2 rounded-xl border-2 border-[#ec9420] hover:border-[#c9723c] transition duration-300 shadow-md"
                >
                  Order Now
                </button>
                <button
                  onClick={scrollToMenu}
                  className=" bg-white/95 hover:bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl border-2 border-[#ec9420] transition duration-300 shadow-md"
                >
                  Browse Menu
                </button>
              </div>
            </div>
            {/* Desktop/Tablet view */}
            <div className="hidden md:flex flex-col justify-center items-center h-full w-full">
              {/* AnimatedPlate component */}
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <span className="relative inline-block">
                  <span className="absolute animate-pulse -top-2 -left-2 w-16 h-16 rounded-full bg-[#dd804f]/30 blur-lg"></span>
                  <span className="inline-block text-6xl animate-bounce" style={{ filter: "drop-shadow(0 0 8px #dd804f88)" }}>
                    <img src="../../dist/images/logoicon.png" alt="logo" className="w-30 h-20 pt-5" />
                  </span>
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 md:mb-6 drop-shadow-lg">
                <span className="text-white">Welcome to</span>&nbsp;
                <ShinyText text="Adu Food" className="whitespace-nowrap" />
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl text-gray-200 px-2">
                Experience authentic Ethiopian cuisine and international favorites, delivered fresh to your door.
              </p>
              {/* Buttons */}
              <div className="flex justify-center gap-4 flex-wrap mt-2 md:mt-4 mb-8 md:mb-0">
                <button
                  onClick={scrollToMenu}
                  className="bg-[#dd804f] hover:bg-[#c9723c] text-white font-semibold px-6 py-3 rounded-xl border-2 border-[#ec9420] hover:border-[#c9723c] transition transform hover:scale-105 duration-300 shadow-md"
                >
                  Order Now
                </button>
                <button
                  onClick={scrollToMenu}
                  className="bg-white/95 hover:bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl border-2 border-[#ec9420] transition transform hover:scale-105 duration-300 shadow-md"
                >
                  Browse Menu
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER */}
        <section
          ref={menuRef}
          className="bg-gray-800/70 rounded-xl shadow-lg p-4 md:p-6 mb-10 border border-gray-700 relative z-10 mt-8 md:mt-12"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 md:h-6 md:w-6" />
              <input
                type="text"
                placeholder="Search for your favorite food..."
                value={keyword}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 md:p-4 pl-11 md:pl-12 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#dd804f] focus:ring-2 focus:ring-[#dd804f]/30 text-base md:text-lg bg-gray-900 text-white placeholder-gray-400 transition"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 md:p-4 pr-10 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#dd804f] focus:ring-2 focus:ring-[#dd804f]/30 text-base md:text-lg min-w-[180px] md:min-w-[200px] bg-gray-900 text-white transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiAjeHh4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-[length:16px_16px] bg-no-repeat bg-[center_right_1rem]"
            >
              <option value="all">All Categories</option>
              <option value="burger">🍔 Burger</option>
              <option value="pizza">🍕 Pizza</option>
              <option value="ethiopian">🇪🇹 Ethiopian</option>
              <option value="drinks">🥤 Drinks</option>
              <option value="dessert">🍰 Dessert</option>
            </select>
          </div>
        </section>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#dd804f]"></div>
            <p className="mt-4 text-gray-300 text-lg">Loading delicious foods...</p>
          </div>
        ) : !Array.isArray(foods) || foods.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-semibold text-gray-100 mb-2">No food found</h3>
            <p className="text-gray-400">Try adjusting your search or browse all categories</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 md:mb-0">
                {keyword ? `Search results for "${keyword}"` : "Our Menu"}
              </h2>
              <span className="text-gray-400 text-sm md:text-base">{foods.length} items found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Shine animation CSS */}
      <style>{`
        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shine {
          animation: shine 5s linear infinite;
        }
      `}</style>
    </div>
  );
};
export default Home;