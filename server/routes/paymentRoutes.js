import express from "express";
import {
  initializePaymentHandler,
  chapaCallbackHandler,
  // chapaWebhookHandler,
  manualVerifyHandler,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ─────────────────────────────────────────────
 * INIT PAYMENT (USER ONLY)
 * ─────────────────────────────────────────────
 * Creates ONLY transaction + returns Chapa checkout URL
 */
router.post("/initialize", protect, initializePaymentHandler);

/**
 * ─────────────────────────────────────────────
 * CALLBACK (CHAPA REDIRECT - PUBLIC)
 * ─────────────────────────────────────────────
 * Only updates transaction status (NO ORDER CREATION)
 */
router.get("/callback", chapaCallbackHandler);

/**
 * ─────────────────────────────────────────────
 * WEBHOOK (CHAPA SERVER → BACKEND)
 * ─────────────────────────────────────────────
 * Reliable payment confirmation channel
 */
// router.post("/webhook", chapaWebhookHandler);

/**
 * ─────────────────────────────────────────────
 * MANUAL VERIFY (FRONTEND POLLING)
 * ─────────────────────────────────────────────
 * FINAL STEP → creates order if payment success
 */
router.get("/verify/:txRef", protect, manualVerifyHandler);

export default router;