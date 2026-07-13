"use client";
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, ArrowLeft, Lock, CheckCircle2, Building
} from 'lucide-react';

export default function CheckoutPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

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

  const pendingFee = studentData?.fees?.[0]; // Grab the first pending invoice

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFee) return;
    
    setIsProcessing(true);

    try {
      // Send the payment request to our secure backend
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: pendingFee.id,
          amount: pendingFee.amount
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add a fake delay for the "processing" animation effect
        setTimeout(() => {
          setTransactionId(data.transactionId);
          setIsSuccess(true);
          setIsProcessing(false);
        }, 2000);
      } else {
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-indigo-400 font-medium">Initializing Secure Gateway...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-emerald-600/20 blur-[150px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="bg-white/5 border border-emerald-500/30 rounded-3xl p-10 backdrop-blur-xl max-w-md w-full text-center z-10 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Payment Successful</h2>
          <p className="text-gray-400 mb-6">Your transaction has been securely processed and applied to your account.</p>
          
          <div className="bg-black/50 rounded-xl p-4 mb-8 text-left border border-white/5">
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono text-gray-300">{transactionId}</p>
            <div className="h-px w-full bg-white/10 my-3" />
            <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
            <p className="font-semibold text-white">${pendingFee?.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>

          <button 
            onClick={() => window.location.href = '/fees'}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            Return to Financials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" /> Cancel Checkout
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Side: Order Summary */}
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-4">
              <ShieldCheck size={20} />
              <span className="text-sm font-semibold tracking-widest uppercase">Nexus Secure Checkout</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Complete your payment</h1>
            
            {pendingFee ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-xl font-medium mb-4">Invoice Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-300 font-medium">{pendingFee.title}</p>
                      <p className="text-sm text-gray-500">Student: {studentData.firstName} {studentData.lastName}</p>
                    </div>
                    <p className="text-white font-medium">${pendingFee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="h-px w-full bg-white/10" />
                  <div className="flex justify-between items-center text-lg">
                    <p className="text-gray-400">Total Due</p>
                    <p className="text-3xl font-bold text-white">${pendingFee.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400">
                <p className="font-medium">You have no pending invoices to pay!</p>
              </div>
            )}
          </div>

          {/* Right Side: Credit Card Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="font-medium text-indigo-400">Processing Payment...</p>
                <p className="text-sm text-gray-400 mt-2">Please do not close this window.</p>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold">Payment Details</h3>
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-white/10 rounded" />
                <div className="w-10 h-6 bg-white/10 rounded" />
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  placeholder={`${studentData?.firstName || 'John'} ${studentData?.lastName || 'Doe'}`}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">CVC</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type="text" 
                      required
                      placeholder="123"
                      maxLength={4}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!pendingFee || isProcessing}
                className="w-full mt-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                <Lock size={16} />
                <span>Pay ${pendingFee?.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</span>
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-4">
                <Lock size={12} />
                <span>Payments are secured with 256-bit encryption</span>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}