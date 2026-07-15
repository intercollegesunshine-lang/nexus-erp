"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Menu, X, Clock, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; background-color: #0c0c0c; color: white; }
.liquid-glass { background: rgba(255,255,255,0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
.liquid-glass::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
`;

const FUN_FACTS = ["Bananas are curved because they grow towards the sun.", "A day on Venus is longer than a year on Venus.", "Octopuses have three hearts and blue blood.", "The shortest war in history lasted just 38 minutes."];

export default function AttendancePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fact, setFact] = useState("");

  useEffect(() => {
    setFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    fetch('/api/student/dashboard', { headers: { 'Cache-Control': 'no-cache, no-store' } }).then(res => res.json()).then(json => { 
      if(json.success) setStudentData(json.data); setIsLoading(false);
    });
  }, []);

  if (isLoading || !studentData) return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="absolute inset-0 z-0"><video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 blur-sm" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" /></div>
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <img src="/logo.png" alt="Sunshine Logo" className="w-12 h-12 object-contain mb-6 animate-pulse" />
        <div className="w-8 h-8 border-2 border-[#00d2ff]/30 border-t-[#00d2ff] rounded-full animate-spin mb-8" />
        <span className="text-[10px] font-bold tracking-widest text-[#00d2ff] uppercase mb-3">Did you know?</span>
        <p className="text-white/80 text-sm font-medium">"{fact}"</p>
      </div>
    </div>
  );

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Award, label: 'Transcripts', href: '/academics' },
    { icon: CreditCard, label: 'Financials', href: '/fees' },
    { icon: BookOpen, label: 'Assignments', href: '/assignments' },
    { icon: Calendar, label: 'Schedule', active: true, href: '/attendance' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.25]" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed z-50 h-screen transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-72 border-r border-white/5 bg-[#0c0c0c]/95 backdrop-blur-3xl flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white">Sunshine<span className="text-white/40 font-medium"> Portal</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50"><X size={18} /></button>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item, idx) => (
              <button key={idx} onClick={() => window.location.href = item.href} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><item.icon size={18} /> <span>{item.label}</span></button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 md:p-10 scroll-smooth">
        <div className="flex items-center justify-between mb-8 md:mb-12 sticky top-0 z-30 pt-4 pb-4 bg-[#0c0c0c]/80 backdrop-blur-xl -mx-6 px-6 md:-mx-10 md:px-10 border-b border-white/5">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]"><Menu size={18} /></button>
             <span className="font-semibold text-sm tracking-wide hidden sm:block text-white/80">Schedule</span>
           </div>
           <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-2">Your Schedule.</h1>
            <p className="text-white/50 text-sm font-medium">Timetable and attendance metrics.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-3xl p-8">
               <h3 className="text-2xl font-bold mb-8 text-white">Weekly Timetable</h3>
               {studentData.class?.schedules?.length > 0 ? (
                 <div className="space-y-4">
                   {studentData.class.schedules.map((s:any, i:number) => (
                     <div key={i} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
                       <div className="flex items-center gap-5">
                         <div className="bg-[#00d2ff]/10 text-[#00d2ff] p-3.5 rounded-xl group-hover:scale-110 transition-transform"><Clock size={20} /></div>
                         <div>
                           <p className="font-bold text-white tracking-tight">{s.subject}</p>
                           <p className="text-xs text-white/40 mt-1 font-medium">Room {s.room} • {s.dayOfWeek}</p>
                         </div>
                       </div>
                       <p className="text-sm font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full">{s.startTime}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/5">
                    <Calendar size={32} className="mx-auto mb-3 text-white/20" />
                    <p className="text-white/50 text-sm font-medium">No schedule posted for your class.</p>
                 </div>
               )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-3xl p-8 border-t-4 border-[#00d2ff] flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00d2ff]/10 blur-3xl rounded-full -z-10" />
               <h3 className="text-2xl font-bold mb-2 text-white">Attendance</h3>
               <p className="text-white/50 text-sm mb-12 font-medium">Your presence metrics for this semester.</p>
               
               <div className="inline-flex items-center justify-center w-56 h-56 rounded-full border-[12px] border-white/5 relative shadow-[0_0_50px_rgba(0,210,255,0.15)]">
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#00d2ff] animate-[spin_4s_linear_infinite]" />
                  <span className="text-7xl font-bold tracking-tighter text-white">94<span className="text-3xl text-white/30">%</span></span>
               </div>
               <p className="mt-10 text-[#00d2ff] font-bold text-sm tracking-widest uppercase bg-[#00d2ff]/10 px-4 py-2 rounded-full border border-[#00d2ff]/20">Excellent Standing</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}