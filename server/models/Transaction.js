import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  phone: String,
  email: String,
  chapaReference: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
