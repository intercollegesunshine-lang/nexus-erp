"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CreditCard, Download, CheckCircle2, 
  AlertCircle, Receipt, Calendar, DollarSign 
} from 'lucide-react';

export default function FeesPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancials = async () => {
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
        console.error("Failed to load financials", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white w-full h-full">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-4" />
        <p className="text-rose-400 font-medium animate-pulse">Loading Financial Records...</p>
      </div>
    );
  }

  // Simulated transaction history for demonstration
  const transactions = [
    { id: "TXN-847291", date: "2026-01-15", amount: 2500, title: "Term 2 Tuition Fee", status: "PAID", method: "Credit Card ending in 4242" },
    { id: "TXN-938104", date: "2025-08-01", amount: 2500, title: "Term 1 Tuition Fee", status: "PAID", method: "Bank Transfer" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Fees & Payments</h1>
            <p className="text-gray-400">Manage your invoices, payments, and financial history.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Side) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Invoice Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-bl-full -z-10" />
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-2xl font-semibold">Current Balance Due</h2>
              </div>

              {studentData?.fees && studentData.fees.length > 0 ? (
                <div className="space-y-6">
                  {studentData.fees.map((fee: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-end justify-between p-6 rounded-xl bg-black/40 border border-rose-500/30">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">{fee.title}</h3>
                        <p className="text-sm text-gray-400 flex items-center mb-4 md:mb-0">
                          <Calendar size={14} className="mr-2" /> 
                          Due on {new Date(fee.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-white mb-4">
                          ${fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <button 
                          onClick={() => window.location.href = '/payments'}
                          className="w-full md:w-auto px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center space-x-2"
                        >
                          <CreditCard size={18} />
                          <span>Pay Securely</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-4 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 size={32} />
                  <div>
                    <h3 className="text-lg font-medium">All Caught Up!</h3>
                    <p className="text-sm opacity-80">You have no pending invoices at this time.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Receipt className="mr-2 text-gray-400" /> Payment History
              </h3>
              
              <div className="space-y-4">
                {transactions.map((txn, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 mt-1">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">{txn.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {txn.date}</span>
                          <span>•</span>
                          <span>{txn.method}</span>
                          <span>•</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-gray-300">#{txn.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 md:pl-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-emerald-400 font-medium tracking-wide">SUCCESS</p>
                      </div>
                      <button className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors group relative" title="Download Receipt">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Stats (Right Side) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Total Paid (This Year)</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-gray-500 text-2xl">$</span>
                <p className="text-5xl font-bold tracking-tight text-white">5,000</p>
                <span className="text-gray-500 text-sm">.00</span>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
               <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center"><DollarSign size={16} className="mr-1"/> Financial Aid & Grants</h3>
               <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <p className="text-2xl font-semibold mb-1">-$500.00</p>
                  <p className="text-xs">Merit Scholarship Applied</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}