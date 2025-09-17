import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authcontext';
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/user';
import { MapPin, Plus, Edit, Trash2, User, Mail } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false
  });

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getUserAddresses();
      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleAddAddress = async (addressData) => {
    try {
      await addAddress(addressData);
      fetchAddresses(); // Refresh addresses
      setShowForm(false);
      setFormData({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleEditAddress = async (addressId, addressData) => {
    try {
      await updateAddress(addressId, addressData);
      fetchAddresses(); // Refresh addresses
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        fetchAddresses(); // Refresh addresses
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      fetchAddresses(); // Refresh addresses
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      handleEditAddress(editingAddress._id, formData);
    } else {
      handleAddAddress(formData);
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Info Section */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
            <div className="p-3 bg-[#dd804f] rounded-full">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              <p className="text-white font-medium">{user?.name || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
            <div className="p-3 bg-[#dd804f] rounded-full">
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email Address</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Section */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Delivery Addresses</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#dd804f] text-white px-4 py-2 rounded-lg hover:bg-[#c9723c] transition"
          >
            <Plus size={20} />
            Add Address
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address Name</label>
                <input
                  type="text"
                  placeholder="Home, Work, etc."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+251 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
              <input
                type="text"
                placeholder="Street name and number"
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State/Region</label>
                <input
                  type="text"
                  placeholder="State or Region"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="mr-2 h-4 w-4 text-[#dd804f] focus:ring-[#dd804f]"
                />
                <span className="text-gray-300">Set as default address</span>
              </label>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#dd804f] text-white px-4 py-2 rounded-lg hover:bg-[#c9723c] transition"
                >
                  {editingAddress ? 'Update' : 'Add'} Address
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#dd804f]"></div>
            <p className="mt-4 text-gray-300">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MapPin size={48} className="mx-auto mb-4 opacity-50" />
            <p>No addresses saved yet</p>
            <p className="text-sm mt-2">Add your first address to get started with deliveries</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address._id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-[#dd804f] bg-[#dd804f]/10' : 'border-gray-600'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      {address.name}
                      {address.isDefault && (
                        <span className="bg-[#dd804f] text-white text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </h4>
                    <p className="text-gray-300 mt-2">{address.street}</p>
                    <p className="text-gray-300">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-400 mt-2">{address.phone}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-gray-400 hover:text-[#dd804f] transition p-1"
                      title="Edit address"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Delete address"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="text-sm text-[#dd804f] hover:underline mt-2"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;