import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../contexts/cartcontext.jsx";
import { AuthContext } from "../contexts/authcontext.jsx";
import {
  initializeChapaPayment,
  manualVerifyPayment,
} from "../api/transaction.js";
import { getUserAddresses } from "../api/user.js";
import TestCards from "../components/TestCards";

export default function PaymentPage() {
  const { fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  // ✅ IMPORTANT: use passed items from Cart page
  const items = state?.items || [];

  const [addressId, setAddressId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // ========================
  // CALCULATIONS
  // ========================
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const foodDiscount = subtotal * 0.05;
  const deliveryFee = promoApplied ? 0 : subtotal * 0.05;
  const amount = subtotal - foodDiscount + deliveryFee;

  // ========================
  // LOAD ADDRESSES
  // ========================
  useEffect(() => {
    loadAddresses();
    fetchCart();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await getUserAddresses();
      const list = res.data.addresses || [];

      setAddresses(list);

      const defaultAddr = list.find((a) => a.isDefault);
      setAddressId(defaultAddr?._id || list[0]?._id || "");
    } catch (err) {
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // VERIFY PAYMENT AFTER RETURN
  // ========================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txRef = params.get("tx_ref");

    if (txRef) {
      verifyPayment(txRef);
    }
  }, []);

  const verifyPayment = async (txRef) => {
    try {
      const res = await manualVerifyPayment(txRef);

      if (res.data.chapaStatus === "success") {
        await fetchCart(); // ✅ refresh cart globally
        localStorage.removeItem("txRef");

        navigate("/orders");
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  // ========================
  // HANDLE PROMO
  // ========================
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "ADUFIRST") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code");
    }
  };

  // ========================
  // HANDLE PAYMENT
  // ========================
  const handlePay = async () => {
    try {
      if (!addressId) return setError("Select address first");
      if (!items.length) return setError("Cart is empty");

      const selectedAddress = addresses.find((a) => a._id === addressId);

      const formattedItems = items.map((item) => ({
        food: item.food,
        qty: item.qty || 1,
        price: item.price || 0,
      }));

      const res = await initializeChapaPayment({
        items: formattedItems,
        addressId,
        phone: selectedAddress?.phone,

        promoCode: promoApplied ? "ADUFIRST" : null,
        discountAmount: promoApplied ? subtotal * 0.05 : 0,
      });

      localStorage.setItem("txRef", res.data.txRef);

      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    }
  };

  // ========================
  // GUARD: NO STATE
  // ========================
  if (!items.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">No items found</h2>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
        >
          Go Back to Cart
        </button>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  // ========================
  // UI
  // ========================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* ADDRESS */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Delivery Address</h2>

              {addresses.length > 0 ? (
                <>
                  {addresses.map((a) => (
                    <label key={a._id} className="block mb-2 border p-3 rounded">
                      <input
                        type="radio"
                        name="address"
                        value={a._id}
                        checked={addressId === a._id}
                        onChange={(e) => setAddressId(e.target.value)}
                      />
                      <span className="ml-2">
                        {a.city} - {a.phone}
                      </span>
                    </label>
                  ))}

                  <button
                    onClick={() => navigate("/profile")}
                    className="mt-4 w-full bg-[#dd804f] text-white py-2 rounded-lg hover:bg-[#c9723c] transition"
                  >
                    Add New Address
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">
                    No delivery address found.
                  </p>

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full bg-[#dd804f] text-white py-2 rounded-lg hover:bg-[#c9723c] transition"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* PROMO */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-4">Promo Code</h2>

              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border p-2 flex-1 rounded"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="text-red-500 text-sm mt-2">{promoError}</p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <p>Subtotal: {subtotal.toFixed(2)} ETB</p>

              <p className="text-green-600">
                Discount: -{foodDiscount.toFixed(2)} ETB
              </p>

              <p>
                Delivery: {promoApplied ? "FREE" : deliveryFee.toFixed(2)}
              </p>

              <hr />

              <p className="font-bold text-lg">
                Total: {amount.toFixed(2)} ETB
              </p>
            </div>

            {error && (
              <p className="text-red-500 mt-3 text-sm">{error}</p>
            )}

            <button
              onClick={handlePay}
              className="w-full mt-5 bg-orange-500 text-white py-3 rounded"
            >
              Pay with Chapa
            </button>

            <TestCards />
          </div>
        </div>
      </div>
    </div>
  );
}