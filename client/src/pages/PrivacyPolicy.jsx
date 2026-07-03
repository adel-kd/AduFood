import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Last updated: July 2026</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Adu Food ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food delivery service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using Adu Food, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Delivery addresses</li>
              <li>Payment information (processed securely through Chapa)</li>
              <li>Account credentials (username, password)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Food items ordered</li>
              <li>Order history and preferences</li>
              <li>Delivery instructions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process and deliver your orders</li>
              <li>Communicate with you about your orders</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>With service providers who perform services on our behalf (e.g., payment processing, delivery)</li>
              <li>When required by law or to protect our rights</li>
              <li>With your consent for specific purposes</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to improve your experience, analyze usage, and assist in our marketing efforts. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="text-gray-600 space-y-1">
              <li>Email: privacy@adufood.com</li>
              <li>Phone: +251 911 123 456</li>
              <li>Address: Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
