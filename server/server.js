const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/larks_by_lekhani';
const JWT_SECRET = 'larks_by_lekhani_super_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// 1. SCHEMAS & MODELS
// ==========================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  basePrice: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  artisanalDetails: [{ type: String }]
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: Object,
  customizationDetails: { type: String },
  photoDriveLinks: { type: String },
  attachedPhotos: [{ type: String }],
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Online Payment' },
  paymentStatus: { type: String, default: 'Paid' },
  status: { type: String, default: 'Pending Review' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// In-Memory Fallbacks
let inMemoryUsers = [];
let inMemoryOrders = [];
let inMemoryProducts = [
  {
    _id: "1",
    title: "Interactive Story Memory Sparkbook",
    basePrice: 599,
    category: "Sparkbooks",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"],
    description: "A handcrafted interactive flip-book featuring pull-out surprise tabs, secret photo envelopes, and pop-up memory cards.",
    artisanalDetails: ["300 GSM heavy cardstock", "Hand-assembled interactive mechanisms"]
  },
  {
    _id: "2",
    title: "Velvet Heirloom Premium Gift Album",
    basePrice: 1299,
    category: "Gift Albums",
    images: ["https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"],
    description: "Luxurious handcrafted keepsake album bound in premium plush velvet with custom gold-foil title stamping.",
    artisanalDetails: ["Acid-free archival pages", "Custom gold hot foil stamping"]
  },
  {
    _id: "3",
    title: "Botanical Floral Resin Photo Frame",
    basePrice: 799,
    category: "Photo Frames",
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"],
    description: "Solid natural teakwood photo frame infused with crystal-clear hand-poured resin and real preserved dried flowers.",
    artisanalDetails: ["Solid natural teakwood frame", "Real pressed botanicals"]
  },
  {
    _id: "4",
    title: "Personalized Miniature Initial Resin Keychain",
    basePrice: 199,
    category: "Keychains",
    images: ["https://images.unsplash.com/photo-1611591475171-d41c10d32cb5?q=80&w=800&auto=format&fit=crop"],
    description: "Small handcrafted initial keychain featuring embedded dried flowers and gold flakes on an antique brass keyring.",
    artisanalDetails: ["Custom alphabet shape choice", "Heavy-duty rustproof brass key ring"]
  },
  {
    _id: "5",
    title: "Custom Birthday Collage Photo Frame",
    basePrice: 699,
    category: "Photo Frames",
    images: ["https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop"],
    description: "Elegant white acrylic photo frame featuring a multi-photo collage layout with custom birthday typography.",
    artisanalDetails: ["Multi-photo collage design", "High-definition archival print"]
  },
  {
    _id: "6",
    title: "Heartmade Vintage Teakwood Portrait Frame",
    basePrice: 749,
    category: "Photo Frames",
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"],
    description: "Classic rich mahogany wood frame handcrafted to preserve cherished family and portrait memories.",
    artisanalDetails: ["Hand-finished wooden frame", "Glass protection panel"]
  },
  {
    _id: "7",
    title: "Lace Ribbon Artisanal Gift Box & Hamper",
    basePrice: 1199,
    category: "Gift Boxes",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"],
    description: "Bespoke handcrafted gift box wrapped in organic linen, real dried floral tulip accents, and vintage lace ribbon.",
    artisanalDetails: ["Hand-tied lace ribbon", "Eco-friendly linen wrapping"]
  }
];

// ==========================================
// 2. AUTH ROUTES
// ==========================================
app.post('/api/auth/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered.' });
      const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
      await newUser.save();
    } catch (dbErr) {
      const exists = inMemoryUsers.find(u => u.email === email);
      if (exists) return res.status(400).json({ message: 'Email already registered.' });
      inMemoryUsers.push({ id: Date.now().toString(), name, email, password: hashedPassword, role: 'user' });
    }
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let foundUser = null;
    try {
      foundUser = await User.findOne({ email });
    } catch (dbErr) {
      foundUser = inMemoryUsers.find(u => u.email === email);
    }
    if (!foundUser) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: foundUser._id || foundUser.id, role: 'user', name: foundUser.name, email: foundUser.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ success: true, token, user: { name: foundUser.name, email: foundUser.email, role: 'user' } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/auth/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "lekhani_admin" && password === "LarksStudio2026!") {
    const token = jwt.sign({ role: 'admin', name: 'Lekhani (Admin)' }, JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({
      success: true,
      token,
      user: { name: 'Lekhani (Admin)', email: 'larksbylekhani@lbl.in', role: 'admin' }
    });
  }
  return res.status(401).json({ message: 'Invalid Admin Credentials.' });
});

