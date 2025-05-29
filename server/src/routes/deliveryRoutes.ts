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

router.post(
  '/mark-delivered',
  authenticateJWT,
  authorizeRoles('delivery'),
  async (req: AuthenticatedRequest, res) => {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({ message: 'Order ID is required' });
      return
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return
      }

      order.status = 'delivered';
      await order.save();

      res.json({ message: 'Order marked as delivered' });
    } catch (err) {
      console.error('Mark Delivered Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


export default router;
