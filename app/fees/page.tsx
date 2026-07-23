"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Menu, X, Download, CheckCircle2, Clock, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { generateReceiptPDF } from '@/lib/pdfGenerator';

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; background-color: #0c0c0c; color: white; }
.liquid-glass { background: rgba(255,255,255,0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
.liquid-glass::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
`;

const FUN_FACTS = ["Bananas are curved because they grow towards the sun.", "A day on Venus is longer than a year on Venus.", "Octopuses have three hearts and blue blood.", "The shortest war in history lasted just 38 minutes."];

export default function FeesPage() {
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
    { icon: CreditCard, label: 'Financials', active: true, href: '/fees' },
    { icon: BookOpen, label: 'Assignments', href: '/assignments' },
    { icon: Calendar, label: 'Schedule', href: '/attendance' },
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
             <span className="font-semibold text-sm tracking-wide hidden sm:block text-white/80">Financials</span>
           </div>
           <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-2">Financials.</h1>
              <p className="text-white/50 text-sm font-medium">Your payment history and fee invoices.</p>
            </div>
            
            {studentData.fees?.filter((f: any) => f.status === 'PENDING').length > 1 && (
              <button 
                onClick={() => window.location.href = '/payments?type=combined'} 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <CreditCard size={16} /> Pay Total Balance
              </button>
            )}
          </motion.div>

          <div className="space-y-4">
            {studentData.fees?.length > 0 ? studentData.fees.map((fee: any, i: number) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} key={i} className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:bg-white/[0.04] transition-colors">
                 <div className="flex items-center gap-5">
                   <div className={`p-4 rounded-2xl border border-white/10 ${fee.status === 'PAID' ? 'bg-[#28c840]/10 text-[#28c840]' : 'bg-[#ff5f57]/10 text-[#ff5f57]'}`}>
                     {fee.status === 'PAID' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                   </div>
                   <div>
                     <h3 className="font-semibold text-xl text-white mb-1">{fee.title}</h3>
                     <p className="text-white/40 text-sm font-medium">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-3xl font-bold tracking-tight text-white">${fee.amount.toLocaleString()}</p>
                        <p className={`text-xs font-bold tracking-widest uppercase mt-1 ${fee.status === 'PAID' ? 'text-[#28c840]' : 'text-[#ff5f57]'}`}>{fee.status}</p>
                    </div>
                    {fee.status === 'PAID' ? (
                       <button onClick={() => {
                          const paymentDetails = fee.payments?.[0];
                          const mergedTransaction = {
                              ...fee,
                              transactionId: paymentDetails?.transactionId || fee.id,
                              date: paymentDetails?.date ? new Date(paymentDetails.date).toLocaleDateString() : new Date().toLocaleDateString(),
                              method: paymentDetails?.paymentMethod || 'Online Payment'
                          };
                          generateReceiptPDF(studentData, mergedTransaction);
                       }} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                          <Download size={20} />
                       </button>
                    ) : (
                       <button onClick={() => window.location.href = `/payments?invoice=${fee.id}`} className="px-5 py-3 rounded-xl bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                          <CreditCard size={16} /> Pay Now
                       </button>
                    )}
                 </div>
              </motion.div>
            )) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="liquid-glass rounded-3xl p-16 text-center">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10"><CreditCard size={32} className="text-white/40" /></div>
                 <h3 className="text-lg font-semibold text-white mb-1">No Records Found</h3>
                 <p className="text-white/50 text-sm">Your payment history will appear here once processed.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}