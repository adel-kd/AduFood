import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get user addresses
// @route   GET /api/user/addresses
// @access  Private
export const getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json({ addresses: user.addresses });
});

// @desc    Add new address
// @route   POST /api/user/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const { name, street, city, state, zipCode, phone, isDefault } = req.body;
  
  // Validation
  if (!name || !street || !city || !state || !zipCode || !phone) {
    res.status(400);
    throw new Error('Please fill all address fields');
  }
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // If setting as default, remove default from other addresses
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // Create new address
  const newAddress = {
    name,
    street,
    city,
    state,
    zipCode,
    phone,
    isDefault: isDefault || false
  };
  
  user.addresses.push(newAddress);
  await user.save();
  
  res.status(201).json(user.addresses[user.addresses.length - 1]);
});

// @desc    Update address
// @route   PUT /api/user/addresses/:id
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
  const { name, street, city, state, zipCode, phone, isDefault } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const address = user.addresses.id(req.params.id);
  
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // If setting as default, remove default from other addresses
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // Update address fields
  address.name = name || address.name;
  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.zipCode = zipCode || address.zipCode;
  address.phone = phone || address.phone;
  address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
  
  await user.save();
  
  res.json(address);
});

// @desc    Delete address
// @route   DELETE /api/user/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const address = user.addresses.id(req.params.id);
  
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  user.addresses.pull(req.params.id);
  await user.save();
  
  res.json({ message: 'Address removed successfully' });
});

// @desc    Set default address
// @route   PATCH /api/user/addresses/:id/default
// @access  Private
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const address = user.addresses.id(req.params.id);
  
  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }
  
  // Remove default from all addresses
  user.addresses.forEach(addr => {
    addr.isDefault = false;
  });
  
  // Set the specified address as default
  address.isDefault = true;
  
  await user.save();
  
  res.json(user.addresses);
});