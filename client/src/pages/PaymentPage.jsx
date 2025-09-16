import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/cartcontext.jsx';
import { AuthContext } from '../contexts/authcontext.jsx';
import { initializeMockTransaction } from '../api/mockTransaction.js';

export default function PaymentPage() {
  const { cartItems, getTotalPrice, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ phone: '', paymentMethod: 'telebirr' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const amount = cartItems.length > 0 ? getTotalPrice() : 0;

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const testNumbers = {
    telebirr: '0900123456',
    CBEBirr: '0900123456',
    AwashBirr: '0900123456',
    'Coopay-Ebirr': '0900123456',
    'M-Pesa': '0700123456',
    Amole: '0900123456'
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); setSuccess('');
  };

  const validatePhone = (phone, method) => {
    const cleaned = phone.replace(/\D/g, '');
    return method === 'M-Pesa'
      ? cleaned === '0700123456'
      : cleaned === '0900123456';
  };

  const handlePay = async () => {
    if (amount <= 0) return setError('Your cart is empty');
    if (!formData.phone) return setError('Phone number is required');
    if (!validatePhone(formData.phone, formData.paymentMethod)) {
      return setError(`For ${formData.paymentMethod}, use test number: ${testNumbers[formData.paymentMethod]}`);
    }

    setIsProcessing(true);
    setError(''); setSuccess('');

    try {
      const { data } = await initializeMockTransaction({
        amount,
        email: user.email,
        first_name: user.firstname,
        last_name: user.lastname,
        phone_number: formData.phone,
        payment_method: formData.paymentMethod,
        cartItems    // important!
      });

      if (data?.success) {
        setSuccess('Payment successful! Redirecting to your orders…');
        setTimeout(() => navigate('/orders'), 1500);
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const useTestNumber = () => setFormData(prev => ({ ...prev, phone: testNumbers[formData.paymentMethod] }));

  return (
    <div
      className="max-w-md mx-auto mt-10 p-6 "
      style={{ color: '#fff' }}
    >
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#fff' }}>Checkout</h1>
      {error && (
        <div className="mb-4 p-3 rounded" style={{ background: '#fff0f0', color: '#e3342f', border: '1px solid #e3342f' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded" style={{ background: '#e6fff2', color: '#1a7f37', border: '1px solid #1a7f37' }}>
          {success}
        </div>
      )}

      <p className="mb-2" style={{ color: '#fff' }}>
        Logged in as: <strong style={{ color: '#dd804f' }}>{user.email}</strong>
      </p>
      <p className="mb-4 text-lg" style={{ color: '#fff' }}>
        Total Amount: <strong style={{ color: '#dd804f' }}>{amount.toFixed(2)} ETB</strong>
      </p>

      <div className="space-y-4">
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          style={{
            background: '#222',
            color: '#fff',
            borderColor: 'gray',
            outline: 'none',
          }}
          onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #dd804f')}
          onBlur={e => (e.target.style.boxShadow = 'none')}
        >
          <option value="telebirr" style={{ color: '#fff' }}>TeleBirr</option>
          <option value="CBEBirr" style={{ color: '#fff' }}>CBE Birr</option>
          <option value="AwashBirr" style={{ color: '#fff' }}>Awash Birr</option>
          <option value="Coopay-Ebirr" style={{ color: '#fff' }}>Coopay E-Birr</option>
          <option value="M-Pesa" style={{ color: '#fff' }}>M-Pesa</option>
          <option value="Amole" style={{ color: '#fff' }}>Amole</option>
        </select>

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          style={{
            background: '#222',
            color: '#fff',
            borderColor: 'gray',
            outline: 'none',
          }}
          onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #dd804f')}
          onBlur={e => (e.target.style.boxShadow = 'none')}
        />

        <div
          className="p-3 rounded-md border text-sm"
          style={{
            background: '#fffbe6',
            borderColor: '#dd804f',
            color: '#222'
          }}
        >
          <p className="mb-2" style={{ color: '#dd804f', fontWeight: 600 }}>
            <strong>Test Number:</strong> {testNumbers[formData.paymentMethod]}
          </p>
          <button
            type="button"
            onClick={useTestNumber}
            className="px-3 py-1 rounded"
            style={{
              background: '#dd804f',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              outline: 'none'
            }}
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #000')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          >
            Use Test Number
          </button>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full mt-6 py-3 rounded-md"
        style={{
          background: isProcessing ? '#888' : '#dd804f',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          outline: 'none',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
        onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #000')}
        onBlur={e => (e.target.style.boxShadow = 'none')}
      >
        {isProcessing ? 'Processing…' : 'Complete Payment'}
      </button>
    </div>
  );
}
