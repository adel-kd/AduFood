// Mock transaction API - no real Chapa integration
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
      orderId
    } = transactionData;
  
    // Validate test numbers
    const isValidMpesa = payment_method === 'M-Pesa' && phone_number.includes('0700123456');
    const isValidOther = payment_method !== 'M-Pesa' && phone_number.includes('0900123456');
    
    if (!isValidMpesa && !isValidOther) {
      throw new Error('Invalid test number for selected payment method');
    }
  
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