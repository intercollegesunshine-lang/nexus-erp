"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, FileText, TrendingUp, Award,
  BookOpen, Calculator, Globe, FlaskConical, LayoutDashboard
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Simulate data for the chart
const performanceData = [
  { term: 'Term 1', average: 85 },
  { term: 'Term 2', average: 88 },
  { term: 'Mid-Term', average: 84 },
  { term: 'Term 3', average: 92 },
  { term: 'Finals', average: 94 },
];

export default function AcademicsPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from our existing secure API
    const fetchAcademics = async () => {
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
        console.error("Failed to load academics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAcademics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white w-full h-full">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full" />
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
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Academic Transcript</h1>
            <p className="text-gray-400">View and download your official grade reports.</p>
          </div>
          
          <button className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all font-medium">
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Transcripts (Left side) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Award className="mr-2 text-blue-400" /> Latest Results
              </h3>
              
              <div className="space-y-4">
                {studentData?.results?.map((exam: any, i: number) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className={`p-4 rounded-xl ${
                        exam.marksObtained >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 
                        exam.marksObtained >= 80 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {exam.subject.includes('Math') ? <Calculator size={24} /> : 
                         exam.subject.includes('Physics') ? <FlaskConical size={24} /> : 
                         <BookOpen size={24} />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{exam.subject}</h4>
                        <p className="text-sm text-gray-400">{exam.examName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">Score</p>
                        <p className="text-2xl font-bold">{exam.marksObtained}<span className="text-gray-500 text-lg">/{exam.totalMarks}</span></p>
                      </div>
                      <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-sm text-gray-400 mb-1">Grade</p>
                        <p className={`text-2xl font-bold ${
                          exam.grade.includes('A') ? 'text-emerald-400' : 
                          exam.grade.includes('B') ? 'text-blue-400' : 'text-orange-400'
                        }`}>{exam.grade}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics (Right side) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold mb-2">Cumulative GPA</h3>
              <p className="text-5xl font-bold tracking-tight mb-2">3.8<span className="text-2xl text-indigo-300 font-normal">/4.0</span></p>
              <p className="text-sm flex items-center text-emerald-400">
                <TrendingUp size={16} className="mr-1" /> +0.2 from last semester
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <TrendingUp className="mr-2 text-emerald-400" size={20} /> 
                Performance Trend
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="term" 
                      stroke="#ffffff50" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[70, 100]} 
                      stroke="#ffffff50" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#60a5fa" 
                      strokeWidth={3}
                      dot={{ fill: '#000', stroke: '#60a5fa', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#3b82f6' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}