import express from 'express';
import { 
  createTransaction, 
  verifyTransactionCallback,
  verifyTransactionManual
} from '../controllers/transactionController.js';

const router = express.Router();

// Initialize transaction
router.post('/', createTransaction);

// Callback URL for Chapa (no webhook secret needed)
router.post('/verify/:orderId', verifyTransactionCallback);

// Manual verification endpoint for frontend
router.get('/verify/:tx_ref', verifyTransactionManual);

export default router;