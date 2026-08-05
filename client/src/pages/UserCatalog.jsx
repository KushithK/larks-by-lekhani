import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Filter, Search } from 'lucide-react';

const LIVE_BACKEND_URL = "https://larks-by-lekhani.onrender.com";

export default function UserCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${LIVE_BACKEND_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  const categories = ['All', 'Sparkbooks', 'Gift Albums', 'Photo Frames', 'Keychains'];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf6f5]">
      <section className="bg-gradient-to-b from-[#f5ebe8] to-[#faf6f5] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#b57c70]/10 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b57c70]/15 text-[#b57c70] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Studio Storefront
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2b2524]">
            Larks by Lekhani
          </h1>
          <p className="text-base text-[#2b2524]/80 font-light max-w-lg mx-auto">
            Bespoke Sparkbooks, Premium Gift Albums, Photo Frames & Small Keychains
          </p>

          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#2b2524]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by name, category, or gift idea..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-[#b57c70]/30 bg-white text-xs text-[#2b2524] shadow-sm focus:outline-none focus:border-[#b57c70] focus:ring-1 focus:ring-[#b57c70]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-[#2b2524]/40 hover:text-[#2b2524]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-[#b57c70]/20">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#b57c70]" />
            <h2 className="font-serif text-2xl font-semibold text-[#2b2524]">
              {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory} ({filteredProducts.length})
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#b57c70] text-white shadow-sm'
                    : 'bg-white text-[#2b2524] border border-[#2b2524]/10 hover:border-[#b57c70]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#b57c70] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#2b2524]/60 mt-2 font-medium">Connecting to Studio Backend...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#b57c70]/30 p-8">
            <p className="text-sm font-semibold text-[#2b2524]">No products match "{searchQuery}"</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-3 text-xs text-[#b57c70] font-bold hover:underline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const sellingPrice = product.basePrice;
              const originalMRP = sellingPrice * 2;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg overflow-hidden border border-[#b57c70]/15 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-square bg-[#faf6f5] overflow-hidden">
                      <img
                        src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/400'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#faf6f5]/90 text-[#2b2524] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border border-[#2b2524]/10">
                        {product.category}
                      </span>
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                        50% OFF
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-serif text-base font-semibold text-[#2b2524] line-clamp-1 group-hover:text-[#b57c70] transition-colors">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#2b2524]/70 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#b57c70]">₹{sellingPrice}.00</span>
                        <span className="text-xs text-rose-500 line-through opacity-70">₹{originalMRP}.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/product/${product._id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded bg-[#faf6f5] hover:bg-[#b57c70] text-[#2b2524] hover:text-white border border-[#b57c70]/30 text-xs font-semibold transition-all"
                    >
                      <span>Know More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}