// ==========================================
// 3. PRODUCT ROUTES
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    if (products.length > 0) return res.status(200).json(products);
    return res.status(200).json(inMemoryProducts);
  } catch (err) {
    return res.status(200).json(inMemoryProducts);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) return res.status(200).json(product);
  } catch (err) {}
  const found = inMemoryProducts.find(p => p._id === req.params.id) || inMemoryProducts[0];
  return res.status(200).json(found);
});

app.post('/api/products', async (req, res) => {
  const { title, basePrice, category, images, description, artisanalDetails } = req.body;
  const newP = {
    _id: Date.now().toString(),
    title,
    basePrice: Number(basePrice),
    category,
    images: Array.isArray(images) ? images : (images ? images.split(',').map(s=>s.trim()) : []),
    description,
    artisanalDetails: Array.isArray(artisanalDetails) ? artisanalDetails : (artisanalDetails ? artisanalDetails.split(',').map(s=>s.trim()) : [])
  };
  try {
    const dbP = new Product(newP);
    await dbP.save();
  } catch (err) {}
  inMemoryProducts.unshift(newP);
  res.status(201).json({ message: 'Product created', product: newP });
});

app.put('/api/products/:id', async (req, res) => {
  const { title, basePrice, category, images, description, artisanalDetails } = req.body;
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      title, basePrice: Number(basePrice), category,
      images: Array.isArray(images) ? images : (images ? images.split(',').map(s=>s.trim()) : []),
      description
    });
  } catch (err) {}
  const idx = inMemoryProducts.findIndex(p => p._id === req.params.id);
  if (idx !== -1) {
    inMemoryProducts[idx] = { ...inMemoryProducts[idx], title, basePrice: Number(basePrice), category, description };
  }
  res.status(200).json({ message: 'Product updated' });
});

app.delete('/api/products/:id', async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); } catch (err) {}
  inMemoryProducts = inMemoryProducts.filter(p => p._id !== req.params.id);
  res.status(200).json({ message: 'Product deleted' });
});

// ==========================================
// 4. ORDER ROUTES
// ==========================================
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = {
      _id: 'LBL-' + Math.floor(100000 + Math.random() * 900000),
      ...req.body,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    try {
      const dbOrder = new Order(newOrder);
      await dbOrder.save();
    } catch (err) {}
    inMemoryOrders.unshift(newOrder);
    res.status(201).json({ success: true, message: 'Order Placed', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Order error', error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    if (orders.length > 0) return res.status(200).json(orders);
    return res.status(200).json(inMemoryOrders);
  } catch (err) {
    return res.status(200).json(inMemoryOrders);
  }
});

app.get('/api/orders/user/:email', async (req, res) => {
  const userEmail = req.params.email.toLowerCase();
  try {
    const orders = await Order.find({ customerEmail: userEmail }).sort({ createdAt: -1 });
    if (orders.length > 0) return res.status(200).json(orders);
    const filtered = inMemoryOrders.filter(o => o.customerEmail && o.customerEmail.toLowerCase() === userEmail);
    return res.status(200).json(filtered);
  } catch (err) {
    const filtered = inMemoryOrders.filter(o => o.customerEmail && o.customerEmail.toLowerCase() === userEmail);
    return res.status(200).json(filtered);
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try { await Order.findByIdAndUpdate(req.params.id, { status }); } catch (err) {}
  const order = inMemoryOrders.find(o => o._id === req.params.id);
  if (order) order.status = status;
  res.status(200).json({ message: 'Status updated' });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Online', message: 'Larks by Lekhani Production API Live' });
});

// Database & Server Startup
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.warn('⚠️ Running with MongoDB Atlas fallback support:', err.message));

app.listen(PORT, () => {
  console.log(`🚀 Larks Backend Server running on port ${PORT}`);
});