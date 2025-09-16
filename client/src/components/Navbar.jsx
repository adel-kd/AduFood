import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/authcontext";
import { CartContext } from "../contexts/cartcontext";
import { ShoppingCart, Heart, Package, Settings, Home, Menu, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [open, setOpen] = useState(false);

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
              <img src="../../images/fulllogo.png" alt="logo" className="w-50 h-18 pt-2" />
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
              <>
                <span className="text-sm text-gray-300">Hi, {user.name || user.email}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
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
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className={`${linkBase} block w-full text-left bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1`}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
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
