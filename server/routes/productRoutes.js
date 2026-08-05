const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Expanded Instagram Catalog Items
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

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    if (products.length > 0) return res.status(200).json(products);
    return res.status(200).json(inMemoryProducts);
  } catch (err) {
    return res.status(200).json(inMemoryProducts);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) return res.status(200).json(product);
  } catch (err) {}
  const found = inMemoryProducts.find(p => p._id === req.params.id);
  if (found) return res.status(200).json(found);
  return res.status(404).json({ message: "Product not found" });
});

router.post('/', async (req, res) => {
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
  inMemoryProducts.unshift(newP);
  res.status(201).json({ message: 'Product created', product: newP });
});

router.put('/:id', async (req, res) => {
  const { title, basePrice, category, images, description, artisanalDetails } = req.body;
  const idx = inMemoryProducts.findIndex(p => p._id === req.params.id);
  if (idx !== -1) {
    inMemoryProducts[idx] = {
      ...inMemoryProducts[idx],
      title,
      basePrice: Number(basePrice),
      category,
      images: Array.isArray(images) ? images : (images ? images.split(',').map(s=>s.trim()) : []),
      description,
      artisanalDetails: Array.isArray(artisanalDetails) ? artisanalDetails : (artisanalDetails ? artisanalDetails.split(',').map(s=>s.trim()) : [])
    };
  }
  res.status(200).json({ message: 'Product updated successfully' });
});

router.delete('/:id', async (req, res) => {
  inMemoryProducts = inMemoryProducts.filter(p => p._id !== req.params.id);
  res.status(200).json({ message: 'Product deleted' });
});

module.exports = router;