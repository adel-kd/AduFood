import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext.jsx'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { registerUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) return
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await registerUser({ name, email, password })
      navigate('/')
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }


  const inputStyle = {
    background: '#181818',
    color: '#fff',
    borderColor: '#444',
    outline: 'none',
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
            Create your account
          </h2>
          <p className="mt-2 text-gray-600">
            Join us and start ordering delicious food
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div
            className="rounded-xl shadow-sm p-8 border border-gray-200 bg-white"
          >
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2 text-gray-900"
                >
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Yohannes Deboch "
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Email address</label>
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
                <label className="block text-sm font-medium mb-2 text-gray-900">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Confirm password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <p className="text-gray-600 mt-3 text-center text-sm">By clicking create account you are agreeing to our<Link to='/terms' className='text-[#dd804f] hover:text-[#c9723c]'>Terms and conditions</Link> and <Link to='/privacy' className='text-[#dd804f] hover:text-[#c9723c]'>Privacy policy</Link> </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-[#dd804f] hover:bg-[#c9723c] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#dd804f] hover:text-[#c9723c]"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
