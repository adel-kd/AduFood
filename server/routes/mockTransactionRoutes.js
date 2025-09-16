import express from 'express';
import { 
  createMockTransaction
  // verifyMockTransaction 
} from '../controllers/mockTransactionController.js';

const router = express.Router();

// Initialize mock transaction
router.post('/', createMockTransaction);

// Verify mock transaction
// router.get('/verify/:orderId', verifyMockTransaction);

export default router;