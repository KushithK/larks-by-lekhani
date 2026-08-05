import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, MapPin, Link as LinkIcon, Sparkles, RefreshCw, Type, Image as ImageIcon } from 'lucide-react';

export default function MyOrdersPage({ currentUser }) {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/user/${currentUser.email}`);
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusIndex = (status) => {
    switch (status) {
      case 'Pending Review': return 1;
      case 'In Production': return 2;
      case 'Dispatched': return 3;
      case 'Completed': return 4;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#b57c70]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b57c70]/15 text-[#b57c70] text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted Studio Tracking
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2524]">
              My Orders & Live Status
            </h1>
            <p className="text-xs text-[#2b2524]/70 mt-1">
              Track your custom handcrafted requests created by Lekhani & studio team.
            </p>
          </div>

          <button
            onClick={fetchUserOrders}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-[#2b2524] text-white rounded-md text-xs font-bold hover:bg-[#423b3a] transition-all shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#b57c70]" /> Refresh Status
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-[#b57c70] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-[#b57c70]/30 space-y-4">
            <Package className="w-12 h-12 text-[#b57c70] mx-auto opacity-50" />
            <h3 className="font-serif text-xl font-bold text-[#2b2524]">No Orders Found</h3>
            <p className="text-xs text-[#2b2524]/70 max-w-sm mx-auto">
              You haven't placed any custom handcrafted orders yet with email <strong>{currentUser.email}</strong>.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="px-6 py-2.5 bg-[#b57c70] text-white text-xs font-bold uppercase rounded-md shadow hover:bg-[#9e675b] transition-all"
              >
                Browse Studio Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {userOrders.map((order) => {
              const activeStep = getStepStatusIndex(order.status);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-[#b57c70]/20 p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2b2524]/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#b57c70]">Order ID: {order._id}</span>
                      <h3 className="font-serif text-xl font-bold text-[#2b2524] mt-0.5">
                        {order.productTitle} (x{order.quantity || 1})
                      </h3>
                      <p className="text-[10px] text-[#2b2524]/50 mt-0.5">
                        Placed on: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-[#b57c70]">
                        ₹{order.totalAmount}
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1">
                        {order.paymentStatus || 'Paid Online'}
                      </span>
                    </div>
                  </div>

                  {/* LIVE PROGRESS STEPPER TIMELINE */}
                  <div className="bg-[#faf6f5] p-5 rounded-xl border border-[#b57c70]/15 space-y-3">
                    <p className="text-xs font-bold text-[#2b2524] uppercase tracking-wider">Live Crafting Progress:</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className={`p-3 rounded-lg border transition-all ${activeStep >= 1 ? 'bg-white border-[#b57c70] shadow-sm' : 'opacity-40 border-gray-200'}`}>
                        <Clock className={`w-5 h-5 mx-auto mb-1 ${activeStep >= 1 ? 'text-[#b57c70]' : 'text-gray-400'}`} />
                        <span className="font-bold block text-[11px] text-[#2b2524]">1. Pending Review</span>
                        <span className="text-[9px] text-[#2b2524]/60">Design Check</span>
                      </div>

                      <div className={`p-3 rounded-lg border transition-all ${activeStep >= 2 ? 'bg-white border-[#b57c70] shadow-sm' : 'opacity-40 border-gray-200'}`}>
                        <Sparkles className={`w-5 h-5 mx-auto mb-1 ${activeStep >= 2 ? 'text-[#b57c70]' : 'text-gray-400'}`} />
                        <span className="font-bold block text-[11px] text-[#2b2524]">2. In Production</span>
                        <span className="text-[9px] text-[#2b2524]/60">Studio Handcrafting</span>
                      </div>

                      <div className={`p-3 rounded-lg border transition-all ${activeStep >= 3 ? 'bg-white border-[#b57c70] shadow-sm' : 'opacity-40 border-gray-200'}`}>
                        <Truck className={`w-5 h-5 mx-auto mb-1 ${activeStep >= 3 ? 'text-[#b57c70]' : 'text-gray-400'}`} />
                        <span className="font-bold block text-[11px] text-[#2b2524]">3. Dispatched</span>
                        <span className="text-[9px] text-[#2b2524]/60">In Courier Transit</span>
                      </div>

                      <div className={`p-3 rounded-lg border transition-all ${activeStep >= 4 ? 'bg-white border-emerald-600 shadow-sm' : 'opacity-40 border-gray-200'}`}>
                        <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${activeStep >= 4 ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <span className="font-bold block text-[11px] text-[#2b2524]">4. Completed</span>
                        <span className="text-[9px] text-[#2b2524]/60">Delivered To You</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address & Idea Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#f5ebe8]/40 p-4 rounded-xl border border-[#b57c70]/10 space-y-1">
                      <h4 className="font-bold text-[#2b2524] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#b57c70]" /> Delivery Address
                      </h4>
                      <p className="font-semibold text-[#2b2524]">{order.customerName}</p>
                      {order.address && (
                        <p className="text-[#2b2524]/80">
                          {order.address.houseNo}, {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode} ({order.address.country || 'India'})
                        </p>
                      )}
                      <p className="text-[#2b2524]/70 pt-1">Phone: {order.contactNumber}</p>
                    </div>

                    <div className="bg-[#f5ebe8]/40 p-4 rounded-xl border border-[#b57c70]/10 space-y-1.5">
                      <h4 className="font-bold text-[#2b2524] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-[#b57c70]" /> Submitted Idea & Requirements
                      </h4>

                      <p className="text-[#2b2524]/90 italic bg-white p-2.5 rounded border border-[#b57c70]/10">
                        "{order.customizationDetails}"
                      </p>

                      {order.photoDriveLinks && (
                        <p className="text-[#2b2524] flex items-center gap-1 truncate pt-1">
                          <strong className="text-[#b57c70]">Reference Link:</strong>
                          <a href={order.photoDriveLinks} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" /> View Photo Link
                          </a>
                        </p>
                      )}

                      {order.attachedPhotos && order.attachedPhotos.length > 0 && (
                        <div className="pt-1 border-t border-[#b57c70]/10">
                          <p className="font-bold text-[#b57c70] text-[10px] uppercase mb-1 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Attached Reference Photos ({order.attachedPhotos.length}):
                          </p>
                          <div className="flex gap-2 overflow-x-auto">
                            {order.attachedPhotos.map((imgData, idx) => (
                              <img key={idx} src={imgData} alt="Reference Upload" className="w-12 h-12 object-cover rounded border border-[#b57c70]/30 shadow-sm" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}