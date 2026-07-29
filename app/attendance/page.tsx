"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Menu, X, Clock, FileText, ExternalLink } from 'lucide-react';
import { signOut } from 'next-auth/react';

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; background-color: #0c0c0c; color: white; }
.liquid-glass { background: rgba(255,255,255,0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
.liquid-glass::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
`;

export default function AttendancePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/dashboard', { headers: { 'Cache-Control': 'no-cache, no-store' } })
      .then(res => res.json())
      .then(json => { 
        if(json.success) setStudentData(json.data); 
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !studentData) return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="w-8 h-8 border-2 border-[#00d2ff]/30 border-t-[#00d2ff] rounded-full animate-spin" />
    </div>
  );

  // --- DYNAMIC CALCULATIONS ---
  const attendanceRecords = studentData.attendance || [];
  const totalDays = attendanceRecords.length;
  // Count PRESENT and LATE as positive attendance days
  const presentDays = attendanceRecords.filter((a:any) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
  
  let standing = "Excellent Standing";
  let standingColor = "text-[#00d2ff]";
  if (percentage < 75) { standing = "Needs Improvement"; standingColor = "text-[#ff5f57]"; }
  else if (percentage < 90) { standing = "Good Standing"; standingColor = "text-[#28c840]"; }

  const hasPdfTimetable = !!studentData.class?.timetableUrl;
  const granularSchedules = studentData.class?.schedules || [];

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

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed z-50 h-screen transition-transform duration-500 w-72 border-r border-white/5 bg-[#0c0c0c]/95 backdrop-blur-3xl flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white">Sunshine Portal</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50"><X size={18} /></button>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item, idx) => (
              <button key={idx} onClick={() => window.location.href = item.href} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={18} /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 md:p-10 scroll-smooth">
        <div className="flex items-center justify-between mb-8 md:mb-12 sticky top-0 z-30 pt-4 pb-4 bg-[#0c0c0c]/80 backdrop-blur-xl -mx-6 px-6 md:-mx-10 md:px-10 border-b border-white/5">
           <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]"><Menu size={18} /></button>
           <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-2">Your Schedule.</h1>
            <p className="text-white/50 text-sm font-medium">Timetable and attendance metrics.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* TIMETABLE SECTION */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-3xl p-8 space-y-6">
               <h3 className="text-2xl font-bold text-white">Class Timetable</h3>
               
               {hasPdfTimetable && (
                 <div className="p-6 bg-white/[0.03] border border-[#00d2ff]/30 rounded-2xl text-center">
                    <FileText size={32} className="mx-auto mb-3 text-[#00d2ff]" />
                    <h4 className="font-bold text-white mb-1">Official Timetable Uploaded</h4>
                    <p className="text-xs text-white/50 mb-4">Your administration has uploaded a PDF schedule.</p>
                    <button onClick={() => window.open(studentData.class.timetableUrl, '_blank')} className="px-6 py-3 rounded-full bg-[#00d2ff] text-black font-bold text-sm hover:bg-[#00d2ff]/90 transition-colors inline-flex items-center gap-2">
                      <ExternalLink size={16} /> View Timetable Document
                    </button>
                 </div>
               )}

               {granularSchedules.length > 0 && (
                 <div className="space-y-4">
                   {granularSchedules.map((s:any, i:number) => (
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
               )}

               {!hasPdfTimetable && granularSchedules.length === 0 && (
                 <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/5">
                    <Calendar size={32} className="mx-auto mb-3 text-white/20" />
                    <p className="text-white/50 text-sm font-medium">No schedule posted for your class.</p>
                 </div>
               )}
            </motion.div>

            {/* ATTENDANCE SECTION */}
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-3xl p-8 border-t-4 border-[#00d2ff] flex flex-col items-center justify-center text-center relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00d2ff]/10 blur-3xl rounded-full -z-10" />
                 <h3 className="text-2xl font-bold mb-2 text-white">Attendance</h3>
                 <p className="text-white/50 text-sm mb-8 font-medium">{totalDays} total records this semester.</p>
                 
                 <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-[10px] border-white/5 relative shadow-[0_0_50px_rgba(0,210,255,0.15)]">
                    {/* The spin speed can be adjusted */}
                    <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-[#00d2ff] animate-[spin_4s_linear_infinite]" />
                    <span className="text-6xl font-bold tracking-tighter text-white">{percentage}<span className="text-2xl text-white/30">%</span></span>
                 </div>
                 <p className={`mt-8 font-bold text-sm tracking-widest uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10 ${standingColor}`}>
                   {standing}
                 </p>
              </motion.div>

              {/* RECENT ATTENDANCE LOG */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="liquid-glass rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Records</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {attendanceRecords.length > 0 ? attendanceRecords.slice(0, 10).map((record: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div>
                        <p className="text-sm font-semibold text-white">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-white/40">{record.subject}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase ${record.status === 'PRESENT' ? 'bg-[#28c840]/20 text-[#28c840]' : record.status === 'ABSENT' ? 'bg-[#ff5f57]/20 text-[#ff5f57]' : 'bg-[#f5a623]/20 text-[#f5a623]'}`}>
                        {record.status}
                      </span>
                    </div>
                  )) : (
                    <p className="text-sm text-white/40 text-center py-4">No attendance records found.</p>
                  )}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}