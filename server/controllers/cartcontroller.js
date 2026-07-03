// controllers/cartController.js
import Cart from '../models/cart.js';
import Food from '../models/Food.js';

// 🔹 Get user cart — full populate for the response
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.food')
      .lean(); // ✅ lean() — read-only fetch, no mutation methods needed

    if (!cart) {
      // Create a bare cart document — no population needed for an empty cart
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// 🔹 Add or update cart item
export const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      // ✅ Only fetch food existence check — no full populate needed here
      const foodExists = await Food.exists({ _id: foodId }); // exists() is faster than findById
      if (!foodExists) return res.status(404).json({ message: 'Food item not found' });

      cart.items.push({ food: foodId, quantity });
    }

    await cart.save();

    // ✅ FIX: Single populate after save — was doing save() then findById().populate() (2 trips)
    await cart.populate('items.food');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart' });
  }
};

// 🔹 Remove item from cart
export const removeFromCart = async (req, res) => {
  const { foodId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.food.toString() !== foodId);
    await cart.save();

    // ✅ FIX: Populate in-place after save instead of findById().populate() (was 2 trips)
    await cart.populate('items.food');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// 🔹 Clear entire cart
export const clearCart = async (req, res) => {
  try {
    // ✅ Single atomic operation — no find + save round-trip
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};
