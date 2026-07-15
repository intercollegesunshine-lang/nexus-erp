"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Menu, X, Zap, Clock } from 'lucide-react';
import { Instrument_Serif, Inter } from 'next/font/google';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'], style: ['normal', 'italic'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const FloatingCrystals = () => (
  <div className="fixed inset-0 z-0 bg-[#F9F8FC]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-[#F9F8FC] to-amber-50/50" />
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={1.5} color="#ffffff" /><directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <Float speed={2} rotationIntensity={1} floatIntensity={2}><mesh position={[5, 3, -5]} scale={2.5}><sphereGeometry args={[1, 64, 64]} /><meshPhysicalMaterial transmission={0.9} roughness={0.1} ior={1.5} color="#ffffff" /></mesh></Float>
      <Environment preset="city" />
    </Canvas>
  </div>
);

export default function AttendancePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/dashboard').then(res => res.json()).then(json => { 
      if(json.success) setStudentData(json.data); 
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !studentData) return (
    <div className="min-h-screen bg-[#F9F8FC] flex flex-col items-center justify-center"><div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" /></div>
  );

  return (
    <div className={`min-h-screen ${inter.className} text-[#1E1B4B] bg-[#F9F8FC] relative overflow-hidden flex flex-col`}>
      <FloatingCrystals />
      
      <div className={`fixed inset-0 bg-[#1E1B4B]/20 backdrop-blur-sm z-40 transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`fixed z-50 transition-transform duration-500 ease-out top-4 bottom-4 left-4 w-72 rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-3xl shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} flex flex-col justify-between`}>
        <div>
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-3"><div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center"><Zap size={20} className="text-white" /></div><span className={`${instrumentSerif.className} text-2xl`}>Sunshine</span></div>
            <button onClick={() => setSidebarOpen(false)} className="p-2.5 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-rose-500 transition-all shadow-sm"><X size={20} /></button>
          </div>
          <nav className="px-6 py-2 space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
              { icon: Award, label: 'Transcripts', href: '/academics' },
              { icon: CreditCard, label: 'Financials', href: '/fees' },
              { icon: BookOpen, label: 'Assignments', href: '/assignments' },
              { icon: Calendar, label: 'Schedule', active: true, href: '/attendance' },
              { icon: Settings, label: 'Settings', href: '/settings' },
            ].map((item, i) => (
                <button key={i} onClick={() => window.location.href = item.href} className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl font-medium transition-all ${item.active ? 'bg-[#1E1B4B] text-white shadow-md' : 'hover:bg-white text-gray-600'}`}>
                    <item.icon size={20} /> <span>{item.label}</span>
                </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl bg-white border border-gray-100 hover:bg-purple-50 transition-colors shadow-sm"><Menu size={20} /></button>
            <span className="hidden sm:inline font-semibold text-gray-500 uppercase tracking-wider text-sm">Schedule</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#1E1B4B] text-white flex items-center justify-center font-bold shadow-md">{studentData.firstName[0]}</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Schedule */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 shadow-sm">
             <h2 className={`${instrumentSerif.className} text-4xl mb-6`}>Weekly Schedule</h2>
             {studentData.class?.schedules?.length > 0 ? (
               <div className="space-y-4">
                 {studentData.class.schedules.map((s:any, i:number) => (
                   <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                     <div className="flex items-center space-x-4">
                       <div className="bg-purple-100 text-purple-600 p-3 rounded-lg"><Clock size={20} /></div>
                       <div>
                         <p className="font-bold text-[#1E1B4B]">{s.subject}</p>
                         <p className="text-xs text-gray-500 font-medium">Room {s.room} • {s.dayOfWeek}</p>
                       </div>
                     </div>
                     <p className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{s.startTime}</p>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-500 italic">No schedule posted.</p>
             )}
          </div>

          {/* Attendance Overview */}
          <div className="bg-[#1E1B4B] text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
             <h2 className={`${instrumentSerif.className} text-4xl mb-2 relative z-10`}>Attendance</h2>
             <p className="text-white/60 text-sm mb-8 relative z-10">Your presence metrics for this semester.</p>
             
             <div className="text-center py-10">
               <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-purple-500/30 relative">
                  <div className="absolute inset-0 rounded-full border-8 border-t-emerald-400 animate-[spin_3s_linear_infinite]" />
                  <span className={`${instrumentSerif.className} text-5xl`}>94<span className="text-2xl text-white/50">%</span></span>
               </div>
               <p className="mt-6 text-emerald-400 font-bold uppercase tracking-wider text-sm">Excellent Standing</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}