"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Menu, X, Zap } from 'lucide-react';
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
        <mesh position={[5, 3, -5]} scale={2.5}><sphereGeometry args={[1, 64, 64]} /><meshPhysicalMaterial transmission={0.9} opacity={1} roughness={0.1} ior={1.5} thickness={2} color="#ffffff" /></mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[-6, -3, -8]} scale={3.5}><sphereGeometry args={[1, 64, 64]} /><MeshDistortMaterial color="#FDF8E1" distort={0.3} speed={2} roughness={0.1} metalness={0.1} /></mesh>
      </Float>
      <Environment preset="city" />
    </Canvas>
  </div>
);

export default function FeesPage() {
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
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6" />
      <p className={`${instrumentSerif.className} text-4xl animate-pulse italic`}>Loading Financials...</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${inter.className} text-[#1E1B4B] bg-[#F9F8FC] relative overflow-hidden flex flex-col`}>
      <FloatingCrystals />
      
      {/* Sidebar Overlay */}
      <div className={`fixed inset-0 bg-[#1E1B4B]/20 backdrop-blur-sm z-40 transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
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
              { icon: CreditCard, label: 'Financials', active: true, href: '/fees' },
              { icon: BookOpen, label: 'Assignments', href: '/assignments' },
              { icon: Calendar, label: 'Schedule', href: '/attendance' },
              { icon: Settings, label: 'Settings', href: '/settings' },
            ].map((item, i) => (
                <button key={i} onClick={() => window.location.href = item.href} className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl font-medium transition-all ${item.active ? 'bg-[#1E1B4B] text-white shadow-md' : 'hover:bg-white text-gray-600'}`}>
                    <item.icon size={20} /> <span>{item.label}</span>
                </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] px-5 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl bg-white border border-gray-100 hover:bg-purple-50 transition-colors shadow-sm"><Menu size={20} /></button>
            <span className="hidden sm:inline font-semibold text-gray-500 uppercase tracking-wider text-sm">Financials</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#1E1B4B] text-white flex items-center justify-center font-bold shadow-md">{studentData.firstName[0]}</div>
        </header>

        <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className={`${instrumentSerif.className} text-4xl sm:text-5xl text-[#1E1B4B] mb-8`}>Pending Dues</h2>
            
            {studentData.fees?.filter((f:any) => f.status === 'PENDING').length > 0 ? (
                <div className="space-y-4">
                  {studentData.fees?.filter((f:any) => f.status === 'PENDING').map((f:any, i:number) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-6 bg-white border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all gap-4">
                        <div>
                          <p className="font-bold text-lg text-[#1E1B4B]">{f.title}</p>
                          <p className="text-sm text-gray-500">Due: {new Date(f.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-6">
                          <p className={`${instrumentSerif.className} text-4xl text-orange-600 font-bold`}>${f.amount.toLocaleString()}</p>
                          <button onClick={() => window.location.href = '/payments'} className="bg-[#1E1B4B] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#312E81] transition-colors whitespace-nowrap">Pay Now</button>
                        </div>
                    </div>
                  ))}
                </div>
            ) : (
                <div className="p-10 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CreditCard size={48} className="mx-auto mb-4 text-emerald-400" />
                  <p className="text-xl font-bold text-emerald-700">All Clear!</p>
                  <p className="text-emerald-600">You have no pending invoices.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}