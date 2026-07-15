"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, CreditCard, Award, Calendar, 
  Settings, Bell, Menu, X, Clock, FileText, 
  CheckCircle2, AlertCircle, ChevronRight, LogOut, 
  Sparkles, Zap, ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Instrument_Serif, Inter } from 'next/font/google';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Fonts ---
const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'], style: ['normal', 'italic'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// --- Ultra-Premium Royal Crystal 3D Background ---
const FloatingCrystals = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#F9F8FC]">
      {/* Soft animated gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-[#F9F8FC] to-amber-50/50" />
      
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
        <directionalLight position={[0, -10, 0]} intensity={1.5} color="#f59e0b" />
        
        {/* Crystal 1: Top Right */}
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[5, 3, -5]} scale={2.5}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhysicalMaterial 
              transmission={0.9} 
              opacity={1} 
              roughness={0.1} 
              ior={1.5} 
              thickness={2} 
              color="#ffffff"
            />
          </mesh>
        </Float>

        {/* Crystal 2: Bottom Left (Liquid Gold/Pearl) */}
        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
          <mesh position={[-6, -3, -8]} scale={3.5}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial 
              color="#FDF8E1" 
              distort={0.3} 
              speed={2} 
              roughness={0.1} 
              metalness={0.1} 
            />
          </mesh>
        </Float>

        {/* Tiny Sparkles */}
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
};

// --- Glassmorphism Bento Card ---
const BentoCard = ({ children, className = "", colSpan = 1, rowSpan = 1 }: { children: React.ReactNode, className?: string, colSpan?: number, rowSpan?: number }) => (
  <div className={`
    bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-7
    hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:bg-white/80 transition-all duration-500 overflow-hidden relative
    ${colSpan === 2 ? 'lg:col-span-2' : 'lg:col-span-1'}
    ${rowSpan === 2 ? 'row-span-2' : 'row-span-1'}
    ${className}
  `}>
    {children}
  </div>
);

