const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  basePrice: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  artisanalDetails: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);