import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, ShieldAlert } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Ordering & Customization",
      question: "How do I specify my custom names, dates, or dried flower preferences?",
      answer: "When viewing any item (Sparkbook, Velvet Album, Photo Frame, or Keychain), click 'Know More'. On the product page, you will find a Customization Order Panel where you can type your preferred names, initial letters, messages, or color choices before submitting."
    },
    {
      category: "Ordering & Customization",
      question: "Will I get to preview my design before it is finalized?",
      answer: "Yes! Once you submit a custom request, Lekhani and our lead designer will email you a digital mockup/preview within 24 hours for your approval before hand-pours or hot foil stamping begins."
    },
    {
      category: "Crafting & Delivery Timelines",
      question: "How long does it take to craft and deliver my order?",
      answer: "Since every artifact is individually handcrafted: Sparkbooks take 2–3 crafting days, Velvet Albums & Photo Frames take 3–4 days, and Resin Keychains take 2 days for epoxy curing. Standard shipping across India takes 3–5 business days."
    },
    {
      category: "Crafting & Delivery Timelines",
      question: "Do you accept urgent / express orders for last-minute gifts?",
      answer: "Yes! If you need urgent delivery for a birthday or anniversary, contact us on WhatsApp (+91 98765 43210) prior to ordering. We offer expedited studio crafting for priority requests."
    },
    {
      category: "Materials & Care",
      question: "How do I care for my resin photo frame and resin keychains?",
      answer: "Our epoxy resin is UV-resistant and crystal clear. To clean, wipe gently with a soft micro-fiber cloth. Avoid harsh chemicals, sharp abrasive scrubbers, or prolonged direct desert sunlight."
    },
    {
      category: "Materials & Care",
      question: "What type of photos can be placed inside Velvet Gift Albums?",
      answer: "Our velvet gift albums feature acid-free archival parchment pages that protect glossy, matte, polaroid, or film photos. Every album includes complimentary corner mounting stickers."
    },
    {
      category: "Policies & Returns",
      question: "What is your return policy for customized items?",
      answer: "Because bespoke artifacts are made specifically with your personal names and photos, customized items cannot be returned. However, if your item arrives damaged during transit, we provide a 100% free studio replacement upon showing unboxing proof."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b57c70]/15 text-[#b57c70] text-xs font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" /> Studio Knowledge Base
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2b2524]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#2b2524]/70 max-w-lg mx-auto">
            Everything you need to know about our handcrafted customization process, timelines, materials, and care instructions.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#b57c70]/20 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#faf6f5] transition-colors"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#b57c70] block mb-1">
                      {faq.category}
                    </span>
                    <h3 className="font-serif font-semibold text-base sm:text-lg text-[#2b2524]">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="p-2 bg-[#f5ebe8] text-[#b57c70] rounded-full flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#2b2524]/80 leading-relaxed border-t border-[#b57c70]/10 bg-[#faf6f5]/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#2b2524] text-[#faf6f5] rounded-2xl p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#b57c70] mx-auto" />
          <h3 className="font-serif text-2xl font-bold">Have a Special Design Concept in Mind?</h3>
          <p className="text-xs text-[#faf6f5]/70 max-w-md mx-auto leading-relaxed">
            If your question isn't listed here, reach out directly to Lekhani for bespoke hamper quotes or specific floral arrangements.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-block px-6 py-2.5 bg-[#b57c70] hover:bg-[#9e675b] text-white text-xs font-bold uppercase tracking-widest rounded-md transition-all shadow"
            >
              Contact Studio Team
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}