import express from 'express';
import { AuthenticatedRequest, authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { Order } from '../models/Order';

const router = express.Router();

// GET customer's current order
router.get(
  '/customer-order',
  authenticateJWT,
  authorizeRoles('customer'),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const order = await Order.find({
        customerId: req.user?.id,
        // status: { $in: ['assigned', 'pending'] }, // only active orders
      }).populate('deliveryPartnerId vendorId');

      if (!order) {
         res.status(404).json({ message: 'No order found' });
         return;
      }

      res.json(order);
    } catch (err) {
      console.error('Customer order fetch error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
