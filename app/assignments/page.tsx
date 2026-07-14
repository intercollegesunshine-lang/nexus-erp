"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { UploadDropzone } from "@/lib/uploadthing";

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch REAL assignments from the database
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard');
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const json = await response.json();
        
        if (json.success && json.data.class?.assignments) {
          // Format the data to easily separate pending vs completed
          const formattedAssignments = json.data.class.assignments.map((assignment: any) => {
             // Look to see if the student has a submission in the array
             const mySubmission = assignment.submissions?.find((sub: any) => sub.studentId === json.data.id);
             
             return {
               ...assignment,
               status: mySubmission ? 'completed' : 'pending',
               score: mySubmission?.grade || 'Pending Grade',
               urgent: !mySubmission && new Date(assignment.dueDate).getTime() - new Date().getTime() < 86400000 // Less than 24hrs away
             };
          });
          setAssignments(formattedAssignments);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 2. Handle the secure file upload success
  const handleUploadComplete = async (assignmentId: string, fileUrl: string) => {
    try {
      // Tell our new API to save this URL to the database!
      const response = await fetch('/api/student/assignments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, fileUrl })
      });

      const result = await response.json();

      if (result.success) {
        alert("Assignment submitted successfully to the database!");
        setUploadingId(null);
        // Instantly move it to the completed tab on the screen
        setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'completed', score: 'Pending Grade' } : a));
      } else {
         alert("Upload finished, but database save failed: " + result.error);
      }
    } catch (error) {
      alert("A network error occurred while saving the submission.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto pb-12">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Header */}
        <div>
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Homework & Assignments</h1>
          <p className="text-gray-400">Manage your pending tasks and submit your work online.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            To-Do ({assignments.filter(a => a.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'completed' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            Completed
          </button>
        </div>

        {/* Assignment List */}
        <div className="space-y-6">
          {assignments.filter(a => a.status === activeTab).length === 0 ? (
            <div className="py-12 text-center bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">
                 {activeTab === 'pending' ? "You're all caught up!" : "No completed assignments yet."}
              </h3>
              <p className="text-gray-400">
                 {activeTab === 'pending' ? "Enjoy your free time. There are no assignments here." : "Submit an assignment to see it here."}
              </p>
            </div>
          ) : (
            assignments.filter(a => a.status === activeTab).map((assignment) => (
              <div key={assignment.id} className={`bg-white/5 backdrop-blur-xl border ${assignment.urgent && activeTab === 'pending' ? 'border-orange-500/30' : 'border-white/10'} rounded-3xl p-6 transition-all hover:bg-white/10`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Left Side: Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${activeTab === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        <BookOpen size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-300">{assignment.subject}</span>
                      {assignment.urgent && activeTab === 'pending' && (
                        <span className="flex items-center text-xs font-medium bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md">
                          <AlertCircle size={12} className="mr-1" /> Urgent
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">{assignment.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{assignment.description}</p>
                    
                    <div className="flex items-center text-sm font-medium text-gray-400">
                      <Clock size={16} className="mr-2" />
                      {activeTab === 'pending' ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}` : `Submitted`}
                    </div>
                  </div>

                  {/* Right Side: Action / Score */}
                  <div className="w-full md:w-64 shrink-0">
                    {activeTab === 'completed' ? (
                      <div className="h-full flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/5 p-6">
                        <p className="text-sm text-gray-500 mb-1">Grade</p>
                        <p className={`text-2xl font-bold ${assignment.score === 'Pending Grade' ? 'text-blue-400 text-lg' : 'text-emerald-400'}`}>{assignment.score}</p>
                      </div>
                    ) : uploadingId === assignment.id ? (
                      <div className="bg-black/40 rounded-2xl border border-white/5 p-4 animate-in zoom-in-95">
                        <UploadDropzone
                          endpoint="timetableUploader" // Reusing our existing file uploader endpoint!
                          onClientUploadComplete={(res) => handleUploadComplete(assignment.id, res[0].url)}
                          onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                          appearance={{
                            container: "border-dashed border-white/20 hover:border-purple-500/50 transition-colors p-2",
                            uploadIcon: "text-purple-400 h-6 w-6",
                            label: "text-white text-xs hover:text-purple-400",
                            button: "bg-purple-600 hover:bg-purple-700 w-full text-xs"
                          }}
                        />
                        <button onClick={() => setUploadingId(null)} className="w-full mt-3 text-xs text-gray-500 hover:text-white transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-end space-y-3">
                        <button 
                          onClick={() => setUploadingId(assignment.id)}
                          className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-lg flex items-center justify-center"
                        >
                          <UploadCloud size={18} className="mr-2" /> Submit Work
                        </button>
                        <button className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors flex items-center justify-center">
                          <FileText size={18} className="mr-2" /> View Rubric
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}