"use client";
import React from 'react';
import { BookOpen, Award, Microscope } from 'lucide-react';

const instrumentSerifClass = "font-serif"; 
const interClass = "font-sans";

export default function AcademicsWebsitePage() {
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
            <a href="/site/academics" className="font-bold text-[#1B133C]">Academics</a>
            <a href="/site/admissions" className="hover:text-[#1B133C] transition-opacity">Admissions</a>
            <a href="/site/campus-life" className="hover:text-[#1B133C] transition-opacity">Campus Life</a>
            <a href="/site/contact" className="hover:text-[#1B133C] transition-opacity">Contact</a>
          </div>
          <button onClick={() => window.location.href = '/login'} className="hidden md:flex bg-[#1B133C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1B133C]/90 transition-colors">
            Student Portal
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 mt-12 w-full max-w-5xl mx-auto pb-16">
        <h1 className={`${instrumentSerifClass} text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight text-[#1B133C] text-center mb-6 drop-shadow-sm`}>
          Academic <span className="italic">Foundation</span>
        </h1>
        <p className="max-w-2xl mx-auto text-center text-sm md:text-base leading-relaxed text-[#1B133C]/90 font-medium mb-12">
          At Sunshine Inter College, we focus on providing a strong, well-rounded academic education. Our curriculum is carefully structured to build conceptual clarity, encourage critical thinking, and prepare students for their board examinations and future careers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Microscope size={24} /></div>
            <h3 className="text-xl font-bold mb-3">Science & Practical Learning</h3>
            <p className="text-sm text-[#1B133C]/80 leading-relaxed">We maintain properly equipped laboratories for Physics, Chemistry, and Biology to ensure students get hands-on experience alongside theoretical knowledge.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><BookOpen size={24} /></div>
            <h3 className="text-xl font-bold mb-3">Dedicated Faculty</h3>
            <p className="text-sm text-[#1B133C]/80 leading-relaxed">Our teachers are experienced professionals committed to guiding students through their academic journey with patience and discipline.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Award size={24} /></div>
            <h3 className="text-xl font-bold mb-3">Structured Curriculum</h3>
            <p className="text-sm text-[#1B133C]/80 leading-relaxed">We follow a strict academic calendar with regular assessments, ensuring students stay on track and are fully prepared for their final exams.</p>
          </div>
        </div>
      </main>
    </div>
  );
}