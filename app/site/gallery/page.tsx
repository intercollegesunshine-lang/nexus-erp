"use client";
import React from 'react';
import DomeGallery from '@/components/DomeGallery';

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col font-sans text-[#1B133C] bg-black">
      
      {/* Restored Flower Background Video */}
      <video 
        autoPlay muted loop playsInline 
        className="fixed inset-0 z-0 w-full h-[130%] object-cover object-top opacity-90"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4"
      />

      {/* Restored White/Glass Navigation Bar */}
      <nav className="relative z-10 w-full pt-4 md:pt-6 flex justify-center px-4">
        <div className="bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm flex items-center justify-between w-full max-w-5xl">
          <a href="/site" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Sunshine Inter College Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <span className="font-bold tracking-tight text-lg hidden sm:block">Sunshine Inter College</span>
          </a>
          <div className="flex space-x-6 sm:space-x-8 text-sm font-medium text-[#1B133C]/80">
            <a href="/site/academics" className="hover:text-[#1B133C] transition-opacity">Academics</a>
            <a href="/site/admissions" className="hover:text-[#1B133C] transition-opacity">Admissions</a>
            <a href="/site/campus-life" className="hover:text-[#1B133C] transition-opacity">Campus Life</a>
            <a href="/site/gallery" className="font-bold text-[#1B133C]">Gallery</a>
            <a href="/site/contact" className="hover:text-[#1B133C] transition-opacity">Contact</a>
          </div>
          <a href="/login" className="hidden md:flex bg-[#1B133C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1B133C]/90 transition-colors">
            Student Portal
          </a>
        </div>
      </nav>

      {/* Main Dome Gallery Section */}
      <main className="relative z-10 flex-1 flex flex-col w-full mt-8 px-4 md:px-10 pb-10">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-serif text-white drop-shadow-md tracking-wide">
            Campus <span className="italic">Gallery</span>
          </h1>
          <p className="text-white/90 text-sm mt-2 font-medium">Drag to explore. Tap any image to enlarge.</p>
        </div>

        {/* FIXED: Added strict height so the Dome Gallery is visible! */}
        <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/20 backdrop-blur-sm mx-auto max-w-7xl" style={{ height: '75vh', minHeight: '600px' }}>
            <DomeGallery 
              fit={0.65} 
              grayscale={false} 
              overlayBlurColor="transparent" // Makes the edges clear so you can see the flower video!
            />
        </div>

      </main>
    </div>
  );
}