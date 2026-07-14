"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, BookOpen } from 'lucide-react';

export default function AttendancePage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!studentData) {
    return <div className="min-h-screen bg-black text-white p-8">No data found.</div>;
  }

  // Calculate Subject-Wise Attendance Stats
  const subjectStats = studentData.attendance?.reduce((acc: any, record: any) => {
    if (!acc[record.subject]) {
      acc[record.subject] = { present: 0, absent: 0, late: 0, total: 0 };
    }
    acc[record.subject].total += 1;
    if (record.status === 'PRESENT') acc[record.subject].present += 1;
    if (record.status === 'ABSENT') acc[record.subject].absent += 1;
    if (record.status === 'LATE') acc[record.subject].late += 1;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Timetable & Attendance</h1>
            <p className="text-gray-400">View your class schedule and subject-wise attendance history.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Weekly Timetable */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Calendar className="mr-2 text-blue-400" /> Class Schedule
              </h3>
              
              {studentData.class?.schedules?.length > 0 ? (
                <div className="space-y-4">
                  {studentData.class.schedules.map((schedule: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{schedule.subject}</h4>
                          <p className="text-sm text-gray-400">Room: {schedule.room}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm font-medium text-white px-3 py-1 bg-white/10 rounded-lg inline-block mb-1">
                          {schedule.dayOfWeek}
                        </p>
                        <p className="text-xs text-gray-400">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-black/20 rounded-xl border border-white/5">
                  <p className="text-gray-400">No active timetable found for your class.</p>
                </div>
              )}
            </div>
            
            {/* Day-Wise Attendance History Log */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Clock className="mr-2 text-purple-400" /> Recent Attendance Log
              </h3>
              
              {studentData.attendance?.length > 0 ? (
                <div className="space-y-3">
                  {studentData.attendance.slice(0, 10).map((record: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-white/5">
                      <div>
                        <p className="font-medium text-gray-200">{record.subject}</p>
                        <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        record.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' :
                        record.status === 'ABSENT' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-4">No attendance records published yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: Subject-Wise Attendance Breakdown */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <BookOpen className="mr-2 text-emerald-400" size={20} /> 
                Subject-Wise Breakdown
              </h3>
              
              {Object.keys(subjectStats).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(subjectStats).map(([subject, stats]: [string, any], idx) => {
                    const percentage = Math.round((stats.present / stats.total) * 100);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-300">{subject}</span>
                          <span className={`text-sm font-bold ${percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {percentage}%
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-orange-500' : 'bg-rose-500'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        {/* Status Counts */}
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span className="flex items-center"><CheckCircle2 size={12} className="text-emerald-500 mr-1" /> {stats.present}</span>
                          <span className="flex items-center"><XCircle size={12} className="text-rose-500 mr-1" /> {stats.absent}</span>
                          <span className="flex items-center"><AlertCircle size={12} className="text-orange-500 mr-1" /> {stats.late}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-400 text-sm">No subject data available.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}