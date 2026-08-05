import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, CheckCircle, Sparkles, UserCheck, Plus } from 'lucide-react';

export default function ReviewsPage() {
  const initialReviews = [
    {
      id: 1,
      name: "Ananya Deshmukh",
      rating: 5,
      date: "July 28, 2026",
      product: "Interactive Story Memory Sparkbook",
      comment: "The Sparkbook turned out even more beautiful than I imagined! The pull-out surprise tabs and calligraphed notes made my anniversary gift so deeply emotional. Lekhani's team was super patient with my text revisions.",
      verified: true
    },
    {
      id: 2,
      name: "Vikramaditya Sharma",
      rating: 5,
      date: "July 20, 2026",
      product: "Velvet Heirloom Premium Gift Album",
      comment: "Outstanding luxury craftsmanship! The velvet texture feels soft and opulent, and the gold foil title stamping was crisp. Came with extra photo mounting stickers. Highly recommended for heirloom gifts!",
      verified: true
    },
    {
      id: 3,
      name: "Meera & Rohan",
      rating: 5,
      date: "July 14, 2026",
      product: "Botanical Floral Resin Photo Frame",
      comment: "The pressed flowers embedded inside the crystal clear resin look surreal with the teakwood frame! It looks like floating art on our living room shelf. Worth every rupee.",
      verified: true
    },
    {
      id: 4,
      name: "Pooja Hegde",
      rating: 5,
      date: "June 30, 2026",
      product: "Personalized Miniature Initial Resin Keychain",
      comment: "Ordered 5 keychains for my bridesmaids with custom initials and baby dried flowers inside. Everyone loved them! Lightweight yet sturdy brass ring.",
      verified: true
    }
  ];

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('larks_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', product: 'Interactive Story Memory Sparkbook', rating: 5, comment: '' });

  const handleAddReview = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      product: newReview.product,
      comment: newReview.comment,
      verified: true
    };

    const updated = [entry, ...reviews];
    setReviews(updated);
    localStorage.setItem('larks_reviews', JSON.stringify(updated));
    setShowAddForm(false);
    setNewReview({ name: '', product: 'Interactive Story Memory Sparkbook', rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b57c70]/15 text-[#b57c70] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Customer Testimonials
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2b2524]">
            Loved by Keepsake Collectors
          </h1>
          <p className="text-sm text-[#2b2524]/70 max-w-lg mx-auto">
            Read authentic reviews from customers who commissioned handcrafted Sparkbooks, Velvet Albums, Photo Frames, and Keychains.
          </p>
        </div>

        {/* Rating Overview Box */}
        <div className="bg-white rounded-2xl p-8 border border-[#b57c70]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-[#b57c70] font-serif">4.9</div>
            <div>
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#2b2524]/70 mt-1">Based on {reviews.length} Verified Customer Reviews</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 bg-[#2b2524] text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#423b3a] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#b57c70]" />
            <span>{showAddForm ? 'Close Review Form' : 'Share Your Review'}</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddForm && (
          <form onSubmit={handleAddReview} className="bg-white p-6 rounded-2xl border border-[#b57c70]/30 shadow-md space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#2b2524] border-b pb-2">Write a Customer Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Product Purchased *</label>
                <select
                  value={newReview.product}
                  onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                >
                  <option value="Interactive Story Memory Sparkbook">Interactive Story Memory Sparkbook</option>
                  <option value="Velvet Heirloom Premium Gift Album">Velvet Heirloom Premium Gift Album</option>
                  <option value="Botanical Floral Resin Photo Frame">Botanical Floral Resin Photo Frame</option>
                  <option value="Personalized Miniature Initial Resin Keychain">Personalized Miniature Initial Resin Keychain</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Rating *</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-[#2b2524] mb-1">Your Review Comment *</label>
              <textarea
                required
                rows={3}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share how you liked the handcrafted quality, packaging, or custom details..."
                className="w-full p-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5]"
              ></textarea>
            </div>
            <button type="submit" className="px-5 py-2.5 bg-[#b57c70] text-white font-bold uppercase rounded shadow">
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#b57c70]/20 p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex text-amber-500 gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#2b2524]/50">{rev.date}</span>
                </div>

                <span className="inline-block text-[10px] uppercase font-bold text-[#b57c70] bg-[#f5ebe8] px-2.5 py-0.5 rounded">
                  {rev.product}
                </span>

                <p className="text-xs text-[#2b2524]/80 leading-relaxed italic pt-1">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#2b2524]/5 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2b2524]">
                  <UserCheck className="w-3.5 h-3.5 text-[#b57c70]" />
                  <span>{rev.name}</span>
                </div>
                {rev.verified && (
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}