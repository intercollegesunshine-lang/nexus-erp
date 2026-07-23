"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Settings, CreditCard, Search, 
  MoreVertical, Plus, Upload, Calendar, X, 
  CheckCircle2, AlertCircle, FileText, Download,
  Trash2, Edit3, ArrowRight, Clock, Zap, UploadCloud, 
  DollarSign, Award, Building, CalendarDays, BellRing, ShieldAlert, Save, Menu
} from 'lucide-react';

import { UploadDropzone } from "@/lib/uploadthing";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Directory');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // --- Data State ---
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Super Profile State ---
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState('Overview');
  const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', gradeLevel: '', section: '' });
  const [attendanceData, setAttendanceData] = useState({ date: new Date().toISOString().split('T')[0], status: 'PRESENT', subject: 'Overall' });

  // --- Assignment State ---
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', subject: '', dueDate: '', className: '' });
  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});
  const [isSubmittingGrade, setIsSubmittingGrade] = useState<string | null>(null);

  // --- Bulk Upload State ---
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  // --- Add Single Student State ---
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '', rollNo: '', className: '' });

  // --- Build Schedule State ---
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({ className: '', dayOfWeek: 'Monday', subject: '', room: '', startTime: '09:00', endTime: '10:00' });

  // --- Upload Timetable State ---
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [timetableClass, setTimetableClass] = useState('');

  // --- Academics & Fees State ---
  const [feeData, setFeeData] = useState({ studentId: '', title: '', amount: '', dueDate: '' });
  const [feeStudentSearch, setFeeStudentSearch] = useState('');
  const [isFeeSearchOpen, setIsFeeSearchOpen] = useState(false);
  const [isSubmittingFee, setIsSubmittingFee] = useState(false);

  const [resultStudentSearch, setResultStudentSearch] = useState('');
  const [isResultSearchOpen, setIsResultSearchOpen] = useState(false);
  const [resultStudentId, setResultStudentId] = useState('');
  const [resultExamName, setResultExamName] = useState('');
  const [resultSubjects, setResultSubjects] = useState([{ subject: '', marksObtained: '', totalMarks: '100', grade: '' }]);
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);

  // --- System Settings State ---
  const [settingsData, setSettingsData] = useState({
    schoolName: 'Nexus Academy',
    contactEmail: 'admin@nexus.edu',
    academicYear: '2026-2027',
    currentTerm: 'Term 1',
    emailAlerts: true,
    smsAlerts: false
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // --- Fetch Data ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, assignmentsRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/assignments')
      ]);
      
      const studentsJson = await studentsRes.json();
      const assignmentsJson = await assignmentsRes.json();
      
      if (studentsJson.success) setStudents(studentsJson.data);
      if (assignmentsJson.success) setAssignments(assignmentsJson.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Action Handlers ---
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) return;
    setIsUploadingBulk(true);
    const formData = new FormData();
    formData.append('file', bulkFile);
    try {
      const res = await fetch('/api/admin/students/bulk-upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        alert(`Success! Imported ${json.count} students.`);
        setIsBulkUploadModalOpen(false);
        setBulkFile(null);
        fetchData(); 
      } else alert("Upload failed: " + json.error);
    } catch (err) {
      alert("A network error occurred.");
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/students/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (data.success) {
        alert("Student added successfully!");
        setIsAddStudentModalOpen(false);
        setNewStudent({ firstName: '', lastName: '', email: '', rollNo: '', className: '' });
        fetchData();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  const handleBuildSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/classes/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Schedule updated!");
        setIsScheduleModalOpen(false);
        setScheduleData({ className: '', dayOfWeek: 'Monday', subject: '', room: '', startTime: '09:00', endTime: '10:00' });
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  const handleTimetableUploadComplete = async (url: string) => {
    if (!timetableClass) {
      alert("Please enter a class name first!");
      return;
    }
    try {
      const res = await fetch('/api/admin/classes/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: timetableClass, timetableUrl: url })
      });
      const data = await res.json();
      if (data.success) {
        alert("Timetable PDF linked to class!");
        setIsTimetableModalOpen(false);
        setTimetableClass('');
      } else {
        alert("Database link failed: " + data.error);
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment)
      });
      const json = await res.json();
      if (json.success) {
        alert("Assignment published successfully!");
        setIsAssignmentModalOpen(false);
        setNewAssignment({ title: '', description: '', subject: '', dueDate: '', className: '' });
        fetchData(); 
      } else alert("Error: " + json.error);
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  const handleSaveGrade = async (submissionId: string) => {
    const grade = gradeInputs[submissionId];
    if (!grade) { alert("Please enter a grade."); return; }
    setIsSubmittingGrade(submissionId);
    try {
      const response = await fetch('/api/admin/grades/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, grade })
      });
      const json = await response.json();
      if (json.success) {
        alert("Grade saved successfully!");
        fetchData();
      } else alert("Failed to save: " + json.error);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingGrade(null);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Delete this student? All records will be lost.")) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { setIsProfileOpen(false); fetchData(); }
    } catch (error) { console.error(error); }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated!");
        fetchData();
        setSelectedStudent({ ...selectedStudent, ...editFormData });
      }
    } catch (error) { console.error(error); }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent.id, ...attendanceData })
      });
      const data = await res.json();
      if (data.success) { alert("Attendance marked!"); fetchData(); }
    } catch (error) { console.error(error); }
  };

  const [editingRecord, setEditingRecord] = useState<{id: string, type: string} | null>(null);
  const [editRecordData, setEditRecordData] = useState<any>({});
  const [isMarkingPaid, setIsMarkingPaid] = useState<string | null>(null);

  const handleMarkFeePaidCash = async (invoiceId: string) => {
    if (!confirm("Confirm you have received CASH for this invoice?")) return;
    setIsMarkingPaid(invoiceId);
    try {
      const res = await fetch('/api/admin/fees/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });
      const data = await res.json();
      if (data.success) {
        alert("Invoice marked as PAID (Cash). Receipt generated.");
        const updatedProfileRes = await fetch('/api/admin/students');
        const studentsData = await updatedProfileRes.json();
        if (studentsData.success) {
           setStudents(studentsData.data);
           const updated = studentsData.data.find((s:any) => s.id === selectedStudent.id);
           if (updated) setSelectedStudent(updated);
        }
      } else {
        alert("Failed to mark as paid: " + data.error);
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setIsMarkingPaid(null);
    }
  };

  const handleSaveEditedRecord = async (type: 'fee' | 'result' | 'attendance') => {
    try {
      const res = await fetch(`/api/admin/records/${type}/${editingRecord!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRecordData)
      });
      const data = await res.json();
      
      if (data.success) {
        setEditingRecord(null);
        const updatedProfileRes = await fetch('/api/admin/students');
        const studentsData = await updatedProfileRes.json();
        if (studentsData.success) {
           setStudents(studentsData.data);
           const updated = studentsData.data.find((s:any) => s.id === selectedStudent.id);
           if (updated) setSelectedStudent(updated);
        }
      } else {
        alert("Failed to update: " + data.error);
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  const handleDeleteRecord = async (type: 'fee' | 'result' | 'attendance' | 'schedule', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type} record? This cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/admin/records/${type}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        if (type !== 'schedule' && selectedStudent) {
            const updatedProfileRes = await fetch('/api/admin/students');
            const studentsData = await updatedProfileRes.json();
            if (studentsData.success) {
               setStudents(studentsData.data);
               const updated = studentsData.data.find((s:any) => s.id === selectedStudent.id);
               if (updated) setSelectedStudent(updated);
            }
        } else {
           fetchData();
        }
      } else {
        alert("Failed to delete: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network error occurred.");
    }
  };

  const handleAssignFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeData.studentId) return alert("Please select a student from the dropdown!");
    setIsSubmittingFee(true);
    try {
      const res = await fetch('/api/admin/fees/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Fee Invoice pushed to student!");
        setFeeData({ studentId: '', title: '', amount: '', dueDate: '' });
        setFeeStudentSearch('');
        fetchData();
      } else alert("Error: " + data.error);
    } catch (err) {
      alert("Network error.");
    } finally {
      setIsSubmittingFee(false);
    }
  };

  const handlePublishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultStudentId) return alert("Please select a student from the dropdown!");
    if (!resultExamName) return alert("Please enter the Exam Name!");
    setIsSubmittingResult(true);
    try {
      const promises = resultSubjects.map(sub => 
        fetch('/api/admin/results/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: resultStudentId,
            examName: resultExamName,
            ...sub
          })
        })
      );
      
      await Promise.all(promises);
      
      alert("Exam Results published to transcript!");
      setResultStudentSearch('');
      setResultStudentId('');
      setResultExamName('');
      setResultSubjects([{ subject: '', marksObtained: '', totalMarks: '100', grade: '' }]);
      fetchData();
    } catch (err) {
      alert("Network error.");
    } finally {
      setIsSubmittingResult(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      alert("System configurations successfully updated!");
    }, 1000);
  };

  const openProfile = (student: any) => {
    setSelectedStudent(student);
    setEditFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      gradeLevel: student.gradeLevel,
      section: student.section
    });
    setIsProfileOpen(true);
    setProfileTab('Overview');
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside className={`
        fixed lg:relative z-40 h-screen transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 w-0 lg:w-24'} 
        bg-zinc-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Nexus<span className="text-emerald-400 font-light">Admin</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { icon: Users, label: 'Student Directory', id: 'Directory' },
            { icon: BookOpen, label: 'Assignment Manager', id: 'Assignments' },
            { icon: CreditCard, label: 'Academics & Fees', id: 'Academics' },
            { icon: Settings, label: 'System Settings', id: 'Settings' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                ${activeTab === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                ${!isSidebarOpen && 'lg:justify-center lg:px-0'}
              `}
            >
              <item.icon size={22} className={`shrink-0 transition-transform duration-300 group-hover:scale-110`} />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'lg:w-0 lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth bg-gradient-to-br from-black via-zinc-950 to-black">
        
        {!isSidebarOpen && (
           <div className="lg:hidden p-4 sticky top-0 z-20 bg-black/40 backdrop-blur-md border-b border-white/10">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                <Menu size={20} />
              </button>
           </div>
        )}

        {/* --- Directory Tab --- */}
        {activeTab === 'Directory' && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Student Directory</h1>
                <p className="text-gray-400 text-sm sm:text-base">Manage student profiles, enrollments, and schedules.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => setIsTimetableModalOpen(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium shadow-lg shadow-blue-500/20 w-full sm:w-auto justify-center"
                >
                  <Calendar size={16} /> <span>Upload Timetable</span>
                </button>
                <button 
                  onClick={() => setIsBulkUploadModalOpen(true)} 
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
                >
                  <Upload size={16} /> <span>Bulk Upload</span>
                </button>
                <button 
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium shadow-lg shadow-emerald-500/20 w-full sm:w-auto justify-center mt-2 sm:mt-0"
                >
                  <Plus size={16} /> <span>Add Student</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                      <th className="p-4 font-medium">Roll No</th>
                      <th className="p-4 font-medium">Student Name</th>
                      <th className="p-4 font-medium">Class / Grade</th>
                      <th className="p-4 font-medium">Email Account</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading students...</td></tr>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student: any) => (
                        <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 font-mono text-sm text-gray-300">{student.enrollmentNo}</td>
                          <td className="p-4 font-medium text-white flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg">
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <span>{student.firstName} {student.lastName}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-400">{student.gradeLevel} - {student.section}</td>
                          <td className="p-4 text-sm text-gray-400">{student.user?.email}</td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => openProfile(student)}
                              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors inline-flex"
                            >
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-500">
                          <Users size={48} className="mx-auto mb-4 opacity-20" />
                          <p>No students found. Use the buttons above to add some!</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- Assignments Tab --- */}
        {activeTab === 'Assignments' && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Assignment Manager</h1>
                <p className="text-gray-400 text-sm sm:text-base">Create tasks and grade student submissions.</p>
              </div>
              
              <button 
                onClick={() => setIsAssignmentModalOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25 font-medium w-full sm:w-auto justify-center"
              >
                <Plus size={18} />
                <span>Create New Assignment</span>
              </button>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading assignments...</div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                  <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">No assignments have been published yet.</p>
                </div>
              ) : (
                assignments.map((assignment: any) => (
                  <div key={assignment.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-start bg-black/40 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs font-semibold tracking-wider">
                            {assignment.subject}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider">
                            Class: {assignment.class?.name || 'All'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-400">{assignment.description}</p>
                      </div>
                      <div className="sm:text-right border-t sm:border-0 border-white/10 pt-4 sm:pt-0">
                        <p className="text-3xl font-light text-white">{assignment.submissions?.length || 0}</p>
                        <p className="text-xs text-gray-500 font-medium">SUBMISSIONS</p>
                      </div>
                    </div>
                    
                    <div className="p-0 overflow-x-auto">
                      {assignment.submissions?.length > 0 ? (
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                              <th className="px-6 py-3 font-medium">Student Name</th>
                              <th className="px-6 py-3 font-medium">File / Link</th>
                              <th className="px-6 py-3 font-medium">Status</th>
                              <th className="px-6 py-3 font-medium text-right">Grade Entry</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {assignment.submissions.map((sub: any) => (
                              <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                  <p className="font-medium text-white">{sub.student.firstName} {sub.student.lastName}</p>
                                  <p className="text-xs text-gray-500">{sub.student.user.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-400 hover:text-blue-300">
                                    <FileText size={16} className="mr-2" /> View Upload
                                  </a>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sub.status === 'GRADED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                    {sub.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <input 
                                      type="text" 
                                      placeholder={sub.grade || "e.g. 95/100"}
                                      className="w-24 bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                      value={gradeInputs[sub.id] || ''}
                                      onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                                      disabled={sub.status === 'GRADED' && !gradeInputs[sub.id]}
                                    />
                                    <button 
                                      onClick={() => handleSaveGrade(sub.id)}
                                      disabled={isSubmittingGrade === sub.id}
                                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                      {isSubmittingGrade === sub.id ? '...' : 'Save'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="px-6 py-8 text-center text-gray-500 text-sm">
                          No students have submitted work for this assignment yet.
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- Academics & Fees Tab --- */}
        {activeTab === 'Academics' && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Academics & Fees</h1>
                <p className="text-gray-400 text-sm sm:text-base">Push financial invoices and exam results directly to student portals.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Financial Hub */}
              <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                    <DollarSign size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Assign Fee Invoice</h2>
                </div>
                
                <form onSubmit={handleAssignFee} className="space-y-5">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Search & Select Student</label>
                    <input 
                      type="text" 
                      placeholder="Type student name..." 
                      value={feeStudentSearch}
                      onChange={e => {
                        setFeeStudentSearch(e.target.value);
                        setIsFeeSearchOpen(true);
                        if (!e.target.value) setFeeData({...feeData, studentId: ''});
                      }}
                      onFocus={() => setIsFeeSearchOpen(true)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                    />
                    {isFeeSearchOpen && feeStudentSearch && (
                      <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(feeStudentSearch.toLowerCase())).map(s => (
                          <div 
                            key={s.id} 
                            onClick={() => {
                              setFeeData({...feeData, studentId: s.id});
                              setFeeStudentSearch(`${s.firstName} ${s.lastName} (${s.enrollmentNo})`);
                              setIsFeeSearchOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-white border-b border-white/5 last:border-0"
                          >
                            {s.firstName} {s.lastName} <span className="text-gray-500 text-xs ml-2">{s.enrollmentNo}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Fee Title</label>
                    <input type="text" required placeholder="e.g. Term 2 Tuition, Field Trip" value={feeData.title} onChange={e => setFeeData({...feeData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Amount ($)</label>
                      <input type="number" required placeholder="150" value={feeData.amount} onChange={e => setFeeData({...feeData, amount: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Due Date</label>
                      <input type="date" required value={feeData.dueDate} onChange={e => setFeeData({...feeData, dueDate: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmittingFee} className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2">
                    {isSubmittingFee ? "Sending..." : <><CreditCard size={18} /><span>Push Invoice to Student</span></>}
                  </button>
                </form>
              </div>

              {/* Academic Hub */}
              <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Award size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Publish Exam Result</h2>
                </div>
                
                <form onSubmit={handlePublishResult} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Search & Select Student</label>
                      <input 
                        type="text" 
                        placeholder="Type student name..." 
                        value={resultStudentSearch}
                        onChange={e => {
                          setResultStudentSearch(e.target.value);
                          setIsResultSearchOpen(true);
                          if (!e.target.value) setResultStudentId('');
                        }}
                        onFocus={() => setIsResultSearchOpen(true)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                      />
                      {isResultSearchOpen && resultStudentSearch && (
                        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                          {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(resultStudentSearch.toLowerCase())).map(s => (
                            <div 
                              key={s.id} 
                              onClick={() => {
                                setResultStudentId(s.id);
                                setResultStudentSearch(`${s.firstName} ${s.lastName} (${s.enrollmentNo})`);
                                setIsResultSearchOpen(false);
                              }}
                              className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-white border-b border-white/5 last:border-0"
                            >
                              {s.firstName} {s.lastName} <span className="text-gray-500 text-xs ml-2">{s.enrollmentNo}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Exam Name</label>
                      <input type="text" required placeholder="e.g. Mid-Term 2026" value={resultExamName} onChange={e => setResultExamName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-gray-400">Subjects & Marks</label>
                      <button 
                        type="button" 
                        onClick={() => setResultSubjects([...resultSubjects, { subject: '', marksObtained: '', totalMarks: '100', grade: '' }])} 
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center bg-emerald-500/10 px-2 py-1 rounded"
                      >
                        <Plus size={12} className="mr-1" /> Add Subject
                      </button>
                    </div>
                    
                    {resultSubjects.map((sub, index) => (
                      <div key={index} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 relative group items-start sm:items-center p-3 sm:p-0 bg-black/40 sm:bg-transparent rounded-xl border sm:border-0 border-white/5">
                        <div className="col-span-4 w-full">
                          <input type="text" required placeholder="Subject Name" value={sub.subject} onChange={e => { const newSubs = [...resultSubjects]; newSubs[index].subject = e.target.value; setResultSubjects(newSubs); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="col-span-3 w-full">
                          <input type="number" required placeholder="Marks" value={sub.marksObtained} onChange={e => { const newSubs = [...resultSubjects]; newSubs[index].marksObtained = e.target.value; setResultSubjects(newSubs); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="col-span-2 w-full flex space-x-2 sm:block">
                          <input type="number" required placeholder="Total" value={sub.totalMarks} onChange={e => { const newSubs = [...resultSubjects]; newSubs[index].totalMarks = e.target.value; setResultSubjects(newSubs); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="col-span-2 w-full">
                          <input type="text" required placeholder="Grade" value={sub.grade} onChange={e => { const newSubs = [...resultSubjects]; newSubs[index].grade = e.target.value; setResultSubjects(newSubs); }} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="col-span-1 flex justify-end w-full sm:w-auto">
                          {resultSubjects.length > 1 && (
                            <button type="button" onClick={() => { const newSubs = resultSubjects.filter((_, i) => i !== index); setResultSubjects(newSubs); }} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit" disabled={isSubmittingResult} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 mt-2">
                    {isSubmittingResult ? "Publishing..." : <><BookOpen size={18} /><span>Publish to Transcript</span></>}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* --- System Settings Tab --- */}
        {activeTab === 'Settings' && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">System Settings</h1>
                <p className="text-gray-400">Manage global school preferences, academic years, and security.</p>
              </div>
              <button 
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 font-medium disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                {isSavingSettings ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                <span>Save Configurations</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* General Info */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Building size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">General Information</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Institution Name</label>
                    <input 
                      type="text" 
                      value={settingsData.schoolName}
                      onChange={e => setSettingsData({...settingsData, schoolName: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Admin Contact Email</label>
                    <input 
                      type="email" 
                      value={settingsData.contactEmail}
                      onChange={e => setSettingsData({...settingsData, contactEmail: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Year */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <CalendarDays size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Academic Period</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Current Academic Year</label>
                    <select 
                      value={settingsData.academicYear}
                      onChange={e => setSettingsData({...settingsData, academicYear: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                      <option>2024-2025</option>
                      <option>2025-2026</option>
                      <option>2026-2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Active Term / Semester</label>
                    <select 
                      value={settingsData.currentTerm}
                      onChange={e => setSettingsData({...settingsData, currentTerm: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                      <option>Term 1</option>
                      <option>Term 2</option>
                      <option>Term 3</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                    <BellRing size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">System Notifications</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl">
                    <div>
                      <p className="font-medium text-white">Email Alerts</p>
                      <p className="text-xs text-gray-500">Send system updates and fee reminders via email.</p>
                    </div>
                    <button 
                      onClick={() => setSettingsData({...settingsData, emailAlerts: !settingsData.emailAlerts})}
                      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${settingsData.emailAlerts ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settingsData.emailAlerts ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-xl">
                    <div>
                      <p className="font-medium text-white">SMS Alerts</p>
                      <p className="text-xs text-gray-500">Send critical attendance alerts via text message.</p>
                    </div>
                    <button 
                      onClick={() => setSettingsData({...settingsData, smsAlerts: !settingsData.smsAlerts})}
                      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${settingsData.smsAlerts ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settingsData.smsAlerts ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
                    <ShieldAlert size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between p-5 bg-black/40 border border-rose-500/10 rounded-xl gap-4">
                    <div>
                      <p className="font-medium text-white">Clear System Cache</p>
                      <p className="text-xs text-gray-500">Forces all portals to fetch fresh data.</p>
                    </div>
                    <button onClick={() => alert("Cache cleared successfully.")} className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                      Clear Cache
                    </button>
                  </div>
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between p-5 bg-black/40 border border-rose-500/10 rounded-xl gap-4">
                    <div>
                      <p className="font-medium text-white text-rose-400">Reset Academic Year</p>
                      <p className="text-xs text-gray-500">Archives all current assignments and attendance.</p>
                    </div>
                    <button onClick={() => confirm("WARNING: This will archive the current year. Continue?")} className="px-4 py-2 bg-rose-600/20 text-rose-500 hover:bg-rose-600/40 border border-rose-500/30 text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                      Reset Year
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- Super Profile Slide-out Modal --- */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[28rem] bg-zinc-950 border-l border-white/10 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedStudent && (
          <div className="h-full flex flex-col">
            
            <div className="p-6 border-b border-white/10 bg-black/50 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <button onClick={() => setIsProfileOpen(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
              <p className="text-indigo-400 font-mono text-sm">{selectedStudent.enrollmentNo}</p>
            </div>

            <div className="flex border-b border-white/10 bg-black/20 px-2 overflow-x-auto no-scrollbar shrink-0">
              {['Overview', 'Fees', 'Results', 'Attendance'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${profileTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB: OVERVIEW */}
              {profileTab === 'Overview' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <form onSubmit={handleUpdateStudent} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                        <input type="text" value={editFormData.firstName} onChange={e => setEditFormData({...editFormData, firstName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                        <input type="text" value={editFormData.lastName} onChange={e => setEditFormData({...editFormData, lastName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Grade</label>
                        <input type="text" value={editFormData.gradeLevel} onChange={e => setEditFormData({...editFormData, gradeLevel: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Section</label>
                        <input type="text" value={editFormData.section} onChange={e => setEditFormData({...editFormData, section: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                      </div>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition-colors text-sm font-medium">
                      <Edit3 size={16} /> <span>Save Profile Changes</span>
                    </button>
                  </form>
                  <div className="h-px bg-white/10 my-6" />
                  <button onClick={() => handleDeleteStudent(selectedStudent.id)} className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2.5 rounded-xl transition-colors text-sm font-medium">
                    <Trash2 size={16} /> <span>Delete Student Record</span>
                  </button>
                </div>
              )}

              {/* TAB: ATTENDANCE */}
              {profileTab === 'Attendance' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <form onSubmit={handleMarkAttendance} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-medium text-white mb-2">Mark New Attendance</h3>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Date</label>
                      <input type="date" value={attendanceData.date} onChange={e => setAttendanceData({...attendanceData, date: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Subject (Optional)</label>
                      <input type="text" placeholder="e.g. Physics, Math" value={attendanceData.subject} onChange={e => setAttendanceData({...attendanceData, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Status</label>
                      <select value={attendanceData.status} onChange={e => setAttendanceData({...attendanceData, status: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors text-sm font-medium">
                      Save Record
                    </button>
                  </form>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Recent History</h3>
                    {selectedStudent.attendances?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedStudent.attendances.map((rec: any, i: number) => (
                          <div key={i} className="flex flex-col space-y-2">
                            {editingRecord?.id === rec.id ? (
                              <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/50 space-y-3">
                                <input type="date" value={editRecordData.date.split('T')[0]} onChange={e => setEditRecordData({...editRecordData, date: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                                <input type="text" value={editRecordData.subject} onChange={e => setEditRecordData({...editRecordData, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                                <select value={editRecordData.status} onChange={e => setEditRecordData({...editRecordData, status: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                                  <option value="PRESENT">Present</option><option value="ABSENT">Absent</option><option value="LATE">Late</option>
                                </select>
                                <div className="flex space-x-2 pt-2">
                                  <button onClick={() => handleSaveEditedRecord('attendance')} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition-colors">Save Changes</button>
                                  <button onClick={() => setEditingRecord(null)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group">
                                <div>
                                  <p className="text-sm font-medium text-white">{rec.subject}</p>
                                  <p className="text-xs text-gray-500">{new Date(rec.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${rec.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : rec.status === 'ABSENT' ? 'bg-rose-500/20 text-rose-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                    {rec.status}
                                  </span>
                                  <div className="opacity-0 lg:group-hover:opacity-100 flex space-x-1 transition-all">
                                    <button 
                                      onClick={() => { setEditingRecord({id: rec.id, type: 'attendance'}); setEditRecordData({...rec}); }}
                                      className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                      title="Edit Record"
                                    ><Edit3 size={14} /></button>
                                    <button 
                                      onClick={() => handleDeleteRecord('attendance', rec.id)}
                                      className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                      title="Delete Record"
                                    ><Trash2 size={14} /></button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No attendance records found.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: FEES */}
              {profileTab === 'Fees' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {selectedStudent.fees?.length > 0 ? (
                    selectedStudent.fees.map((fee: any, i: number) => (
                      <div key={i} className="relative">
                        {editingRecord?.id === fee.id ? (
                          <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/50 space-y-3">
                            <input type="text" value={editRecordData.title} onChange={e => setEditRecordData({...editRecordData, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <input type="number" value={editRecordData.amount} onChange={e => setEditRecordData({...editRecordData, amount: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <input type="date" value={editRecordData.dueDate.split('T')[0]} onChange={e => setEditRecordData({...editRecordData, dueDate: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <select value={editRecordData.status} onChange={e => setEditRecordData({...editRecordData, status: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                              <option value="PENDING">PENDING</option><option value="PAID">PAID</option>
                            </select>
                            <div className="flex space-x-2 pt-2">
                              <button onClick={() => handleSaveEditedRecord('fee')} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition-colors">Save Changes</button>
                              <button onClick={() => setEditingRecord(null)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 group">
                            <div className="absolute top-4 right-4 opacity-0 lg:group-hover:opacity-100 flex space-x-2 transition-all">
                              {fee.status === 'PENDING' && (
                                <button
                                  onClick={() => handleMarkFeePaidCash(fee.id)}
                                  disabled={isMarkingPaid === fee.id}
                                  className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1 text-xs font-bold"
                                  title="Mark as Paid (Cash)"
                                >
                                  {isMarkingPaid === fee.id ? '...' : <><CheckCircle2 size={14} /> Cash</>}
                                </button>
                              )}
                              <button onClick={() => { setEditingRecord({id: fee.id, type: 'fee'}); setEditRecordData({...fee}); }} className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"><Edit3 size={16} /></button>
                              <button onClick={() => handleDeleteRecord('fee', fee.id)} className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 size={16} /></button>
                            </div>
                            <div className="flex justify-between items-start mb-2 pr-28">
                              <p className="font-medium text-white text-sm">{fee.title}</p>
                              <span className={`text-xs px-2 py-1 rounded font-medium ${fee.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {fee.status}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">${fee.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No fee records found.</p>
                  )}
                </div>
              )}

              {/* TAB: RESULTS */}
              {profileTab === 'Results' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {selectedStudent.results?.length > 0 ? (
                    selectedStudent.results.map((res: any, i: number) => (
                      <div key={i} className="relative">
                        {editingRecord?.id === res.id ? (
                          <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/50 space-y-3">
                            <input type="text" placeholder="Subject" value={editRecordData.subject} onChange={e => setEditRecordData({...editRecordData, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <input type="text" placeholder="Exam Name" value={editRecordData.examName} onChange={e => setEditRecordData({...editRecordData, examName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="number" placeholder="Marks Obtained" value={editRecordData.marksObtained} onChange={e => setEditRecordData({...editRecordData, marksObtained: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                              <input type="number" placeholder="Total Marks" value={editRecordData.totalMarks} onChange={e => setEditRecordData({...editRecordData, totalMarks: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            </div>
                            <input type="text" placeholder="Grade" value={editRecordData.grade} onChange={e => setEditRecordData({...editRecordData, grade: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                            <div className="flex space-x-2 pt-2">
                              <button onClick={() => handleSaveEditedRecord('result')} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition-colors">Save Changes</button>
                              <button onClick={() => setEditingRecord(null)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group">
                            <div>
                              <p className="font-medium text-white text-sm">{res.subject}</p>
                              <p className="text-xs text-gray-500">{res.examName}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <div className="text-right mr-2">
                                 <p className="text-lg font-bold text-white">{res.marksObtained}<span className="text-xs text-gray-500">/{res.totalMarks}</span></p>
                                 <p className={`text-xs font-bold ${res.grade.includes('A') ? 'text-emerald-400' : res.grade.includes('B') ? 'text-blue-400' : 'text-orange-400'}`}>
                                   Grade {res.grade}
                                 </p>
                               </div>
                               <div className="opacity-0 lg:group-hover:opacity-100 flex flex-col space-y-1 transition-all shrink-0">
                                 <button onClick={() => { setEditingRecord({id: res.id, type: 'result'}); setEditRecordData({...res}); }} className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"><Edit3 size={14} /></button>
                                 <button onClick={() => handleDeleteRecord('result', res.id)} className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 size={14} /></button>
                               </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No exam results found.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Add Student</h3>
              <button onClick={() => setIsAddStudentModalOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">First Name</label>
                  <input type="text" required value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Last Name</label>
                  <input type="text" value={newStudent.lastName} onChange={e => setNewStudent({...newStudent, lastName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Email</label>
                <input type="email" required value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Roll No</label>
                  <input type="text" required value={newStudent.rollNo} onChange={e => setNewStudent({...newStudent, rollNo: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Class (e.g. 10-A)</label>
                  <input type="text" required value={newStudent.className} onChange={e => setNewStudent({...newStudent, className: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white rounded-xl py-3 mt-2 text-sm font-bold hover:bg-emerald-500 transition-all">Add Student</button>
            </form>
          </div>
        </div>
      )}

      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Add Class Period</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleBuildSchedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Class (e.g. 10-A)</label>
                  <input type="text" required value={scheduleData.className} onChange={e => setScheduleData({...scheduleData, className: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Day of Week</label>
                  <select required value={scheduleData.dayOfWeek} onChange={e => setScheduleData({...scheduleData, dayOfWeek: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Subject</label>
                <input type="text" required placeholder="e.g. Mathematics" value={scheduleData.subject} onChange={e => setScheduleData({...scheduleData, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Room</label>
                  <input type="text" required value={scheduleData.room} onChange={e => setScheduleData({...scheduleData, room: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Start</label>
                  <input type="time" required value={scheduleData.startTime} onChange={e => setScheduleData({...scheduleData, startTime: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-2.5 text-white focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">End</label>
                  <input type="time" required value={scheduleData.endTime} onChange={e => setScheduleData({...scheduleData, endTime: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-2.5 text-white focus:border-blue-500 outline-none text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-xl py-3 mt-2 text-sm font-bold hover:bg-blue-500 transition-all">Save Schedule Period</button>
            </form>
          </div>
        </div>
      )}

      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Upload Timetable PDF</h3>
              <button onClick={() => setIsTimetableModalOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Target Class (e.g. 10-A)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter class name first"
                  value={timetableClass}
                  onChange={(e) => setTimetableClass(e.target.value)}
                  className="w-full bg-black/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {timetableClass ? (
                <div className="bg-black/40 rounded-2xl border border-white/5 p-4 animate-in zoom-in-95">
                  <UploadDropzone
                    endpoint="timetableUploader" 
                    onClientUploadComplete={(res) => handleTimetableUploadComplete(res[0].url)}
                    onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                    appearance={{
                      container: "border-dashed border-white/20 hover:border-blue-500/50 transition-colors p-6",
                      uploadIcon: "text-blue-400 h-8 w-8 mb-2",
                      label: "text-white text-sm hover:text-blue-400",
                      button: "bg-blue-600 hover:bg-blue-700 w-full mt-4"
                    }}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-black/20">
                   <p className="text-sm text-gray-500">Please enter a target class name above to enable the upload zone.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isBulkUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Bulk Upload</h3>
                <p className="text-sm text-gray-400">Upload an Excel (.xlsx) file.</p>
              </div>
              <button onClick={() => setIsBulkUploadModalOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-5">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors relative">
                <input 
                  type="file" accept=".xlsx, .xls, .csv" onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required
                />
                <UploadCloud className="mx-auto text-emerald-500 mb-3" size={32} />
                <p className="text-sm font-medium text-white mb-1">{bulkFile ? bulkFile.name : "Click or drag file to upload"}</p>
                <p className="text-xs text-gray-500">Required columns: email, rollNo, firstName</p>
              </div>

              <button type="submit" disabled={isUploadingBulk || !bulkFile} className="w-full bg-emerald-600 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-emerald-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                {isUploadingBulk ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>Start Import</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">New Assignment</h3>
                <p className="text-sm text-gray-400">Push a task to the student portal.</p>
              </div>
              <button 
                onClick={() => setIsAssignmentModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Target Class</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., 10-A, 9-B"
                  value={newAssignment.className}
                  onChange={(e) => setNewAssignment({...newAssignment, className: e.target.value})}
                  className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Subject Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Physics, Mathematics"
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Assignment Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Lab Report 4"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Instructions</label>
                <textarea 
                  rows={3}
                  placeholder="Provide submission guidelines..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Due Date</label>
                <input 
                  type="date" 
                  required
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3.5 text-sm font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                >
                  <BookOpen size={18} />
                  <span>Publish Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backdrop for Super Profile */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

    </div>
  );
}