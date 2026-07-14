"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Search, Download, UploadCloud, Plus, X, 
  LayoutDashboard, BookOpen, Settings, LogOut, ShieldCheck, Mail, Lock,
  MoreHorizontal, CreditCard, Award, ChevronRight, Calendar
} from 'lucide-react';
// NEW: Import the UploadButton we just created!
import { UploadButton } from "@/lib/uploadthing";

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);
  
  // --- FORM STATES ---
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'fees' | 'results'>('details');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', 
    rollNo: '', gradeLevel: '10th', section: 'A', className: ''
  });
  
  // Notice we removed the URL input! UploadThing handles it now.
  const [timetableForm, setTimetableForm] = useState({ className: '' });
  
  const [feeForm, setFeeForm] = useState({ title: '', amount: '', dueDate: '' });
  const [resultForm, setResultForm] = useState({ examName: 'Mid-Term 2026', subject: '', marksObtained: '', totalMarks: '100', grade: '', remarks: '' });

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formPayload = new FormData();
    formPayload.append('file', file);

    try {
      const res = await fetch('/api/admin/students/bulk-upload', {
        method: 'POST',
        body: formPayload,
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully imported ${data.count} students!`);
        fetchStudents();
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/students/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Student added successfully!");
        setIsAddModalOpen(false);
        setFormData({ firstName: '', lastName: '', email: '', password: '', rollNo: '', gradeLevel: '10th', section: 'A', className: '' });
        fetchStudents();
      } else alert(`Failed to add student: ${data.error}`);
    } catch (error) {
      alert("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/fees/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...feeForm, studentId: selectedStudent.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Fee assigned to student!");
        setFeeForm({ title: '', amount: '', dueDate: '' });
      } else alert(`Failed to assign fee: ${data.error}`);
    } catch (error) {
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/results/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resultForm, studentId: selectedStudent.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Result published successfully!");
        setResultForm({ examName: 'Mid-Term 2026', subject: '', marksObtained: '', totalMarks: '100', grade: '', remarks: '' });
      } else alert(`Failed to publish result: ${data.error}`);
    } catch (error) {
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col z-20 hidden md:flex">
        <div className="p-6 flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Nexus<span className="text-emerald-400 font-light">Admin</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users size={22} /> <span className="font-medium">Student Directory</span>
          </button>
          <button className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <LayoutDashboard size={22} /> <span className="font-medium">Academics & Fees</span>
          </button>
          <button className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Settings size={22} /> <span className="font-medium">System Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto z-10 p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Action Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Student Directory</h1>
              <p className="text-gray-400">Manage student profiles, enrollments, and bulk actions.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              
              <button 
                onClick={() => setIsTimetableModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-white shadow-lg"
              >
                <Calendar size={16} className="text-blue-400" />
                <span>Upload Timetable</span>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-white shadow-lg"
              >
                {isUploading ? <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /> : <UploadCloud size={16} />}
                <span>{isUploading ? 'Importing...' : 'Bulk Upload'}</span>
              </button>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Plus size={16} /> <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                    <th className="p-4 font-medium">Roll No</th>
                    <th className="p-4 font-medium">Student Name</th>
                    <th className="p-4 font-medium">Class / Grade</th>
                    <th className="p-4 font-medium">Email Account</th>
                    <th className="p-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoadingStudents ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
                        Loading Database...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        <Users size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No students found. Use the buttons above to add some!</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <span className="font-mono text-sm text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                            {student.enrollmentNo}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=047857&color=fff`} 
                              className="w-8 h-8 rounded-full"
                              alt="avatar" 
                            />
                            <span className="font-medium text-white">{student.firstName} {student.lastName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-300">{student.class?.name || student.gradeLevel}</span>
                          <span className="text-gray-500 text-sm ml-1">Sec {student.section}</span>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {student.user?.email || 'No Linked Account'}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              setActiveTab('details');
                              setIsActionPanelOpen(true);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Plus className="mr-2 text-emerald-400" size={20} /> Register New Student
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleManualSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">First Name *</label>
                  <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Last Name</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500/50 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500/50 outline-none" placeholder="nexus123" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Roll No *</label>
                  <input type="text" required value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Grade</label>
                  <input type="text" value={formData.gradeLevel} onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Section</label>
                  <input type="text" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase">Class Name</label>
                <input type="text" value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-emerald-500/50 outline-none" placeholder="e.g. 10-A" />
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all shadow-lg flex items-center disabled:opacity-50">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Creating...' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Calendar className="mr-2 text-blue-400" size={20} /> Upload Timetable (Cloud)
              </h2>
              <button onClick={() => setIsTimetableModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase">Class Name *</label>
                <input 
                  type="text" 
                  required 
                  value={timetableForm.className} 
                  onChange={(e) => setTimetableForm({ className: e.target.value })} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" 
                  placeholder="e.g. 10-A" 
                />
                <p className="text-xs text-gray-500 mt-1">Make sure you type the class name before uploading.</p>
              </div>

              {/* NEW: UploadThing React Component! */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase">Timetable File (PDF or Image)</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex justify-center bg-black/20 hover:bg-black/40 transition-colors">
                  <UploadButton
                    endpoint="timetableUploader"
                    onClientUploadComplete={async (res) => {
                      if (!timetableForm.className) {
                         alert("Please enter a Class Name before uploading!");
                         return;
                      }
                      
                      // 1. Get the secure Cloud URL
                      const fileUrl = res[0].url;
                      
                      // 2. Send it to our backend to save in the Database
                      try {
                        const apiRes = await fetch('/api/admin/classes/timetable', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            className: timetableForm.className, 
                            timetableUrl: fileUrl 
                          }),
                        });
                        const data = await apiRes.json();
                        if (data.success) {
                          alert("Timetable securely uploaded and linked to class!");
                          setIsTimetableModalOpen(false);
                          setTimetableForm({ className: '' });
                        } else {
                          alert(`Database Error: ${data.error}`);
                        }
                      } catch (err) {
                        alert("Failed to save to database.");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Upload Failed: ${error.message}`);
                    }}
                    appearance={{
                       button: "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-8",
                       allowedContent: "text-gray-400 text-xs mt-2"
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {isActionPanelOpen && selectedStudent && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#111111]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
              <p className="text-sm text-emerald-400 font-mono">{selectedStudent.enrollmentNo}</p>
            </div>
            <button onClick={() => setIsActionPanelOpen(false)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex px-6 pt-4 space-x-6 border-b border-white/10">
            <button onClick={() => setActiveTab('details')} className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'details' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Overview</button>
            <button onClick={() => setActiveTab('fees')} className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'fees' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Assign Fees</button>
            <button onClick={() => setActiveTab('results')} className={`pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'results' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Publish Results</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Class Assignment</p>
                  <p className="font-medium text-white">{selectedStudent.class?.name || selectedStudent.gradeLevel}</p>
                  <p className="text-sm text-gray-400">Section {selectedStudent.section}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Linked Account</p>
                  <div className="flex items-center space-x-2"><Mail size={14} className="text-gray-400" /><p className="font-medium text-white">{selectedStudent.user?.email || 'No email registered'}</p></div>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <form onSubmit={handleAssignFee} className="space-y-5">
                <div className="flex items-center space-x-2 text-blue-400 mb-2"><CreditCard size={18} /><h3 className="font-semibold">Generate Invoice</h3></div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Invoice Title</label>
                  <input type="text" required value={feeForm.title} onChange={e => setFeeForm({...feeForm, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Amount ($)</label>
                  <input type="number" step="0.01" required value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Due Date</label>
                  <input type="date" required value={feeForm.dueDate} onChange={e => setFeeForm({...feeForm, dueDate: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500/50 outline-none" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                  Assign Fee to Student
                </button>
              </form>
            )}

            {activeTab === 'results' && (
              <form onSubmit={handlePublishResult} className="space-y-5">
                <div className="flex items-center space-x-2 text-purple-400 mb-2"><Award size={18} /><h3 className="font-semibold">Add Academic Record</h3></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Exam Name</label>
                    <input type="text" required value={resultForm.examName} onChange={e => setResultForm({...resultForm, examName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Subject</label>
                    <input type="text" required value={resultForm.subject} onChange={e => setResultForm({...resultForm, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Scored</label>
                    <input type="number" required value={resultForm.marksObtained} onChange={e => setResultForm({...resultForm, marksObtained: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Out of</label>
                    <input type="number" required value={resultForm.totalMarks} onChange={e => setResultForm({...resultForm, totalMarks: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Grade</label>
                    <input type="text" required value={resultForm.grade} onChange={e => setResultForm({...resultForm, grade: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none font-mono" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Remarks</label>
                  <textarea value={resultForm.remarks} onChange={e => setResultForm({...resultForm, remarks: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none resize-none h-24" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center justify-center disabled:opacity-50">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                  Publish Result
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}