"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, CreditCard, Award, Calendar, 
  Settings, Bell, Menu, X, Clock, FileText, 
  CheckCircle2, AlertCircle, ChevronRight, LogOut,
  Sparkles, TrendingUp
} from 'lucide-react';
import { signOut } from 'next-auth/react';

// Shared Utilities
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

html, body { 
  font-family: 'Inter', system-ui, sans-serif; 
  -webkit-font-smoothing: antialiased; 
  background-color: #0c0c0c; 
  color: white; 
}
::selection { 
  background: rgba(61, 129, 227, 0.3); 
}

/* Shiny gradient headline */
.animate-shiny {
  animation: shiny 6s linear infinite;
}
@keyframes shiny {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Liquid Glass Utility */
.liquid-glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative; overflow: hidden;
}
.liquid-glass::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
`;

const FUN_FACTS = [
  "Bananas are curved because they grow towards the sun.",
  "A day on Venus is longer than a year on Venus.",
  "Honey never spoils. Archaeologists have found pots of honey over 3,000 years old.",
  "Octopuses have three hearts and blue blood.",
  "The shortest war in history lasted just 38 minutes.",
  "A single cloud can weigh more than a million pounds.",
  "Human teeth are the only part of the body that cannot heal themselves."
];

const MetricCard = ({ title, value, subtitle, icon: Icon, alert = false, href, index }: { title: string, value: string | React.ReactNode, subtitle?: string, icon: any, alert?: boolean, href?: string, index: number }) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + index * 0.1 }}
    onClick={() => href && (window.location.href = href)} 
    className="text-left w-full group relative overflow-hidden liquid-glass rounded-2xl p-6 min-h-[150px] flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300"
  >
    {/* Subtle gradient glow behind the icon */}
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${alert ? 'from-red-500/20 to-orange-500/0' : 'from-[#00d2ff]/20 to-[#0B2551]/0'} rounded-bl-full -z-10`} />
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white shadow-sm">
        <Icon size={20} className={`${alert ? 'text-[#ff5f57] animate-pulse' : 'text-[#A4F4FD] group-hover:text-white transition-colors'}`} />
      </div>
      {alert && <span className="flex h-3 w-3 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>}
    </div>
    <div className="relative z-10">
      <h3 className="text-white/50 text-xs font-semibold mb-1 tracking-widest uppercase">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {subtitle && <span className={`text-sm font-medium ${alert ? 'text-[#ff5f57]' : 'text-white/40'}`}>{subtitle}</span>}
      </div>
    </div>
  </motion.button>
);

