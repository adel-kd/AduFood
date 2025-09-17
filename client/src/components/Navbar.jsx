import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authcontext";
import { CartContext } from "../contexts/cartcontext";
import { ShoppingCart, Heart, Package, Settings, Home, Menu, LogOut, ChevronDown } from "lucide-react";
import { User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  // Dropdown state for greeting/profile
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const linkBase =
    "relative px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500/10 hover:text-primary-400 transition-colors";
  const activeClass = "bg-primary-500/20 text-primary-400";

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-gray-800/95 backdrop-blur border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-primary-500/10 hover:text-primary-400"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="../../images/fulllogo.png" alt="logo" className="w-30 h-10 pt-2" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
              }
            >
              <Home className="inline w-4 h-4 mr-1" /> Home
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
                  }
                >
                  <ShoppingCart className="inline w-4 h-4 mr-1" /> Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
                  }
                >
                  <Heart className="inline w-4 h-4 mr-1" /> Favorites
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
                  }
                >
                  <Package className="inline w-4 h-4 mr-1" /> Orders
                </NavLink>
                {user.isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
                    }
                  >
                    <Settings className="inline w-4 h-4 mr-1" /> Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition px-3 py-2 rounded-md"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <User size={20} />
                  <span className="text-sm text-gray-300">Hi, {user.name || user.email}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-400 transition-colors text-sm"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-primary-500/10 hover:text-primary-400 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? activeClass : "text-gray-300"}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden border-t border-gray-700 px-4 py-3 space-y-2 bg-gray-800">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
            }
          >
            <Home className="inline w-4 h-4 mr-1" /> Home
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/cart"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
                }
              >
                <ShoppingCart className="inline w-4 h-4 mr-1" /> Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/favorites"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
                }
              >
                <Heart className="inline w-4 h-4 mr-1" /> Favorites
              </NavLink>
              <NavLink
                to="/orders"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
                }
              >
                <Package className="inline w-4 h-4 mr-1" /> Orders
              </NavLink>
              {user.isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
                  }
                >
                  <Settings className="inline w-4 h-4 mr-1" /> Admin
                </NavLink>
              )}
              {/* Mobile: Profile and Logout in dropdown style */}
              <div className="border-t border-gray-700 pt-2 mt-2">
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={`${linkBase} block w-full text-left flex items-center gap-2`}
                >
                  <User size={16} /> Profile
                </NavLink>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className={`${linkBase} block w-full text-left bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1 mt-1`}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} block w-full ${isActive ? activeClass : "text-gray-300"}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
