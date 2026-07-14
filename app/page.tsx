"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, CreditCard, Award, Calendar, 
  Settings, Bell, Menu, X, TrendingUp, Clock, FileText, 
  Download, CheckCircle2, AlertCircle, Zap, ChevronRight,
  LogOut 
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion'; 

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const GlassCard = ({ children, className = "", hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, alert = false }: any) => (
  <GlassCard hover className="relative overflow-hidden group h-full flex flex-col justify-between">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 -z-10`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white`}>
        <Icon size={24} className={`opacity-80 group-hover:opacity-100 transition-opacity ${alert ? 'text-rose-400 animate-pulse' : ''}`} />
      </div>
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
      </div>
      {subtitle && <span className={`text-sm ${alert ? 'text-rose-400 font-medium' : 'text-gray-500'} mt-1 block`}>{subtitle}</span>}
    </div>
  </GlassCard>
);

export default function StudentApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Timer State
  const [nextClassInfo, setNextClassInfo] = useState({ subject: "No more classes", countdown: "Done for today", active: false });
  const [todaysSchedule, setTodaysSchedule] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard');
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const json = await response.json();
        if (json.success) setStudentData(json.data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!studentData?.class?.schedules) return;

    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = studentData.class.schedules.filter((s: any) => s.dayOfWeek === currentDay);
    setTodaysSchedule(todayClasses);

    const updateTimer = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      let upcomingClass = null;
      let activeClass = null;

      for (const cls of todayClasses) {
        const [startH, startM] = cls.startTime.split(':').map(Number);
        const [endH, endM] = cls.endTime.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        if (currentTimeInMinutes >= startTotal && currentTimeInMinutes < endTotal) {
          activeClass = cls;
        } else if (currentTimeInMinutes < startTotal && !upcomingClass) {
          upcomingClass = cls;
        }
      }

      if (activeClass) {
        setNextClassInfo({ subject: activeClass.subject, countdown: "In Progress", active: true });
      } else if (upcomingClass) {
        const [startH, startM] = upcomingClass.startTime.split(':').map(Number);
        
        // Calculate exact remaining time
        let targetTime = new Date(now);
        targetTime.setHours(startH, startM, 0, 0);
        const diffMs = targetTime.getTime() - now.getTime();
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        setNextClassInfo({ 
          subject: upcomingClass.subject, 
          countdown: `In ${hours}h ${minutes}m ${seconds}s`,
          active: false
        });
      } else {
        setNextClassInfo({ subject: "Free Time", countdown: "No more classes today!", active: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [studentData]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white w-full h-full absolute inset-0">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-blue-400 font-medium animate-pulse">Decrypting Secure Data...</p>
      </div>
    );
  }

  if (!studentData) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold text-xl">Error loading student profile.</div>;

  const navItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', active: true },
    { icon: Award, label: 'Academic Results' },
    { icon: CreditCard, label: 'Fees & Payments' },
    { icon: BookOpen, label: 'Assignments' },
    { icon: Calendar, label: 'Attendance & Timetable' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-hidden flex w-full">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <aside className={`fixed lg:relative z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'w-72' : 'w-0 lg:w-24'} bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Nexus<span className="text-blue-400 font-light">Student</span></span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (item.label === 'Academic Results') window.location.href = '/academics';
                if (item.label === 'Fees & Payments') window.location.href = '/fees';
                if (item.label === 'Attendance & Timetable') window.location.href = '/attendance';
                if (item.label === 'Assignments') window.location.href = '/assignments';
                if (item.label === 'Settings') window.location.href = '/settings';
              }}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${item.active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'} ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}
            >
              <item.icon size={22} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group text-rose-400 hover:bg-rose-500/10 border border-transparent ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}>
            <LogOut size={22} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Secure Logout</span>
          </button>
          <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 ${!isSidebarOpen && 'lg:hidden'}`}>
            <div className="flex items-center space-x-3 mb-3">
              <img src={`https://ui-avatars.com/api/?name=${studentData.firstName}+${studentData.lastName}&background=2563eb&color=fff`} alt="Student" className="w-10 h-10 rounded-full border border-white/20 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{studentData.firstName} {studentData.lastName}</p>
                <p className="text-xs text-blue-400 truncate">Grade {studentData.gradeLevel} - {studentData.section}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-pulse" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto overflow-hidden">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            
            {}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Welcome back, {studentData.firstName}
                </h1>
                <p className="text-gray-400">Here is your academic overview for today.</p>
              </div>
            </motion.div>

            {}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* THE LIVE TIMER CARD */}
              <MetricCard 
                title={nextClassInfo.active ? "Current Class" : "Next Class"} 
                value={nextClassInfo.subject} 
                subtitle={nextClassInfo.countdown} 
                icon={Clock} 
                colorClass={nextClassInfo.active ? "from-emerald-500 to-teal-500" : "from-blue-500 to-cyan-500"} 
                alert={nextClassInfo.active}
              />
              
              <MetricCard title="Overall Grade" value="A-" subtitle="Mid-Term" icon={Award} colorClass="from-emerald-500 to-teal-500" />
              
              <GlassCard hover className="relative overflow-hidden group h-full flex flex-col justify-between">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 -z-10`} />
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white`}>
                    <CheckCircle2 size={24} className={`opacity-80 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  {studentData?.class?.timetableUrl && (
                    <a href={studentData.class.timetableUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors border border-white/10 z-10">
                      View Timetable PDF
                    </a>
                  )}
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Attendance</h3>
                  <div className="flex items-baseline space-x-2"><p className="text-3xl font-semibold text-white tracking-tight">94%</p></div>
                  <span className="text-sm text-gray-500 mt-1 block">This Semester</span>
                </div>
              </GlassCard>

              <MetricCard 
                title="Fees Due" 
                value={studentData.fees?.[0] ? `$${studentData.fees[0].amount.toLocaleString()}` : "$0"} 
                subtitle={studentData.fees?.[0] ? "Action Required" : "All cleared"} 
                icon={CreditCard} 
                colorClass="from-rose-500 to-orange-500" 
                alert={studentData.fees?.length > 0} 
              />
            </motion.div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div variants={itemVariants}>
                  <GlassCard>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-white">Recent Exam Results</h3>
                      <button onClick={() => window.location.href = '/academics'} className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                        View All Transcripts <ChevronRight size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {studentData.results && studentData.results.length > 0 ? (
                        studentData.results.map((exam: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${exam.marksObtained >= 90 ? 'bg-emerald-500/10 text-emerald-400' : exam.marksObtained >= 80 ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                <FileText size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-200">{exam.subject}</h4>
                                <p className="text-xs text-gray-500">{new Date(exam.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-lg font-semibold text-white">{exam.marksObtained}%</p>
                                <p className={`text-xs flex items-center justify-end ${exam.marksObtained >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  <TrendingUp size={12} className={`mr-1 ${exam.marksObtained < 80 ? 'rotate-180' : ''}`} />
                                  Grade {exam.grade}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm py-4">No recent exam results published yet.</p>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <GlassCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2"><BookOpen className="text-purple-400" size={20} />Pending Assignments</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors">
                        <div className="flex justify-between items-start mb-2"><span className="text-xs font-medium px-2 py-1 rounded bg-rose-500/20 text-rose-400">Due Tomorrow</span></div>
                        <h4 className="font-medium text-gray-200 mb-1">Physics Lab Report</h4>
                        <p className="text-sm text-gray-500 mb-4">Submit the pendulum experiment findings.</p>
                        <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">Submit Now</button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {}
              <div className="space-y-8">
                <motion.div variants={itemVariants}>
                  <GlassCard className={`${studentData.fees?.[0] ? 'border-rose-500/30' : 'border-emerald-500/30'} relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${studentData.fees?.[0] ? 'bg-rose-500/10' : 'bg-emerald-500/10'} rounded-bl-full -z-10`} />
                    <h3 className="text-lg font-semibold text-white mb-2">Pending Fees</h3>
                    
                    {studentData.fees && studentData.fees.length > 0 ? (
                      <>
                        <p className="text-sm text-gray-400 mb-6">{studentData.fees[0].title}</p>
                        <div className="mb-6">
                          <p className="text-4xl font-bold text-white mb-1">${studentData.fees[0].amount.toLocaleString()}</p>
                          <p className="text-sm text-rose-400 flex items-center">
                            <AlertCircle size={14} className="mr-1" /> Due {new Date(studentData.fees[0].dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <button onClick={() => window.location.href = '/payments'} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-2">
                            <CreditCard size={18} /><span>Pay Now Securely</span>
                          </button>
                          <button onClick={() => window.location.href = '/fees'} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium text-sm">
                            View Fee Breakdown
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                        <p className="text-white font-medium">All Caught Up!</p>
                        <p className="text-sm text-gray-400 mt-1">No pending fees at this time.</p>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>

                {/* THE LIVE DYNAMIC SCHEDULE */}
                <motion.div variants={itemVariants}>
                  <GlassCard>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-white">Today's Schedule</h3>
                      <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">Live</span>
                    </div>
                    
                    {todaysSchedule.length > 0 ? (
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-white/10">
                        {todaysSchedule.map((cls: any, i: number) => {
                          const now = new Date();
                          const currentMinutes = now.getHours() * 60 + now.getMinutes();
                          const [startH, startM] = cls.startTime.split(':').map(Number);
                          const [endH, endM] = cls.endTime.split(':').map(Number);
                          const startTotal = startH * 60 + startM;
                          const endTotal = endH * 60 + endM;
                          
                          // Determine if this specific class is happening right now
                          const isActive = currentMinutes >= startTotal && currentMinutes < endTotal;
                          // Determine if this class is completely in the past
                          const isPast = currentMinutes >= endTotal;

                          return (
                            <div key={i} className={`relative flex items-start pl-8 group ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                              <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center ${isActive ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse' : isPast ? 'bg-gray-600' : 'bg-white/20'}`} />
                              <div className={`p-3 rounded-xl border w-full transition-colors ${isActive ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-transparent'}`}>
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className={`font-medium text-sm ${isActive ? 'text-blue-400' : 'text-gray-200'}`}>{cls.subject}</h4>
                                  <span className="text-xs text-gray-500">{cls.startTime} - {cls.endTime}</span>
                                </div>
                                <p className="text-xs text-gray-400 flex justify-between">
                                  <span>{cls.room}</span>
                                  {isActive && <span className="text-emerald-400">Happening Now</span>}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                        <Calendar className="mx-auto text-gray-500 mb-2" size={24} />
                        <p className="text-sm text-gray-400">No classes scheduled for today.</p>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}