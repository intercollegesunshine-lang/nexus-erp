"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Bell, Menu, X, Zap, LogOut, FileText } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Instrument_Serif, Inter } from 'next/font/google';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'], style: ['normal', 'italic'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const FloatingCrystals = () => (
  <div className="fixed inset-0 z-0 bg-[#F9F8FC]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/50 via-[#F9F8FC] to-amber-50/50" />
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
      <directionalLight position={[0, -10, 0]} intensity={1.5} color="#f59e0b" />
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[5, 3, -5]} scale={2.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial transmission={0.9} opacity={1} roughness={0.1} ior={1.5} thickness={2} color="#ffffff" />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-6, -3, -8]} scale={3.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial color="#FDF8E1" distort={0.3} speed={2} roughness={0.1} metalness={0.1} />
        </mesh>
      </Float>
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

export default function AcademicsPage() {
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
    <div className="min-h-screen bg-[#F9F8FC] flex flex-col items-center justify-center text-[#1E1B4B] w-full h-full absolute inset-0">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6 shadow-xl" />
      <p className={`${instrumentSerif.className} text-4xl animate-pulse italic tracking-wide`}>Loading Transcripts...</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${inter.className} text-[#1E1B4B] font-sans selection:bg-purple-200 overflow-hidden flex flex-col w-full relative bg-[#F9F8FC]`}>
      <FloatingCrystals />
      
      {/* Sidebar Overlay (Closes sidebar on click) */}
      <div 
        className={`fixed inset-0 bg-[#1E1B4B]/20 backdrop-blur-sm z-40 transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar Drawer */}
      <aside className={`fixed z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] top-4 bottom-4 left-4 w-72 rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-3xl shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} flex flex-col justify-between`}>
        <div>
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center"><Zap size={20} className="text-white" /></div>
              <span className={`${instrumentSerif.className} text-2xl tracking-tight text-[#1E1B4B] leading-none mt-1`}>Sunshine<br/><span className="text-[#1E1B4B]/60 text-sm italic font-sans tracking-widest uppercase">Portal</span></span>
            </div>
            {/* CLOSE BUTTON */}
            <button onClick={() => setSidebarOpen(false)} className="p-2.5 rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-rose-500 shadow-sm transition-all border border-gray-100"><X size={20} /></button>
          </div>
          <nav className="px-6 py-2 space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
              { icon: Award, label: 'Transcripts', active: true, href: '/academics' },
              { icon: CreditCard, label: 'Financials', href: '/fees' },
              { icon: BookOpen, label: 'Assignments', href: '/assignments' },
              { icon: Calendar, label: 'Schedule', href: '/attendance' },
              { icon: Settings, label: 'Settings', href: '/settings' },
            ].map((item, i) => (
                <button key={i} onClick={() => window.location.href = item.href} className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group font-medium ${item.active ? 'bg-[#1E1B4B] text-white shadow-md' : 'text-[#1E1B4B]/70 hover:bg-white hover:text-[#1E1B4B] hover:shadow-sm'}`}>
                    <item.icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.active ? 'text-white' : ''}`} /> <span>{item.label}</span>
                </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        <header className="sticky top-6 z-30 mx-6 sm:mx-10 max-w-7xl xl:mx-auto bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center space-x-4">
            {/* OPEN BUTTON */}
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl bg-white border border-gray-100 text-[#1E1B4B] hover:bg-purple-50 hover:text-purple-700 transition-colors shadow-sm"><Menu size={20} /></button>
            <div className="hidden sm:flex items-center space-x-2 text-sm font-semibold text-[#1E1B4B]/60 tracking-wider uppercase"><span>Academic Results</span></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1E1B4B] text-white flex items-center justify-center font-bold text-sm shadow-md">{studentData.firstName[0]}</div>
          </div>
        </header>

        <div className="p-6 sm:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] text-white border border-transparent rounded-[2rem] p-10 mb-8 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h1 className={`${instrumentSerif.className} text-5xl sm:text-6xl tracking-tight mb-2 relative z-10`}>Transcripts</h1>
             <p className="text-white/70 font-medium relative z-10">Your complete academic history and examination results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {studentData.results?.length > 0 ? studentData.results.map((exam: any, i: number) => (
             <div key={i} className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-7 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl shadow-sm ${exam.marksObtained >= 90 ? 'bg-emerald-50 text-emerald-600' : exam.marksObtained >= 80 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1E1B4B]">{exam.subject}</h3>
                    <p className="text-gray-500 text-sm">{exam.examName}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className={`${instrumentSerif.className} text-4xl text-[#1E1B4B]`}>{exam.marksObtained}<span className="text-xl text-gray-400">/{exam.totalMarks}</span></p>
                    <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${exam.marksObtained >= 80 ? 'text-emerald-600' : 'text-orange-600'}`}>Grade {exam.grade}</p>
                </div>
             </div>
           )) : (
             <div className="col-span-1 md:col-span-2 p-10 bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] text-center shadow-sm">
                <Award size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No academic results published yet.</p>
             </div>
           )}
          </div>
        </div>
      </main>
    </div>
  );
}