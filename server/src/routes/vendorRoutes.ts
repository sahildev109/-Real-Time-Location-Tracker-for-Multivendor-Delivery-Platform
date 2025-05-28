import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { getVendorOrders, assignDeliveryPartner } from '../controllers/vendorController';

const router = express.Router();

router.get(
  '/orders',
  authenticateJWT,
  authorizeRoles('vendor'),
  getVendorOrders
);

router.post(
  '/assign',
  authenticateJWT,
  authorizeRoles('vendor'),
  assignDeliveryPartner
);

export default router;
