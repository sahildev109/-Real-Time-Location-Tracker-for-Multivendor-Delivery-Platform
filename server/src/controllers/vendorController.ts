import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getVendorOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ vendorId: req.user?.id }).populate('deliveryPartnerId customerId');
    console.log('vendorId:', req.user?.id);
    res.status(200).json(orders);
  } catch (err) {
    console.error('Get Vendor Orders Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignDeliveryPartner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { orderId, deliveryPartnerId } = req.body;

  if (!orderId || !deliveryPartnerId) {
    res.status(400).json({ message: 'Order ID and Delivery Partner ID required' });
    return;
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.vendorId.toString() !== req.user?.id) {
      res.status(403).json({ message: 'Unauthorized: Not your order' });
      return;
    }

    order.deliveryPartnerId = deliveryPartnerId;
    order.status = 'assigned';
    await order.save();

    res.status(200).json({ message: 'Delivery partner assigned', order });
  } catch (err) {
    console.error('Assign Partner Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
