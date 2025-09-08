// controllers/cartController.js
import Cart from '../models/cart.js';
import Food from '../models/Food.js';

// 🔹 Get or create user cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.food');

    if (!cart) {
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
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      const foodExists = await Food.findById(foodId);
      if (!foodExists) return res.status(404).json({ message: 'Food item not found' });

      cart.items.push({ food: foodId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.food');
    res.json(updatedCart);
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

    const updatedCart = await Cart.findById(cart._id).populate('items.food');
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// 🔹 Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};
