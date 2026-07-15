"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, CreditCard, Award, Calendar, 
  Settings, Bell, Menu, X, TrendingUp, Clock, FileText, 
  Download, CheckCircle2, AlertCircle, Zap, ChevronRight, LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Instrument_Serif, Inter } from 'next/font/google';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';

// --- Premium Royal Fonts ---
const instrumentSerif = Instrument_Serif({ 
  weight: '400', 
  subsets: ['latin'], 
  style: ['normal', 'italic'] 
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'] 
});

// --- 3D Background Component ---
const FloatingCrystals = () => (
  <div className="fixed inset-0 z-0 bg-[#F9F8FC]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-[#F9F8FC] to-amber-50/50" />
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
      <directionalLight position={[0, -10, 0]} intensity={1.5} color="#f59e0b" />
      
      {/* Large Crystal */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[5, 3, -5]} scale={2.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial transmission={0.9} opacity={1} roughness={0.1} ior={1.5} thickness={2} color="#ffffff" />
        </mesh>
      </Float>
      
      {/* Distorted Crystal */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-6, -3, -8]} scale={3.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial color="#FDF8E1" distort={0.3} speed={2} roughness={0.1} metalness={0.1} />
        </mesh>
      </Float>
      
      {/* Sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={2 + Math.random() * 2} floatIntensity={3} rotationIntensity={2}>
          <Sphere args={[0.03, 16, 16]} position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, -5 - Math.random() * 10]}>
            <meshStandardMaterial color={Math.random() > 0.5 ? "#F59E0B" : "#8B5CF6"} emissive={Math.random() > 0.5 ? "#F59E0B" : "#8B5CF6"} emissiveIntensity={2} />
          </Sphere>
        </Float>
      ))}
      <Environment preset="city" />
    </Canvas>
  </div>
);

// --- Premium UI Components ---
const GlassCard = ({ children, className = "", hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={`
    bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    ${hover ? 'hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, alert = false }: { title: string, value: string | React.ReactNode, subtitle?: string, icon: any, colorClass: string, alert?: boolean }) => (
  <GlassCard hover className="relative overflow-hidden group flex flex-col justify-between min-h-[150px]">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-[#1E1B4B]`}>
        <Icon size={24} className={`${alert ? 'text-orange-500 animate-pulse' : 'opacity-80'}`} />
      </div>
    </div>
    <div>
      <h3 className="text-gray-500 text-xs font-bold mb-1 tracking-wider uppercase">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <p className={`${instrumentSerif.className} text-4xl text-[#1E1B4B] tracking-tight`}>{value}</p>
        {subtitle && <span className={`text-sm ${alert ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>{subtitle}</span>}
      </div>
    </div>
  </GlassCard>
);

export default function StudentApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // PERMANENT FIX: Force browser to fetch fresh data every time
        const response = await fetch('/api/student/dashboard', {
          headers: { 
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

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

  const generateNotifications = (data: any) => {
    const alerts = [];
    
    if (data.fees && data.fees.some((f: any) => f.status === 'PENDING')) {
      alerts.push({
        id: 'fee', title: 'New Fee Invoice', desc: 'You have pending fees that require payment.', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-100', time: 'Action Required', link: '/fees'
      });
    }

    const pendingAsgmts = data.class?.assignments?.filter((a: any) => !a.submissions?.some((s: any) => s.studentId === data.id)) || [];
    if (pendingAsgmts.length > 0) {
      alerts.push({
        id: 'assignment', title: 'Pending Assignments', desc: `You have ${pendingAsgmts.length} unsubmitted assignment(s).`, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', time: 'Due Soon', link: '/assignments'
      });
    }

    if (data.results && data.results.length > 0) {
      const latestResult = data.results[0];
      alerts.push({
        id: 'result', title: 'Exam Result Published', desc: `Grade posted for ${latestResult.subject}`, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-100', time: new Date(latestResult.createdAt).toLocaleDateString(), link: '/academics'
      });
    }
    setNotifications(alerts);
  };

  if (isLoading || !studentData) {
    return (
      <div className="min-h-screen bg-[#F9F8FC] flex flex-col items-center justify-center text-[#1E1B4B] w-full h-full absolute inset-0">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6 shadow-xl" />
        <p className={`${instrumentSerif.className} text-4xl animate-pulse italic tracking-wide`}>Loading Dashboard...</p>
      </div>
    );
  }

  // --- MATH FIX: Calculate TOTAL sum of all pending fees! ---
  const pendingFeesList = studentData.fees?.filter((f:any) => f.status === 'PENDING') || [];
  const totalPendingFees = pendingFeesList.reduce((sum: number, fee: any) => sum + fee.amount, 0);

  const pendingAssignments = studentData.class?.assignments?.filter((a: any) => {
    return !a.submissions?.some((sub: any) => sub.studentId === studentData.id);
  }) || [];

  const navItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', active: true, href: '/' },
    { icon: Award, label: 'Academic Results', active: false, href: '/academics' },
    { icon: CreditCard, label: 'Fees & Payments', active: false, href: '/fees' },
    { icon: BookOpen, label: 'Assignments', active: false, href: '/assignments' },
    { icon: Calendar, label: 'Attendance', active: false, href: '/attendance' },
    { icon: Settings, label: 'Settings', active: false, href: '/settings' },
  ];

  return (
    <div className={`min-h-screen ${inter.className} text-[#1E1B4B] selection:bg-purple-200 overflow-hidden flex flex-col w-full relative bg-[#F9F8FC]`}>
      
      <FloatingCrystals />
      
      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-[#1E1B4B]/20 backdrop-blur-sm z-40 transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Floating Sidebar Drawer */}
      <aside className={`fixed z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] top-4 bottom-4 left-4 w-72 rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-3xl shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} flex flex-col justify-between`}>
        <div>
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center shadow-lg"><Zap size={20} className="text-white" /></div>
              <span className={`${instrumentSerif.className} text-2xl tracking-tight text-[#1E1B4B] leading-none mt-1`}>Sunshine<br/><span className="text-[#1E1B4B]/60 text-sm italic font-sans tracking-widest uppercase">Portal</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2.5 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-rose-500 shadow-sm transition-all border border-gray-100"><X size={20} /></button>
          </div>

          <nav className="px-6 py-2 space-y-2">
            {navItems.map((item, idx) => (
              <button key={idx} onClick={() => window.location.href = item.href} className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group font-medium ${item.active ? 'bg-[#1E1B4B] text-white shadow-md' : 'text-[#1E1B4B]/70 hover:bg-white hover:text-[#1E1B4B] hover:shadow-sm'}`}>
                <item.icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.active ? 'text-white' : ''}`} /> 
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 space-y-4">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 font-medium">
            <LogOut size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span>Secure Logout</span>
          </button>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E1B4B] flex items-center justify-center font-bold text-white shadow-inner">
              {studentData.firstName[0]}{studentData.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#1E1B4B] truncate">{studentData.firstName} {studentData.lastName}</p>
              <p className="text-xs text-gray-500 truncate uppercase tracking-wider mt-0.5">Grade {studentData.gradeLevel}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        
        {/* Header */}
        <header className="sticky top-6 z-30 mx-6 sm:mx-10 max-w-7xl xl:mx-auto bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl bg-white border border-gray-100 text-[#1E1B4B] hover:bg-purple-50 hover:text-purple-700 transition-colors shadow-sm"><Menu size={20} /></button>
          </div>

          <div className="flex items-center space-x-4 relative">
            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2.5 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
              <Bell size={20} />
              {notifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />}
            </button>
            
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-white/90 backdrop-blur-3xl border border-white rounded-3xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h4 className={`${instrumentSerif.className} text-xl text-[#1E1B4B]`}>Notifications</h4>
                  <span className="text-xs bg-[#1E1B4B] text-white px-2.5 py-1 rounded-full font-bold">{notifications.length}</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length > 0 ? notifications.map((notif, idx) => (
                    <div key={idx} onClick={() => window.location.href = notif.link} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start space-x-4">
                      <div className={`p-2.5 rounded-xl shrink-0 ${notif.bg} ${notif.color}`}><notif.icon size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-[#1E1B4B] mb-0.5">{notif.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-400"><p className="text-sm">No new notifications.</p></div>
                  )}
                </div>
              </div>
            )}
            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#1E1B4B] text-white items-center justify-center font-bold text-sm shadow-md">{studentData.firstName[0]}</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          
          <div className="mb-8">
            <h1 className={`${instrumentSerif.className} text-5xl sm:text-6xl text-[#1E1B4B] mb-2 tracking-tight`}>
              Welcome back, <span className="italic">{studentData.firstName}</span>
            </h1>
            <p className="text-gray-500 font-medium">Your academic overview for today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentData.class?.schedules?.[0] ? (
               <MetricCard title="Next Class" value={studentData.class.schedules[0].subject} subtitle={`at ${studentData.class.schedules[0].startTime}`} icon={Clock} colorClass="from-blue-100 to-indigo-100" />
            ) : (
               <MetricCard title="Next Class" value="Free Time" subtitle="No classes today" icon={Clock} colorClass="from-gray-100 to-gray-200" />
            )}
            
            <MetricCard title="Overall Grade" value="A-" subtitle="Excellent Standing" icon={Award} colorClass="from-emerald-100 to-teal-100" />
            <MetricCard title="Attendance" value="94%" subtitle="This Semester" icon={CheckCircle2} colorClass="from-purple-100 to-pink-100" />
            
            <MetricCard 
              title="Fees Due" 
              value={totalPendingFees > 0 ? `$${totalPendingFees.toLocaleString()}` : "$0"} 
              subtitle={totalPendingFees > 0 ? `${pendingFeesList.length} action(s) required` : "All cleared"} 
              icon={CreditCard} 
              colorClass="from-orange-100 to-rose-100" 
              alert={totalPendingFees > 0} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            
            <div className="lg:col-span-2 space-y-8">
              {/* Academics */}
              <GlassCard>
                <div className="flex justify-between items-center mb-8">
                  <h3 className={`${instrumentSerif.className} text-3xl text-[#1E1B4B]`}>Recent Results</h3>
                  <button onClick={() => window.location.href = '/academics'} className="text-sm text-gray-500 hover:text-[#1E1B4B] flex items-center font-bold bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    View Transcripts <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {studentData.results && studentData.results.length > 0 ? (
                    studentData.results.slice(0, 3).map((exam: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center space-x-5">
                          <div className={`p-4 rounded-xl ${exam.marksObtained >= 90 ? 'bg-emerald-50 text-emerald-600' : exam.marksObtained >= 80 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1E1B4B] text-lg">{exam.subject}</h4>
                            <p className="text-xs text-gray-400 font-bold tracking-wider uppercase mt-1">{exam.examName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`${instrumentSerif.className} text-3xl text-[#1E1B4B]`}>{exam.marksObtained}%</p>
                          <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${exam.marksObtained >= 80 ? 'text-emerald-600' : 'text-orange-600'}`}>Grade {exam.grade}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-4 font-medium text-center">No recent exam results published yet.</p>
                  )}
                </div>
              </GlassCard>

              {/* Assignments */}
              <GlassCard>
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`${instrumentSerif.className} text-3xl text-[#1E1B4B] flex items-center gap-3`}>
                    <div className="p-2 bg-purple-100 rounded-xl"><BookOpen className="text-purple-600" size={20} /></div>
                    Pending Assignments
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pendingAssignments.length > 0 ? (
                    pendingAssignments.slice(0, 4).map((assignment: any) => {
                      const isUrgent = new Date(assignment.dueDate).getTime() - new Date().getTime() < 86400000;
                      return (
                        <div key={assignment.id} className={`p-6 rounded-[1.5rem] border bg-white transition-all ${isUrgent ? 'border-orange-200 shadow-[0_8px_30px_rgba(249,115,22,0.1)]' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${isUrgent ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                              {isUrgent ? 'Due Tomorrow' : `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{assignment.subject}</span>
                          </div>
                          <h4 className="font-bold text-[#1E1B4B] text-lg mb-2 line-clamp-1">{assignment.title}</h4>
                          <button onClick={() => window.location.href = '/assignments'} className={`w-full mt-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${isUrgent ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-50 text-[#1E1B4B] hover:bg-gray-200'}`}>
                            Go to Submissions
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center bg-emerald-50 border border-emerald-100 rounded-[2rem]">
                      <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                      <p className={`${instrumentSerif.className} text-3xl text-emerald-800 mb-1`}>All caught up!</p>
                      <p className="text-emerald-600 font-medium">You have successfully submitted all assignments.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Financials & Schedule */}
            <div className="space-y-8">
              
              <GlassCard className={`${totalPendingFees > 0 ? 'border-orange-200 shadow-[0_8px_30px_rgba(249,115,22,0.1)]' : ''} relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-40 h-40 ${totalPendingFees > 0 ? 'bg-orange-100/50' : 'bg-gray-50'} rounded-bl-full -z-10 blur-xl`} />
                <h3 className={`${instrumentSerif.className} text-3xl text-[#1E1B4B] mb-6`}>Financial Hub</h3>
                
                {totalPendingFees > 0 ? (
                  <>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 shadow-sm">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Total Outstanding Balance</p>
                      <p className={`${instrumentSerif.className} text-5xl text-orange-600 mb-2`}>
                        ${totalPendingFees.toLocaleString()}
                      </p>
                      <p className="text-sm text-orange-600 font-medium flex items-center">
                        <AlertCircle size={16} className="mr-1.5" /> {pendingFeesList.length} Unpaid Invoice(s)
                      </p>
                    </div>
                    <button onClick={() => window.location.href = '/payments'} className="w-full py-4 rounded-xl bg-[#1E1B4B] text-white hover:bg-[#312E81] font-bold transition-all shadow-lg flex items-center justify-center space-x-2">
                      <CreditCard size={18} />
                      <span>Pay Securely</span>
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                    <p className="text-[#1E1B4B] font-bold">Account Cleared</p>
                    <p className="text-sm text-gray-500 mt-1">No pending fees.</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h3 className={`${instrumentSerif.className} text-3xl text-[#1E1B4B] mb-6`}>Today's Schedule</h3>
                {studentData.class?.schedules?.length > 0 ? (
                  <div className="space-y-4">
                    {studentData.class.schedules.slice(0,4).map((cls: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <h4 className="font-bold text-[#1E1B4B]">{cls.subject}</h4>
                          <span className="text-xs font-bold text-gray-400">{cls.startTime}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Room {cls.room}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-100 rounded-[2rem]">
                    <Calendar size={32} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No classes scheduled.</p>
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