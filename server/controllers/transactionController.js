import axios from 'axios';

// Initialize transaction
export const createTransaction = async (req, res) => {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      phone_number,
      orderId
    } = req.body;

    if (!amount || !email || !first_name || !last_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Build payload
    const payload = {
      amount: String(amount),
      currency: 'ETB',
      email,
      first_name,
      last_name,
      ...(phone_number && { phone_number }),
      tx_ref: orderId,
      callback_url: `${process.env.BACKEND_URL}/api/transactions/verify/${orderId}`,
      return_url: `${process.env.FRONTEND_URL}/payment/result?tx_ref=${orderId}`,
      customization: {
        title: 'Adu Delivery Payment',
        description: 'Food order checkout'
      },
      meta: {
        order_id: orderId,
        user_id: req.user?.id || 'guest'
      }
    };

    const chapaRes = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!chapaRes.data || !chapaRes.data.data?.checkout_url) {
      return res.status(500).json({ 
        message: 'Transaction initialization failed', 
        data: chapaRes.data 
      });
    }

    res.json({
      message: 'Transaction initialized successfully',
      data: chapaRes.data.data
    });
  } catch (err) {
    console.error('Chapa API error:', err.response?.data || err.message);
    res.status(500).json({ 
      message: 'Failed to create transaction', 
      error: err.response?.data || err.message 
    });
  }
};

// Verify transaction - called by Chapa callback
export const verifyTransactionCallback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, tx_ref } = req.body;

    console.log('Callback received:', { orderId, status, tx_ref, body: req.body });

    if (status === 'success' && tx_ref === orderId) {
      // Update your database here - mark order as paid
      // await updateOrderStatus(orderId, 'completed');
      
      console.log(`Payment successful for order: ${orderId}`);
      
      // You can also send email notifications or trigger other actions here
    } else {
      console.log(`Payment failed for order: ${orderId}`);
      // await updateOrderStatus(orderId, 'failed');
    }

    // Return success response to Chapa
    res.status(200).json({ message: 'Callback received' });
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).json({ message: 'Callback processing failed' });
  }
};

// Manual transaction verification (for frontend)
export const verifyTransactionManual = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    if (!tx_ref) {
      return res.status(400).json({ message: 'Transaction reference is required' });
    }

    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
      }
    );

    if (verifyRes.data.status === 'success') {
      // Update order status in your database
      // await updateOrderStatus(tx_ref, 'completed');
      
      return res.json({
        message: 'Transaction verified successfully',
        data: verifyRes.data
      });
    } else {
      return res.status(400).json({
        message: 'Transaction verification failed',
        data: verifyRes.data
      });
    }
  } catch (err) {
    console.error('Verification error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to verify transaction',
      error: err.response?.data || err.message
    });
  }
};