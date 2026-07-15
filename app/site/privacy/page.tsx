"use client";
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-[#1B133C] font-sans">
      <video autoPlay muted loop playsInline className="fixed inset-0 z-0 w-full h-[130%] object-cover object-top opacity-90" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <button onClick={() => window.history.back()} className="mb-8 text-sm font-bold bg-white/70 px-4 py-2 rounded-xl backdrop-blur-md hover:bg-white transition-colors">
          ← Back
        </button>
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-[#1B133C]/80 leading-relaxed text-sm md:text-base">
            <h2 className="text-xl font-bold text-[#1B133C]">1. Data Collection</h2>
            <p>Sunshine Inter College collects necessary personal data (such as name, enrollment number, contact details, and academic history) strictly for educational administration and portal operations.</p>
            
            <h2 className="text-xl font-bold text-[#1B133C]">2. Payment Information</h2>
            <p>Financial transactions are processed via secure third-party gateways (Razorpay). We do not store your credit card or bank account details on our servers.</p>
            
            <h2 className="text-xl font-bold text-[#1B133C]">3. Data Protection</h2>
            <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
            
            <h2 className="text-xl font-bold text-[#1B133C]">4. Contact Us</h2>
            <p>If you have questions about your privacy, please contact administration at sunshine@edu or visit the campus at Basai Road, Tundla-283204.</p>
          </div>
        </div>
      </div>
    </div>
  );
}