"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, CreditCard, Award, Calendar, Settings, Menu, X, Upload, CheckCircle2, Sparkles, Link as LinkIcon } from 'lucide-react';
import { UploadDropzone } from "@/lib/uploadthing";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; background-color: #0c0c0c; color: white; }
.liquid-glass { background: rgba(255,255,255,0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
.liquid-glass::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
`;

const FUN_FACTS = ["Bananas are curved because they grow towards the sun.", "A day on Venus is longer than a year on Venus.", "Octopuses have three hearts and blue blood.", "The shortest war in history lasted just 38 minutes."];

export default function AssignmentsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fact, setFact] = useState("");

  // NEW: States for the submission modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Reusable fetch function so we can refresh the data after submitting!
  const fetchData = () => {
    fetch('/api/student/dashboard', { headers: { 'Cache-Control': 'no-cache, no-store' } })
      .then(res => res.json())
      .then(json => { 
        if(json.success) setStudentData(json.data); 
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    fetchData();
  }, []);

  // NEW: Function to handle the actual submission to your database
  const handleSubmission = async (fileUrl: string) => {
    if (!fileUrl) return alert("Please provide a file or link.");
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/student/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignmentId: selectedAssignmentId, 
          fileUrl: fileUrl 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsSubmitModalOpen(false);
        setSelectedAssignmentId(null);
        setLinkInput("");
        fetchData(); // Refresh the assignments list instantly!
      } else {
        alert("Failed to submit: " + data.error);
      }
    } catch (error) {
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !studentData) return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="absolute inset-0 z-0"><video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 blur-sm" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" /></div>
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <img src="/logo.png" alt="Sunshine Logo" className="w-12 h-12 object-contain mb-6 animate-pulse" />
        <div className="w-8 h-8 border-2 border-[#00d2ff]/30 border-t-[#00d2ff] rounded-full animate-spin mb-8" />
        <span className="text-[10px] font-bold tracking-widest text-[#00d2ff] uppercase mb-3">Did you know?</span>
        <p className="text-white/80 text-sm font-medium">"{fact}"</p>
      </div>
    </div>
  );

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Award, label: 'Transcripts', href: '/academics' },
    { icon: CreditCard, label: 'Financials', href: '/fees' },
    { icon: BookOpen, label: 'Assignments', active: true, href: '/assignments' },
    { icon: Calendar, label: 'Schedule', href: '/attendance' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.25]" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed z-50 h-screen transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-72 border-r border-white/5 bg-[#0c0c0c]/95 backdrop-blur-3xl flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white">Sunshine<span className="text-white/40 font-medium"> Portal</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50"><X size={18} /></button>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item, idx) => (
              <button key={idx} onClick={() => window.location.href = item.href} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><item.icon size={18} /> <span>{item.label}</span></button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-6 md:p-10 scroll-smooth">
        <div className="flex items-center justify-between mb-8 md:mb-12 sticky top-0 z-30 pt-4 pb-4 bg-[#0c0c0c]/80 backdrop-blur-xl -mx-6 px-6 md:-mx-10 md:px-10 border-b border-white/5">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]"><Menu size={18} /></button>
             <span className="font-semibold text-sm tracking-wide hidden sm:block text-white/80">Assignments</span>
           </div>
           <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-2">Active Tasks.</h1>
            <p className="text-white/50 text-sm font-medium">Submit and track your coursework securely.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {studentData.class?.assignments?.length > 0 ? studentData.class.assignments.map((a: any, i: number) => {
               const isSubmitted = a.submissions?.some((sub: any) => sub.studentId === studentData.id);
               return (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }} key={i} className="liquid-glass rounded-3xl p-8 flex flex-col justify-between hover:bg-white/[0.04] transition-colors group">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-bold text-[#A4F4FD] bg-[#A4F4FD]/10 border border-[#A4F4FD]/20 px-3 py-1.5 rounded-full uppercase tracking-widest">{a.subject}</span>
                        {isSubmitted && <span className="text-[10px] font-bold text-[#28c840] bg-[#28c840]/10 border border-[#28c840]/20 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12}/> Done</span>}
                      </div>
                      <h3 className="font-bold text-2xl mb-3 text-white tracking-tight">{a.title}</h3>
                      <p className="text-white/50 text-sm mb-8 leading-relaxed">{a.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 pt-6 gap-4">
                      <span className="text-xs font-medium text-white/40 flex items-center gap-1.5"><Calendar size={14}/> Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                      
                      {/* NEW: Updated onClick to open the modal */}
                      <button 
                        onClick={() => { setSelectedAssignmentId(a.id); setIsSubmitModalOpen(true); }}
                        disabled={isSubmitted} 
                        className={`w-full sm:w-auto rounded-full px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${isSubmitted ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' : 'bg-white text-black hover:bg-white/90 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                      >
                        {!isSubmitted && <Upload size={16} />}
                        <span>{isSubmitted ? 'Task Completed' : 'Submit Work'}</span>
                      </button>
                    </div>
                 </motion.div>
               )
             }) : (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 liquid-glass rounded-3xl p-16 text-center">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10"><Sparkles size={32} className="text-white/40" /></div>
                 <h3 className="text-xl font-bold text-white mb-1">Clear Horizon</h3>
                 <p className="text-sm font-medium text-white/50">No assignments posted for your class yet.</p>
               </motion.div>
             )}
          </div>
        </div>
      </main>

      {/* NEW: The Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2ff]/10 blur-3xl rounded-full -z-10" />
              
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white tracking-tight">Submit Work</h3>
                <button onClick={() => { setIsSubmitModalOpen(false); setLinkInput(''); }} className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Option 1: File Upload */}
                <div>
                  <label className="block text-xs font-bold text-[#00d2ff] uppercase tracking-widest mb-3">Option 1: File Upload</label>
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
                    <UploadDropzone
                      endpoint="timetableUploader" // Reusing this endpoint as it accepts PDFs and Images!
                      onClientUploadComplete={(res) => handleSubmission(res[0].url)}
                      onUploadError={(error: Error) => alert(`Upload Failed: ${error.message}`)}
                      appearance={{
                        container: "border-dashed border-white/20 hover:border-[#00d2ff]/50 transition-colors p-4",
                        uploadIcon: "text-[#00d2ff] h-6 w-6 mb-2",
                        label: "text-white/80 text-sm hover:text-[#00d2ff]",
                        button: "bg-[#00d2ff] text-black font-bold hover:bg-[#00d2ff]/90 w-full mt-4"
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-white/30 font-bold uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>

                {/* Option 2: Paste Link */}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmission(linkInput); }}>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Option 2: Paste URL (Google Drive, Docs, etc.)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                        <LinkIcon size={16} />
                      </div>
                      <input 
                        type="url" 
                        required 
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        placeholder="https://docs.google.com/..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00d2ff]/50 transition-colors placeholder:text-white/20"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !linkInput}
                      className="px-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? '...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}