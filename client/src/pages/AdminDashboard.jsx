import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, Package, ShoppingBag, X, Save, ShieldCheck, MapPin, Phone, Type, Link as LinkIcon, Image as ImageIcon, CheckCircle2, Upload } from 'lucide-react';

const LIVE_BACKEND_URL = "https://larks-by-lekhani.onrender.com";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
  
  // productFormData.images is managed as a REAL ARRAY of photos
  const [productFormData, setProductFormData] = useState({
    title: '',
    category: 'Photo Frames',
    basePrice: '',
    images: [], // Array of 1 to 10 photo URLs / Base64
    description: '',
    artisanalDetails: ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
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

  const openAddModal = () => {
    setEditingProduct(null);
    setProductFormData({ title: '', category: 'Photo Frames', basePrice: '', images: [], description: '', artisanalDetails: '' });
    setImageUrlInput('');
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
    setImageUrlInput('');
    setShowProductModal(true);
  };

  // UPLOAD UP TO 10 PHOTOS FROM FILE PICKER
  const handleProductPhotoFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData(prev => {
          if (prev.images.length >= 10) {
            alert('Maximum 10 photos allowed per product.');
            return prev;
          }
          return { ...prev, images: [...prev.images, reader.result] };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // ADD PHOTO BY URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (productFormData.images.length >= 10) {
      alert('Maximum 10 photos allowed per product.');
      return;
    }
    setProductFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
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

  const handleStatusChange = async (orderId, newStatus) => {
    await fetch(`${LIVE_BACKEND_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#b57c70]/20">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b57c70]" />
              <span className="text-[10px] uppercase font-bold text-[#b57c70]">Lekhani Studio Control</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#2b2524]">Admin Management Portal</h1>
          </div>

          <div className="flex items-center bg-[#2b2524]/5 p-1 rounded-lg border border-[#b57c70]/20">
            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'products' ? 'bg-[#b57c70] text-white' : 'text-[#2b2524]'}`}>
              Products ({products.length})
            </button>
            <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded text-xs font-bold ${activeTab === 'orders' ? 'bg-[#b57c70] text-white' : 'text-[#2b2524]'}`}>
              Customer Orders ({orders.length})
            </button>
          </div>
        </div>

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
                const imgList = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? p.images.split(',').map(s=>s.trim()).filter(Boolean) : []);

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

                      {/* Photo Thumbnail Strip */}
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
                  <div>
                    <span className="font-bold text-xs text-[#2b2524]">Order ID: {o._id}</span>
                    <span className="ml-2 font-semibold text-xs text-[#b57c70] bg-[#f5ebe8] px-2.5 py-0.5 rounded">
                      {o.productTitle} (x{o.quantity || 1})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                      {o.paymentStatus || 'Paid Online'} (₹{o.totalAmount})
                    </span>
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="text-xs font-semibold px-3 py-1 rounded-full border bg-[#faf6f5] cursor-pointer">
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Production">In Production</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Completed">Completed</option>
                    </select>
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
                        <p className="font-bold text-[#b57c70] text-[10px] uppercase mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Attached Reference Photos ({o.attachedPhotos.length}):
                        </p>
                        <div className="flex gap-2 overflow-x-auto">
                          {o.attachedPhotos.map((imgData, idx) => (
                            <a key={idx} href={imgData} target="_blank" rel="noopener noreferrer">
                              <img src={imgData} alt="Reference Upload" className="w-14 h-14 object-cover rounded border border-[#b57c70]/30 shadow-sm hover:scale-105 transition-transform cursor-pointer" />
                            </a>
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

      </div>

      {/* EDIT / ADD PRODUCT MODAL (SUPPORTS UP TO 10 PHOTOS) */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 border border-[#b57c70]/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2b2524]">{editingProduct ? 'Update Product Details' : 'Add New Item'}</h3>
                <p className="text-[10px] text-[#b57c70] font-semibold">Upload 1, 2, 3... up to 10 photos per product</p>
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

              {/* MULTI-PHOTO UPLOAD SECTION (UP TO 10 PHOTOS) */}
              <div className="bg-[#f5ebe8]/50 p-4 rounded-xl border border-[#b57c70]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#2b2524] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#b57c70]" /> Item Photos ({productFormData.images.length} / 10 Added)
                  </label>
                  <span className="text-[10px] text-[#b57c70] font-bold">Max 10 Photos</span>
                </div>

                {/* Upload File Box */}
                <div className="border-2 border-dashed border-[#b57c70]/40 hover:border-[#b57c70] rounded-xl p-3 bg-white text-center cursor-pointer relative transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductPhotoFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-5 h-5 text-[#b57c70] mx-auto mb-1" />
                  <p className="text-xs font-bold text-[#2b2524]">Click or Drag Photos Here to Upload</p>
                  <p className="text-[10px] text-[#2b2524]/60">Select 1, 2, 3, 4, 5... up to 10 photos from phone/PC</p>
                </div>

                {/* Added Photos Thumbnail Gallery */}
                {productFormData.images.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase text-[#b57c70] mb-1.5">
                      Attached Product Photos ({productFormData.images.length}):
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

                {/* Add Photo by URL option */}
                <div className="pt-2 border-t border-[#b57c70]/15 flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste direct image URL (https://i.postimg.cc/car1.jpg)"
                    className="flex-1 p-2 border rounded border-[#2b2524]/20 bg-white text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-[#2b2524] text-white font-bold text-[11px] rounded"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2b2524] mb-1">Description *</label>
                <textarea required rows={3} value={productFormData.description} onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })} placeholder="Detailed product description..." className="w-full p-2.5 border rounded border-[#2b2524]/20 bg-[#faf6f5]"></textarea>
              </div>

              <button type="submit" className="w-full py-3 bg-[#b57c70] text-white font-bold uppercase rounded shadow hover:bg-[#9e675b] transition-all flex items-center justify-center gap-1.5">
                <Save className="w-4 h-4" />
                <span>Save Item Details ({productFormData.images.length} Photos)</span>
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
              Product details and all uploaded photos have been saved to your studio inventory.
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

    </div>
  );
}