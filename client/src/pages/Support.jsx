import React from 'react';
import { Mail, Phone, MessageSquare, Clock } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-gray-600 text-lg">We're here to help you with any questions or concerns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-[#dd804f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-[#dd804f]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-2">+251 911 123 456</p>
            <p className="text-gray-500 text-xs">Available 9 AM - 9 PM</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-[#dd804f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#dd804f]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-2">support@adufood.com</p>
            <p className="text-gray-500 text-xs">Response within 24 hours</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-[#dd804f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-[#dd804f]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-2">Chat with us</p>
            <p className="text-gray-500 text-xs">Available 9 AM - 9 PM</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
                placeholder="Tell us more about your issue..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#dd804f] hover:bg-[#c9723c] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#dd804f]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[#dd804f]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
              <p className="text-gray-600 text-sm">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
