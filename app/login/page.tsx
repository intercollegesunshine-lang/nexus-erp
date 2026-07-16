"use client";
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Instrument_Serif, Inter } from 'next/font/google';

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'], style: ['normal', 'italic'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error) {
        alert("Invalid email or password!");
        setIsLoading(false);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (sessionData?.user && sessionData.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }
    } catch (err) {
      alert('An error occurred during login.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' }); 
  };

  return (
    <div className={`relative min-h-screen w-full overflow-y-auto overflow-x-hidden flex flex-col ${inter.className} text-[#1B133C] bg-black`}>
      <video autoPlay muted loop playsInline className="fixed inset-0 z-0 w-full h-[130%] object-cover object-top opacity-90" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4" />

      <nav className="relative z-10 w-full pt-4 md:pt-6 flex justify-center px-4">
  <div className="bg-transparent backdrop-blur-md rounded-xl px-4 md:px-6 py-3 flex items-center space-x-10">

    <div
      className="flex items-center space-x-3 cursor-pointer"
      onClick={() => (window.location.href = "/login")}
    >
      <img
        src="/logo.png"
        alt="Sunshine Inter College Logo"
        className="w-10 h-10 object-contain"
      />

      <span className="font-extrabold tracking-tight text-xl text-black">
        Sunshine Inter College
      </span>
    </div>

    <div className="hidden sm:flex space-x-8 text-base font-bold text-black">
      <a
        href="/site/academics"
        className="hover:text-gray-700 transition-colors duration-200"
      >
        Academics
      </a>

      <a
        href="/site/admissions"
        className="hover:text-gray-700 transition-colors duration-200"
      >
        Admissions
      </a>

      <a
        href="/site/gallery"
        className="hover:text-gray-700 transition-colors duration-200"
      >
        Gallery
      </a>

      <a
        href="/site/campus-life"
        className="hover:text-gray-700 transition-colors duration-200"
      >
        Campus Life
      </a>

      <a
        href="/site/contact"
        className="hover:text-gray-700 transition-colors duration-200"
      >
        Contact
      </a>
    </div>

  </div>
</nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 mt-8 md:mt-12 w-full max-w-5xl mx-auto text-center pb-12">
        

        <h1 className={`${instrumentSerif.className} text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl mx-auto drop-shadow-sm`}>
          Welcome to <br />
          <span className="italic">Sunshine Inter College</span>
        </h1>

        <p className="mt-5 sm:mt-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70 font-medium">
          Access your intelligent student portal to track academic progress, manage fee payments, and submit assignments — all securely in one place.
        </p>

        <div className="mt-10 sm:mt-12 w-full max-w-md bg-white/50 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-6 sm:p-8 shadow-[0_16px_40px_-12px_rgba(27,19,60,0.15)] text-left mx-auto">
          <button type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading || isLoading} className="w-full flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-md border border-[#1B133C]/10 text-[#1B133C] font-semibold py-3.5 rounded-xl hover:bg-white transition-colors mb-6 shadow-sm">
            {isGoogleLoading ? <div className="w-5 h-5 border-2 border-[#1B133C]/30 border-t-[#1B133C] rounded-full animate-spin" /> : <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </>}
          </button>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 h-px bg-[#1B133C]/10"></div>
            <span className="text-xs text-[#1B133C]/50 font-bold uppercase tracking-wider">Or Use Email</span>
            <div className="flex-1 h-px bg-[#1B133C]/10"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1B133C]/80 ml-1">Work or Student Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B133C]/40 group-focus-within:text-[#1B133C]/70 transition-colors"><Mail size={18} /></div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@sunshine.edu" required className="w-full bg-white/70 backdrop-blur-sm border border-[#1B133C]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#1B133C] placeholder-[#1B133C]/40 focus:outline-none focus:ring-2 focus:ring-[#1B133C]/20 focus:border-[#1B133C]/30 transition-all duration-300 font-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1B133C]/80 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1B133C]/40 group-focus-within:text-[#1B133C]/70 transition-colors"><Lock size={18} /></div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-white/70 backdrop-blur-sm border border-[#1B133C]/10 rounded-xl py-3.5 pl-11 pr-4 text-[#1B133C] placeholder-[#1B133C]/40 focus:outline-none focus:ring-2 focus:ring-[#1B133C]/20 focus:border-[#1B133C]/30 transition-all duration-300 font-medium tracking-wide" />
              </div>
            </div>

            <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full mt-2 relative flex items-center justify-center space-x-2 bg-[#FEFEFE] px-6 py-3.5 rounded-xl text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300 disabled:opacity-70 group">
              {isLoading ? <div className="w-5 h-5 border-2 border-[#1B133C]/30 border-t-[#1B133C] rounded-full animate-spin" /> : <><span className="relative z-10">Access Portal</span><ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
          <div className="mt-8 flex items-center justify-center space-x-2 text-xs font-medium text-[#1B133C]/60">
            <ShieldCheck size={16} className="text-emerald-600/80" /><span>Encrypted & Secured Workspace</span>
          </div>
        </div>

        {/* MANDATORY LEGAL LINKS FOR RAZORPAY */}
        <footer className="w-full py-6 mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#1B133C]/70 z-10 relative">
          <a href="/site/terms" className="hover:text-[#1B133C] transition-colors underline">Terms & Conditions</a>
          <span className="hidden sm:inline">•</span>
          <a href="/site/privacy" className="hover:text-[#1B133C] transition-colors underline">Privacy Policy</a>
          <span className="hidden sm:inline">•</span>
          <a href="/site/refund" className="hover:text-[#1B133C] transition-colors underline">Refund & Cancellation Policy</a>
          <span className="hidden sm:inline">•</span>
          <a href="/site/contact" className="hover:text-[#1B133C] transition-colors underline">Contact Us</a>
        </footer>
      </main>
    </div>
  );
}