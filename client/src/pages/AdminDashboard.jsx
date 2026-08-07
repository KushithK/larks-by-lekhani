import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, Package, ShoppingBag, X, Save, ShieldCheck, MapPin, Phone, Type, Link as LinkIcon, Image as ImageIcon, CheckCircle2, Upload, ArrowRight, Check, AlertCircle, ZoomIn, Eye, Sparkles, Flame } from 'lucide-react';

const LIVE_BACKEND_URL = "https://larks-by-lekhani.onrender.com";
const STATUS_STEPS = ['Pending Review', 'In Production', 'Dispatched', 'Completed'];

const compressImageFile = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    };
  });
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'highlights'
  const [products, setProducts] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
  
  // New Highlight Form State
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightImage, setNewHighlightImage] = useState('');

  // Hover Photo Preview State
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  // Status Step Change Confirmation Modal State
  const [pendingAdvanceOrder, setPendingAdvanceOrder] = useState(null);
  const [pendingNextStatus, setPendingNextStatus] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [statusPopupText, setStatusPopupText] = useState('');
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [productFormData, setProductFormData] = useState({
    title: '', category: 'Photo Frames', basePrice: '', images: [], description: '', artisanalDetails: ''
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchHighlights();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${LIVE_BACKEND_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {}
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${LIVE_BACKEND_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {}
  };

  const fetchHighlights = async () => {
    try {
      const res = await fetch(`${LIVE_BACKEND_URL}/api/highlights`);
      const data = await res.json();
      setHighlights(data);
    } catch (err) {}
  };

  // HIGHLIGHT PHOTO UPLOAD
  const handleHighlightPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImageFile(file);
      setNewHighlightImage(compressed);
    }
  };

  const handleAddHighlightSubmit = async (e) => {
    e.preventDefault();
    if (!newHighlightTitle || !newHighlightImage) return;

    try {
      const res = await fetch(`${LIVE_BACKEND_URL}/api/highlights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newHighlightTitle, imageUrl: newHighlightImage })
      });

      if (res.ok) {
        setNewHighlightTitle('');
        setNewHighlightImage('');
        fetchHighlights();
        alert('Brand Highlight added successfully!');
      }
    } catch (err) {
      alert('Error adding highlight.');
    }
  };

  const handleDeleteHighlight = async (id) => {
    if (!window.confirm('Delete this highlight bubble?')) return;
    try {
      await fetch(`${LIVE_BACKEND_URL}/api/highlights/${id}`, { method: 'DELETE' });
      fetchHighlights();
    } catch (err) {}
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductFormData({ title: '', category: 'Photo Frames', basePrice: '', images: [], description: '', artisanalDetails: '' });
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    let parsedImages = [];
    if (Array.isArray(product.images)) {
      parsedImages = product.images;
    } else if (typeof product.images === 'string' && product.images.length > 0) {
      parsedImages = product.images.split(',').map(s => s.trim()).filter(Boolean);
    }

    setProductFormData({
      title: product.title,
      category: product.category,
      basePrice: product.basePrice,
      images: parsedImages,
      description: product.description,
      artisanalDetails: Array.isArray(product.artisanalDetails) ? product.artisanalDetails.join(', ') : ''
    });
    setShowProductModal(true);
  };

  const handleProductPhotoFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (productFormData.images.length >= 10) {
        alert('Maximum 10 photos allowed per product.');
        break;
      }
      const compressedBase64 = await compressImageFile(file);
      setProductFormData(prev => ({
        ...prev,
        images: [...prev.images, compressedBase64]
      }));
    }
  };

  const handleRemoveProductPhoto = (indexToRemove) => {
    setProductFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `${LIVE_BACKEND_URL}/api/products/${editingProduct._id}` : `${LIVE_BACKEND_URL}/api/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productFormData)
      });

      if (res.ok) {
        setShowProductModal(false);
        fetchProducts();
        setShowSaveSuccessPopup(true);

        setTimeout(() => {
          setShowSaveSuccessPopup(false);
        }, 2000);
      }
    } catch (err) {
      alert('Error saving product details.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete item?')) return;
    await fetch(`${LIVE_BACKEND_URL}/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const openConfirmAdvanceModal = (order, nextStatus) => {
    setPendingAdvanceOrder(order);
    setPendingNextStatus(nextStatus);
    setShowConfirmModal(true);
  };

  const executeOrderAdvance = async () => {
    if (!pendingAdvanceOrder || !pendingNextStatus) return;

    try {
      const res = await fetch(`${LIVE_BACKEND_URL}/api/orders/${pendingAdvanceOrder._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: pendingNextStatus })
      });

      if (res.ok) {
        setShowConfirmModal(false);
        fetchOrders();
        setStatusPopupText(`Order ${pendingAdvanceOrder._id} successfully advanced to "${pendingNextStatus}"!`);
        setShowStatusPopup(true);
        setTimeout(() => setShowStatusPopup(false), 2000);
      }
    } catch (err) {
      alert('Error updating order status.');
    } fontally {
      setPendingAdvanceOrder(null);
      setPendingNextStatus('');
    }
  };

  const getImageList = (imagesData) => {
    if (Array.isArray(imagesData)) return imagesData;
    if (typeof imagesData === 'string') return imagesData.split(',').map(s=>s.trim()).filter(Boolean);
    return [];
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#b57c70]/20">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b57c70]" />
              <span className="text-[10px] uppercase font-bold text-[#b57c70]">Lekhani Studio Control</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#2b2524]">Admin Management Portal</h1>
          </div>

          <div className="flex items-center bg-[#2b2524]/5 p-1 rounded-lg border border-[#b57c70]/20 flex-wrap">
            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'products' ? 'bg-[#b57c70] text-white' : 'text-[#2b2524]'}`}>
              Products ({products.length})
            </button>
            <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'orders' ? 'bg-[#b57c70] text-white' : 'text-[#2b2524]'}`}>
              Orders ({orders.length})
            </button>
            <button onClick={() => setActiveTab('highlights')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'highlights' ? 'bg-[#b57c70] text-white' : 'text-[#2b2524]'}`}>
              Brand Highlights ({highlights.length})
            </button>
          </div>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-semibold text-[#2b2524]">Catalog Inventory</h2>
              <button onClick={openAddModal} className="px-4 py-2 bg-[#2b2524] text-white rounded text-xs font-semibold flex items-center gap-2 shadow">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const imgList = getImageList(p.images);

                return (
                  <div key={p._id} className="bg-white rounded-xl border border-[#b57c70]/20 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold text-[#b57c70] bg-[#f5ebe8] px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-[#2b2524]/70 font-bold bg-[#faf6f5] px-2 py-0.5 rounded border">
                          📸 {imgList.length} Photos
                        </span>
                      </div>

                      {imgList.length > 0 && (
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-[#faf6f5] mb-3 border border-[#2b2524]/5 relative">
                          <img src={imgList[0]} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <h3 className="font-serif font-semibold text-base text-[#2b2524] line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-[#2b2524]/70 mt-1 line-clamp-2">{p.description}</p>
                      <p className="text-sm font-bold text-[#b57c70] mt-3">₹{p.basePrice}.00</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2b2524]/10 flex justify-end gap-2">
                      <button onClick={() => openEditModal(p)} className="p-2 text-xs font-semibold text-[#2b2524] hover:bg-[#f5ebe8] rounded flex items-center gap-1 transition-colors">
                        <Edit3 className="w-3.5 h-3.5 text-[#b57c70]" /> Update ({imgList.length} Photos)
                      </button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUSTOMER ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl font-semibold text-[#2b2524]">Customer Orders & Studio Dispatch</h2>
              <button onClick={fetchOrders} className="text-xs text-[#b57c70] font-semibold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
              </button>
            </div>

            {orders.map((o) => (
              <div key={o._id} className="bg-white rounded-xl border border-[#b57c70]/20 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                  <div>
                    <span className="font-bold text-xs text-[#2b2524]">Order ID: {o._id}</span>
                    <span className="ml-2 font-semibold text-xs text-[#b57c70] bg-[#f5ebe8] px-2.5 py-0.5 rounded">
                      {o.productTitle} (x{o.quantity || 1})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                      {o.paymentStatus || 'Paid Online'} (₹{o.totalAmount})
                    </span>

                    {(!o.status || o.status === 'Pending Review') && (
                      <button
                        type="button"
                        onClick={() => openConfirmAdvanceModal(o, 'In Production')}
                        className="px-3.5 py-1.5 bg-[#b57c70] hover:bg-[#9e675b] text-white font-bold text-xs rounded-full shadow transition-all flex items-center gap-1.5"
                      >
                        <span>Start Production</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {o.status === 'In Production' && (
                      <button
                        type="button"
                        onClick={() => openConfirmAdvanceModal(o, 'Dispatched')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow transition-all flex items-center gap-1.5"
                      >
                        <span>Dispatch Order</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {o.status === 'Dispatched' && (
                      <button
                        type="button"
                        onClick={() => openConfirmAdvanceModal(o, 'Completed')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition-all flex items-center gap-1.5"
                      >
                        <span>Mark Completed</span> <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    )}

                    {o.status === 'Completed' && (
                      <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                        ✓ Order Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-5 bg-[#faf6f5] p-3.5 rounded-lg space-y-1">
                    <p className="font-bold text-[#2b2524]">{o.customerName}</p>
                    <p className="text-[#b57c70]">{o.customerEmail}</p>
                    <p className="text-[#2b2524]/80 flex items-center gap-1 pt-1">
                      <Phone className="w-3 h-3 text-[#b57c70]" /> Phone: {o.contactNumber || 'N/A'}
                    </p>
                    {o.address && (
                      <p className="text-[#2b2524]/80 flex items-start gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b57c70] flex-shrink-0 mt-0.5" />
                        <span>{o.address.houseNo}, {o.address.street}, {o.address.city}, {o.address.state} - {o.address.pincode} ({o.address.country || 'India'})</span>
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-7 bg-[#f5ebe8]/40 p-3.5 rounded-lg space-y-1">
                    <p className="font-bold text-[#2b2524] text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Type className="w-3.5 h-3.5 text-[#b57c70]" /> Customer Idea & Requirements:
                    </p>
                    
                    <p className="text-[#2b2524]/90 leading-relaxed italic bg-white p-2 rounded border border-[#b57c70]/10">
                      "{o.customizationDetails}"
                    </p>

                    {o.photoDriveLinks && (
                      <p className="text-[#2b2524] flex items-center gap-1 truncate pt-1">
                        <strong>Reference Link:</strong>
                        <a href={o.photoDriveLinks} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> Open Link
                        </a>
                      </p>
                    )}

                    {o.attachedPhotos && o.attachedPhotos.length > 0 && (
                      <div className="pt-2 border-t border-[#b57c70]/10">
                        <p className="font-bold text-[#b57c70] text-[10px] uppercase mb-1.5 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Attached Reference Photos ({o.attachedPhotos.length}) — Hover to Zoom:
                        </p>
                        <div className="flex gap-2.5 overflow-x-auto py-1">
                          {o.attachedPhotos.map((imgData, idx) => (
                            <div
                              key={idx}
                              onMouseEnter={() => setHoveredPhoto(imgData)}
                              onMouseLeave={() => setHoveredPhoto(null)}
                              className="relative group cursor-zoom-in flex-shrink-0"
                            >
                              <img
                                src={imgData}
                                alt={`Reference ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-[#b57c70]/30 shadow-sm group-hover:border-[#b57c70] group-hover:scale-110 transition-all duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BRAND HIGHLIGHTS MANAGEMENT TAB */}
        {activeTab === 'highlights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#b57c70]/20 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#2b2524] flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-current" />
                <span>Manage Studio Brand Highlights (Homepage Reel)</span>
              </h2>
              <p className="text-xs text-[#2b2524]/70">
                Add floating animated highlight story bubbles displayed between your studio name and search bar.
              </p>

              {/* Add New Highlight Form */}
              <form onSubmit={handleAddHighlightSubmit} className="bg-[#faf6f5] p-4 rounded-xl border border-[#b57c70]/20 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-end">
                <div className="sm:col-span-4">
                  <label className="block font-bold text-[#2b2524] mb-1">Highlight Title *</label>
                  <input
                    type="text"
                    required
                    value={newHighlightTitle}
                    onChange={(e) => setNewHighlightTitle(e.target.value)}
                    placeholder="e.g. Bespoke Albums, Resin Frames"
                    className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-white"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block font-bold text-[#2b2524] mb-1">Highlight Image *</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHighlightPhotoUpload}
                      className="text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-[#b57c70] file:text-white file:font-bold cursor-pointer"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#b57c70] hover:bg-[#9e675b] text-white font-bold uppercase rounded shadow flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Highlight
                  </button>
                </div>
              </form>
            </div>

            {/* Current Highlights List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {highlights.map((h) => (
                <div key={h._id} className="bg-white p-4 rounded-xl border border-[#b57c70]/20 text-center space-y-2 shadow-sm relative group">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#b57c70] to-amber-400 mx-auto overflow-hidden">
                    <img src={h.imageUrl} alt={h.title} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <h4 className="font-serif font-bold text-xs text-[#2b2524] line-clamp-1">{h.title}</h4>
                  <button
                    onClick={() => handleDeleteHighlight(h._id)}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full mx-auto flex items-center justify-center transition-colors"
                    title="Delete Highlight"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* HOVER PREVIEW ENLARGED IMAGE CARD */}
      {hoveredPhoto && (
        <div className="fixed bottom-10 right-10 z-50 pointer-events-none bg-white p-3 rounded-2xl border-2 border-[#b57c70] shadow-2xl animate-in fade-in zoom-in max-w-sm sm:max-w-md">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#b57c70] mb-2 pb-1 border-b">
            <Eye className="w-4 h-4" /> Customer Reference Photo Preview
          </div>
          <img
            src={hoveredPhoto}
            alt="Enlarged Reference Preview"
            className="w-72 sm:w-80 h-72 sm:h-80 object-cover rounded-xl shadow-inner bg-[#faf6f5]"
          />
        </div>
      )}

      {/* STEP ADVANCE CONFIRMATION POP-UP MODAL */}
      {showConfirmModal && pendingAdvanceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-[#b57c70]/30 animate-in fade-in">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2b2524]">Advance Order Status?</h3>
            
            <div className="bg-[#faf6f5] p-3.5 rounded-xl border border-[#b57c70]/15 text-xs text-[#2b2524]/80 space-y-2 text-left">
              <p className="font-bold text-[#2b2524]">
                Order ID: <span className="font-mono text-[#b57c70]">{pendingAdvanceOrder._id}</span>
              </p>
              <p>Product: <strong>{pendingAdvanceOrder.productTitle}</strong></p>
              <p>Customer: <strong>{pendingAdvanceOrder.customerName}</strong></p>
              <div className="pt-2 border-t font-bold text-xs flex items-center justify-between">
                <span className="text-[#2b2524]/60">{pendingAdvanceOrder.status || 'Pending Review'}</span>
                <span className="text-[#b57c70]">➔ {pendingNextStatus}</span>
              </div>
            </div>

            <p className="text-xs text-rose-700 font-semibold bg-rose-50 p-2 rounded">
              ⚠️ Note: Once advanced, you cannot move backwards to previous steps.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#2b2524] text-xs font-bold uppercase rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeOrderAdvance}
                className="flex-1 py-2.5 bg-[#b57c70] hover:bg-[#9e675b] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow transition-all flex items-center justify-center gap-1.5"
              >
                <span>Confirm & Advance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 border border-[#b57c70]/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2b2524]">{editingProduct ? 'Update Product Details' : 'Add New Item'}</h3>
                <p className="text-[10px] text-[#b57c70] font-semibold">Select 1, 2, 3... up to 10 photos directly from your computer/phone</p>
              </div>
              <button onClick={() => setShowProductModal(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2b2524] mb-1">Product Title *</label>
                <input type="text" required value={productFormData.title} onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })} placeholder="e.g. Custom Die-Cast Car Display Frame" className="w-full p-2.5 border rounded border-[#2b2524]/20 bg-[#faf6f5]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2b2524] mb-1">Category *</label>
                  <select value={productFormData.category} onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })} className="w-full p-2.5 border rounded border-[#2b2524]/20 bg-[#faf6f5]">
                    <option value="Photo Frames">Photo Frames</option>
                    <option value="Gift Albums">Gift Albums</option>
                    <option value="Keychains">Keychains</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Gift Cards">Gift Cards</option>
                    <option value="Cards & Keepsakes">Cards & Keepsakes</option>
                    <option value="Crochet & Crafts">Crochet & Crafts</option>
                    <option value="Sparkbooks">Sparkbooks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2b2524] mb-1">Selling Price (₹) *</label>
                  <input type="number" required value={productFormData.basePrice} onChange={(e) => setProductFormData({ ...productFormData, basePrice: e.target.value })} placeholder="e.g. 899" className="w-full p-2.5 border rounded border-[#2b2524]/20 bg-[#faf6f5]" />
                </div>
              </div>

              <div className="bg-[#f5ebe8]/50 p-4 rounded-xl border border-[#b57c70]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#2b2524] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#b57c70]" /> Upload Product Photos ({productFormData.images.length} / 10 Selected)
                  </label>
                  <span className="text-[10px] text-[#b57c70] font-bold">Max 10 Photos</span>
                </div>

                <div className="border-2 border-dashed border-[#b57c70]/40 hover:border-[#b57c70] rounded-xl p-3 bg-white text-center cursor-pointer relative transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductPhotoFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-[#b57c70] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#2b2524]">Click Here to Select Photos from Your PC/Phone</p>
                  <p className="text-[10px] text-[#2b2524]/60">Select 1, 2, 3, 4... up to 10 picture files</p>
                </div>

                {productFormData.images.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase text-[#b57c70] mb-1.5">
                      Selected Photos ({productFormData.images.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {productFormData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-[#b57c70]/40 shadow-sm group">
                          <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveProductPhoto(idx)}
                            className="absolute top-0 right-0 p-1 bg-black/80 text-white rounded-bl hover:bg-rose-600 transition-colors"
                            title="Delete this photo"
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
                <label className="block font-bold text-[#2b2524] mb-1">Description *</label>
                <textarea required rows={3} value={productFormData.description} onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })} placeholder="Detailed product description..." className="w-full p-2.5 border rounded border-[#2b2524]/20 bg-[#faf6f5]"></textarea>
              </div>

              <button type="submit" className="w-full py-3 bg-[#b57c70] text-white font-bold uppercase rounded shadow hover:bg-[#9e675b] transition-all flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" />
                <span>Save Item Details ({productFormData.images.length} Photos Selected)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESSFULLY SAVED POP-UP MODAL */}
      {showSaveSuccessPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#b57c70]/30 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2b2524]">Successfully Saved!</h3>
            <p className="text-xs text-[#2b2524]/80 leading-relaxed font-medium">
              Product details and all selected photos have been saved to your studio inventory.
            </p>

            <button
              type="button"
              onClick={() => setShowSaveSuccessPopup(false)}
              className="w-full py-2.5 bg-[#b57c70] hover:bg-[#9e675b] text-white text-xs font-bold uppercase rounded-md shadow transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* STATUS ADVANCED SUCCESS POP-UP MODAL */}
      {showStatusPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#b57c70]/30 animate-in fade-in">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2b2524]">Order Advanced!</h3>
            <p className="text-xs text-[#2b2524]/80 leading-relaxed font-medium">
              {statusPopupText}
            </p>

            <button
              type="button"
              onClick={() => setShowStatusPopup(false)}
              className="w-full py-2.5 bg-[#b57c70] text-white text-xs font-bold uppercase rounded-md shadow"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}