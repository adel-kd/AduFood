import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [open, setOpen] = useState(false)

  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500/10 hover:text-primary-400 transition-colors'
  const activeClass = 'bg-primary-500/20 text-primary-400'

  return (
    <nav className="bg-gray-800/95 backdrop-blur border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-primary-500/10 hover:text-primary-400" 
              aria-label="Toggle menu" 
              onClick={() => setOpen(v => !v)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-display font-bold text-white">Adu Food</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <NavLink to="/" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
              Home
            </NavLink>
            {user && (
              <>
                <NavLink to="/cart" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
                  �� Cart
                </NavLink>
                <NavLink to="/favorites" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
                  ❤️ Favorites
                </NavLink>
                <NavLink to="/orders" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
                  📦 Orders
                </NavLink>
                {user.isAdmin && (
                  <NavLink to="/admin" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
                    ⚙️ Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-300">Hi, {user.name || user.email}</span>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({isActive}) => `${linkBase} ${isActive ? activeClass : 'text-gray-300'}`}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-gray-700 px-4 py-3 space-y-2 bg-gray-800">
          <NavLink to="/" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink to="/cart" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
                🛒 Cart
              </NavLink>
              <NavLink to="/favorites" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
                ❤️ Favorites
              </NavLink>
              <NavLink to="/orders" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
                📦 Orders
              </NavLink>
              {user.isAdmin && (
                <NavLink to="/admin" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
                  ⚙️ Admin
                </NavLink>
              )}
              <button 
                onClick={() => { setOpen(false); logout(); }} 
                className={`${linkBase} block w-full text-left bg-primary-500 text-white hover:bg-primary-600`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)} className={({isActive}) => `${linkBase} block w-full ${isActive ? activeClass : 'text-gray-300'}`}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
