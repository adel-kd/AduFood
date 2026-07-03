import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our menu, add items to your cart, proceed to checkout, select your delivery address, choose a payment method, and complete payment through Chapa. You will receive order confirmation via email and SMS.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Telebirr, CBE Birr, Awash Birr, Coopay Ebirr, M-Pesa, and Amole through our secure Chapa payment gateway. All transactions are encrypted and secure.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 30-45 minutes during normal hours. During peak times (lunch and dinner), delivery may take 45-60 minutes. You can track your order status in real-time through the Orders page.'
    },
    {
      question: 'What is the delivery fee?',
      answer: 'We charge a flat 5% delivery fee on all orders. This fee is automatically calculated and displayed at checkout before you complete your payment.'
    },
    {
      question: 'Can I cancel my order after placing it?',
      answer: 'You can cancel your order within 5 minutes of placing it. After that window, please contact our customer support team at +251 911 123 456 for assistance with cancellations.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Go to the Orders page in your account to view all your orders and their current status. You will also receive real-time updates via email and SMS as your order progresses.'
    },
    {
      question: 'What if I receive the wrong order or missing items?',
      answer: 'Contact our support team immediately at support@adufood.com or call +251 911 123 456. We will investigate and either send the correct items or issue a refund.'
    },
    {
      question: 'Can I modify my order after placing it?',
      answer: 'Modifications are only possible within 5 minutes of placing your order. After that, the order is sent to the kitchen and cannot be changed. Please contact support if you need urgent assistance.'
    },
    {
      question: 'How do I apply a promo code?',
      answer: 'Enter your promo code in the designated field on the checkout page and click "Apply". Valid codes will automatically apply the discount to your total. The ADUFIRST code gives you 100% off your first order.'
    },
    {
      question: 'Is there a minimum order value?',
      answer: 'Yes, the minimum order value is 100 ETB. Orders below this amount cannot be processed through our system.'
    },
    {
      question: 'Do you deliver to my area?',
      answer: 'We currently deliver to most areas within Addis Ababa. Enter your delivery address during checkout to see if we serve your location. We are continuously expanding our delivery zones.'
    },
    {
      question: 'What if no one is available to receive the delivery?',
      answer: 'If no one is available to receive the order, our delivery partner will wait for 5 minutes before leaving. You can contact the driver directly through the link provided in your order confirmation.'
    },
    {
      question: 'How do I report a problem with my food quality?',
      answer: 'If you have any concerns about food quality, please contact our support team within 1 hour of delivery. We take quality seriously and will address your concerns promptly.'
    },
    {
      question: 'Can I schedule orders for later?',
      answer: 'Currently, we only accept immediate orders. Scheduled orders will be available in a future update. Stay tuned for this feature!'
    },
    {
      question: 'How do I create an account?',
      answer: 'Click the Register button on the homepage, enter your name, email, and password, and submit the form. You will receive a verification email. Click the verification link to activate your account.'
    },
    {
      question: 'Can I order without creating an account?',
      answer: 'No, you must create an account to place orders. This allows us to provide better service, track your orders, and offer personalized recommendations.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      question: 'Are my payment details secure?',
      answer: 'Yes, all payments are processed through Chapa, a PCI-DSS compliant payment gateway. We never store your payment card details on our servers.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Refunds are processed for order errors, quality issues, or delivery failures. Refunds typically take 5-7 business days to process. Contact our support team to initiate a refund request.'
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team via email at support@adufood.com, phone at +251 911 123 456, or live chat on our website. Support is available 9 AM to 9 PM daily.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-lg">Find answers to common questions about Adu Food</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching your search. Try different keywords.</p>
          </div>
        )}

        <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 text-sm mb-4">Can't find the answer you're looking for? Our support team is here to help.</p>
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
