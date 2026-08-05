const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: {
    houseNo: { type: String, required: true },
    landmark: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  customizationDetails: { type: String, required: true },
  photoDriveLinks: { type: String, default: '' },
  attachedPhotos: [{ type: String }], // Array of Base64 uploaded photos
  engravingText: { type: String, default: '' },
  specialDate: { type: String, default: '' },
  colorTheme: { type: String, default: 'Rose Gold & Terracotta' },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Online Payment' },
  paymentStatus: { type: String, default: 'Paid' },
  status: { type: String, default: 'Pending Review' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);