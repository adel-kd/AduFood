// src/pages/Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authcontext";
import { CartContext } from "../contexts/cartcontext";
import { removeFromCart } from "../api/cart";

export default function Cart() {
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    removeItem,
    updateQuantity,
    fetchCart,
    getTotalPrice,
  } = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      await fetchCart();
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id);
      removeItem(id);
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const handleUpdateQuantity = (id, qty) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    updateQuantity(id, qty);
  };

  /**
   * 🔥 CRITICAL FIX: normalize cart BEFORE checkout
   * backend expects: food, qty, price
   */
  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return;

    const totalItems = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    if (totalItems > 5) {
      setCheckoutMessage("Too many items in cart.");
      setTimeout(() => setCheckoutMessage(""), 3000);
      return;
    }

    const formattedItems = cartItems.map((item) => ({
      food: item.food?._id || item._id, // ✅ FIX HERE
      qty: item.quantity || 1,
      price: item.price || 0,
    }));

    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice * 0.05;
    const totalAmount = totalPrice * 0.95 + deliveryFee;

    navigate("/payment", {
      state: {
        items: formattedItems, // ✅ IMPORTANT
        amount: totalAmount,
        userEmail: user?.email,
        userPhone: user?.phone || "",
      },
    });
  };

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice * 0.05;
  const foodDiscount = totalPrice * 0.05;
  const totalAmount = totalPrice - foodDiscount + deliveryFee;

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-3 text-orange-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/" className="text-orange-500 font-semibold">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-orange-500">{item.price} ETB</p>
                  </div>
                </div>

                {/* qty */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                    className="px-2 bg-orange-500 text-white rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                    className="px-2 bg-orange-500 text-white rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="border p-4 rounded-lg h-fit">
            <h2 className="font-bold mb-4">Summary</h2>

            <div className="space-y-2 text-sm">
              <p>Subtotal: {totalPrice.toFixed(2)} ETB</p>
              <p className="text-green-600">
                Discount: -{foodDiscount.toFixed(2)} ETB
              </p>
              <p>Delivery: {deliveryFee.toFixed(2)} ETB</p>
              <hr />
              <p className="font-bold">
                Total: {totalAmount.toFixed(2)} ETB
              </p>
            </div>

            {checkoutMessage && (
              <p className="text-red-500 text-sm mt-2">
                {checkoutMessage}
              </p>
            )}

            <button
              onClick={handleProceedToPayment}
              className="w-full mt-4 bg-orange-500 text-white py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}