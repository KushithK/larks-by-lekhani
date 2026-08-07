import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Instagram, ExternalLink } from 'lucide-react';

const LIVE_BACKEND_URL = "https://larks-by-lekhani.onrender.com";
const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/larksbylekhani.in?igsh=MXVpeHV6aTdwOHdzbQ==";
const OFFICIAL_EMAIL = "larksbylekhani@lbl.in";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch(`${LIVE_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSending(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#b57c70]/15 text-[#b57c70] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> We'd Love to Hear From You
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2b2524]">
            Get in Touch with Lekhani
          </h1>
          <p className="text-sm text-[#2b2524]/70 max-w-lg mx-auto">
            Email us or DM us on Instagram for custom orders, bulk gift boxes, and special requests!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#b57c70]/20 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#2b2524] border-b border-[#b57c70]/15 pb-3">
                Studio Information
              </h2>

              <div className="space-y-4 text-xs text-[#2b2524]/80">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#f5ebe8] text-[#b57c70] rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2b2524]">Studio Location</h4>
                    <p className="text-[#2b2524]/70 mt-0.5">Larks Creative House, Uppinangady, Mangalore, Karnataka, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#f5ebe8] text-[#b57c70] rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2b2524]">Official Email</h4>
                    <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-[#b57c70] font-bold hover:underline mt-0.5 block">
                      {OFFICIAL_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#f5ebe8] text-[#b57c70] rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2b2524]">Studio Contact Line</h4>
                    <p className="text-[#2b2524]/70 mt-0.5 font-medium">+91 XXXXX XXXXX (Studio Line)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#f5ebe8] text-[#b57c70] rounded-lg">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2b2524]">Instagram DM</h4>
                    <a
                      href={INSTAGRAM_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline font-bold flex items-center gap-1 mt-0.5"
                    >
                      @larksbylekhani.in <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-[#b57c70]/20 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#2b2524] mb-1">Send Us a Direct Message</h2>
            <p className="text-xs text-[#2b2524]/60 mb-6">Fill out the form below and Lekhani's team will reply to your email within 24 hours.</p>

            {submitted ? (
              <div className="bg-[#f5ebe8] p-8 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#b57c70] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#2b2524]">Message Sent To Lekhani!</h3>
                <p className="text-xs text-[#2b2524]/80 leading-relaxed">
                  Thank you for reaching out. We have received your inquiry in our studio inbox and will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2.5 bg-[#2b2524] text-white text-xs font-semibold rounded hover:bg-[#423b3a]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#2b2524] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Roy"
                      className="w-full p-3 rounded-md border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2b2524] mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. radhika@example.com"
                      className="w-full p-3 rounded-md border border-[#2b2524]/20 bg-[#faf6f5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#2b2524] mb-1">Subject / Item Inquiry *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiry about Custom Photo Frame"
                    className="w-full p-3 rounded-md border border-[#2b2524]/20 bg-[#faf6f5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2b2524] mb-1">Your Message or Question *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your customization ideas, dates, or questions..."
                    className="w-full p-3 rounded-md border border-[#2b2524]/20 bg-[#faf6f5] leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-[#b57c70] hover:bg-[#9e675b] text-white font-bold uppercase tracking-widest rounded-md shadow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending Inquiry...' : 'Send Message To Studio'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}