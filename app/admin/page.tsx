"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, Search, Download, UploadCloud, Plus, X, 
  LayoutDashboard, BookOpen, Settings, LogOut, ShieldCheck, Mail, Lock,
  MoreHorizontal, CreditCard, Award, ChevronRight, Calendar, Clock, CheckSquare,
  Trash2, Edit2, Save
} from 'lucide-react';
import { UploadButton } from "@/lib/uploadthing";

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);
  
  // --- FORM STATES ---
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'fees' | 'results' | 'attendance'>('details');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', enrollmentNo: '', gradeLevel: '', section: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', 
    rollNo: '', gradeLevel: '10th', section: 'A', className: ''
  });
  
  const [timetableForm, setTimetableForm] = useState({ className: '' });
  
  const [scheduleForm, setScheduleForm] = useState({
    className: '', dayOfWeek: 'Monday', subject: '', room: '', startTime: '09:00', endTime: '10:00'
  });
  
  const [feeForm, setFeeForm] = useState({ title: '', amount: '', dueDate: '' });
  const [resultForm, setResultForm] = useState({ examName: 'Mid-Term 2026', subject: '', marksObtained: '', totalMarks: '100', grade: '', remarks: '' });

  // NEW: Attendance Form State
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: 'Overall',
    status: 'PRESENT',
    remarks: ''
  });

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
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/classes/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleForm),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully added ${scheduleForm.subject} to ${scheduleForm.className}!`);
        setScheduleForm(prev => ({ ...prev, subject: '', room: '', startTime: prev.endTime, endTime: '' }));
      } else alert(`Failed: ${data.error}`);
    } catch (error) {
      alert("A network error occurred.");
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

  // NEW: Handle Marking Attendance
  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...attendanceForm, studentId: selectedStudent.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Attendance marked as ${attendanceForm.status}!`);
        fetchStudents(); // Automatically refresh data to show in history
        setAttendanceForm(prev => ({ ...prev, remarks: '' }));
      } else alert(`Failed to mark attendance: ${data.error}`);
    } catch (error) {
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        alert("Student profile updated!");
        setIsEditingProfile(false);
        fetchStudents();
        setSelectedStudent({ ...selectedStudent, ...editForm });
      } else alert(`Update failed: ${data.error}`);
    } catch (error) {
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!confirm(`Are you absolutely sure you want to permanently delete ${selectedStudent.firstName}? This will erase all fees, results, and attendance.`)) return;
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert("Student permanently deleted.");
        setIsActionPanelOpen(false);
        fetchStudents();
      } else alert(`Delete failed: ${data.error}`);
    } catch (error) {
      alert("Network error.");
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

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

      <main className="flex-1 overflow-y-auto z-10 p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Student Directory</h1>
              <p className="text-gray-400">Manage student profiles, enrollments, and schedules.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              
              <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-white shadow-lg"
              >
                <Clock size={16} className="text-purple-400" />
                <span>Build Schedule</span>
              </button>

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
                              setEditForm({
                                firstName: student.firstName,
                                lastName: student.lastName,
                                enrollmentNo: student.enrollmentNo,
                                gradeLevel: student.gradeLevel,
                                section: student.section
                              });
                              setIsEditingProfile(false);
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

      {/* Schedule Builder Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Clock className="mr-2 text-purple-400" size={20} /> Build Daily Schedule
              </h2>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddSchedule} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Class Name *</label>
                  <input type="text" required value={scheduleForm.className} onChange={(e) => setScheduleForm({...scheduleForm, className: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" placeholder="e.g. 10-A" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Day of Week *</label>
                  <select required value={scheduleForm.dayOfWeek} onChange={(e) => setScheduleForm({...scheduleForm, dayOfWeek: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none appearance-none cursor-pointer">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Subject *</label>
                  <input type="text" required value={scheduleForm.subject} onChange={(e) => setScheduleForm({...scheduleForm, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" placeholder="e.g. Physics" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Room/Lab</label>
                  <input type="text" value={scheduleForm.room} onChange={(e) => setScheduleForm({...scheduleForm, room: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" placeholder="e.g. Room 302" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">Start Time (24H) *</label>
                  <input type="time" required value={scheduleForm.startTime} onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase">End Time (24H) *</label>
                  <input type="time" required value={scheduleForm.endTime} onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500/50 outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Done</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all shadow-lg flex items-center disabled:opacity-50">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                  Add Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Modals (Add Student, Upload Timetable) */}
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
                      
                      const fileUrl = res[0].url;
                      
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

          {/* ACTION PANEL TABS */}
          <div className="flex px-6 pt-4 space-x-6 border-b border-white/10 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('details')} className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'details' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Overview</button>
            <button onClick={() => setActiveTab('fees')} className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'fees' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Fees</button>
            <button onClick={() => setActiveTab('results')} className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'results' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Results</button>
            
            {/* NEW ATTENDANCE TAB */}
            <button onClick={() => setActiveTab('attendance')} className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'attendance' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-400 hover:text-white'}`}>Attendance</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Profile Details</h3>
                  <div className="flex space-x-2">
                    {isEditingProfile ? (
                      <button onClick={handleUpdateStudent} disabled={isSubmitting} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
                        <Save size={14} /> <span>Save</span>
                      </button>
                    ) : (
                      <button onClick={() => setIsEditingProfile(true)} className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors">
                        <Edit2 size={14} /> <span>Edit</span>
                      </button>
                    )}
                    <button onClick={handleDeleteStudent} className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-medium rounded-lg transition-colors">
                      <Trash2 size={14} /> <span>Delete</span>
                    </button>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                        <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                        <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Enrollment No</label>
                      <input type="text" value={editForm.enrollmentNo} onChange={e => setEditForm({...editForm, enrollmentNo: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-emerald-500 font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Grade</label>
                        <input type="text" value={editForm.gradeLevel} onChange={e => setEditForm({...editForm, gradeLevel: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Section</label>
                        <input type="text" value={editForm.section} onChange={e => setEditForm({...editForm, section: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-emerald-500" />
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Class Assignment</p>
                      <p className="font-medium text-white">{selectedStudent.class?.name || selectedStudent.gradeLevel}</p>
                      <p className="text-sm text-gray-400">Section {selectedStudent.section}</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Linked Account</p>
                      <div className="flex items-center space-x-2"><Mail size={14} className="text-gray-400" /><p className="font-medium text-white">{selectedStudent.user?.email || 'No email registered'}</p></div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-8 animate-in fade-in">
                <form onSubmit={(e) => { handleAssignFee(e); setTimeout(fetchStudents, 500); }} className="space-y-5 bg-black/30 p-5 rounded-2xl border border-white/5">
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

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center"><CreditCard size={14} className="mr-2" /> Fee History</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedStudent.fees?.length > 0 ? (
                      selectedStudent.fees.map((fee: any) => (
                        <div key={fee.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <p className="text-sm font-medium text-white">{fee.title}</p>
                            <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">${fee.amount}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${fee.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{fee.status}</span>
                          </div>
                        </div>
                      ))
                    ) : <p className="text-xs text-gray-500 italic">No fees recorded.</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-8 animate-in fade-in">
                <form onSubmit={(e) => { handlePublishResult(e); setTimeout(fetchStudents, 500); }} className="space-y-5 bg-black/30 p-5 rounded-2xl border border-white/5">
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

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center"><Award size={14} className="mr-2" /> Academic Records</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedStudent.results?.length > 0 ? (
                      selectedStudent.results.map((res: any) => (
                        <div key={res.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <p className="text-sm font-medium text-white">{res.subject}</p>
                            <p className="text-xs text-gray-500">{res.examName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">{res.marksObtained}/{res.totalMarks}</p>
                            <p className="text-xs font-medium text-emerald-400">Grade {res.grade}</p>
                          </div>
                        </div>
                      ))
                    ) : <p className="text-xs text-gray-500 italic">No results recorded.</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-8 animate-in fade-in">
                <form onSubmit={handleMarkAttendance} className="space-y-5 bg-black/30 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center space-x-2 text-orange-400 mb-2">
                    <CheckSquare size={18} /><h3 className="font-semibold">Mark Attendance</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400 uppercase">Date *</label>
                      <input type="date" required value={attendanceForm.date} onChange={e => setAttendanceForm({...attendanceForm, date: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:border-orange-500/50 outline-none text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400 uppercase">Subject</label>
                      <input type="text" required value={attendanceForm.subject} onChange={e => setAttendanceForm({...attendanceForm, subject: e.target.value})} placeholder="e.g. Overall, Physics" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:border-orange-500/50 outline-none text-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Status *</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button type="button" onClick={() => setAttendanceForm({...attendanceForm, status: 'PRESENT'})} className={`py-2 rounded-xl border text-sm font-medium transition-all ${attendanceForm.status === 'PRESENT' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-black/50 border-white/10 text-gray-400 hover:bg-white/5'}`}>Present</button>
                      <button type="button" onClick={() => setAttendanceForm({...attendanceForm, status: 'LATE'})} className={`py-2 rounded-xl border text-sm font-medium transition-all ${attendanceForm.status === 'LATE' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-black/50 border-white/10 text-gray-400 hover:bg-white/5'}`}>Late</button>
                      <button type="button" onClick={() => setAttendanceForm({...attendanceForm, status: 'ABSENT'})} className={`py-2 rounded-xl border text-sm font-medium transition-all ${attendanceForm.status === 'ABSENT' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-black/50 border-white/10 text-gray-400 hover:bg-white/5'}`}>Absent</button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Remarks (Optional)</label>
                    <input type="text" value={attendanceForm.remarks} onChange={e => setAttendanceForm({...attendanceForm, remarks: e.target.value})} placeholder="e.g. Doctor's appointment" className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-white focus:border-orange-500/50 outline-none text-sm" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center justify-center disabled:opacity-50">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <CheckSquare size={16} className="mr-2" />}
                    Save Attendance
                  </button>
                </form>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center"><CheckSquare size={14} className="mr-2" /> Recent Attendance</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedStudent.attendance?.length > 0 ? (
                      selectedStudent.attendance.map((att: any) => (
                        <div key={att.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <p className="text-sm font-medium text-white">{new Date(att.date).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">{att.subject}</p>
                          </div>
                          <div>
                            <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase ${
                              att.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : 
                              att.status === 'LATE' ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-rose-500/20 text-rose-400'
                            }`}>{att.status}</span>
                          </div>
                        </div>
                      ))
                    ) : <p className="text-xs text-gray-500 italic">No attendance recorded.</p>}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}