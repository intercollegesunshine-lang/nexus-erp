"use client";
import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const instrumentSerifClass = "font-serif"; 
const interClass = "font-sans";

export default function ContactWebsitePage() {
  return (
    <div className={`relative min-h-screen w-full overflow-y-auto overflow-x-hidden flex flex-col ${interClass} text-[#1B133C] bg-black`}>
      {}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}} />
      <video autoPlay muted loop playsInline className="fixed inset-0 z-0 w-full h-[130%] object-cover object-top opacity-90"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4"
      />

      {/* Navigation Bar */}
      <nav className="relative z-10 w-full pt-4 md:pt-6 flex justify-center px-4">
        <div className="bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm flex items-center justify-between w-full max-w-5xl">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/login'}>
            <img src="/logo.png" alt="Sunshine Inter College Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <span className="font-bold tracking-tight text-lg hidden sm:block">Sunshine Inter College</span>
          </div>
          <div className="flex space-x-6 sm:space-x-8 text-sm font-medium text-[#1B133C]/80">
            <a href="/site/academics" className="hover:text-[#1B133C] transition-opacity">Academics</a>
            <a href="/site/admissions" className="hover:text-[#1B133C] transition-opacity">Admissions</a>
            <a href="/site/campus-life" className="hover:text-[#1B133C] transition-opacity">Campus Life</a>
            <a href="/site/contact" className="font-bold text-[#1B133C]">Contact</a>
          </div>
          <button onClick={() => window.location.href = '/login'} className="hidden md:flex bg-[#1B133C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1B133C]/90 transition-colors">
            Student Portal
          </button>
        </div>
      </nav>

      {}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-start justify-center gap-12 px-4 mt-12 w-full max-w-5xl mx-auto pb-16">
        
        <div className="flex-1 w-full text-center lg:text-left">
          <h1 className={`${instrumentSerifClass} text-5xl md:text-7xl leading-[0.95] tracking-tight text-[#1B133C] mb-6 drop-shadow-sm`}>
            Get in <span className="italic">Touch.</span>
          </h1>
          <p className="max-w-md mx-auto lg:mx-0 text-sm md:text-base leading-relaxed text-[#1B133C]/80 font-medium mb-10">
            Have questions about admissions, facilities, or academics? Our administration office is here to assist you.
          </p>

          <div className="space-y-6 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-[#1B133C]/10 text-left">
              <div className="bg-[#1B133C] text-white p-3 rounded-full"><MapPin size={20} /></div>
              <div>
                <h4 className="font-bold text-sm">Main Campus</h4>
                <p className="text-xs text-[#1B133C]/70">123 Education Boulevard, Tech City, 10001</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-[#1B133C]/10 text-left">
              <div className="bg-[#1B133C] text-white p-3 rounded-full"><Phone size={20} /></div>
              <div>
                <h4 className="font-bold text-sm">Admissions Office</h4>
                <p className="text-xs text-[#1B133C]/70">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-[#1B133C]/10 text-left">
              <div className="bg-[#1B133C] text-white p-3 rounded-full"><Mail size={20} /></div>
              <div>
                <h4 className="font-bold text-sm">Email Us</h4>
                <p className="text-xs text-[#1B133C]/70">info@sunshine.edu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-8 shadow-[0_16px_40px_-12px_rgba(27,19,60,0.15)] mx-auto">
          <h3 className="text-xl font-bold mb-6">Send a Message</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
            <div>
              <label className="text-xs font-semibold text-[#1B133C]/80 ml-1">Full Name</label>
              <input type="text" required placeholder="John Doe" className="w-full mt-1 bg-white/70 backdrop-blur-sm border border-[#1B133C]/10 rounded-xl py-3 px-4 text-[#1B133C] focus:outline-none focus:ring-2 focus:ring-[#1B133C]/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1B133C]/80 ml-1">Email Address</label>
              <input type="email" required placeholder="john@example.com" className="w-full mt-1 bg-white/70 backdrop-blur-sm border border-[#1B133C]/10 rounded-xl py-3 px-4 text-[#1B133C] focus:outline-none focus:ring-2 focus:ring-[#1B133C]/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1B133C]/80 ml-1">Your Message</label>
              <textarea required rows={4} placeholder="How can we help you?" className="w-full mt-1 bg-white/70 backdrop-blur-sm border border-[#1B133C]/10 rounded-xl py-3 px-4 text-[#1B133C] focus:outline-none focus:ring-2 focus:ring-[#1B133C]/20 resize-none"></textarea>
            </div>
            <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-[#1B133C] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors shadow-lg">
              <span>Send Message</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}