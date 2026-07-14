"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Lock, Bell, Shield, Save, 
  Smartphone, Mail, CheckCircle2, DownloadCloud,
  LayoutDashboard, Award, CreditCard, BookOpen, Calendar, Settings as SettingsIcon, Zap
} from 'lucide-react';

export default function StudentSettingsPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Form States
  const [profileData, setProfileData] = useState({ phone: '', personalEmail: '', address: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({ assignments: true, grades: true, fees: true, sms: false });
  
  // Loading States
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

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
          setProfileData({
            phone: '+1 (555) 019-2834',
            personalEmail: `${json.data.firstName.toLowerCase()}.${json.data.lastName.toLowerCase()}@gmail.com`,
            address: '123 Nexus Avenue, Tech City'
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      alert("Personal profile updated successfully!");
    }, 1000);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Button was clicked!"); // Debug log
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    
    setIsSavingPassword(true);

    try {
      const response = await fetch('/api/student/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      const result = await response.json();

      if (result.success) {
        alert("Password securely updated in the database!");
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        alert("Failed to update password: " + result.error);
      }
    } catch (error) {
      alert("A network error occurred while updating the password.");
      console.error(error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const downloadStudentData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studentData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Nexus_Data_${studentData.firstName}_${studentData.lastName}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', href: '/' },
    { icon: Award, label: 'Academic Results', href: '/academics' },
    { icon: CreditCard, label: 'Fees & Payments', href: '/fees' },
    { icon: BookOpen, label: 'Assignments', href: '/assignments' },
    { icon: Calendar, label: 'Attendance & Timetable', href: '/attendance' },
    { icon: SettingsIcon, label: 'Settings', href: '/settings', active: true },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex w-full">
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
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => window.location.href = item.href}
              className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${item.active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'} ${!isSidebarOpen && 'lg:justify-center lg:px-0'}`}
            >
              <item.icon size={22} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <button onClick={() => window.location.href = '/'} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
              </button>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
              <p className="text-gray-400">Manage your profile, security, and preferences.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Personal Info</h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">First Name</label>
                    <input type="text" disabled value={studentData.firstName} className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Last Name</label>
                    <input type="text" disabled value={studentData.lastName} className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start space-x-3">
                  <Mail className="text-blue-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm text-blue-100 font-medium">{studentData.user?.email}</p>
                    <p className="text-xs text-blue-300">Official Nexus Academy Email</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Recovery Email</label>
                  <input type="email" value={profileData.personalEmail} onChange={e => setProfileData({...profileData, personalEmail: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Mobile Number</label>
                  <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                
                <button type="submit" disabled={isSavingProfile} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4">
                  {isSavingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /><span>Update Profile</span></>}
                </button>
              </form>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                  <Lock size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Security</h2>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Current Password</label>
                  <input type="password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono tracking-widest" />
                </div>
                <div className="h-px bg-white/5 my-4" />
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">New Password</label>
                  <input type="password" required minLength={8} value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono tracking-widest" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Confirm New Password</label>
                  <input type="password" required minLength={8} value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono tracking-widest" />
                </div>

                <button type="submit" disabled={isSavingPassword || !passwords.current || !passwords.new} className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4">
                  {isSavingPassword ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Shield size={18} /><span>Update Password</span></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}