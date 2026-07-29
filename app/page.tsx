"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, BookOpen, CreditCard, Award, Calendar, 
  Settings, Bell, Menu, X, TrendingUp, Clock, FileText, 
  Download, CheckCircle2, AlertCircle, Zap, ChevronRight,
  ExternalLink, LogOut
} from 'lucide-react';

const GlassCard = ({ children, className = "", hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={`
    bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden
    ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out cursor-pointer' : ''}
    ${className}
  `}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, alert = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className="text-left w-full relative overflow-hidden group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 ease-out cursor-pointer"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 -z-10`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white relative`}>
        <Icon size={24} className={`opacity-80 group-hover:opacity-100 transition-opacity relative z-10 ${alert ? 'text-rose-400' : ''}`} />
        {alert && <div className="absolute inset-0 bg-rose-500/20 rounded-xl animate-ping" />}
      </div>
      {alert && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />}
    </div>
    <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">{title}</h3>
    <div className="flex items-baseline space-x-2">
      <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
      {subtitle && <span className={`text-sm font-medium ${alert ? 'text-rose-400' : 'text-gray-500'}`}>{subtitle}</span>}
    </div>
  </button>
);

export default function StudentApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard', { headers: { 'Cache-Control': 'no-cache, no-store' } });
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const json = await response.json();
        if (json.success) setStudentData(json.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-close sidebar on mobile
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  if (isLoading || !studentData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md pointer-events-none" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
        <div className="relative z-10 flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain mb-6 animate-pulse opacity-90" />
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-blue-400 font-bold tracking-widest uppercase text-xs">Syncing Data...</p>
        </div>
      </div>
    );
  }

  // 1. Calculate Fees
  const pendingFeesList = studentData.fees?.filter((f:any) => f.status === 'PENDING') || [];
  const totalPendingFees = pendingFeesList.reduce((sum: number, fee: any) => sum + fee.amount, 0);
  
  // 2. Calculate Assignments
  const pendingAssignments = studentData.class?.assignments?.filter((a: any) => !a.submissions?.some((sub: any) => sub.studentId === studentData.id)) || [];
  const notificationCount = pendingAssignments.length + (totalPendingFees > 0 ? 1 : 0);

  // 3. Real Attendance Math
  const attendanceRecords = studentData.attendance || [];
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((a:any) => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // 4. Next Class Logic
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysClasses = studentData.class?.schedules?.filter((s:any) => s.dayOfWeek === today).sort((a:any, b:any) => a.startTime.localeCompare(b.startTime)) || [];
  const hasPdfTimetable = !!studentData.class?.timetableUrl;

  let nextClassTitle = "None";
  let nextClassSub = "Free day";
  let nextClassHref = "/attendance";

  if (todaysClasses.length > 0) {
     nextClassTitle = todaysClasses[0].subject;
     nextClassSub = todaysClasses[0].startTime;
  } else if (hasPdfTimetable) {
     nextClassTitle = "Timetable PDF";
     nextClassSub = "Click to view";
     nextClassHref = studentData.class.timetableUrl;
  }

  // 5. REAL FINAL GRADE CALCULATION
  let overallGrade = "N/A";
  let gradeSub = "No exams yet";
  
  if (studentData.results && studentData.results.length > 0) {
    const validResults = studentData.results.filter((r: any) => r.totalMarks > 0);
    if (validResults.length > 0) {
      let totalPercentage = 0;
      validResults.forEach((r: any) => {
        totalPercentage += (r.marksObtained / r.totalMarks) * 100;
      });
      const avg = totalPercentage / validResults.length;
      
      if (avg >= 97) overallGrade = "A+";
      else if (avg >= 90) overallGrade = "A";
      else if (avg >= 85) overallGrade = "B+";
      else if (avg >= 80) overallGrade = "B";
      else if (avg >= 70) overallGrade = "C";
      else if (avg >= 60) overallGrade = "D";
      else overallGrade = "F";
      
      gradeSub = `${avg.toFixed(1)}% Average`;
    }
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true, href: '/' },
    { icon: Award, label: 'Transcripts', active: false, href: '/academics' },
    { icon: CreditCard, label: 'Financials', active: false, href: '/fees' },
    { icon: BookOpen, label: 'Assignments', active: false, href: '/assignments' },
    { icon: Calendar, label: 'Schedule', active: false, href: '/attendance' },
    { icon: Settings, label: 'Settings', active: false, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-hidden flex">
      
      {/* FIXED: Premium Motion Video Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.25] mix-blend-screen" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        
        {/* Glow Orbs overlaid on video */}
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Floating Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 w-0 lg:w-24'} 
        bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Sunshine<span className="text-blue-400 font-light">Portal</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <nav className="px-4 py-6 space-y-2">
            {navItems.map((item, idx) => (
              <button key={idx} onClick={() => window.location.href = item.href} className={`
                w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                ${item.active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                ${!isSidebarOpen && 'lg:justify-center lg:px-0'}
              `}>
                <item.icon size={22} className={`transition-transform duration-300 group-hover:scale-110 ${item.active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="p-4 space-y-4">
            {/* User Info Widget */}
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 ${!isSidebarOpen && 'lg:hidden'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30 shrink-0">
                  {studentData.firstName[0]}{studentData.lastName?.[0] || ''}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{studentData.firstName} {studentData.lastName}</p>
                  <p className="text-xs text-blue-400 truncate">Grade {studentData.gradeLevel} - {studentData.section}</p>
                </div>
              </div>
            </div>

            {/* FIXED: Functional Sign Out Button */}
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}
            >
              <LogOut size={22} className="transition-transform duration-300 group-hover:scale-110" />
              <span className={`font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors shadow-sm">
              <Menu size={20} />
            </button>
            <span className="font-bold tracking-wide hidden sm:block text-white">Overview</span>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* FIXED: Functional Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                className={`relative p-2 rounded-full border transition-colors ${isNotificationOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
              >
                <Bell size={20} />
                {notificationCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#050505] animate-pulse" />}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0c0c0c]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-50 p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-bold tracking-wide">Notifications</h4>
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold tracking-widest uppercase">{notificationCount} New</span>
                      </div>
                      
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {totalPendingFees > 0 && (
                          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 cursor-pointer hover:bg-rose-500/20 transition-colors group" onClick={() => window.location.href='/fees'}>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[10px] font-bold text-rose-400 tracking-widest uppercase flex items-center gap-1"><AlertCircle size={12} /> Action Required</p>
                            </div>
                            <p className="text-sm text-gray-200 font-medium">Pending Dues: ₹{totalPendingFees.toLocaleString()}</p>
                            <p className="text-xs text-rose-500/70 mt-1">Please clear your financial dues to avoid late penalties.</p>
                          </div>
                        )}

                        {pendingAssignments.map((a: { id: React.Key | null | undefined; subject: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; title: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
                          <div key={a.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => window.location.href='/assignments'}>
                            <p className="text-[10px] font-bold text-blue-400 mb-1 tracking-widest uppercase">{a.subject}</p>
                            <p className="text-sm text-gray-200 font-bold line-clamp-1">{a.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                          </div>
                        ))}

                        {notificationCount === 0 && (
                          <div className="text-center py-8">
                            <CheckCircle2 size={32} className="text-emerald-500/50 mx-auto mb-3" />
                            <p className="text-sm text-gray-400 font-medium">You're all caught up!</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <img src="/logo.png" alt="School Badge" className="w-8 h-8 opacity-80 shadow-md" />
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
                Welcome back,<br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 ml-0 md:ml-3 uppercase tracking-tighter">
                  {studentData.firstName}.
                </span>
              </h1>
              <p className="text-gray-400 text-sm font-medium">Here is your academic overview for today.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard 
              onClick={() => {
                if (nextClassHref.startsWith('http')) window.open(nextClassHref, '_blank');
                else window.location.href = nextClassHref;
              }}
              title="Time Table" value={nextClassTitle} subtitle={nextClassSub} icon={Clock} colorClass="from-blue-500 to-cyan-500" 
            />
            {/* FIXED: Real Grade Passed Down Here */}
            <MetricCard 
              onClick={() => window.location.href = '/academics'}
              title="Overall Grade" value={overallGrade} subtitle={gradeSub} icon={Award} colorClass="from-indigo-500 to-purple-500" 
            />
            <MetricCard 
              onClick={() => window.location.href = '/attendance'}
              title="Attendance" value={`${attendancePercentage}%`} subtitle="This Term" icon={CheckCircle2} colorClass="from-emerald-500 to-teal-500" 
            />
            <MetricCard 
              onClick={() => window.location.href = '/fees'}
              title="Fees Due" 
              value={totalPendingFees > 0 ? `₹${totalPendingFees.toLocaleString('en-IN')}` : "₹0"} 
              subtitle={totalPendingFees > 0 ? `${pendingFeesList.length} action(s) required` : "Cleared"} 
              icon={CreditCard} 
              colorClass="from-rose-500 to-orange-500" 
              alert={totalPendingFees > 0} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              
              <GlassCard>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Award className="text-blue-400" size={20} /> Recent Results</h3>
                  <button onClick={() => window.location.href = '/academics'} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                    View All <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {studentData.results?.length > 0 ? studentData.results.slice(0, 3).map((exam: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-white/5 text-gray-400 group-hover:text-blue-400 transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-200">{exam.subject}</h4>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{exam.examName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white flex items-center justify-end gap-1">
                           <TrendingUp size={14} className="text-emerald-400" /> {exam.marksObtained}%
                        </p>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-blue-400 mt-1">Grade {exam.grade}</p>
                      </div>
                    </div>
                  )) : <p className="text-gray-500 text-sm py-2">No recent results published yet.</p>}
                </div>
              </GlassCard>

              {/* Assignments Section */}
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-purple-400" size={20} /> Active Tasks
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingAssignments.length > 0 ? pendingAssignments.slice(0, 4).map((a: any) => (
                    <div key={a.id} className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col justify-between group shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 uppercase tracking-widest mb-3 inline-block">
                          {a.subject}
                        </span>
                        <h4 className="font-bold text-gray-200 mb-1 line-clamp-1">{a.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{a.description}</p>
                      </div>
                      <button onClick={() => window.location.href = '/assignments'} className="w-full py-2.5 mt-5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                        Submit Work
                      </button>
                    </div>
                  )) : (
                    <div className="col-span-1 sm:col-span-2 py-10 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                      <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-3 opacity-80" />
                      <p className="text-gray-300 font-bold">All caught up!</p>
                      <p className="text-gray-500 text-sm mt-1">You have no pending assignments.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6 md:space-y-8">
              
              {/* Fee Payment Widget */}
              <GlassCard className={`${totalPendingFees > 0 ? 'border-rose-500/30' : 'border-emerald-500/30'} relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${totalPendingFees > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'} rounded-bl-full -z-10`} />
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <CreditCard className={totalPendingFees > 0 ? "text-rose-400" : "text-emerald-400"} size={20} /> Financial Hub
                </h3>
                
                {totalPendingFees > 0 ? (
                  <>
                    <div className="mt-6 mb-8">
                      <p className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">Total Balance Due</p>
                      <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">₹{totalPendingFees.toLocaleString('en-IN')}</p>
                    </div>

                    <button onClick={() => window.location.href = '/payments'} className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-gray-200 font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center space-x-2">
                      <CreditCard size={18} />
                      <span>Pay Securely</span>
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                    <p className="text-white font-bold text-lg">Account Cleared</p>
                    <p className="text-sm text-gray-400 mt-1">No pending fees.</p>
                  </div>
                )}
              </GlassCard>

              {/* Today's Schedule Widget */}
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-blue-400" size={20} /> Today's Classes
                  </h3>
                </div>
                
                {hasPdfTimetable && todaysClasses.length === 0 ? (
                  <div className="text-center py-6 border border-white/5 rounded-2xl bg-white/[0.02]">
                    <FileText size={32} className="mx-auto text-blue-400/50 mb-3" />
                    <p className="text-sm font-medium text-gray-300 mb-4">Official timetable is available.</p>
                    <button onClick={() => window.open(studentData.class.timetableUrl, '_blank')} className="w-[80%] mx-auto py-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      Open PDF <ExternalLink size={14} />
                    </button>
                  </div>
                ) : todaysClasses.length > 0 ? (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-white/10">
                    {todaysClasses.slice(0, 4).map((cls: any, i: number) => (
                      <div key={i} className="relative flex items-start pl-8 group">
                        <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-[#050505] bg-white/20 group-hover:bg-blue-400 transition-colors" />
                        <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] w-full group-hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-sm text-gray-200">{cls.subject}</h4>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">{cls.startTime} • Room {cls.room}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                    <p className="text-gray-500 text-sm font-medium">No classes scheduled today.</p>
                  </div>
                )}
              </GlassCard>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}