import express from 'express';
import { AuthenticatedRequest, authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { Order } from '../models/Order';

const router = express.Router();

router.get(
  '/assigned-order',
  authenticateJWT,
  authorizeRoles('delivery'),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
      const order = await Order.findOne({
        deliveryPartnerId: req.user?.id,
        status: 'assigned',
      }).populate('vendorId customerId');

      if (!order) {
        res.status(404).json({ message: 'No assigned order found' });
        return;
      }

      res.json(order);
    } catch (err) {
      console.error('Delivery order fetch error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
