import React from 'react';
import { Heart, Instagram, Mail } from 'lucide-react';

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/larksbylekhani.in?igsh=MXVpeHV6aTdwOHdzbQ==";
const OFFICIAL_EMAIL = "larksbylekhani@lbl.in";

export default function Footer() {
  return (
    <footer className="bg-[#2b2524] text-[#faf6f5] mt-20 py-8 border-t border-[#b57c70]/20 text-center text-xs space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[#faf6f5] font-semibold transition-all"
        >
          <Instagram className="w-4 h-4 text-[#b57c70]" />
          <span>@larksbylekhani.in</span>
        </a>

        <a
          href={`mailto:${OFFICIAL_EMAIL}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[#faf6f5] font-semibold transition-all"
        >
          <Mail className="w-4 h-4 text-[#b57c70]" />
          <span>{OFFICIAL_EMAIL}</span>
        </a>
      </div>

      <p>© {new Date().getFullYear()} Larks Creative House. All Rights Reserved.</p>
      
      <p className="text-[#b57c70] flex items-center justify-center gap-1">
        Heartmade with <Heart className="w-3 h-3 fill-current" /> for bespoke memory lovers.
      </p>
    </footer>
  );
}