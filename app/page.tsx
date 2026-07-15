"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, CreditCard, Award, Calendar, 
  Settings, Bell, Menu, X, TrendingUp, Clock, FileText, 
  Download, CheckCircle2, AlertCircle, Zap, ChevronRight, LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

// --- Premium UI Components ---

const GlassCard = ({ children, className = "", hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={`
    bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6
    ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out cursor-pointer' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, alert = false, link }: { title: string, value: string | React.ReactNode, subtitle?: string, icon: any, colorClass: string, alert?: boolean, link?: string }) => (
  <GlassCard hover className="relative overflow-hidden group flex flex-col justify-between min-h-[140px]" >
    <div 
      className="absolute inset-0 z-0 cursor-pointer" 
      onClick={() => link ? window.location.href = link : null}
    />
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 -z-10`} />
    <div className="flex justify-between items-start mb-2 pointer-events-none">
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white`}>
        <Icon size={24} className={`opacity-80 group-hover:opacity-100 transition-opacity ${alert ? 'text-rose-400 animate-pulse' : ''}`} />
      </div>
    </div>
    <div className="pointer-events-none">
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
    </div>
  </GlassCard>
);

// --- Main Student Application ---

export default function StudentApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch REAL data from the API
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard');
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const json = await response.json();
        
        if (json.success) {
          setStudentData(json.data);
          generateNotifications(json.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- Dynamic Notifications Logic ---
  const generateNotifications = (data: any) => {
    const alerts = [];
    
    // 1. Check for Pending Fees
    if (data.fees && data.fees.some((f: any) => f.status === 'PENDING')) {
      alerts.push({
        id: 'fee',
        title: 'New Fee Invoice',
        desc: 'You have pending fees that require payment.',
        icon: CreditCard,
        color: 'text-rose-400',
        bg: 'bg-rose-500/20',
        time: 'Action Required',
        link: '/fees'
      });
    }

    // 2. Check for Pending Assignments
    const pendingAsgmts = data.class?.assignments?.filter((a: any) => !a.submissions?.some((s: any) => s.studentId === data.id)) || [];
    if (pendingAsgmts.length > 0) {
      alerts.push({
        id: 'assignment',
        title: 'Pending Assignments',
        desc: `You have ${pendingAsgmts.length} unsubmitted assignment(s).`,
        icon: BookOpen,
        color: 'text-purple-400',
        bg: 'bg-purple-500/20',
        time: 'Due Soon',
        link: '/assignments'
      });
    }

    // 3. Check for Recent Exam Results (published within last 7 days)
    if (data.results && data.results.length > 0) {
      const latestResult = data.results[0];
      alerts.push({
        id: 'result',
        title: 'Exam Result Published',
        desc: `Grade posted for ${latestResult.subject}`,
        icon: Award,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        time: new Date(latestResult.createdAt).toLocaleDateString(),
        link: '/academics'
      });
    }

    setNotifications(alerts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white w-full h-full absolute inset-0">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-blue-400 font-medium animate-pulse">Connecting to Nexus Database...</p>
      </div>
    );
  }

  if (!studentData) return <div className="min-h-screen bg-black text-white p-8">Error loading data.</div>;

  // --- Date & Time Logic ---
  const todayDate = new Date();
  const dateString = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const dayOfWeekString = todayDate.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"

  // Filter schedules to ONLY show today's classes, sorted by start time
  const todaysClasses = studentData.class?.schedules
    ?.filter((schedule: any) => schedule.dayOfWeek === dayOfWeekString)
    ?.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime)) || [];

  // Find the "Next" class based on current time
  const currentTime = todayDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
  
  let nextClass = null;
  let activeClassIndex = -1;

  for (let i = 0; i < todaysClasses.length; i++) {
    const cls = todaysClasses[i];
    // If the class hasn't ended yet, it's either currently active or it's the next one
    if (currentTime < cls.endTime) {
       nextClass = cls;
       // If it has already started, it's the active class
       if (currentTime >= cls.startTime) {
           activeClassIndex = i;
       }
       break; // Found the next relevant class, stop looking
    }
  }

  // Compute Real Pending Assignments
  const pendingAssignments = studentData.class?.assignments?.filter((a: any) => {
    return !a.submissions?.some((sub: any) => sub.studentId === studentData.id);
  }) || [];

  // Compute Real Attendance Percentage
  let attendancePercentage = "0%";
  if (studentData.attendance && studentData.attendance.length > 0) {
    const presentCount = studentData.attendance.filter((a: any) => a.status === 'PRESENT').length;
    attendancePercentage = Math.round((presentCount / studentData.attendance.length) * 100) + "%";
  }

  // Compute Overall Grade (Average of all published results)
  let overallGrade = "N/A";
  if (studentData.results && studentData.results.length > 0) {
    const totalMarks = studentData.results.reduce((acc: number, curr: any) => acc + curr.marksObtained, 0);
    const maxMarks = studentData.results.reduce((acc: number, curr: any) => acc + curr.totalMarks, 0);
    const percentage = (totalMarks / maxMarks) * 100;
    
    if (percentage >= 90) overallGrade = "A";
    else if (percentage >= 80) overallGrade = "B";
    else if (percentage >= 70) overallGrade = "C";
    else overallGrade = "F";
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', active: true, href: '/' },
    { icon: Award, label: 'Academic Results', active: false, href: '/academics' },
    { icon: CreditCard, label: 'Fees & Payments', active: false, href: '/fees' },
    { icon: BookOpen, label: 'Assignments', active: false, href: '/assignments' },
    { icon: Calendar, label: 'Attendance & Timetable', active: false, href: '/attendance' },
    { icon: Settings, label: 'Settings', active: false, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-hidden flex w-full">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 w-0 lg:w-24'} 
        bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between
      `}>
        <div>
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Nexus<span className="text-blue-400 font-light">Student</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
            {navItems.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => window.location.href = item.href}
                className={`
                w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                ${item.active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                ${!isSidebarOpen && 'lg:justify-center lg:px-0'}
              `}>
                <item.icon size={22} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 space-y-4">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}
          >
            <LogOut size={22} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
              Secure Logout
            </span>
          </button>

          <div className={`p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 ${!isSidebarOpen && 'lg:hidden'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0">
                {studentData.firstName[0]}{studentData.lastName[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{studentData.firstName} {studentData.lastName}</p>
                <p className="text-xs text-blue-400 truncate">Grade {studentData.gradeLevel} - {studentData.section}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-pulse" />
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in slide-in-from-top-2">
                  <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                    <h4 className="font-semibold text-white">Notifications</h4>
                    <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full text-white">{notifications.length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div key={idx} onClick={() => window.location.href = notif.link} className="p-4 hover:bg-white/5 cursor-pointer transition-colors flex items-start space-x-4">
                          <div className={`p-2 rounded-xl shrink-0 ${notif.bg} ${notif.color}`}>
                            <notif.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.desc}</p>
                            <p className="text-[10px] text-gray-600 mt-2 font-medium uppercase tracking-wider">{notif.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <CheckCircle2 size={32} className="mx-auto mb-2 text-gray-600" />
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Welcome back, {studentData.firstName}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">Here is your academic overview for <span className="text-white font-medium">{dateString}</span>.</p>
            </div>
          </div>

          {/* Student Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {nextClass ? (
               <MetricCard link="/attendance" title="Next Class" value={nextClass.subject} subtitle={`at ${nextClass.startTime}`} icon={Clock} colorClass="from-blue-500 to-cyan-500" />
            ) : (
               <MetricCard link="/attendance" title="Next Class" value="Free Time" subtitle="No more classes today!" icon={Clock} colorClass="from-gray-500 to-gray-700" />
            )}
            
            <MetricCard link="/academics" title="Overall Grade" value={overallGrade} subtitle="Mid-Term Average" icon={Award} colorClass="from-emerald-500 to-teal-500" />
            <MetricCard link="/attendance" title="Attendance" value={attendancePercentage} subtitle="This Semester" icon={CheckCircle2} colorClass="from-purple-500 to-pink-500" />
            
            <MetricCard 
              link="/fees"
              title="Fees Due" 
              value={studentData.fees?.some((f:any) => f.status === 'PENDING') ? `$${studentData.fees.find((f:any)=>f.status==='PENDING').amount.toLocaleString()}` : "$0"} 
              subtitle={studentData.fees?.some((f:any) => f.status === 'PENDING') ? "Action required" : "All cleared"} 
              icon={CreditCard} 
              colorClass="from-rose-500 to-orange-500" 
              alert={studentData.fees?.some((f:any) => f.status === 'PENDING')} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Academics & Results */}
            <div className="lg:col-span-2 space-y-8">
              <GlassCard>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Recent Exam Results</h3>
                  <button onClick={() => window.location.href = '/academics'} className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                    View All Transcripts <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {studentData.results && studentData.results.length > 0 ? (
                    studentData.results.slice(0, 3).map((exam: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${exam.marksObtained >= 90 ? 'bg-emerald-500/10 text-emerald-400' : exam.marksObtained >= 80 ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200">{exam.subject}</h4>
                            <p className="text-xs text-gray-500">
                              {new Date(exam.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-white">{exam.marksObtained}%</p>
                            <p className={`text-xs flex items-center justify-end ${exam.marksObtained >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
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

              {/* REAL Pending Assignments Section */}
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="text-purple-400" size={20} />
                    Pending Assignments
                  </h3>
                  {pendingAssignments.length > 0 && (
                    <button onClick={() => window.location.href = '/assignments'} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      View All Tasks
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingAssignments.length > 0 ? (
                    pendingAssignments.slice(0, 4).map((assignment: any) => {
                      const isUrgent = new Date(assignment.dueDate).getTime() - new Date().getTime() < 86400000;
                      return (
                        <div key={assignment.id} className={`p-5 rounded-xl border transition-colors ${isUrgent ? 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${isUrgent ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-gray-300'}`}>
                              {isUrgent ? 'Due Tomorrow' : `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">{assignment.subject}</span>
                          </div>
                          <h4 className="font-semibold text-gray-100 mb-1 line-clamp-1">{assignment.title}</h4>
                          <p className="text-sm text-gray-500 mb-5 line-clamp-2">{assignment.description}</p>
                          <button 
                            onClick={() => window.location.href = '/assignments'} 
                            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors border ${isUrgent ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}
                          >
                            Go to Submissions
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 py-8 flex flex-col items-center justify-center text-center bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                      <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
                      <p className="text-emerald-400 font-semibold text-lg">All caught up!</p>
                      <p className="text-emerald-500/70 text-sm mt-1">You have successfully submitted all assignments.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Payments & Schedule */}
            <div className="space-y-8">
              
              {/* Fee Payment Widget */}
              <GlassCard className={`${studentData.fees?.some((f:any)=>f.status==='PENDING') ? 'border-rose-500/30' : 'border-emerald-500/30'} relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${studentData.fees?.some((f:any)=>f.status==='PENDING') ? 'bg-rose-500/10' : 'bg-emerald-500/10'} rounded-bl-full -z-10`} />
                <h3 className="text-lg font-semibold text-white mb-2">Pending Fees</h3>
                
                {studentData.fees?.filter((f:any) => f.status === 'PENDING').length > 0 ? (
                  <>
                    <p className="text-sm text-gray-400 mb-6">{studentData.fees.find((f:any)=>f.status==='PENDING').title}</p>
                    <div className="mb-6">
                      <p className="text-4xl font-bold text-white mb-1">${studentData.fees.find((f:any)=>f.status==='PENDING').amount.toLocaleString()}</p>
                      <p className="text-sm text-rose-400 flex items-center">
                        <AlertCircle size={14} className="mr-1" /> Due {new Date(studentData.fees.find((f:any)=>f.status==='PENDING').dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button onClick={() => window.location.href = '/payments'} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-2">
                        <CreditCard size={18} />
                        <span>Pay Now Securely</span>
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

              {/* Today's Schedule */}
              <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-6">Today's Schedule</h3>
                
                {todaysClasses.length > 0 ? (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:bg-white/10">
                    {todaysClasses.map((cls: any, i: number) => {
                      const isActive = i === activeClassIndex; 
                      return (
                        <div key={i} className="relative flex items-start pl-8 group">
                          <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center ${isActive ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-gray-600'}`} />
                          <div className={`p-3 rounded-xl border w-full transition-colors ${isActive ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-transparent hover:border-white/10'}`}>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className={`font-medium text-sm ${isActive ? 'text-blue-400' : 'text-gray-200'}`}>{cls.subject}</h4>
                              <span className="text-xs text-gray-500">{cls.startTime} - {cls.endTime}</span>
                            </div>
                            <p className="text-xs text-gray-400">Room {cls.room}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-2xl">
                    <Calendar size={32} className="text-gray-600 mb-3" />
                    <p className="text-gray-400 text-sm">No classes scheduled for today.</p>
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