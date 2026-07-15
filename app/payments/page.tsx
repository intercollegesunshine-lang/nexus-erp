"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; background-color: #0c0c0c; color: white; }
.liquid-glass { background: rgba(255,255,255,0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
.liquid-glass::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
`;

const FUN_FACTS = [
  "Bananas are curved because they grow towards the sun.",
  "A day on Venus is longer than a year on Venus.",
  "Octopuses have three hearts and blue blood.",
  "The shortest war in history lasted just 38 minutes."
];

export default function PaymentsPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fact, setFact] = useState("");

  useEffect(() => {
    setFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
    
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    // Fetch Student Financial Data
    fetch('/api/student/dashboard', { headers: { 'Cache-Control': 'no-cache, no-store' } })
      .then(res => res.json())
      .then(json => {
        if (json.success) setStudentData(json.data);
        setIsLoading(false);
      });
  }, []);

  const pendingFees = studentData?.fees?.filter((f: any) => f.status === 'PENDING') || [];
  const totalAmount = pendingFees.reduce((sum: number, fee: any) => sum + fee.amount, 0);
  const combinedTitle = pendingFees.length > 1 ? `${pendingFees.length} Pending Dues (Combined)` : (pendingFees[0]?.title || '');
  const combinedIds = pendingFees.map((f: any) => f.id).join(','); // Join all IDs with a comma

  const pendingFee = pendingFees.length > 0 ? {
    id: combinedIds,
    title: combinedTitle,
    amount: totalAmount
  } : null;

  const handlePayment = async () => {
    if (!pendingFee) return;
    setIsProcessing(true);

    try {
      // 1. Create Razorpay Order
      const res = await fetch('/api/payments/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: pendingFee.id, amount: pendingFee.amount })
      });
      const orderData = await res.json();

      if (!orderData.success) {
        alert("Error initiating payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Sunshine Portal",
        description: pendingFee.title,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment Signature
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              invoiceId: pendingFee.id,
              amount: pendingFee.amount
            })
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            window.location.href = '/fees'; // Redirect back to financials page
          } else {
            alert("Payment Verification Failed. Contact administration.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.user?.email || "",
        },
        theme: { color: "#00d2ff" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function () {
         alert("Payment Canceled or Failed.");
         setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Network error occurred.");
    }
  };

  if (isLoading || !studentData) return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex items-center justify-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="absolute inset-0 z-0"><video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 blur-sm" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" /></div>
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <img src="/logo.png" alt="Sunshine Logo" className="w-12 h-12 object-contain mb-6 animate-pulse" />
        <div className="w-8 h-8 border-2 border-[#00d2ff]/30 border-t-[#00d2ff] rounded-full animate-spin mb-8" />
        <span className="text-[10px] font-bold tracking-widest text-[#00d2ff] uppercase mb-3">Did you know?</span>
        <p className="text-white/80 text-sm font-medium">"{fact}"</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white bg-[#0c0c0c] flex overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.25]" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
      </div>

      <main className="flex-1 relative z-10 p-6 md:p-10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-xl">
           <button onClick={() => window.location.href = '/fees'} className="mb-8 flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit">
             <ArrowLeft size={16} /> Return to Dashboard
           </button>

           <div className="mb-6 flex items-center gap-2 text-[#00d2ff] font-bold text-sm tracking-widest uppercase">
             <ShieldCheck size={18} /> Razorpay Secure Checkout
           </div>

           <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-8">Complete Payment.</h1>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00d2ff]/10 blur-3xl rounded-full -z-10" />
              
              {pendingFee ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-1">{pendingFee.title}</h2>
                    <p className="text-xs font-bold text-white/40 tracking-widest uppercase">{studentData.firstName} {studentData.lastName} • {studentData.enrollmentNo}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-t border-white/10 pt-8 mb-8">
                    <span className="text-sm font-bold text-white/50 tracking-widest uppercase">Total Amount Due</span>
                    <span className="text-5xl font-bold tracking-tight text-white">₹{pendingFee.amount.toLocaleString('en-IN')}</span>
                  </div>

                  <button onClick={handlePayment} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-full font-bold text-base hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:scale-100">
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <><Lock size={18} /> Pay Now via Razorpay</>
                    )}
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-white/30 uppercase tracking-wider text-center">
                    <ShieldCheck size={14} className="text-[#28c840]" /> Payments are secured with 256-bit encryption and RBI compliant.
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                   <div className="w-16 h-16 rounded-full bg-[#28c840]/10 flex items-center justify-center mx-auto mb-4 border border-[#28c840]/20"><ShieldCheck size={32} className="text-[#28c840]" /></div>
                   <h3 className="text-xl font-bold text-white mb-1">Account Cleared</h3>
                   <p className="text-white/50 text-sm font-medium">You have no pending invoices at this time.</p>
                </div>
              )}
           </motion.div>
        </div>
      </main>
    </div>
  );
}
