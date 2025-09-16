import React from 'react'
import Navbar from './Navbar.jsx'
import { FaTiktok, FaInstagram, FaTelegramPlane } from "react-icons/fa";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="sticky top-0 z-40 shadow-adu bg-gray-800/95 backdrop-blur border-b border-gray-700">
        <Navbar />
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="border-t border-gray-700 bg-gray-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
            <img src="../../images/fulllogo.png" alt="logo" className="w-30 h-10" />
              <p className="text-gray-300 mb-4">Delicious Ethiopian and international cuisine delivered fresh to your door.</p>
              <div className="flex space-x-6 text-[28px]">
      <FaTiktok style={{ color: "#dd804f" }} />
      <FaInstagram style={{ color: "#dd804f" }} />
      <FaTelegramPlane style={{ color: "#dd804f" }} />
    </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
                <li><a href="/foods" className="hover:text-primary-400 transition-colors">Menu</a></li>
                <li><a href="/about" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/help" className="hover:text-primary-400 transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                <li><a href="/faq" className="hover:text-primary-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Adu Food. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Made with ❤️ in Ethiopia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
