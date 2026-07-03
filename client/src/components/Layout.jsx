import React from 'react'
import Navbar from './Navbar.jsx'
import { FaTiktok, FaInstagram, FaTelegramPlane } from "react-icons/fa";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-40 shadow-sm bg-white/95 backdrop-blur border-b border-gray-200">
        <Navbar />
      </header>
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img src="/images/fulllogo.png" alt="logo" className="w-30 h-8 pt-2" />

              <p className="text-gray-600 mb-4">Delicious Ethiopian and international cuisine delivered fresh to your door.</p>
              <div className="flex space-x-6 text-[28px]">
                <a href="https://www.tiktok.com/" className='hover:scale-110 transition-all duration-300' target="_blank">   <FaTiktok style={{ color: "#dd804f" }} /></a>
                <a href="https://www.instagram.com/" className='hover:scale-110 transition-all duration-300' target="_blank"><FaInstagram style={{ color: "#dd804f" }} /></a>
                <a href="https://www.telegram.com/" className='hover:scale-110 transition-all duration-300' target="_blank"><FaTelegramPlane style={{ color: "#dd804f" }} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/" className="hover:text-[#dd804f] transition-colors">Home</a></li>
                <li><a href="/" onClick={() => window.scrollTo({ top: 1500, behavior: 'smooth' })} className="hover:text-[#dd804f] transition-colors">Menu</a></li>
                <li><a href="/about" className="hover:text-[#dd804f] transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-[#dd804f] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/help" className="hover:text-[#dd804f] transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-[#dd804f] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-[#dd804f] transition-colors">Terms of Service</a></li>
                <li><a href="/faq" className="hover:text-[#dd804f] transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Adu Food. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
