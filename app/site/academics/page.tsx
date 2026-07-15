"use client";
import React from 'react';
import { Users, Palette, Trophy } from 'lucide-react';

const instrumentSerifClass = "font-serif"; 
const interClass = "font-sans";

export default function CampusLifeWebsitePage() {
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
            <a href="/site/campus-life" className="font-bold text-[#1B133C]">Campus Life</a>
            <a href="/site/contact" className="hover:text-[#1B133C] transition-opacity">Contact</a>
          </div>
          <button onClick={() => window.location.href = '/login'} className="hidden md:flex bg-[#1B133C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1B133C]/90 transition-colors">
            Student Portal
          </button>
        </div>
      </nav>

      {}
      <main className="relative z-10 flex-1 flex flex-col px-4 mt-12 w-full max-w-5xl mx-auto pb-16">
        <h1 className={`${instrumentSerifClass} text-5xl md:text-7xl leading-none tracking-tight text-[#1B133C] mb-4 drop-shadow-sm`}>
          Beyond the <span className="italic">Classroom.</span>
        </h1>
        <p className="max-w-2xl text-sm md:text-base leading-relaxed text-[#1B133C]/80 font-medium mb-12">
          Education at Sunshine Inter College extends far beyond textbooks. Experience a vibrant community equipped with state-of-the-art facilities, clubs, and athletic programs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1 */}
          <div className="group relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/30 rounded-[2rem] p-8 min-h-[300px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B133C]/80 to-transparent z-0"></div>
            {/* Fallback image style using css */}
            <div className="absolute inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
            
            <div className="relative z-10 text-white">
              <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4"><Trophy size={20} /></div>
              <h3 className="text-2xl font-bold mb-2">Athletics & Sports</h3>
              <p className="text-sm text-white/80">Olympic-sized pool, indoor basketball courts, and sprawling fields for football and cricket.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/30 rounded-[2rem] p-8 min-h-[300px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B133C]/80 to-transparent z-0"></div>
            <div className="absolute inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
            
            <div className="relative z-10 text-white">
              <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4"><Palette size={20} /></div>
              <h3 className="text-2xl font-bold mb-2">Arts & Culture</h3>
              <p className="text-sm text-white/80">Dedicated studios for fine arts, a 500-seat auditorium for dramatics, and regular cultural fests.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}