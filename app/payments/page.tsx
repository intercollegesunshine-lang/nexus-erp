"use client";
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, ArrowLeft, Lock, CheckCircle2, AlertTriangle, Download
} from 'lucide-react';
import { generateReceiptPDF } from '@/lib/pdfGenerator';
import { Instrument_Serif, Inter } from 'next/font/google';

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'], style: ['normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Helper to load the Razorpay checkout script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Payment States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        // CACHE BUSTING added here so right after they pay, it instantly updates
        const response = await fetch('/api/student/dashboard', {
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
        });
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const json = await response.json();
        if (json.success) setStudentData(json.data);
      } catch (error) {
        console.error("Failed to load financials", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  // Grabs the oldest pending fee. We let them pay one at a time for invoice clarity.
  const pendingFee = studentData?.fees?.find((f: any) => f.status === 'PENDING');

  const handlePayment = async () => {
    if (!pendingFee) return;
    setIsProcessing(true);
    setErrorMessage('');
    setPaymentStatus('IDLE');

    // 1. Load Razorpay Script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setErrorMessage("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      setPaymentStatus('FAILED');
      return;
    }

    try {
      // 2. Create Order on our Secure Backend
      const orderRes = await fetch('/api/payments/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: pendingFee.id, amount: pendingFee.amount })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setErrorMessage(orderData.error || "Failed to create secure order.");
        setIsProcessing(false);
        setPaymentStatus('FAILED');
        return;
      }

      // 3. Initialize Razorpay Checkout Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount, // in paise
        currency: "INR",
        name: "Sunshine Inter College",
        description: pendingFee.title,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 4. Verify Signature on Backend after success
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: pendingFee.id,
              amount: pendingFee.amount
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setTransactionDetails({
              id: verifyData.transactionId,
              amount: pendingFee.amount,
              title: pendingFee.title,
              date: new Date().toLocaleString()
            });
            setPaymentStatus('SUCCESS');
          } else {
            setErrorMessage("Payment verification failed. If money was deducted, it will be refunded.");
            setPaymentStatus('FAILED');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.user?.email || "",
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      
      rzp1.on('payment.failed', function (response: any){
        setErrorMessage(response.error.description || "Payment failed or was cancelled.");
        setPaymentStatus('FAILED');
        setIsProcessing(false);
      });

      rzp1.open();

    } catch (error) {
      setErrorMessage("A network error occurred. Please try again.");
      setPaymentStatus('FAILED');
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (studentData && transactionDetails) {
      generateReceiptPDF(studentData, transactionDetails);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a061a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-indigo-400 font-medium">Connecting to Payment Gateway...</p>
      </div>
    );
  }

  // --- SUCCESS SCREEN ---
  if (paymentStatus === 'SUCCESS') {
    return (
      <div className={`min-h-screen ${inter.className} bg-[#F9F8FC] flex flex-col items-center justify-center text-[#1E1B4B] p-8 overflow-hidden relative`}>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-[#F9F8FC] to-[#F9F8FC]" />
        
        <div className="bg-white/80 border border-white rounded-[2rem] p-10 backdrop-blur-3xl max-w-md w-full text-center z-10 animate-in zoom-in-95 shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-200">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h2 className={`${instrumentSerif.className} text-4xl mb-2`}>Payment Successful</h2>
          <p className="text-gray-500 mb-8 font-medium">Your account has been instantly updated.</p>
          
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="font-mono text-emerald-600 font-bold">{transactionDetails.id}</p>
            <div className="h-px w-full bg-gray-200 my-4" />
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Amount Paid</p>
            <p className="font-bold text-2xl text-[#1E1B4B]">₹{transactionDetails.amount.toLocaleString()}</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleDownloadReceipt}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Download size={18} />
              <span>Download PDF Receipt</span>
            </button>
            <button 
              onClick={() => window.location.href = '/fees'}
              className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-[#1E1B4B] hover:bg-gray-50 transition-colors font-medium"
            >
              Return to Financials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- FAILURE SCREEN ---
  if (paymentStatus === 'FAILED') {
    return (
      <div className={`min-h-screen ${inter.className} bg-[#F9F8FC] flex flex-col items-center justify-center text-[#1E1B4B] p-8 relative`}>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100 via-[#F9F8FC] to-[#F9F8FC]" />
        
        <div className="bg-white/80 border border-white rounded-[2rem] p-10 backdrop-blur-3xl max-w-md w-full text-center z-10 animate-in zoom-in-95 shadow-[0_20px_60px_rgba(249,115,22,0.15)]">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-orange-200">
            <AlertTriangle size={48} className="text-orange-500" />
          </div>
          <h2 className={`${instrumentSerif.className} text-4xl mb-2 text-[#1E1B4B]`}>Payment Failed</h2>
          <p className="text-gray-500 mb-6 font-medium">{errorMessage}</p>
          
          <button 
            onClick={handlePayment}
            className="w-full py-4 rounded-xl bg-[#1E1B4B] text-white font-bold hover:bg-[#312E81] transition-colors shadow-lg flex items-center justify-center space-x-2 mb-3"
          >
            Retry Payment
          </button>
          <button 
            onClick={() => window.location.href = '/fees'}
            className="w-full py-3 rounded-xl text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm border border-transparent hover:border-gray-200"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    );
  }

  // --- CHECKOUT SCREEN ---
  return (
    <div className={`min-h-screen ${inter.className} bg-[#F9F8FC] text-[#1E1B4B] overflow-hidden`}>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-[#F9F8FC] to-[#F9F8FC] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto p-4 sm:p-8 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-sm font-bold text-gray-500 hover:text-[#1E1B4B] transition-colors mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ArrowLeft size={16} className="mr-2" /> Return to Dashboard
        </button>

        <div className="flex items-center space-x-2 text-indigo-600 mb-4">
          <ShieldCheck size={20} />
          <span className="text-xs font-bold tracking-widest uppercase">Razorpay Secure Checkout</span>
        </div>
        <h1 className={`${instrumentSerif.className} text-5xl mb-8`}>Complete Payment</h1>
        
        {pendingFee ? (
          <div className="bg-white/80 border border-white rounded-[2rem] p-8 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-xl font-bold text-[#1E1B4B] mb-1">{pendingFee.title}</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{studentData.firstName} {studentData.lastName} • {studentData.enrollmentNo}</p>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200 mb-6" />

            <div className="flex justify-between items-center text-lg mb-10">
              <p className="text-gray-500 font-bold uppercase tracking-wider">Total Amount Due</p>
              <p className={`${instrumentSerif.className} text-5xl text-[#1E1B4B]`}>
                ₹{pendingFee.amount.toLocaleString()}
              </p>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              {isProcessing ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={18} />
                  <span>Pay Now via Razorpay</span>
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center space-x-3 text-xs font-bold text-gray-400 mt-6 uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>Payments are secured with 256-bit encryption and RBI compliant.</span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-10 text-center text-emerald-800 shadow-sm">
            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-80 text-emerald-500" />
            <p className={`${instrumentSerif.className} text-4xl mb-2`}>All Cleared!</p>
            <p className="font-semibold text-sm text-emerald-600/80">You have no pending invoices to pay.</p>
          </div>
        )}
      </div>
    </div>
  );
}