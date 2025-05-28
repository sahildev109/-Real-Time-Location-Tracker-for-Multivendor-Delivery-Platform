import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { getVendorOrders, assignDeliveryPartner } from '../controllers/vendorController';
import { User } from '../models/User';

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


router.get(
  '/delivery-partners',
  authenticateJWT,
  authorizeRoles('vendor'),
  async (req, res) => {
    try {
      const deliveryUsers = await User.find({ role: 'delivery' }).select('_id email');
      res.json(deliveryUsers);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching delivery partners' });
    }
  }
);


export default router;
