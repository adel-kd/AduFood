// Mock transaction API 
export const initializeMockTransaction = async (transactionData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const {
    amount,
    email,
    first_name,
    last_name,
    phone_number,
    payment_method,
    delivery_address, 
    orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  } = transactionData;

  // Validate test numbers
  const isValidMpesa = payment_method === 'M-Pesa' && phone_number.includes('0700123456');
  const isValidOther = payment_method !== 'M-Pesa' && phone_number.includes('0900123456');
  
  if (!isValidMpesa && !isValidOther) {
    throw new Error('Invalid test number for selected payment method');
  }

 
  if (!delivery_address) {
    throw new Error('Delivery address is required');
  }

  // Calculate total items and create item description
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const itemDescription = cartItems.length > 0 
    ? cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ')
    : 'Food items';

  // Simulate successful payment
  return {
    data: {
      success: true,
      message: 'Payment processed successfully',
      data: {
        order_id: orderId,
        amount: amount,
        currency: 'ETB',
        status: 'success',
        payment_method: payment_method,
        customer: {
          email: email,
          name: `${first_name} ${last_name}`,
          phone: phone_number
        },
        delivery_address: {
          name: delivery_address.name,
          street: delivery_address.street,
          city: delivery_address.city,
          state: delivery_address.state,
          zip_code: delivery_address.zipCode,
          phone: delivery_address.phone,
          is_default: delivery_address.isDefault || false
        },
        order_details: {
          total_items: totalItems,
          items: itemDescription,
          cart_items: cartItems 
        },
        timestamp: new Date().toISOString()
      }
    }
  };
};

// Mock verification function
export const verifyMockTransaction = async (orderId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      status: 'success',
      data: {
        tx_ref: orderId,
        amount: '100.00',
        currency: 'ETB',
        status: 'success',
        created_at: new Date().toISOString()
      }
    }
  };
};


export const getMockTransactionHistory = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  

  return {
    data: {
      transactions: [
        {
          id: 'mock_1',
          amount: 100.00,
          currency: 'ETB',
          status: 'success',
          payment_method: 'telebirr',
          timestamp: new Date(Date.now() - 86400000).toISOString(), 
          items: ['2x Burger', '1x Fries']
        }
      ]
    }
  };
};