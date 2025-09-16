import express from 'express'
import Transaction from '../models/Transaction.js'
import axios from 'axios'

const router = express.Router()

router.post('/chapa', async (req, res) => {
  const { data } = req.body

  try {
    // Verify transaction with Chapa API
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${data.tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    )

    const transactionData = response.data.data

    // Update transaction in DB
    await Transaction.findOneAndUpdate(
      { chapaReference: transactionData.tx_ref },
      { status: transactionData.status }
    )

    res.status(200).json({ message: 'Webhook received' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Webhook handling failed' })
  }
})

export default router
