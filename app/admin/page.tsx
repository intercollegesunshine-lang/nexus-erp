"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, MoreVertical, ShieldCheck, 
  ArrowLeft, Download, DollarSign, GraduationCap, X, Plus,
  UploadCloud
} from 'lucide-react';

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the Publish Grade Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [newGrade, setNewGrade] = useState({ subject: '', marks: '', grade: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State and Ref for Bulk Upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/admin/students');
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const json = await response.json();
        if (json.success) {
          setStudents(json.data);
        } else {
          console.error("API Error:", json.error);
        }
      } catch (error) {
        console.error("Failed to load admin data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Helper function to calculate average score/GPA
  const calculateGPA = (results: any[]) => {
    if (!results || results.length === 0) return "N/A";
    const total = results.reduce((acc, curr) => acc + curr.marksObtained, 0);
    return (total / results.length).toFixed(1) + "%";
  };

  // Helper function to calculate total pending fees
  const calculatePendingFees = (fees: any[]) => {
    if (!fees || fees.length === 0) return 0;
    return fees
      .filter(fee => fee.status === 'PENDING')
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NEW: Handle Excel Upload Logic
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/students/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`Successfully imported ${data.count} students!`);
        window.location.reload(); // Refresh the page to show the newly added students
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      // Reset the input so you can upload the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Function to submit the grade to our API
  const handlePublishGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedStudent) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          examName: 'Finals 2026',
          subject: newGrade.subject,
          marksObtained: Number(newGrade.marks),
          totalMarks: 100,
          grade: newGrade.grade
        })
      });
      
      if(res.ok) {
        setIsModalOpen(false);
        setNewGrade({ subject: '', marks: '', grade: '' });
        window.location.reload(); // Refresh the page to see the updated GPA!
      }
    } catch(e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-indigo-400 font-medium animate-pulse">Initializing Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="text-indigo-500" size={24} />
              <span className="text-sm font-medium tracking-widest text-indigo-400 uppercase">Super Admin Control</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Student Directory</h1>
            <p className="text-gray-400">Manage enrollments, academic records, and financial status.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium text-gray-300"
            >
              <ArrowLeft size={16} /> <span>Back to App</span>
            </button>

            {/* NEW: Hidden File Input and Upload Button */}
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UploadCloud size={16} />
              )}
              <span>{isUploading ? 'Uploading...' : 'Bulk Upload'}</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm font-medium text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Download size={16} /> <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or enrollment ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 text-sm font-medium text-gray-400">Student Info</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Grade & Section</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Academic Standing</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Financial Status</th>
                  <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const pendingFees = calculatePendingFees(student.fees);
                    return (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=4f46e5&color=fff`} 
                              alt="Avatar" 
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-white">{student.firstName} {student.lastName}</p>
                              <p className="text-xs text-gray-500">{student.enrollmentNo}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {student.gradeLevel} - {student.section}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <GraduationCap size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-300">{calculateGPA(student.results)} Avg</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {pendingFees > 0 ? (
                            <div className="flex items-center space-x-1.5 text-rose-400">
                              <DollarSign size={16} />
                              <span className="text-sm font-medium">{pendingFees.toLocaleString()} Due</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Cleared
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => { setSelectedStudent(student); setIsModalOpen(true); }}
                            className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-lg transition-colors border border-indigo-500/20 flex items-center space-x-1 ml-auto"
                          >
                            <Plus size={14} /> <span>Grade</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Publish Grade Modal UI */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative animate-in zoom-in-95">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-white mb-1">Publish Grade</h2>
                <p className="text-sm text-gray-400 mb-6">Adding result for {selectedStudent?.firstName} {selectedStudent?.lastName}</p>
                
                <form onSubmit={handlePublishGrade} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1 block">Subject Name</label>
                    <input type="text" required placeholder="e.g. Biology" value={newGrade.subject} onChange={e => setNewGrade({...newGrade, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Marks (out of 100)</label>
                      <input type="number" required placeholder="85" value={newGrade.marks} onChange={e => setNewGrade({...newGrade, marks: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1 block">Letter Grade</label>
                      <input type="text" required placeholder="A" value={newGrade.grade} onChange={e => setNewGrade({...newGrade, grade: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium mt-4 shadow-lg shadow-indigo-500/25 transition-all">
                    {isSubmitting ? 'Publishing...' : 'Publish Result'}
                  </button>
                </form>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}