// --- Main Student App ---
export default function StudentApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
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

  const generateNotifications = (data: any) => {
    const alerts = [];
    if (data.fees?.some((f: any) => f.status === 'PENDING')) {
      alerts.push({ id: 'fee', title: 'Pending Invoice', desc: 'You have outstanding fees.', icon: CreditCard, color: 'text-rose-500', bg: 'bg-rose-100', link: '/fees' });
    }
    const pendingAsgmts = data.class?.assignments?.filter((a: any) => !a.submissions?.some((s: any) => s.studentId === data.id)) || [];
    if (pendingAsgmts.length > 0) {
      alerts.push({ id: 'assignment', title: 'Pending Tasks', desc: `${pendingAsgmts.length} unsubmitted assignments.`, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100', link: '/assignments' });
    }
    setNotifications(alerts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8FC] flex flex-col items-center justify-center text-[#1E1B4B] w-full h-full absolute inset-0">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6 shadow-xl" />
        <p className={`${instrumentSerif.className} text-4xl animate-pulse italic tracking-wide`}>Loading Workspace...</p>
      </div>
    );
  }

  if (!studentData) return <div className="min-h-screen bg-[#F9F8FC] text-[#1E1B4B] flex items-center justify-center">Error loading profile.</div>;

  const pendingAssignments = studentData.class?.assignments?.filter((a: any) => !a.submissions?.some((sub: any) => sub.studentId === studentData.id)) || [];
  const nextClass = studentData.class?.schedules?.[0];
  const pendingFee = studentData.fees?.find((f: any) => f.status === 'PENDING');

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true, href: '/' },
    { icon: Award, label: 'Transcripts', active: false, href: '/academics' },
    { icon: CreditCard, label: 'Financials', active: false, href: '/fees' },
    { icon: BookOpen, label: 'Assignments', active: false, href: '/assignments' },
    { icon: Calendar, label: 'Schedule', active: false, href: '/attendance' },
    { icon: Settings, label: 'Settings', active: false, href: '/settings' },
  ];

  return (
    <div className={`min-h-screen ${inter.className} text-[#1E1B4B] font-sans selection:bg-purple-200 overflow-hidden flex flex-col w-full relative bg-[#F9F8FC]`}>
      
      <FloatingCrystals />

      {/* Slide-in Overlay */}
      <div 
        className={`fixed inset-0 bg-[#1E1B4B]/20 backdrop-blur-sm z-40 transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar Drawer */}
      <aside className={`
        fixed z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        top-4 bottom-4 left-4 w-72 rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-3xl shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} 
        flex flex-col justify-between
      `}>
        <div>
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className={`${instrumentSerif.className} text-2xl tracking-tight text-[#1E1B4B] leading-none mt-1`}>
                Sunshine<br/><span className="text-[#1E1B4B]/60 text-sm italic font-sans tracking-widest uppercase">Portal</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2.5 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-rose-500 shadow-sm transition-all border border-gray-100">
              <X size={20} />
            </button>
          </div>

          <nav className="px-6 py-2 space-y-2">
            {navItems.map((item, idx) => (
              <button 
                key={idx} onClick={() => window.location.href = item.href}
                className={`
                w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group font-medium
                ${item.active ? 'bg-[#1E1B4B] text-white shadow-md' : 'text-[#1E1B4B]/70 hover:bg-white hover:text-[#1E1B4B] hover:shadow-sm'}
              `}>
                <item.icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.active ? 'text-white' : ''}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="p-4 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center font-bold text-purple-900 shrink-0 shadow-inner">
                {studentData.firstName[0]}{studentData.lastName[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#1E1B4B] truncate">{studentData.firstName}</p>
                <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest mt-0.5">Grade {studentData.gradeLevel}</p>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="p-2 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        
        {/* Floating Header */}
        <header className="sticky top-6 z-30 mx-6 sm:mx-10 max-w-7xl xl:mx-auto bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl bg-white border border-gray-100 text-[#1E1B4B] hover:bg-purple-50 hover:text-purple-700 transition-colors shadow-sm">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-sm font-semibold text-[#1E1B4B]/60 tracking-wider uppercase">
              <span>{studentData.className || 'Student'} Workspace</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2.5 rounded-2xl bg-white border border-gray-100 text-[#1E1B4B] hover:bg-purple-50 transition-colors shadow-sm relative">
                <Bell size={20} />
                {notifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-3xl border border-white rounded-[2rem] shadow-[0_20px_60px_rgb(0,0,0,0.1)] overflow-hidden z-50 animate-in zoom-in-95">
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <h4 className={`${instrumentSerif.className} text-xl text-[#1E1B4B]`}>Alerts</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div key={idx} onClick={() => window.location.href = notif.link} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start space-x-4">
                          <div className={`p-2.5 rounded-2xl shrink-0 ${notif.bg} ${notif.color}`}><notif.icon size={18} /></div>
                          <div>
                            <p className="text-sm font-bold text-[#1E1B4B] mb-0.5">{notif.title}</p>
                            <p className="text-xs text-gray-500">{notif.desc}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-400"><CheckCircle2 size={32} className="mx-auto mb-3 opacity-50" /><p className="text-sm font-medium">All caught up!</p></div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#1E1B4B] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {studentData.firstName[0]}
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="p-6 sm:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* 1. Welcome Card (Span 2x2) */}
            <BentoCard colSpan={2} rowSpan={2} className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] text-white border-transparent">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="h-full flex flex-col justify-between relative z-10">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1.5 mb-6 border border-white/10">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold tracking-wider text-white/90 uppercase">{greeting}</span>
                  </div>
                  <h1 className={`${instrumentSerif.className} text-5xl sm:text-7xl leading-[0.95] tracking-tight mb-4`}>
                    Welcome back,<br/><span className="text-amber-300 italic">{studentData.firstName}</span>
                  </h1>
                  <p className="text-white/70 font-medium max-w-sm leading-relaxed">
                    You have <strong className="text-white">{pendingAssignments.length} assignments</strong> pending and <strong className="text-white">1</strong> upcoming class today.
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-8">
                  <button onClick={() => window.location.href = '/assignments'} className="bg-white text-[#1E1B4B] px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors">
                    View Workspace
                  </button>
                </div>
              </div>
            </BentoCard>

            {/* 2. Schedule Card (Span 1x1) */}
            <BentoCard className="group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Clock size={24} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Up Next</span>
              </div>
              {nextClass ? (
                <>
                  <h3 className="text-2xl font-bold text-[#1E1B4B] mb-1">{nextClass.subject}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-4">{nextClass.startTime} • Room {nextClass.room}</p>
                  <a href="/attendance" className="text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:text-blue-700 flex items-center">
                    Full Schedule <ChevronRight size={14} className="ml-1" />
                  </a>
                </>
              ) : (
                <div className="pt-2"><p className="text-lg font-bold text-gray-400">Free Time</p><p className="text-sm text-gray-400 mt-1">No classes today.</p></div>
              )}
            </BentoCard>

            {/* 3. GPA Card (Span 1x1) */}
            <BentoCard>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Award size={24} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GPA</span>
              </div>
              <h3 className={`${instrumentSerif.className} text-5xl text-[#1E1B4B] mb-2`}>A-</h3>
              <p className="text-sm font-medium text-emerald-600 flex items-center">
                <TrendingUp size={16} className="mr-1" /> Top 15% of Class
              </p>
            </BentoCard>

            {/* 4. Action Items / Assignments (Span 2x1) */}
            <BentoCard colSpan={2} className="flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1E1B4B] flex items-center"><BookOpen size={18} className="mr-2 text-purple-500" /> Action Items</h3>
                <a href="/assignments" className="text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#1E1B4B]">View All</a>
              </div>
              {pendingAssignments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingAssignments.slice(0, 2).map((a: any) => (
                    <div key={a.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer" onClick={() => window.location.href='/assignments'}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded shadow-sm text-gray-500">{a.subject}</span>
                        <ArrowUpRight size={14} className="text-gray-400" />
                      </div>
                      <h4 className="font-bold text-sm text-[#1E1B4B] truncate">{a.title}</h4>
                      <p className="text-xs text-rose-500 font-medium mt-2">Due {new Date(a.dueDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-sm font-bold text-emerald-600 flex items-center"><CheckCircle2 size={18} className="mr-2" /> All assignments complete!</p>
                </div>
              )}
            </BentoCard>

            {/* 5. Fees Card (Span 1x1) */}
            <BentoCard className={`group ${pendingFee ? 'border-orange-200 bg-orange-50/30' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${pendingFee ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}><CreditCard size={24} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financials</span>
              </div>
              {pendingFee ? (
                <>
                  <h3 className={`${instrumentSerif.className} text-4xl text-orange-600 mb-1`}>${pendingFee.amount.toLocaleString()}</h3>
                  <p className="text-xs font-bold text-orange-500 mb-4 line-clamp-1">{pendingFee.title}</p>
                  <a href="/payments" className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center block transition-colors">
                    Pay Now
                  </a>
                </>
              ) : (
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-[#1E1B4B] mb-1">Settled</h3>
                  <p className="text-sm text-gray-500">No pending dues.</p>
                </div>
              )}
            </BentoCard>

            {/* 6. Quick Stats (Span 1x1) */}
            <BentoCard>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><CheckCircle2 size={24} /></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attendance</span>
              </div>
              <h3 className={`${instrumentSerif.className} text-5xl text-[#1E1B4B] mb-2`}>94<span className="text-3xl text-gray-400">%</span></h3>
              <p className="text-sm font-medium text-gray-500">Excellent standing.</p>
            </BentoCard>

          </div>
        </div>
      </main>
    </div>
  );
}