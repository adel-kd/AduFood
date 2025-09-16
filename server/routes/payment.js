import express from 'express'
import fetch from 'node-fetch' // if Node >=18, fetch is global, else install node-fetch
const router = express.Router()

// Load secret key from .env
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY

// Initialize Payment
router.post('/init', async (req, res) => {
  const { amount, email, first_name, last_name, tx_ref, phone_number } = req.body

  try {
    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'ETB',
        email,
        first_name,
        last_name,
        phone_number: phone_number || '',
        tx_ref,
        callback_url: `${process.env.BASE_URL}/api/payment/callback`,
        return_url: `${process.env.BASE_URL}/checkout-success`,
        customization: {
          title: 'Payment for your order',
          description: 'Adu Food Delivery'
        }
      })
    })

    const data = await response.json()

    if (data.status === 'success') {
      res.json({ checkout_url: data.data.checkout_url })
    } else {
      res.status(400).json({ message: 'Chapa initialization failed', data })
    }

  } catch (error) {
    console.error('Chapa init error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Verify Payment
router.get('/verify/:tx_ref', async (req, res) => {
  const { tx_ref } = req.params

  try {
    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (data.status === 'success' && data.data.status === 'success') {
      // Payment is successful
      res.json({
        message: 'Payment successful',
        reference: data.data.tx_ref,
        chapa_ref: data.data.id,
        amount: data.data.amount
      })
    } else {
      res.status(400).json({ message: 'Payment not successful', data })
    }

  } catch (error) {
    console.error('Chapa verify error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
