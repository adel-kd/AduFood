import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/cartcontext.jsx';
import { AuthContext } from '../contexts/authcontext.jsx';
import { initializeMockTransaction } from '../api/mockTransaction.js';
import { getUserAddresses } from '../api/user.js';
import { placeOrder } from '../api/order.js';
import { MapPin, Plus, CreditCard, Smartphone, Navigation, CheckCircle, ChevronDown } from 'lucide-react';

export default function PaymentPage() {
  const { cartItems, getTotalPrice, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    paymentMethod: 'telebirr',
    addressId: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [hasCheckedAddresses, setHasCheckedAddresses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const amount = cartItems.length > 0 ? getTotalPrice() : 0;

  useEffect(() => {
    fetchCart();
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await getUserAddresses();
      const fetched = res.data.addresses || [];
      setAddresses(fetched);

      const defaultAddr = fetched.find(a => a.isDefault);
      if (defaultAddr) {
        setFormData(p => ({ ...p, addressId: defaultAddr._id }));
      } else if (fetched.length > 0) {
        setFormData(p => ({ ...p, addressId: fetched[0]._id }));
      }
    } catch (err) {
      console.error('Address fetch error:', err);
      setError('Failed to load addresses.');
    } finally {
      setLoadingAddresses(false);
      setHasCheckedAddresses(true);
    }
  };

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
    setError('');
    setSuccess('');
  };

  const validatePhone = (phone, method) => {
    const cleaned = phone.replace(/\D/g, '');
    return method === 'M-Pesa'
      ? cleaned === '0700123456'
      : cleaned === '0900123456';
  };

  const useTestNumber = () =>
    setFormData(prev => ({
      ...prev,
      phone: testNumbers[formData.paymentMethod]
    }));

  const handlePay = async () => {
    if (amount <= 0) return setError('Your cart is empty.');
    if (!formData.phone) return setError('Phone number is required.');
    if (!formData.addressId && addresses.length > 0) {
      return setError('Select a delivery address.');
    }
    if (addresses.length === 0) {
      setError('Please add a delivery address first.');
      setTimeout(() => navigate('/profile'), 2000);
      return;
    }
    if (!validatePhone(formData.phone, formData.paymentMethod)) {
      return setError(
        `For ${formData.paymentMethod}, use test number: ${testNumbers[formData.paymentMethod]}`
      );
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const selectedAddress = addresses.find(a => a._id === formData.addressId);

      // 1️⃣ Simulate payment
      const { data } = await initializeMockTransaction({
        amount,
        email: user.email,
        first_name: user.name?.split(' ')[0] || 'Customer',
        last_name: user.name?.split(' ').slice(1).join(' ') || '',
        phone_number: formData.phone,
        payment_method: formData.paymentMethod,
        delivery_address: selectedAddress,
        cartItems
      });
      if (!data?.success) throw new Error('Payment failed');

      // 2️⃣ Create order in backend
      await placeOrder({
        items: cartItems.map(item => ({
          food: item._id,
          quantity: item.quantity
        })),
        totalPrice: amount,
        paymentMethod: formData.paymentMethod,
        deliveryAddress: selectedAddress
      });

      setSuccess('Payment successful! Redirecting to your orders…');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      console.error('Payment/order error:', err);
      setError(
        err.response?.data?.message ||
          'Payment or order creation failed. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (loadingAddresses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d1b17] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md w-full border border-white/10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dd804f] mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold mb-2">Loading</h2>
          <p className="text-gray-400">Preparing your checkout experience...</p>
        </div>
      </div>
    );
  }

  // No addresses state
  if (hasCheckedAddresses && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d1b17] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md w-full border border-white/10">
          <MapPin className="h-16 w-16 text-[#dd804f] mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-4">Delivery Address Required</h2>
          <p className="text-gray-300 mb-6">Please add a delivery address to complete your order</p>
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-[#dd804f] hover:bg-[#c9723c] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 mb-4"
          >
            Add Address
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-[#dd804f] hover:text-[#c9723c] text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Order</h1>
          <p className="text-gray-400">Review and confirm your payment details</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6">
          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#dd804f]" />
              Order Summary
            </h2>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-gray-300 mb-2">Logged in as: <span className="text-white font-medium">{user.email}</span></p>
              <p className="text-gray-300">Total Amount: <span className="text-[#dd804f] text-xl font-bold">{amount.toFixed(2)} ETB</span></p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200">{success}</p>
            </div>
          )}

          {/* Payment Method */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#dd804f]" />
              Payment Method
            </h2>
            <div className="relative">
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#dd804f] transition-all appearance-none pr-12"
              >
                {Object.keys(testNumbers).map(method => (
                  <option key={method} value={method} className="bg-[#222]">
                    {method}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#dd804f]" />
              Phone Number
            </h2>
            <div className="flex gap-3">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dd804f] transition-all"
                placeholder="Enter your phone number"
              />
              <button
                type="button"
                onClick={useTestNumber}
                className="bg-[#dd804f] hover:bg-[#c9723c] text-white font-medium px-4 rounded-xl transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
              >
                Use Test
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Test number: {testNumbers[formData.paymentMethod]}
            </p>
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-[#dd804f]" />
              Delivery Address
            </h2>
            <div className="relative">
              <select
                name="addressId"
                value={formData.addressId}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#dd804f] transition-all appearance-none pr-12"
              >
                {addresses.map(addr => (
                  <option key={addr._id} value={addr._id} className="bg-[#2d1b17]">
                    {addr.name} - {addr.street}, {addr.city}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-[#dd804f] hover:text-[#c9723c] mt-3 text-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </button>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-[#dd804f] to-[#ec9420] hover:from-[#c9723c] hover:to-[#d4832a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ${amount.toFixed(2)} ETB`
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="text-center text-gray-400 text-sm">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}