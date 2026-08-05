import React from 'react';
import { Feather, Heart, Sparkles, ShieldCheck, Instagram, ExternalLink } from 'lucide-react';

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/larksbylekhani.in?igsh=MXVpeHV6aTdwOHdzbQ==";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#faf6f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b57c70]/15 text-[#b57c70] text-xs font-semibold uppercase tracking-widest">
            <Feather className="w-3.5 h-3.5" /> Larks Creative House
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2b2524]">
            Larks by Lekhani
          </h1>
          <p className="text-base text-[#2b2524]/80 font-light max-w-xl mx-auto leading-relaxed">
            Heartmade 🥹💗 Album | Photo Frames | Gift Boxes & More 📌
          </p>

          <div className="pt-2">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow hover:opacity-95 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow Us @larksbylekhani.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="bg-white rounded-2xl border border-[#b57c70]/20 p-8 sm:p-10 shadow-sm space-y-6 text-sm text-[#2b2524]/80 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#2b2524] border-b border-[#b57c70]/20 pb-3">
            Handcrafted with Intention & Heart in Mangalore
          </h2>
          <p>
            Founded by Lekhani in <strong>Mangalore, Karnataka</strong>, <strong>Larks Creative House</strong> grew out of a deep love for "heartmade" memory crafting.
          </p>
          <p>
            Every <strong>Sparkbook</strong>, <strong>Velvet Album</strong>, <strong>Resin Photo Frame</strong>, and <strong>Artisanal Gift Box</strong> is sculpted, hand-bound, or pressed in our Mangalore studio. We combine dried botanicals, fine linen, and gold accents to turn your special memories into everlasting physical art.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl border border-[#b57c70]/15 shadow-sm space-y-2">
            <Heart className="w-6 h-6 text-[#b57c70] mx-auto" />
            <h3 className="font-serif font-semibold text-[#2b2524]">Heartmade Quality</h3>
            <p className="text-xs text-[#2b2524]/70">Custom letters, initials, dried flower choices, and color palettes.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#b57c70]/15 shadow-sm space-y-2">
            <Sparkles className="w-6 h-6 text-[#b57c70] mx-auto" />
            <h3 className="font-serif font-semibold text-[#2b2524]">Archival Materials</h3>
            <p className="text-xs text-[#2b2524]/70">Acid-free papers, solid teakwood, and UV-resistant resin casting.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#b57c70]/15 shadow-sm space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#b57c70] mx-auto" />
            <h3 className="font-serif font-semibold text-[#2b2524]">100% Studio Handmade</h3>
            <p className="text-xs text-[#2b2524]/70">Handcrafted in Coastal Karnataka & shipped across India.</p>
          </div>
        </div>

      </div>
    </div>
  );
}