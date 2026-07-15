"use client";
import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-[#1B133C] font-sans">
      <video autoPlay muted loop playsInline className="fixed inset-0 z-0 w-full h-[130%] object-cover object-top opacity-90" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <button onClick={() => window.history.back()} className="mb-8 text-sm font-bold bg-white/70 px-4 py-2 rounded-xl backdrop-blur-md hover:bg-white transition-colors">
          ← Back
        </button>
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white">
          <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-[#1B133C]/80 leading-relaxed text-sm md:text-base">
            <h2 className="text-xl font-bold text-[#1B133C]">1. Introduction</h2>
            <p>Welcome to Sunshine Inter College. By using our website and digital portal, you agree to comply with and be bound by the following terms and conditions of use.</p>
            
            <h2 className="text-xl font-bold text-[#1B133C]">2. Educational Portal Usage</h2>
            <p>The student portal is provided for the sole use of registered students and parents of Sunshine Inter College. Unauthorized sharing of credentials or access is strictly prohibited.</p>
            
            <h2 className="text-xl font-bold text-[#1B133C]">3. Fee Payments</h2>
            <p>All online fee payments are processed securely through our authorized payment gateway (Razorpay). Users must ensure sufficient funds and correct details during transactions.</p>
            
            <h2 className="text-xl font-bold text-[#1B133C]">4. Modifications</h2>
            <p>The school reserves the right to modify these terms, fee structures, and academic policies at any time. Changes will be communicated via the official portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}