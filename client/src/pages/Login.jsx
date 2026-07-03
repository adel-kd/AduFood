import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      await loginUser({ email, password })
      navigate('/')
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-top justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-md w-full space-y-8">
        {/* Logo only, no brand text */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/images/logoicon.png" alt="logo" className="w-30 h-30 rounded-lg" />
        </div>
        <div className="text-center">
          <h2
            className="text-3xl font-display font-bold text-gray-900"
          >
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div
            className="rounded-xl shadow-sm p-8 border border-gray-200 bg-white"
          >
            <div className="space-y-4">
              <div>
           <div   className="block text-sm font-small mb-2 text-[#dd804f]">
           <h3>you wanna check admin side? </h3>
                <p>
                  email: admin@adufood.com <br />
                  pass:admin123
                </p>
           </div>

                <label
                  className="block text-sm font-medium mb-2 text-gray-900"
                >
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2 text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-[#dd804f] hover:bg-[#c9723c] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-[#dd804f] hover:text-[#c9723c]"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
