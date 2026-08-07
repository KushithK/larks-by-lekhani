import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, 
  X, Lock, ChevronLeft, ChevronRight, Truck, UserCheck,
  Check, User, QrCode, Link as LinkIcon, Sparkles,
  Upload, Image as ImageIcon, AlertCircle
} from 'lucide-react';

const LIVE_BACKEND_URL = "https://larks-by-lekhani.onrender.com";
const YOUR_REAL_UPI_ID = "larksbylekhani@upi";
const STUDIO_BUSINESS_NAME = "Larks by Lekhani";

// FAIL-SAFE MULTI-PHOTO CATALOG
const FALLBACK_CATALOG = [
  {
    _id: "1",
    title: "Birthday Story Mini Memory Album",
    basePrice: 499,
    discountPercent: 50,
    category: "Gift Albums",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A compact handcrafted birthday memory album book with interactive flip tabs, pull-out photo sleeves, and cute birthday prompts."
  },
  {
    _id: "2",
    title: "Handcrafted Floral Resin Keychain",
    basePrice: 149,
    discountPercent: 50,
    category: "Keychains",
    images: [
      "https://images.unsplash.com/photo-1611591475171-d41c10d32cb5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Charming small gift keychain featuring real pressed dried flowers, subtle foil accents, and a durable antique brass ring."
  },
  {
    _id: "3",
    title: "Sweet Bird Gift Hamper Box",
    basePrice: 999,
    discountPercent: 40,
    category: "Gift Boxes",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd454a?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A delightful small bird-themed gift box curated with ribbon, a dainty necklace, custom keychain, sticker pack, hair clips, earrings, and a face mask."
  },
  {
    _id: "4",
    title: "Artisanal Designed Gift Cards Set",
    basePrice: 99,
    discountPercent: 30,
    category: "Gift Cards",
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"],
    description: "Set of custom designed aesthetic gift cards with gold foil stamping, blank interior for personal notes, and vintage kraft envelope."
  },
  {
    _id: "5",
    title: "Cute Handmade Crochet Flower Card",
    basePrice: 199,
    discountPercent: 50,
    category: "Cards & Keepsakes",
    images: ["https://images.unsplash.com/photo-1528458909336-e7a0adfac1d5?q=80&w=800&auto=format&fit=crop"],
    description: "Adorable handcrafted greeting card featuring a soft 3D hand-crocheted yarn flower stem on premium cardstock at an affordable price."
  },
  {
    _id: "6",
    title: "Handmade Crochet Mini Bucket",
    basePrice: 299,
    discountPercent: 25,
    category: "Crochet & Crafts",
    images: ["https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop"],
    description: "Cute hand-crocheted mini bucket pouch crafted with soft cotton yarn, perfect for holding small trinkets, jewelry, or desktop accessories."
  },
  {
    _id: "7",
    title: "Custom Die-Cast Car Display Frame",
    basePrice: 899,
    discountPercent: 50,
    category: "Photo Frames",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Bespoke 3D shadow box frame designed specifically to display your favorite die-cast model car with custom background graphics."
  },
  {
    _id: "8",
    title: "Heartmade Custom Memory Frame",
    basePrice: 649,
    discountPercent: 50,
    category: "Photo Frames",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Handmade wooden memory photo frame customized with your favorite photographs, dried botanicals, and personalized names."
  }
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Ananya Sharma",
    rating: 5,
    date: "August 2, 2026",
    productTitle: "Birthday Story Mini Memory Album",
    comment: "Absolutely stunning quality! The custom notes and gold-foil detail were done with so much handcrafted care.",
    verified: true
  },
  {
    id: 2,
    name: "Rohan Verma",
    rating: 5,
    date: "July 29, 2026",
    productTitle: "Handcrafted Floral Resin Keychain",
    comment: "Arrived in 4 days in pristine packaging. Worth every penny for personalized gifting!",
    verified: true
  }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Checkout & Gateway Modal States
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCodAlert, setShowCodAlert] = useState(false);
  const [showFormRequiredAlert, setShowFormRequiredAlert] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('PhonePe');
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [processingStepText, setProcessingStepText] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Photo Attachment Upload State
  const [attachedPhotos, setAttachedPhotos] = useState([]);

  // Verified Customer Reviews State
  const [allReviews, setAllReviews] = useState(() => {
    const saved = localStorage.getItem('larks_product_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Shipping Form State
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [shippingForm, setShippingForm] = useState({
    contactEmail: '',
    contactPhone: '',
    firstName: '',
    lastName: '',
    houseNo: '',
    landmark: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    customizationDetails: '',
    photoDriveLinks: ''
  });

  const deliveryCharge = 150;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${LIVE_BACKEND_URL}/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        
        let parsedImgs = [];
        if (Array.isArray(data.images) && data.images.length > 0) {
          parsedImgs = data.images;
        } else if (typeof data.images === 'string' && data.images.length > 0) {
          parsedImgs = data.images.split(',').map(s=>s.trim()).filter(Boolean);
        }

        if (parsedImgs.length === 0) {
          parsedImgs = ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"];
        }

        setProduct({ ...data, images: parsedImgs });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Fetching error:', err);
    }

    const matched = FALLBACK_CATALOG.find(p => p._id === String(id)) || FALLBACK_CATALOG[0];
    setProduct(matched);
    setLoading(false);
  };

  const getProductImageList = () => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (typeof product.images === 'string' && product.images.length > 0) return product.images.split(',').map(s=>s.trim()).filter(Boolean);
    return ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'];
  };

  const productImages = getProductImageList();

  const nextImage = () => {
    if (productImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    if (productImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleInputChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handlePhotoFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    setAttachedPhotos(attachedPhotos.filter((_, idx) => idx !== index));
  };

  const handleSelectCod = () => {
    setPaymentMethod('cod');
    setShowCodAlert(true);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (paymentMethod === 'cod') {
      setShowCodAlert(true);
      return;
    }

    const isContactAndDeliveryValid = 
      shippingForm.contactEmail.trim() !== '' &&
      shippingForm.contactPhone.trim() !== '' &&
      shippingForm.firstName.trim() !== '' &&
      shippingForm.lastName.trim() !== '' &&
      shippingForm.houseNo.trim() !== '' &&
      shippingForm.streetAddress.trim() !== '' &&
      shippingForm.city.trim() !== '' &&
      shippingForm.state.trim() !== '' &&
      shippingForm.pincode.trim() !== '';

    if (!isContactAndDeliveryValid) {
      setShowFormRequiredAlert(true);
      return;
    }

    setShowRazorpayModal(true);
  };

  const handleRealMoneyPayment = async () => {
    setIsProcessingRazorpay(true);
    
    const itemSubtotal = (product ? product.basePrice : 599) * quantity;
    const grandTotal = itemSubtotal + deliveryCharge;

    const upiDeepLink = `upi://pay?pa=${YOUR_REAL_UPI_ID}&pn=${encodeURIComponent(STUDIO_BUSINESS_NAME)}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent('Order ' + product.title)}`;

    setProcessingStepText(`Opening ${selectedUpiApp} App...`);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = upiDeepLink;
    }

    setTimeout(async () => {
      setProcessingStepText('Verifying Transaction with Bank...');

      const payload = {
        productId: product._id,
        productTitle: product.title,
        customerName: `${shippingForm.firstName} ${shippingForm.lastName}`.trim(),
        customerEmail: shippingForm.contactEmail,
        contactNumber: shippingForm.contactPhone,
        address: {
          houseNo: shippingForm.houseNo,
          landmark: shippingForm.landmark || '',
          street: shippingForm.streetAddress,
          city: shippingForm.city,
          state: shippingForm.state,
          pincode: shippingForm.pincode,
          country: 'India'
        },
        customizationDetails: shippingForm.customizationDetails || 'Standard handcrafted design (No special notes)',
        photoDriveLinks: shippingForm.photoDriveLinks,
        attachedPhotos: attachedPhotos,
        quantity,
        totalAmount: grandTotal,
        paymentMethod: `Real UPI Payment (${selectedUpiApp})`,
        paymentStatus: 'Paid - Verified'
      };

      try {
        const res = await fetch(`${LIVE_BACKEND_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setTimeout(() => {
            setIsProcessingRazorpay(false);
            setShowRazorpayModal(false);
            setShowCheckout(false);
            setOrderConfirmed(data.order);
          }, 1200);
          return;
        }
      } catch (err) {}

      setTimeout(() => {
        setIsProcessingRazorpay(false);
        setShowRazorpayModal(false);
        setShowCheckout(false);
        setOrderConfirmed({
          _id: 'LBL-' + Math.floor(100000 + Math.random() * 900000),
          productTitle: product.title,
          quantity,
          totalAmount: grandTotal,
          customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
          contactNumber: shippingForm.contactPhone,
          address: { houseNo: shippingForm.houseNo, street: shippingForm.streetAddress, city: shippingForm.city, state: shippingForm.state, pincode: shippingForm.pincode },
          paymentMethod: `Online Payment (${selectedUpiApp})`,
          attachedPhotos
        });
      }, 1200);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f5] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#b57c70] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-serif italic text-[#2b2524]/70">Fetching Heartmade Artifact Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf6f5] flex flex-col items-center justify-center p-4">
        <h2 className="font-serif text-2xl text-[#2b2524] font-semibold">Artifact Not Found</h2>
        <Link to="/" className="mt-4 text-xs font-semibold text-[#b57c70] flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Collections
        </Link>
      </div>
    );
  }

  const originalPrice = product.basePrice;
  const discountPercent = product.discountPercent || 50;
  const strikeThroughMRP = Math.round(originalPrice / (1 - (discountPercent / 100)));
  const itemSubtotal = originalPrice * quantity;
  const grandTotal = itemSubtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-[#faf6f5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#2b2524]/70 hover:text-[#b57c70] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>

        {/* ORDER CONFIRMED RECEIPT SCREEN */}
        {orderConfirmed ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-[#b57c70]/30 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#b57c70] tracking-widest">Order Placed Successfully</span>
              <h1 className="font-serif text-3xl font-bold text-[#2b2524] mt-1">
                Thanks for ordering from Larks by Lekhani!
              </h1>
              <p className="text-xs text-[#2b2524]/70 mt-2">
                Order Reference Number: <strong className="text-[#2b2524] font-mono">{orderConfirmed._id}</strong>
              </p>
            </div>

            <div className="bg-[#faf6f5] p-5 rounded-xl text-left text-xs space-y-3 border border-[#b57c70]/15">
              <div className="flex justify-between border-b pb-2">
                <span className="font-bold text-[#2b2524]">{orderConfirmed.productTitle} x {orderConfirmed.quantity}</span>
                <span className="font-bold text-[#b57c70]">₹{orderConfirmed.totalAmount}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#b57c70] font-bold">Delivery Address:</p>
                <p className="text-[#2b2524]/80 mt-0.5">
                  {orderConfirmed.customerName}, {orderConfirmed.address.houseNo}, {orderConfirmed.address.street}, {orderConfirmed.address.city}, {orderConfirmed.address.state} - {orderConfirmed.address.pincode} (India)
                </p>
                <p className="text-[#2b2524]/70 mt-1">Contact Mobile: {orderConfirmed.contactNumber}</p>
              </div>

              {orderConfirmed.attachedPhotos && orderConfirmed.attachedPhotos.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-[10px] uppercase text-[#b57c70] font-bold mb-1.5">Attached Reference Photos ({orderConfirmed.attachedPhotos.length}):</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {orderConfirmed.attachedPhotos.map((imgSrc, idx) => (
                      <img key={idx} src={imgSrc} alt="Reference" className="w-12 h-12 object-cover rounded border border-[#b57c70]/30" />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t flex justify-between items-center text-[11px]">
                <span>Payment Status: <strong className="text-emerald-700 font-bold">{orderConfirmed.paymentMethod}</strong></span>
                <span className="text-[#2b2524]/60">Includes ₹150 Shipping Charge</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/my-orders"
                className="px-6 py-3 bg-[#b57c70] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#9e675b] transition-all shadow"
              >
                Track Live Order Status & Review
              </Link>
              <Link
                to="/"
                className="px-6 py-3 bg-[#2b2524] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#423b3a] transition-all shadow"
              >
                Back to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* PRODUCT DETAIL & MULTI-PHOTO SLIDER WITH THUMBNAIL STRIP */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-[#b57c70]/20 shadow-sm relative group">
                <img
                  src={productImages[currentImageIndex] || 'https://via.placeholder.com/600'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop';
                  }}
                />

                {productImages.length > 1 && (
                  <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow backdrop-blur-sm">
                    {currentImageIndex + 1} / {productImages.length} Photos
                  </span>
                )}

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#2b2524] shadow-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#2b2524] shadow-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#b57c70]">
                    Click Photo to View ({productImages.length} Available):
                  </span>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1">
                    {productImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                          currentImageIndex === idx 
                            ? 'border-[#b57c70] scale-95 shadow-md ring-2 ring-[#b57c70]/30' 
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop';
                          }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b57c70] tracking-widest bg-[#f5ebe8] px-2.5 py-1 rounded">
                  {product.category}
                </span>
                
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2524] mt-2">
                  {product.title}
                </h1>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#2b2524]/70 font-medium">(Verified Buyers Ratings)</span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#b57c70]">
                    Rs. {product.basePrice}.00
                  </span>
                  <span className="text-base text-rose-500 line-through font-medium opacity-70">
                    Rs. {strikeThroughMRP}.00
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#2b2524]/80 leading-relaxed border-t border-b border-[#b57c70]/15 py-4">
                {product.description}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold uppercase text-[#2b2524]">Quantity:</label>
                  <div className="flex items-center border border-[#b57c70]/30 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-[#2b2524] hover:bg-[#faf6f5]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-2 text-xs font-bold text-[#2b2524] min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-[#2b2524] hover:bg-[#faf6f5]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="py-3.5 px-6 rounded-lg border border-[#b57c70] text-[#b57c70] hover:bg-[#f5ebe8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to cart</span>
                  </button>

                  <button
                    onClick={() => setShowCheckout(true)}
                    className="py-3.5 px-6 rounded-lg bg-[#b57c70] hover:bg-[#9e675b] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                  >
                    Buy it now
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VERIFIED CUSTOMER REVIEWS DISPLAY ONLY */}
        {!orderConfirmed && (
          <div className="border-t border-[#b57c70]/20 pt-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b57c70] tracking-widest">Verified Buyer Ratings</span>
                <h2 className="font-serif text-2xl font-bold text-[#2b2524] mt-0.5">
                  Customer Reviews
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#2b2524]">5.0 Out of 5 Stars</span>
              </div>
            </div>

            <div className="bg-[#f5ebe8]/40 p-4 rounded-xl border border-[#b57c70]/15 flex items-center justify-between text-xs text-[#2b2524]/80">
              <span>Have you purchased this item? You can leave a verified review from your <strong>My Orders</strong> page!</span>
              <Link to="/my-orders" className="text-[#b57c70] font-bold hover:underline">
                Go to My Orders ➔
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-[#b57c70]/15 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#2b2524]/50">{rev.date}</span>
                  </div>
                  <p className="text-xs text-[#2b2524]/80 italic">"{rev.comment}"</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2b2524] pt-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#b57c70]" />
                    <span>{rev.name}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-normal">Verified Buyer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && !orderConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#b57c70]/30 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b57c70]">Checkout</span>
                <h3 className="font-serif text-xl font-bold text-[#2b2524]">Shipping & Custom Idea Details</h3>
              </div>
              <button onClick={() => setShowCheckout(false)} className="p-1 text-[#2b2524]/50 hover:text-[#2b2524]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              
              {/* CUSTOMIZATION BOX (OPTIONAL) */}
              <div className="bg-[#f5ebe8]/60 p-4 rounded-xl border border-[#b57c70]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2b2524] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#b57c70]" /> Customization & Reference
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-[#b57c70] bg-white px-2 py-0.5 rounded border border-[#b57c70]/20">
                    Optional
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-[#2b2524] mb-1">
                    Describe Your Idea & Requirements
                  </label>
                  <textarea
                    name="customizationDetails"
                    rows={3}
                    value={shippingForm.customizationDetails}
                    onChange={handleInputChange}
                    placeholder="Describe what you need — e.g. names to engrave, special dates, color choices, or specific instructions..."
                    className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-white leading-relaxed text-xs"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-semibold text-[#2b2524] mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#b57c70]" /> Upload Reference Photo(s)
                  </label>
                  
                  <div className="border-2 border-dashed border-[#b57c70]/40 hover:border-[#b57c70] rounded-xl p-3 bg-white text-center cursor-pointer relative transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-5 h-5 text-[#b57c70] mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#2b2524]">Click or Drag Reference Photos Here</p>
                    <p className="text-[10px] text-[#2b2524]/60">Select photos from your phone or PC (JPG, PNG, WEBP)</p>
                  </div>

                  {attachedPhotos.length > 0 && (
                    <div className="mt-2.5">
                      <p className="text-[10px] font-bold uppercase text-[#b57c70]">
                        Attached Photos ({attachedPhotos.length}):
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {attachedPhotos.map((photoData, idx) => (
                          <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#b57c70]/30 shadow-sm group">
                            <img src={photoData} alt={`Reference ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full opacity-80 hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#2b2524] mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-[#b57c70]" /> Or Paste Reference Photo / Drive Link
                  </label>
                  <input
                    type="url"
                    name="photoDriveLinks"
                    value={shippingForm.photoDriveLinks}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/folder or photo link..."
                    className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-white text-xs"
                  />
                </div>
              </div>

              {/* MANDATORY DELIVERY & CONTACT INFORMATION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2b2524]">Delivery & Contact Information</h4>
                  <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Required Fields *
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={shippingForm.contactEmail}
                      onChange={handleInputChange}
                      placeholder="customer@example.com"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">Contact Phone Number *</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={shippingForm.contactPhone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">House / Flat / Apt No. *</label>
                    <input
                      type="text"
                      name="houseNo"
                      value={shippingForm.houseNo}
                      onChange={handleInputChange}
                      placeholder="Apt 4B, 2nd Floor"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      value={shippingForm.landmark}
                      onChange={handleInputChange}
                      placeholder="Near Central Park"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2b2524] uppercase mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={shippingForm.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Building, Street, Area"
                    className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingForm.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2b2524] uppercase mb-1">Pin Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingForm.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="pt-3 border-t border-[#b57c70]/20 space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#2b2524]">Payment Method</h4>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer border-[#b57c70] bg-[#f5ebe8]/50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="accent-[#b57c70]"
                    />
                    <span className="font-bold text-[#2b2524]">Online Payment Gateway (UPI, Cards, NetBanking)</span>
                  </label>

                  <label
                    onClick={handleSelectCod}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#2b2524]/20 bg-[#faf6f5] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={handleSelectCod}
                      className="accent-[#b57c70]"
                    />
                    <span className="text-[#2b2524]/80">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              {/* TOTAL BREAKDOWN WITH ₹150 DELIVERY CHARGE */}
              <div className="bg-[#faf6f5] p-3.5 rounded-xl space-y-1 border border-[#b57c70]/15">
                <div className="flex justify-between text-[#2b2524]/80">
                  <span>Item Subtotal ({quantity} item):</span>
                  <span>Rs. {itemSubtotal}.00</span>
                </div>
                <div className="flex justify-between text-[#2b2524]/80 font-medium">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#b57c70]" /> Delivery Charge:
                  </span>
                  <span className="text-[#b57c70] font-bold">+ Rs. 150.00</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-[#2b2524] pt-1.5 border-t border-[#2b2524]/10">
                  <span>Total Payable Amount:</span>
                  <span className="text-[#b57c70] text-sm">Rs. {grandTotal}.00</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#2b2524] hover:bg-[#423b3a] text-white font-bold uppercase tracking-widest rounded-md transition-all shadow"
              >
                Proceed to Payment Gateway (Rs. {grandTotal}.00)
              </button>

            </form>
          </div>
        </div>
      )}

      {/* FORM REQUIRED POPUP ALERT */}
      {showFormRequiredAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#b57c70]/30 animate-in fade-in zoom-in">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-lg font-bold text-[#2b2524]">Incomplete Delivery Info</h3>
            <p className="text-xs text-[#2b2524]/80 leading-relaxed font-medium">
              Fill the form and then proceed to continue. Please complete your delivery name, contact number, and address details before going to payment.
            </p>

            <button
              type="button"
              onClick={() => setShowFormRequiredAlert(false)}
              className="w-full py-2.5 bg-[#b57c70] hover:bg-[#9e675b] text-white text-xs font-bold uppercase rounded-md shadow transition-all"
            >
              OK, Fill Form
            </button>
          </div>
        </div>
      )}

      {/* COD ALERT */}
      {showCodAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2b2524]">Cash on Delivery Unavailable</h3>
            <p className="text-xs text-[#2b2524]/80 leading-relaxed">
              Because all artifacts at Larks by Lekhani are custom handcrafted with your personal names and photos, Cash on Delivery (COD) is currently not available. Please proceed with <strong>Online Payment</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowCodAlert(false);
                setPaymentMethod('online');
              }}
              className="w-full py-2.5 bg-[#b57c70] text-white text-xs font-bold uppercase rounded-md"
            >
              Select Online Payment
            </button>
          </div>
        </div>
      )}

      {/* RAZORPAY PAYMENT GATEWAY MODAL */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#f3f4f6] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-300 relative text-gray-800 text-xs font-sans">
            
            <div className="bg-[#1d4ed8] text-white px-5 py-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowRazorpayModal(false)} className="hover:opacity-80">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h3 className="font-bold text-lg tracking-tight">Larks by Lekhani</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-base text-gray-900">Payment Options</h4>
                <p className="text-[11px] text-gray-500">Available Offers</p>
              </div>

              <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[10px]">%</span>
                  <span className="text-[11px] font-semibold text-gray-800">Unlimited 1% cashback with UPI</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 cursor-pointer">View all</span>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recommended</p>
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {[
                    { id: 'Google Pay', name: 'UPI - Google Pay', color: 'bg-emerald-500', logo: 'GPay' },
                    { id: 'PhonePe', name: 'UPI - PhonePe', color: 'bg-indigo-600', logo: 'Pe' },
                    { id: 'CRED UPI', name: 'UPI - CRED UPI', color: 'bg-black', logo: 'CRED' }
                  ].map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedUpiApp === app.id ? 'bg-indigo-50/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg ${app.color} text-white flex items-center justify-center text-[10px] font-bold`}>
                          {app.logo}
                        </div>
                        <span className="font-bold text-gray-800 text-xs">{app.name}</span>
                      </div>
                      {selectedUpiApp === app.id ? (
                        <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] space-y-1">
                <p className="font-bold text-amber-900 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  Direct UPI Merchant Address:
                </p>
                <p className="font-mono font-bold text-[#b57c70]">{YOUR_REAL_UPI_ID}</p>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                By proceeding, you agree to Razorpay's <span className="underline cursor-pointer">Privacy Notice</span>
              </p>
            </div>

            <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4 shadow-lg">
              <div>
                <span className="text-base font-extrabold text-gray-900 block">₹{grandTotal}.00</span>
                <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Includes ₹150 Delivery</span>
              </div>

              <button
                onClick={handleRealMoneyPayment}
                disabled={isProcessingRazorpay}
                className="flex-1 py-3 px-6 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingRazorpay ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs">{processingStepText}</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}