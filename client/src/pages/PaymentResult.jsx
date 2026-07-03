import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyChapaPayment } from '../api/transaction.js';
import { CartContext } from '../contexts/cartcontext.jsx';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const txRef = searchParams.get('tx_ref');
      
      if (!txRef) {
        setStatus('error');
        setMessage('No transaction reference found');
        setTimeout(() => navigate('/orders'), 3000);
        return;
      }

      try {
        const res = await verifyChapaPayment(txRef);
        
        if (res.data.message === 'Payment successful') {
          setStatus('success');
          setMessage('Payment successful! Order created.');
          setTimeout(() => navigate('/orders'), 2000);
        } else {
          setStatus('error');
          setMessage('Payment verification failed');
          setTimeout(() => navigate('/orders'), 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Payment verification error');
        console.error('Payment verification error:', error);
        setTimeout(() => navigate('/orders'), 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full border border-gray-200 shadow-sm">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dd804f] mx-auto mb-4"></div>
            <h2 className="text-gray-900 text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-gray-900 text-2xl font-bold mb-2">Payment Successful</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to orders...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-gray-900 text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to orders...</p>
          </>
        )}
      </div>
    </div>
  );
}
