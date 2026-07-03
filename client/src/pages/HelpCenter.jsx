import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';

export default function HelpCenter() {
  const [openSection, setOpenSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const helpSections = [
    {
      title: 'Getting Started',
      icon: null,
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the Register button in the top right corner of the homepage. Fill in your name, email, and password to create your account. You will receive a confirmation email to verify your account.'
        },
        {
          question: 'How do I add items to my cart?',
          answer: 'Browse our menu and click the "Add to Cart" button on any food item. You can adjust quantities in the cart before checkout.'
        },
        {
          question: 'How do I place an order?',
          answer: 'After adding items to your cart, proceed to checkout. Select your delivery address, choose a payment method, and complete the payment through our secure Chapa payment gateway.'
        }
      ]
    },
    {
      title: 'Orders & Delivery',
      icon: '📦',
      items: [
        {
          question: 'How can I track my order?',
          answer: 'Go to the Orders page in your account to view all your orders and their current status. You will also receive updates via email and SMS.'
        },
        {
          question: 'What are the delivery fees?',
          answer: 'We charge a 5% delivery fee on all orders. This fee is automatically calculated and displayed at checkout.'
        },
        {
          question: 'How long does delivery take?',
          answer: 'Delivery times vary based on your location and order volume. Typically, orders are delivered within 30-45 minutes during peak hours.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'You can cancel your order within 5 minutes of placing it. After that, please contact our support team for assistance.'
        }
      ]
    },
    {
      title: 'Payments',
      icon: null,
      items: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Telebirr, CBE Birr, Awash Birr, Coopay Ebirr, M-Pesa, and Amole through our secure Chapa payment gateway.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, all payments are processed through Chapa, a secure payment gateway that complies with international security standards. We never store your payment details.'
        },
        {
          question: 'How do I apply a promo code?',
          answer: 'Enter your promo code in the promo code field on the checkout page. Click "Apply" to see your discount reflected in the total.'
        }
      ]
    },
    {
      title: 'Account & Profile',
      icon: '👤',
      items: [
        {
          question: 'How do I update my profile?',
          answer: 'Go to your Profile page to update your personal information, change your password, and manage your delivery addresses.'
        },
        {
          question: 'How do I add a delivery address?',
          answer: 'In your Profile page, go to the Addresses section and click "Add New Address". Fill in the required details and save.'
        },
        {
          question: 'How do I save favorites?',
          answer: 'Click the heart icon on any food item to add it to your favorites. You can view all your favorites in the Favorites page.'
        }
      ]
    }
  ];

  const filteredSections = helpSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-gray-600 text-lg">Find answers to common questions</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                {openSection === sectionIndex ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              {openSection === sectionIndex && (
                <div className="p-6 space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found for your search. Try different keywords.</p>
          </div>
        )}

        <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 text-sm mb-4">Can't find what you're looking for? Contact our support team.</p>
          <a
            href="/support"
            className="inline-block bg-[#dd804f] hover:bg-[#c9723c] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
