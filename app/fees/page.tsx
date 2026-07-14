"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CreditCard, Download, CheckCircle2, 
  AlertCircle, Receipt, Calendar, DollarSign 
} from 'lucide-react';
// IMPORT THE PDF ENGINE!
import { generateReceiptPDF } from '@/lib/pdfGenerator';

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

  // NEW: Robust handler for generating the receipt
  const handleDownloadReceipt = (transaction: any) => {
    if (!studentData) return;
    try {
      generateReceiptPDF(studentData, transaction);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Make sure you ran: npm install jspdf jspdf-autotable");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white w-full h-full">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const pendingFees = studentData?.fees || [];
  
  // Mock transaction history for display
  const pastTransactions = [
    { id: 'TXN-2026-001', title: 'Q1 Tuition Fee', amount: 1500, date: '2026-01-15', method: 'Credit Card' },
    { id: 'TXN-2025-084', title: 'Library Fine', amount: 25, date: '2025-11-20', method: 'Debit Card' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Fees & Payments</h1>
          <p className="text-gray-400">Manage your pending invoices and view payment history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Invoices */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <AlertCircle className="mr-2 text-rose-400" /> Pending Invoices
            </h2>
            
            {pendingFees.length > 0 ? (
              <div className="space-y-4">
                {pendingFees.map((fee: any, i: number) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-white/5 border border-rose-500/30 backdrop-blur-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 mt-1">
                        <Receipt size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{fee.title}</h4>
                        <p className="text-sm text-gray-400 flex items-center mt-1">
                          <Calendar size={14} className="mr-1" /> Due by {new Date(fee.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 md:pl-4 md:border-l border-white/10">
                      <div className="text-right">
                        <p className="text-sm text-gray-400 mb-1">Amount Due</p>
                        <p className="text-2xl font-bold text-white">${fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <button 
                        onClick={() => window.location.href = '/payments'}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-emerald-500/30 text-center">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">You are all caught up!</h3>
                <p className="text-gray-400">There are no pending invoices on your account.</p>
              </div>
            )}

            <div className="pt-8">
              <h2 className="text-xl font-semibold flex items-center mb-6">
                <CheckCircle2 className="mr-2 text-emerald-400" /> Payment History
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="space-y-0 divide-y divide-white/10">
                  {pastTransactions.map((txn, i) => (
                    <div key={i} className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="font-medium">{txn.title}</p>
                          <p className="text-xs text-gray-500">{txn.id} • {new Date(txn.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 md:pl-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                          <p className="text-xs text-emerald-400 font-medium tracking-wide">SUCCESS</p>
                        </div>
                        
                        {/* THE DOWNLOAD BUTTON */}
                        <button 
                          onClick={() => handleDownloadReceipt(txn)}
                          className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors group relative" 
                          title="Download Receipt"
                        >
                          <Download size={18} />
                        </button>
                        
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side Column: Summary */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">Total Outstanding</h3>
              <p className="text-5xl font-bold tracking-tight text-white mb-2">
                ${pendingFees.reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-indigo-300">Across {pendingFees.length} pending invoice(s)</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2 text-blue-400" size={18}/> Payment Methods
              </h3>
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-white/10 rounded" />
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/28</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-medium">Default</span>
              </div>
              <button className="w-full mt-4 py-2.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl transition-colors border border-dashed border-blue-500/30">
                + Add New Method
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}