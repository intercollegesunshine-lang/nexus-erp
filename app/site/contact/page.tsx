"use client";
import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const instrumentSerifClass = "font-serif"; 
const interClass = "font-sans";

export default function ContactWebsitePage() {
  return (
    <div className={`relative min-h-screen w-full overflow-y-auto overflow-x-hidden flex flex-col ${interClass} text-[#1B133C] bg-black`}>
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

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 mt-12 w-full max-w-5xl mx-auto pb-16">
        
        <div className="w-full max-w-2xl text-center">
          <h1 className={`${instrumentSerifClass} text-5xl md:text-7xl leading-[0.95] tracking-tight text-[#1B133C] mb-6 drop-shadow-sm`}>
            Get in <span className="italic">Touch.</span>
          </h1>
          <p className="max-w-lg mx-auto text-sm md:text-base leading-relaxed text-[#1B133C]/90 font-medium mb-12">
            Have questions about admissions, facilities, or academics? Our administration office is here to assist you during working hours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {/* Campus / Location */}
            <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="bg-[#1B133C] text-white p-4 rounded-2xl mb-4"><MapPin size={24} /></div>
              <h4 className="font-bold text-lg mb-2">Our Campus</h4>
              <p className="text-sm text-[#1B133C]/80 font-medium mb-3">Basai Road, Tundla-283204</p>
              <a 
                href="https://maps.app.goo.gl/KKYnHEsPTJosegTp8?g_st=ic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider flex items-center bg-orange-500/10 px-3 py-1.5 rounded-full transition-colors"
              >
                View on Map <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
            
            {/* Phone */}
            <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="bg-[#1B133C] text-white p-4 rounded-2xl mb-4"><Phone size={24} /></div>
              <h4 className="font-bold text-lg mb-2">Call Us</h4>
              <p className="text-sm text-[#1B133C]/80 font-medium">+91 9837537472</p>
            </div>
            
            {/* Email */}
            <div className="flex flex-col items-center p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg text-center hover:-translate-y-1 transition-transform">
              <div className="bg-[#1B133C] text-white p-4 rounded-2xl mb-4"><Mail size={24} /></div>
              <h4 className="font-bold text-lg mb-2">Email Us</h4>
              <p className="text-sm text-[#1B133C]/80 font-medium">intercollegesunshine</p>
              <p className="text-sm text-[#1B133C]/80 font-medium">@gmail.com</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}