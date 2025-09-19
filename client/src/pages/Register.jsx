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
      className="min-h-screen flex items-top justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: '' }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Logo only, no brand text */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/images/logoicon.png" alt="logo" className="w-30 h-30 rounded-lg" />
        </div>
        <div className="text-center">
          <h2
            className="text-3xl font-display font-bold"
            style={{ color: '#fff' }}
          >
            Create your account
          </h2>
          <p className="mt-2" style={{ color: '#fff', opacity: 0.8 }}>
            Join us and start ordering delicious food
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div
            className="rounded-xl shadow-adu p-8 border"
            style={{ background: '#222', borderColor: '#444' }}
          >
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#fff' }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Yohannes Deboch "
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none"
                  style={inputStyle}
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #dd804f')}
                  onBlur={e => (e.target.style.boxShadow = 'none')}
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>Email address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none"
                  style={inputStyle}
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #dd804f')}
                  onBlur={e => (e.target.style.boxShadow = 'none')}
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none"
                  style={inputStyle}
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #dd804f')}
                  onBlur={e => (e.target.style.boxShadow = 'none')}
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#fff' }}>Confirm password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none"
                  style={inputStyle}
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #dd804f')}
                  onBlur={e => (e.target.style.boxShadow = 'none')}
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              style={{
                background: loading ? '#dd804f' : '#dd804f',
                color: '#fff',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
                fontWeight: 600,
                boxShadow: 'none',
              }}
              onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #000')}
              onBlur={e => (e.target.style.boxShadow = 'none')}
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
              <p style={{ color: '#fff', opacity: 0.8 }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium"
                  style={{
                    color: '#dd804f',
                    textDecoration: 'underline',
                  }}
                  onMouseOver={e => (e.target.style.color = '#fff')}
                  onMouseOut={e => (e.target.style.color = '#dd804f')}
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
