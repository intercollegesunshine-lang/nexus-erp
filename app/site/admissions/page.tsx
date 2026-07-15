"use client";
import React from 'react';
import { CheckCircle2, Calendar, MapPin } from 'lucide-react';

const instrumentSerifClass = "font-serif"; 
const interClass = "font-sans";

export default function AdmissionsWebsitePage() {
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
            <a href="/site/admissions" className="font-bold text-[#1B133C]">Admissions</a>
            <a href="/site/campus-life" className="hover:text-[#1B133C] transition-opacity">Campus Life</a>
            <a href="/site/contact" className="hover:text-[#1B133C] transition-opacity">Contact</a>
          </div>
          <button onClick={() => window.location.href = '/login'} className="hidden md:flex bg-[#1B133C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1B133C]/90 transition-colors">
            Student Portal
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-4 mt-12 w-full max-w-5xl mx-auto pb-16">
        
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            <Calendar size={16} className="mr-2 text-orange-600" /> Admissions Currently Open
          </div>
          <h1 className={`${instrumentSerifClass} text-5xl md:text-7xl leading-[0.95] tracking-tight text-[#1B133C] mb-6 drop-shadow-sm`}>
            Join our <br className="hidden lg:block"/> <span className="italic">School Family.</span>
          </h1>
          <p className="max-w-md mx-auto lg:mx-0 text-sm md:text-base leading-relaxed text-[#1B133C]/90 font-medium mb-8">
            Admissions for the current academic session are now open. We welcome prospective students and parents to visit the school for more details, collect the prospectus, and begin the enrollment process.
          </p>
          <div className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-md border border-[#1B133C]/10 px-5 py-3 rounded-xl text-sm font-semibold text-[#1B133C] shadow-sm">
            <MapPin size={18} className="text-orange-600" />
            <span>Please visit the school office to apply.</span>
          </div>
        </div>

        <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-8 shadow-[0_16px_40px_-12px_rgba(27,19,60,0.15)]">
          <h3 className="text-xl font-bold mb-6">Admission Steps</h3>
          <ul className="space-y-5">
            {[
              "Visit the school administration office",
              "Collect the admission prospectus and form",
              "Submit the filled form with required documents",
              "Attend a brief interaction or assessment",
              "Complete the fee submission process"
            ].map((step, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <div className="bg-emerald-500/20 text-emerald-700 p-1 rounded-full shrink-0"><CheckCircle2 size={16} /></div>
                <span className="text-sm font-medium text-[#1B133C]/90">{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-[#1B133C]/10 text-center text-sm font-medium text-[#1B133C]/70">
            Office Timing: 8:00 AM to 2:00 PM
          </div>
        </div>
      </main>
    </div>
  );
}