export default function StudentApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fact, setFact] = useState("");
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard', { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
        if (response.status === 401) return (window.location.href = '/login');
        const json = await response.json();
        if (json.success) setStudentData(json.data);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchDashboardData();
  }, []);

  if (isLoading || !studentData) {
    return (
      <div className="min-h-screen text-white bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 blur-sm" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/80 to-[#0c0c0c]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center max-w-sm text-center px-4"
        >
          <img src="/logo.png" alt="Sunshine Logo" className="w-12 h-12 object-contain mb-6 animate-pulse" />
          <div className="w-8 h-8 border-2 border-[#00d2ff]/30 border-t-[#00d2ff] rounded-full animate-spin mb-8" />
          <span className="text-[10px] font-bold tracking-widest text-[#00d2ff] uppercase mb-3">Did you know?</span>
          <p className="text-white/80 text-sm font-medium leading-relaxed">"{fact}"</p>
        </motion.div>
      </div>
    );
  }

  const pendingFeesList = studentData.fees?.filter((f:any) => f.status === 'PENDING') || [];
  const totalPendingFees = pendingFeesList.reduce((sum: number, fee: any) => sum + fee.amount, 0);
  const pendingAssignments = studentData.class?.assignments?.filter((a: any) => !a.submissions?.some((sub: any) => sub.studentId === studentData.id)) || [];

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true, href: '/' },
    { icon: Award, label: 'Transcripts', active: false, href: '/academics' },
    { icon: CreditCard, label: 'Financials', active: false, href: '/fees' },
    { icon: BookOpen, label: 'Assignments', active: false, href: '/assignments' },
    { icon: Calendar, label: 'Schedule', active: false, href: '/attendance' },
    { icon: Settings, label: 'Settings', active: false, href: '/settings' },
  ];

  return (
    <div className="min-h-screen text-white selection:bg-[#00d2ff]/30 bg-[#0c0c0c] flex overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      
      {/* Background Video with Noise Filter */}
      <svg className="hidden">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.25]" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Hidden by default */}
      <aside className={`fixed z-50 h-screen transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-72 border-r border-white/5 bg-[#0c0c0c]/95 backdrop-blur-3xl flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <span className="font-bold text-lg tracking-tight text-white">Sunshine<span className="text-white/40 font-medium"> Portal</span></span>
            </div>
            
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item, idx) => (
              <button key={idx} onClick={() => window.location.href = item.href} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={18} /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-sm text-white border border-white/20">
              {studentData.firstName[0]}{studentData.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{studentData.firstName} {studentData.lastName}</p>
              <p className="text-xs text-[#A4F4FD] truncate">Grade {studentData.gradeLevel}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 md:p-10 scroll-smooth">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12 sticky top-0 z-30 pt-4 pb-4 bg-[#0c0c0c]/80 backdrop-blur-xl -mx-6 px-6 md:-mx-10 md:px-10 border-b border-white/5">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]">
               <Menu size={18} />
             </button>
             <span className="font-semibold text-sm tracking-wide hidden sm:block text-white/80">Overview</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/60 relative">
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff5f57] rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 sm:w-80 liquid-glass rounded-2xl p-4 shadow-2xl z-50 border border-white/10"
                    >
                      <h3 className="font-semibold text-white mb-3 text-sm flex items-center justify-between">
                        Notifications
                        <span className="text-[10px] bg-[#00d2ff]/20 text-[#00d2ff] px-2 py-0.5 rounded-full">2 New</span>
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-white">Fee Invoice Generated</p>
                          <p className="text-xs text-white/50 mt-1">A new fee invoice for Tuition is due soon.</p>
                          <p className="text-[10px] text-[#00d2ff] mt-2">Just now</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-white">Assignment Graded</p>
                          <p className="text-xs text-white/50 mt-1">Your recent submission has been graded.</p>
                          <p className="text-[10px] text-[#00d2ff] mt-2">2 hours ago</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
           </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-10">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[0.9] mb-3">
              Welcome back, <br />
              <span className="animate-shiny inline-block" style={{
                backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                filter: 'url(#c3-noise)'
              }}>
                {studentData.firstName}.
              </span>
            </h1>
            <p className="text-white/50 text-sm font-medium">Here is your academic overview for today.</p>
          </motion.div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard index={0} title="Next Class" value={studentData.class?.schedules?.[0]?.subject || "None"} subtitle={studentData.class?.schedules?.[0]?.startTime || "Free day"} icon={Clock} href="/attendance" />
            <MetricCard index={1} title="Overall Grade" value="A-" subtitle="Excellent Standing" icon={Award} href="/academics" />
            <MetricCard index={2} title="Attendance" value="94%" subtitle="This Term" icon={CheckCircle2} href="/attendance" />
            <MetricCard index={3} title="Fees Due" value={totalPendingFees > 0 ? `₹${totalPendingFees.toLocaleString()}` : "$0"} subtitle={totalPendingFees > 0 ? `${pendingFeesList.length} action(s) required` : "Cleared"} icon={CreditCard} alert={totalPendingFees > 0} href="/fees" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recent Results */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="liquid-glass rounded-3xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Award className="text-[#00d2ff]" size={20} /> Recent Results</h3>
                  <button onClick={() => window.location.href = '/academics'} className="text-xs font-semibold text-white/50 hover:text-white flex items-center transition-colors">
                    View All <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
                <div className="space-y-3">
                  {studentData.results?.length > 0 ? studentData.results.slice(0, 3).map((exam: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 group-hover:text-white transition-colors"><FileText size={18} /></div>
                        <div>
                          <h4 className="font-medium text-sm text-white">{exam.subject}</h4>
                          <p className="text-xs text-white/40 mt-0.5">{exam.examName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white flex items-center justify-end gap-1">
                           <TrendingUp size={14} className="text-[#28c840]" /> {exam.marksObtained}%
                        </p>
                        <p className="text-[10px] font-semibold tracking-wider uppercase text-[#00d2ff]">Grade {exam.grade}</p>
                      </div>
                    </div>
                  )) : <p className="text-white/40 text-sm py-2">No recent results.</p>}
                </div>
              </motion.div>

              {/* Pending Assignments */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="liquid-glass rounded-3xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Sparkles className="text-[#A4F4FD]" size={20} /> Active Tasks</h3>
                  <button onClick={() => window.location.href = '/assignments'} className="text-xs font-semibold text-white/50 hover:text-white flex items-center transition-colors">
                    View All <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingAssignments.length > 0 ? pendingAssignments.slice(0, 4).map((a: any) => (
                    <div key={a.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#00d2ff] mb-2 block">{a.subject}</span>
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{a.title}</h4>
                        <p className="text-xs text-white/50 mb-5">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => window.location.href = '/assignments'} className="w-full py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-95 transition-all">
                        Submit Work
                      </button>
                    </div>
                  )) : (
                    <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center bg-white/[0.01] rounded-2xl border border-white/5">
                      <div className="w-12 h-12 rounded-full bg-[#28c840]/10 flex items-center justify-center mb-3">
                         <CheckCircle2 size={24} className="text-[#28c840]" />
                      </div>
                      <p className="text-sm font-semibold text-white">All caught up!</p>
                      <p className="text-xs text-white/50 mt-1">No pending assignments at the moment.</p>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>

            <div className="space-y-6">
              
              {/* Financial Hub */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="liquid-glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-40 h-40 ${totalPendingFees > 0 ? 'bg-[#ff5f57]/20' : 'bg-[#28c840]/20'} blur-3xl -z-10 rounded-full`} />
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard size={20} className={totalPendingFees > 0 ? "text-[#ff5f57]" : "text-[#28c840]"} /> 
                  Financial Hub
                </h3>
                {totalPendingFees > 0 ? (
                  <>
                    <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-1">Total Due</p>
                    <p className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">₹{totalPendingFees.toLocaleString()}</p>
                    <button onClick={() => window.location.href = '/payments'} className="w-full py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      Pay Securely
                    </button>
                  </>
                ) : (
                   <div className="py-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#28c840]/10 flex items-center justify-center mb-4">
                       <CheckCircle2 size={32} className="text-[#28c840]" />
                    </div>
                    <p className="text-lg font-bold text-white">Account Cleared</p>
                    <p className="text-sm text-white/50 mt-1">No pending invoices.</p>
                  </div>
                )}
              </motion.div>

              {/* Today's Schedule */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="liquid-glass rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Calendar size={20} className="text-[#00d2ff]" /> Today's Schedule</h3>
                {studentData.class?.schedules?.length > 0 ? (
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-white/10">
                    {studentData.class.schedules.slice(0,4).map((cls: any, i: number) => (
                      <div key={i} className="relative flex items-center pl-8 group">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-[#0c0c0c] bg-white/20 group-hover:bg-[#00d2ff] transition-colors" />
                        <div className="p-3 rounded-2xl border border-white/5 bg-white/[0.02] w-full group-hover:bg-white/[0.05] transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-sm text-white">{cls.subject}</h4>
                            <span className="text-[10px] font-bold tracking-wider text-[#00d2ff] px-2 py-0.5 rounded-full bg-[#00d2ff]/10">{cls.startTime}</span>
                          </div>
                          <p className="text-xs text-white/40">Room {cls.room}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-white/40 text-sm italic py-4 text-center">No classes scheduled today.</p>}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}