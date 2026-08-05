const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

let inMemoryOrders = [];

// SUBMIT ORDER WITH PHOTO ATTACHMENTS
router.post('/', async (req, res) => {
  try {
    const {
      productId,
      productTitle,
      customerName,
      customerEmail,
      contactNumber,
      address,
      customizationDetails,
      photoDriveLinks,
      attachedPhotos,
      engravingText,
      specialDate,
      colorTheme,
      quantity,
      totalAmount,
      paymentMethod,
      paymentStatus
    } = req.body;

    const newOrder = {
      _id: 'LBL-' + Math.floor(100000 + Math.random() * 900000),
      productId,
      productTitle,
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      contactNumber,
      address,
      customizationDetails,
      photoDriveLinks: photoDriveLinks || '',
      attachedPhotos: Array.isArray(attachedPhotos) ? attachedPhotos : [],
      engravingText: engravingText || '',
      specialDate: specialDate || '',
      colorTheme: colorTheme || 'Rose Gold & Terracotta',
      quantity: Number(quantity) || 1,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'Online Payment',
      paymentStatus: paymentStatus || 'Paid',
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };

    try {
      const dbOrder = new Order(newOrder);
      await dbOrder.save();
    } catch (err) {
      // In-memory fallback
    }

    inMemoryOrders.unshift(newOrder);
    res.status(201).json({
      success: true,
      message: 'Order Placed Successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order', error: error.message });
  }
});

// GET ALL ORDERS FOR ADMIN DASHBOARD
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    if (orders.length > 0) return res.status(200).json(orders);
    return res.status(200).json(inMemoryOrders);
  } catch (err) {
    return res.status(200).json(inMemoryOrders);
  }
});

// GET ORDERS FOR LOGGED-IN CUSTOMER EMAIL
router.get('/user/:email', async (req, res) => {
  const userEmail = req.params.email.toLowerCase();
  try {
    const orders = await Order.find({ customerEmail: userEmail }).sort({ createdAt: -1 });
    if (orders.length > 0) return res.status(200).json(orders);
    
    const filtered = inMemoryOrders.filter(o => o.customerEmail.toLowerCase() === userEmail);
    return res.status(200).json(filtered);
  } catch (err) {
    const filtered = inMemoryOrders.filter(o => o.customerEmail.toLowerCase() === userEmail);
    return res.status(200).json(filtered);
  }
});

// UPDATE ORDER STATUS
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await Order.findByIdAndUpdate(req.params.id, { status });
  } catch (err) {}

  const order = inMemoryOrders.find(o => o._id === req.params.id);
  if (order) order.status = status;

  res.status(200).json({ message: 'Order status updated' });
});

module.exports = router;