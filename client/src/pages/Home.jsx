import React, { useEffect, useState, useRef, useContext } from "react";
import { listFoods } from "../api/food";
import FoodCard from "../components/FoodCard";
import BounceCards from "../components/BounceCards";
import {
  Search,
  Star,
  Clock,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { AuthContext } from "../contexts/authcontext.jsx";

const HERO_IMAGE_URL =
  "https://res.cloudinary.com/ddntf1cdt/image/upload/v1783021601/image.png_202607022235_zmaj7w.jpg";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [foods, setFoods] = useState([]);
  const [keyword, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const menuRef = useRef(null);

  const categories = [
    {
      key: "burger",
      label: "Burger",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    },
    {
      key: "pizza",
      label: "Pizza",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    },
    {
      key: "ethiopian",
      label: "Ethiopian",
      img: "https://i.pinimg.com/736x/8c/1e/84/8c1e84cc35c2e58d567677224fbaa9ee.jpg",
    },
    {
      key: "drinks",
      label: "Drinks",
      img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    },
    {
      key: "dessert",
      label: "Dessert",
      img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
    },
  ];

  const testimonials = [
    {
      name: "Selam T.",
      quote:
        "Order landed hot, fast, and exactly as pictured. Adu Food is my Friday-night default now.",
    },
    {
      name: "Markos B.",
      quote:
        "The Ethiopian combo platter converted me. Portion size and spice level were both spot on.",
    },
    {
      name: "Hana G.",
      quote:
        "Clean checkout, live tracking, and the driver actually called when he arrived.",
    },
  ];

  const categoryTransforms = [
    "rotate(-12deg) translate(-260px)",
    "rotate(-6deg) translate(-130px)",
    "rotate(0deg) translate(0px)",
    "rotate(6deg) translate(130px)",
    "rotate(12deg) translate(260px)",
  ];

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const res = await listFoods({
        keyword,
        category: category === "all" ? undefined : category,
      });

      setFoods(res.data.foods);
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [keyword, category]);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const goToCategory = (cat) => {
    setCategory(cat);
    scrollToMenu();
  };

  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    setTestimonialSubmitted(true);

    setTimeout(() => {
      setTestimonialSubmitted(false);
      setTestimonialText("");
    }, 3000);
  };

  return (
    <div className="w-full bg-white">
      {/* Announcement */}
      <div className="w-full bg-[#1F1B18] text-white text-center py-2 text-sm">
        Free delivery on your first order — Use code ADUFIRST
      </div>

      {/* HERO */}
      <section
        className="relative min-h-screen bg-cover bg-center overflow-hidden animate-zoomHero"
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* Blur effects */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#dd804f]/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-orange-400/10 blur-3xl rounded-full animate-pulse" />

        <div className="relative z-10 min-h-screen flex items-center px-6 md:px-20">
          <div className="max-w-xl">

            {/* Title */}
            <h1 className="text-[4rem] md:text-[7.5rem] font-black leading-none mb-6 opacity-0 animate-slideLeft">
              <span className="text-white">Adu</span>
              <span className="text-[#dd804f]">Food</span>
            </h1>

            {/* Description */}
            <p className="text-white text-lg md:text-xl mb-8 leading-relaxed opacity-0 animate-slideLeft [animation-delay:0.3s]">
              Experience authentic Ethiopian cuisine and international favorites,
              delivered fresh and hot to your doorstep.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mb-8 opacity-0 animate-slideLeft [animation-delay:0.6s]">
              <button
                onClick={scrollToMenu}
                className="bg-[#dd804f] text-white px-8 py-4 rounded-full font-semibold hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300"
              >
                Order Now
              </button>

              <button
                onClick={scrollToMenu}
                className="bg-white/20 backdrop-blur-md border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-300"
              >
                Browse Menu
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 opacity-0 animate-slideLeft [animation-delay:0.9s]">
              <div className="px-4 py-2 rounded-full text-white">
                ⭐ 4.9 Rating
              </div>

              <div className="px-4 py-2 rounded-full text-white">
                🚚 30 min delivery
              </div>

              <div className="px-4 py-2 rounded-full text-white">
                🔒 Safe checkout
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORY BOUNCE */}
      <section className="overflow-hidden">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold animate-pulse pt-20">
            Popular Categories
          </h2>
        </div>

        <div className="flex justify-center">
          <BounceCards
            items={categories}
            containerWidth={1100}
            containerHeight={380}
            animationDelay={0.2}
            animationStagger={0.1}
            transformStyles={categoryTransforms}
            onCategoryClick={goToCategory}
          />
        </div>
      </section>

      {/* SEARCH + MENU */}
      <section ref={menuRef} className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-12 p-4 border rounded-xl"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-4 border rounded-xl pr-4"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 rounded-xl h-72"
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No foods found.
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mb-20">
        {[
          { icon: <Clock />, title: "Fast delivery" },
          { icon: <Flame />, title: "Fresh daily" },
          { icon: <ShieldCheck />, title: "Secure checkout" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-center mb-4 text-[#dd804f]">
              {item.icon}
            </div>

            <h3 className="font-bold text-xl">{item.title}</h3>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          What customers are saying
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border rounded-xl p-6 shadow-sm"
            >
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="fill-yellow-400 text-yellow-400 w-4 h-4"
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-4">"{t.quote}"</p>

              <h4 className="font-bold">{t.name}</h4>
            </div>
          ))}

          <div className="bg-[#dd804f]/5 border-2 border-dashed border-[#dd804f]/30 rounded-xl p-6">
            {testimonialSubmitted ? (
              <p className="text-green-600 font-medium">
                Thanks for your feedback!
              </p>
            ) : user ? (
              <form onSubmit={handleTestimonialSubmit}>
                <textarea
                  rows={4}
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  className="w-full border rounded-lg p-3 mb-3"
                  placeholder="Write your experience..."
                />

                <button className="w-full bg-[#dd804f] text-white py-3 rounded-lg hover:opacity-90 transition">
                  Submit
                </button>
              </form>
            ) : (
              <a
                href="/login"
                className="bg-[#dd804f] text-white px-4 py-3 rounded-lg inline-block"
              >
                Login to review
              </a>
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-4xl mx-auto mb-20 bg-gray-900 rounded-2xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">
          Get 15% off your next order
        </h2>

        <p className="text-gray-300 mb-6">
          Join our list for exclusive offers.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNewsletterSubmitted(true);

            setTimeout(() => {
              setNewsletterSubmitted(false);
            }, 3000);
          }}
          className="flex gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 px-4 py-3 rounded-xl text-black"
          />

          <button className="bg-[#dd804f] px-6 rounded-xl font-semibold hover:scale-105 transition">
            Notify Me
          </button>
        </form>

        {newsletterSubmitted && (
          <p className="mt-4 text-green-400">🎉 You're subscribed!</p>
        )}
      </section>
    </div>
  );
};

export default Home;