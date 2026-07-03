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
  "https://res.cloudinary.com/ddntf1cdt/image/upload/v1783117227/Gemini_Generated_Image_70ndnn70ndnn70nd_crqt6r.png";


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
  const ClientTestimonialBox = () => {
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setText("");
        setRating(0);
      }, 2500);
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <p className="font-semibold mb-2">Share your experience</p>

        {/* Star rating */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              onClick={() => setRating(i + 1)}
              className={`w-5 h-5 cursor-pointer transition ${i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
                }`}
            />
          ))}
        </div>

        {/* Textarea */}
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#dd804f]"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={!text || rating === 0}
          className="bg-[#dd804f] text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
        >
          Submit
        </button>

        {submitted && (
          <p className="text-green-600 text-sm mt-3 animate-pulse">
            Thanks for your feedback! 🎉
          </p>
        )}
      </form>
    );
  };
  // ─────────────────────────────
  // FETCH FOODS
  // ─────────────────────────────
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
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="w-full bg-white overflow-x-hidden">

      {/* ANNOUNCEMENT */}
      <div className="w-full bg-[#1F1B18] text-white text-center py-2 text-sm">
        Free delivery on your first order — Use code ADUFIRST
      </div>

      {/* ───────────────── HERO ───────────────── */}
      <section
        className="relative min-h-screen bg-fit bg-center overflow-hidden animate-zoomHero"
        style={{
          backgroundImage: `url(${HERO_IMAGE_URL})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        {/* blur effects */}
        <div className="hidden md:block absolute top-20 right-20 w-80 h-80 bg-[#dd804f]/20 blur-3xl rounded-full animate-pulse" />
        <div className="hidden md:block absolute bottom-20 right-40 w-96 h-96 bg-orange-400/10 blur-3xl rounded-full animate-pulse" />

        <div className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 md:px-20">

          <div className="max-w-xl">

            {/* TITLE (animation restored) */}
            <h1 className="text-5xl sm:text-6xl md:text-[7.5rem] font-black leading-none mb-6 opacity-0 animate-slideLeft">
              <span className="text-white">Adu</span>
              <span className="text-[#dd804f]">Food</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-white text-base md:text-xl mb-8 opacity-0 animate-slideLeft [animation-delay:0.3s]">
              Experience authentic Ethiopian cuisine and international favorites,
              delivered fresh and hot to your doorstep.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 opacity-0 animate-slideLeft [animation-delay:0.6s]">
              <button
                onClick={scrollToMenu}
                className="bg-[#dd804f] px-6 py-3 md:px-8 md:py-4 rounded-full text-white font-semibold hover:scale-105 transition"
              >
                Order Now
              </button>

              <button
                onClick={scrollToMenu}
                className="bg-white/20 border border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-white hover:text-black transition"
              >
                Browse Menu
              </button>
            </div>
            <br /><br />
            {/* STATS */}
            <div className="flex flex-wrap gap-3 text-white opacity-0 animate-slideLeft [animation-delay:0.9s]">
              <div className="">⭐ 4.9 Rating</div>&nbsp; &nbsp;
              <div className="">🚚 30 min delivery</div>&nbsp; &nbsp;
              <div className="">🔒 Safe checkout</div>&nbsp; &nbsp;
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────── CATEGORIES (FIXED SCALE) ───────────────── */}
      <section className="overflow-hidden px-2 sm:px-4">

        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold pt-10 md:pt-20">
            Popular Categories
          </h2>
        </div>

        <div className="flex justify-center w-full overflow-hidden">
          <div className="scale-[0.6] sm:scale-[0.75] md:scale-100 origin-center">
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
        </div>

      </section>

      {/* ───────────────── SEARCH + MENU ───────────────── */}
      <section ref={menuRef} className="max-w-7xl mx-auto px-4 mb-16">

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-12 p-4 border rounded-xl"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-4 border rounded-xl"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-72 rounded-xl" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No foods found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}

      </section>

      {/* ───────────────── FEATURES ───────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto px-4 mb-20">
        {[
          { icon: <Clock />, title: "Fast delivery" },
          { icon: <Flame />, title: "Fresh daily" },
          { icon: <ShieldCheck />, title: "Secure checkout" },
        ].map((item) => (
          <div key={item.title} className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4 text-[#dd804f]">
              {item.icon}
            </div>
            <h3 className="font-bold text-lg md:text-xl">{item.title}</h3>
          </div>
        ))}
      </section>

      {/* ───────────────── TESTIMONIALS ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What customers are saying
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {/* ───── EXISTING TESTIMONIALS ───── */}
          {testimonials.map((t) => (
            <div key={t.name} className="border rounded-xl p-6 shadow-sm bg-white">
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-4 text-sm">"{t.quote}"</p>
              <h4 className="font-bold">{t.name}</h4>
            </div>
          ))}

          {/* ───── CLIENT INPUT CARD (NEW 4TH CARD) ───── */}
          <div className="border rounded-xl p-6 shadow-sm bg-[#dd804f]/5 border-dashed border-[#dd804f]/30">

            {user ? (
              <ClientTestimonialBox />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-700 mb-4 font-medium">
                  Login to share your experience
                </p>

                <a
                  href="/login"
                  className="bg-[#dd804f] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Login
                </a>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ───────────────── NEWSLETTER ───────────────── */}
      <section className="max-w-4xl mx-auto mb-20 bg-gray-900 rounded-2xl p-6 md:p-10 text-center text-white">

        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Get 15% off your next order
        </h2>

        <p className="text-gray-300 mb-6">
          Join our list for exclusive offers.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNewsletterSubmitted(true);
            setTimeout(() => setNewsletterSubmitted(false), 3000);
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 px-4 py-3 rounded-xl text-black"
          />
          <button className="bg-[#dd804f] px-6 py-3 rounded-xl font-semibold">
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